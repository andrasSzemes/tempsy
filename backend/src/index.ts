import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import prisma from './lib/prisma.js';
import type { User } from './types/User.js';

type TokenClaims = {
  sub?: unknown;
  email?: unknown;
  name?: unknown;
  identities?: unknown;
};

function extractBearerToken(req: { header(name: string): string | undefined }): string | null {
  const authHeader = req.header('authorization');
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

function decodeJwtPayload(token: string): TokenClaims | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/'); // Convert from base64url to base64
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4); // Pad with '=' to make length a multiple of 4
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json) as TokenClaims;
  } catch {
    return null;
  }
}

function resolveAuthProvider(claims: TokenClaims): 'registry' | 'google' {
  if (!Array.isArray(claims.identities)) {
    return 'registry';
  }

  const hasGoogleIdentity = claims.identities.some((identity) => {
    if (typeof identity !== 'object' || identity === null) {
      return false;
    }
    if (!('providerName' in identity)) {
      return false;
    }
    return String(identity.providerName).toLowerCase() === 'google';
  });

  return hasGoogleIdentity ? 'google' : 'registry';
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  const SECRETS = JSON.parse(process.env.AWS_SECRETS || '{}');

  res.json({ message: `Welcome to tempsy backend API: ${SECRETS?.DATABASE_URL?.substring(0, 20)}...` });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/users/count', async (_req: Request, res: Response) => {
  try {
    const count = await prisma.user.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: 'Database is not ready or migration is missing.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.head('/api/users/:identifier', async (req: Request<{ identifier: string }>, res: Response) => {
  const identifier = req.params.identifier;

  if (!identifier) {
    return res.sendStatus(400);
  }

  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS(
        SELECT 1
        FROM "User"
        WHERE "id" = ${identifier}
           OR "registryCognitoSub" = ${identifier}
           OR "googleCognitoSub" = ${identifier}
      ) AS "exists";
    `;

    return res.sendStatus(rows[0]?.exists === true ? 204 : 404);
  } catch (error) {
    return res.sendStatus(500);
  }
});

app.post('/api/users', async (req: Request<unknown, unknown, Partial<User>>, res: Response) => {
  const { name: nameFromBody } = req.body ?? {};

  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Missing bearer token.' });
  }

  const claims = decodeJwtPayload(token);
  if (!claims) {
    return res.status(401).json({ message: 'Invalid bearer token.' });
  }

  const cognitoSub = typeof claims.sub === 'string' ? claims.sub : undefined;
  const email = typeof claims.email === 'string' ? claims.email : undefined;
  const name = typeof claims.name === 'string' ? claims.name : undefined;
  const provider = resolveAuthProvider(claims);

  if (typeof cognitoSub !== 'string' || cognitoSub.length === 0) {
    return res.status(400).json({ message: 'Token claim "sub" is required.' });
  }

  if (typeof email !== 'string' || email.length === 0) {
    return res.status(400).json({ message: 'Token claim "email" is required.' });
  }

  if (nameFromBody !== undefined && nameFromBody !== null && typeof nameFromBody !== 'string') {
    return res.status(400).json({ message: 'name must be a string when provided.' });
  }
  const resolvedName = typeof nameFromBody === 'string' ? nameFromBody : name ?? null;

  try {
    const generatedId = randomUUID();
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        registryCognitoSub: string | null;
        googleCognitoSub: string | null;
        email: string;
        name: string | null;
        createdAt: Date;
      }>
    >`
      WITH existing AS (
        SELECT "id"
        FROM "User"
        WHERE (CASE WHEN ${provider} = 'registry' THEN "registryCognitoSub" ELSE "googleCognitoSub" END) = ${cognitoSub}
           OR "email" = ${email}
        LIMIT 1
      ),
      updated AS (
        UPDATE "User"
        SET "registryCognitoSub" = CASE WHEN ${provider} = 'registry' THEN ${cognitoSub} ELSE "registryCognitoSub" END,
            "googleCognitoSub" = CASE WHEN ${provider} = 'google' THEN ${cognitoSub} ELSE "googleCognitoSub" END,
            "email" = ${email},
            "name" = ${resolvedName}
        WHERE "id" IN (SELECT "id" FROM existing)
        RETURNING "id", "registryCognitoSub", "googleCognitoSub", "email", "name", "createdAt"
      ),
      inserted AS (
        INSERT INTO "User" ("id", "registryCognitoSub", "googleCognitoSub", "email", "name")
        SELECT
          ${generatedId},
          CASE WHEN ${provider} = 'registry' THEN ${cognitoSub} ELSE NULL END,
          CASE WHEN ${provider} = 'google' THEN ${cognitoSub} ELSE NULL END,
          ${email},
          ${resolvedName}
        WHERE NOT EXISTS (SELECT 1 FROM existing)
        RETURNING "id", "registryCognitoSub", "googleCognitoSub", "email", "name", "createdAt"
      )
      SELECT * FROM updated
      UNION ALL
      SELECT * FROM inserted;
    `;

    const user = rows[0];

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not save user.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
