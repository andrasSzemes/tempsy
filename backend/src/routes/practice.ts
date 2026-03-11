import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import type { TokenClaims } from '../types/TokenClaims.js';

type PracticeRequestBody = {
  verb?: unknown;
  tense?: unknown;
  subject?: unknown;
  success?: unknown;
};

function parseIntegerQueryValue(value: unknown): number | null {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
    return null;
  }

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

function monthStartUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function monthKey(year: number, monthIndex: number): number {
  return year * 12 + monthIndex;
}

function formatUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

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

practiceRouter.get('/statistics', async (req: Request, res: Response) => {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Missing bearer token.' });
  }

  const claims = decodeJwtPayload(token);
  if (!claims) {
    return res.status(401).json({ message: 'Invalid bearer token.' });
  }

  const cognitoSub = typeof claims.sub === 'string' && claims.sub.length > 0 ? claims.sub : null;
  if (!cognitoSub) {
    return res.status(400).json({ message: 'Token claim "sub" is required.' });
  }

  const provider = resolveAuthProvider(claims);

  const yearQuery = parseIntegerQueryValue(req.query.year);
  const monthQuery = parseIntegerQueryValue(req.query.month);

  if (yearQuery !== null && (yearQuery < 2000 || yearQuery > 2100)) {
    return res.status(400).json({ message: 'year must be between 2000 and 2100.' });
  }
  if (monthQuery !== null && (monthQuery < 1 || monthQuery > 12)) {
    return res.status(400).json({ message: 'month must be between 1 and 12.' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: provider === 'google'
        ? { googleCognitoSub: cognitoSub }
        : { registryCognitoSub: cognitoSub },
      select: { id: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User was not found.' });
    }

    const now = new Date();
    const minimumMonth = monthStartUtc(user.createdAt);
    const maximumMonth = monthStartUtc(now);
    const requestedMonth =
      yearQuery !== null && monthQuery !== null
        ? new Date(Date.UTC(yearQuery, monthQuery - 1, 1))
        : maximumMonth;

    const minKey = monthKey(minimumMonth.getUTCFullYear(), minimumMonth.getUTCMonth());
    const maxKey = monthKey(maximumMonth.getUTCFullYear(), maximumMonth.getUTCMonth());
    const requestedKey = monthKey(requestedMonth.getUTCFullYear(), requestedMonth.getUTCMonth());
    const clampedKey = Math.max(minKey, Math.min(maxKey, requestedKey));

    const selectedYear = Math.floor(clampedKey / 12);
    const selectedMonthIndex = clampedKey % 12;
    const selectedMonthStart = new Date(Date.UTC(selectedYear, selectedMonthIndex, 1));
    const nextMonthStart = new Date(Date.UTC(selectedYear, selectedMonthIndex + 1, 1));

    const [monthlyTotalRows, allTimeTotalRows, dailyRows, tenseRows] = await Promise.all([
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS "count"
        FROM "Practice"
        WHERE "user_id" = ${user.id}
          AND "created_at" >= ${selectedMonthStart}
          AND "created_at" < ${nextMonthStart};
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS "count"
        FROM "Practice"
        WHERE "user_id" = ${user.id};
      `,
      prisma.$queryRaw<Array<{ day: string; count: number }>>`
        SELECT TO_CHAR(("created_at" AT TIME ZONE 'Europe/Budapest')::date, 'YYYY-MM-DD') AS "day", COUNT(*)::int AS "count"
        FROM "Practice"
        WHERE "user_id" = ${user.id}
          AND "created_at" >= ${selectedMonthStart}
          AND "created_at" < ${nextMonthStart}
        GROUP BY 1
        ORDER BY 1 ASC;
      `,
      prisma.$queryRaw<Array<{ tense: string; count: number }>>`
        SELECT t."name" AS "tense", COUNT(*)::int AS "count"
        FROM "Practice" p
        INNER JOIN "Tense" t ON t."id" = p."tense_id"
        WHERE p."user_id" = ${user.id}
          AND p."created_at" >= ${selectedMonthStart}
          AND p."created_at" < ${nextMonthStart}
        GROUP BY t."name"
        ORDER BY "count" DESC, t."name" ASC;
      `,
    ]);

    const monthlyTotal = Number(monthlyTotalRows[0]?.count ?? 0);
    const allTimeTotal = Number(allTimeTotalRows[0]?.count ?? 0);

    const dailyCounts = dailyRows.map((row: { day: string; count: number }) => ({
      date: row.day,
      count: Number(row.count),
    }));

    const tenseBreakdown = tenseRows.map((row: { tense: string; count: number }) => {
      const count = Number(row.count);
      return {
        tense: row.tense,
        count,
        percentage: monthlyTotal > 0 ? Number(((count / monthlyTotal) * 100).toFixed(2)) : 0,
      };
    });

    return res.json({
      month: {
        year: selectedYear,
        month: selectedMonthIndex + 1,
        label: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(selectedMonthStart),
      },
      range: {
        startYear: minimumMonth.getUTCFullYear(),
        startMonth: minimumMonth.getUTCMonth() + 1,
        endYear: maximumMonth.getUTCFullYear(),
        endMonth: maximumMonth.getUTCMonth() + 1,
      },
      user: {
        registeredAt: user.createdAt.toISOString(),
      },
      totals: {
        monthly: monthlyTotal,
        allTime: allTimeTotal,
      },
      dailyCounts,
      tenseBreakdown,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not load practice statistics.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

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
