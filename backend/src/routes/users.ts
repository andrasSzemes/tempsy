import { Router, Request, Response } from 'express';
import type { User } from '../types/User.js';
import type { TokenClaims } from '../types/TokenClaims.js';
import {
  countUsers,
  upsertUserByClaims,
  userExistsByIdentifier,
  type AuthProvider,
} from '../repositories/usersRepository.js';

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

function resolveAuthProvider(claims: TokenClaims): AuthProvider {
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

const usersRouter = Router();

usersRouter.get('/count', async (_req: Request, res: Response) => {
  try {
    const count = await countUsers();
    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: 'Database is not ready or migration is missing.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

usersRouter.head('/:identifier', async (req: Request<{ identifier: string }>, res: Response) => {
  const identifier = req.params.identifier;

  if (!identifier) {
    return res.sendStatus(400);
  }

  try {
    const exists = await userExistsByIdentifier(identifier);
    return res.sendStatus(exists ? 204 : 404);
  } catch (error) {
    return res.sendStatus(500);
  }
});

usersRouter.post('/', async (req: Request<unknown, unknown, Partial<User>>, res: Response) => {
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
    const user = await upsertUserByClaims(provider, cognitoSub, email, resolvedName);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not save user.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default usersRouter;
