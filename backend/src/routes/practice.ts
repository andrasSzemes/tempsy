import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import type { TokenClaims } from '../types/TokenClaims.js';

type PracticeRequestBody = {
  verb?: unknown;
  tense?: unknown;
  subject?: unknown;
  success?: unknown;
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
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
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

const practiceRouter = Router();

practiceRouter.post('/', async (req: Request<unknown, unknown, PracticeRequestBody>, res: Response) => {
  const { verb, tense, subject, success } = req.body ?? {};

  if (typeof verb !== 'string' || verb.length === 0) {
    return res.status(400).json({ message: 'verb is required.' });
  }
  if (typeof tense !== 'string' || tense.length === 0) {
    return res.status(400).json({ message: 'tense is required.' });
  }
  if (typeof subject !== 'string' || subject.length === 0) {
    return res.status(400).json({ message: 'subject is required.' });
  }
  if (typeof success !== 'boolean') {
    return res.status(400).json({ message: 'success must be a boolean.' });
  }

  const token = extractBearerToken(req);
  if (!token) {
    return res.status(202).json({ processed: false, reason: 'missing-token' });
  }

  const claims = decodeJwtPayload(token);
  if (!claims) {
    return res.status(202).json({ processed: false, reason: 'invalid-token' });
  }

  const cognitoSub = typeof claims.sub === 'string' && claims.sub.length > 0 ? claims.sub : null;
  if (!cognitoSub) {
    return res.status(202).json({ processed: false, reason: 'missing-sub-claim' });
  }

  const provider = resolveAuthProvider(claims);

  try {
    const user = await prisma.user.findFirst({
      where: provider === 'google'
        ? { googleCognitoSub: cognitoSub }
        : { registryCognitoSub: cognitoSub },
      select: { id: true },
    });

    if (!user) {
      return res.status(202).json({ processed: false, reason: 'unknown-user' });
    }

    const [verbRow, tenseRow, subjectRow] = await Promise.all([
      prisma.verb.findFirst({ where: { name: verb }, select: { id: true } }),
      prisma.tense.findFirst({ where: { name: tense }, select: { id: true } }),
      prisma.subject.findFirst({ where: { name: subject }, select: { id: true } }),
    ]);

    if (!verbRow || !tenseRow || !subjectRow) {
      return res.status(400).json({ message: 'Could not resolve verb/tense/subject IDs.' });
    }

    await prisma.$executeRaw`
      INSERT INTO "Practice" ("user_id", "verb_id", "tense_id", "subject_id", "success")
      VALUES (${user.id}, ${verbRow.id}::uuid, ${tenseRow.id}::uuid, ${subjectRow.id}::uuid, ${success});
    `;

    return res.status(201).json({ processed: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not save practice entry.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default practiceRouter;
