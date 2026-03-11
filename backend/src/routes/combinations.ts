import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import type { TokenClaims } from '../types/TokenClaims.js';

type GenerateCombinationsBody = {
  tense?: unknown;
  verbs?: unknown;
  personalised?: unknown;
};

const combinationsRouter = Router();

type TenseLookupRow = {
  id: string;
  name: string;
};

type CombinationRow = {
  verb: string;
  subject: string;
  conjuguatedVerbWithSubject: string;
  phraseToShow: string;
  tense: string;
};

type TimeMarkerRow = {
  placement: 'beginningOfSentence' | 'endOfSentence';
  text: string;
};

function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function capitalizeStart(sentence: string): string {
  if (!sentence) {
    return '';
  }
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function ensureSentenceEnding(sentence: string): string {
  const trimmed = sentence.trim();
  if (trimmed.length === 0) {
    return '';
  }

  const lastChar = trimmed[trimmed.length - 1];
  if (['.', '!', '?'].includes(lastChar)) {
    return trimmed;
  }

  return `${trimmed}.`;
}

function normalizePhraseToShow(phrase: string): string {
  return ensureSentenceEnding(capitalizeStart(phrase));
}

function addTimeMarker(sentence: string, marker: TimeMarkerRow): string {
  const trimmedSentence = sentence.trim();
  if (trimmedSentence.length === 0) {
    return '';
  }

  if (marker.placement === 'beginningOfSentence') {
    return `${marker.text}, ${trimmedSentence}`;
  }

  return `${trimmedSentence} ${marker.text}`;
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

combinationsRouter.post('/generate', async (req: Request<unknown, unknown, GenerateCombinationsBody>, res: Response) => {
  const { tense, verbs, personalised } = req.body ?? {};

  if (typeof tense !== 'string' || tense.trim().length === 0) {
    return res.status(400).json({ message: 'tense must be a non-empty string.' });
  }

  if (!Array.isArray(verbs) || verbs.length === 0) {
    return res.status(400).json({ message: 'verbs must be a non-empty string array.' });
  }

  if (personalised !== undefined && typeof personalised !== 'boolean') {
    return res.status(400).json({ message: 'personalised must be a boolean when provided.' });
  }

  const shouldPersonalise = personalised === true;

  const normalizedVerbs = Array.from(
    new Set(
      verbs
        .filter((verb): verb is string => typeof verb === 'string')
        .map((verb) => verb.trim())
        .filter((verb) => verb.length > 0),
    ),
  );

  if (normalizedVerbs.length === 0) {
    return res.status(400).json({ message: 'verbs must contain at least one non-empty string.' });
  }

  try {
    const trimmedTense = tense.trim();
    const tenseRows = await prisma.$queryRaw<TenseLookupRow[]>`
      SELECT "id", "name"
      FROM "Tense"
      WHERE "name" = ${trimmedTense}
      LIMIT 1;
    `;
    const tenseRow = tenseRows[0];

    if (!tenseRow) {
      return res.status(404).json({ message: 'Tense not found.' });
    }

    const verbNamesSql = Prisma.join(normalizedVerbs.map((name) => Prisma.sql`${name}`));

    let userId: string | null = null;
    if (shouldPersonalise) {
      const token = extractBearerToken(req);
      const claims = token ? decodeJwtPayload(token) : null;
      const cognitoSub = claims && typeof claims.sub === 'string' && claims.sub.length > 0 ? claims.sub : null;

      if (claims && cognitoSub) {
        const provider = resolveAuthProvider(claims);
        const user = await prisma.user.findFirst({
          where: provider === 'google'
            ? { googleCognitoSub: cognitoSub }
            : { registryCognitoSub: cognitoSub },
          select: { id: true },
        });

        userId = user?.id ?? null;
      }
    }

    const items = userId
      ? await prisma.$queryRaw<CombinationRow[]>`
          WITH practice_stats AS (
            SELECT
              p."verb_id",
              p."tense_id",
              p."subject_id",
              COUNT(*) FILTER (WHERE p."success" = true)::int AS "success_count",
              COUNT(*) FILTER (WHERE p."success" = false)::int AS "failure_count"
            FROM "Practice" p
            WHERE p."user_id" = ${userId}
            GROUP BY p."verb_id", p."tense_id", p."subject_id"
          ),
          eligible AS (
            SELECT
              v."name" AS "verb",
              s."name" AS "subject",
              c."text" AS "conjuguatedVerbWithSubject",
              ctx."text" AS "phraseToShow",
              ${tenseRow.name} AS "tense"
            FROM "Verb" v
            JOIN "Conjugation" c
              ON c."verb_id" = v."id"
             AND c."tense_id" = ${tenseRow.id}::uuid
            JOIN "Subject" s ON s."id" = c."subject_id"
            JOIN LATERAL (
              SELECT c2."text"
              FROM "Context" c2
              WHERE c2."verb_id" = v."id"
              ORDER BY random()
              LIMIT 1
            ) ctx ON true
            LEFT JOIN practice_stats ps
              ON ps."verb_id" = c."verb_id"
             AND ps."tense_id" = c."tense_id"
             AND ps."subject_id" = c."subject_id"
            WHERE v."name" IN (${verbNamesSql})
              AND (ps."verb_id" IS NULL OR ps."success_count" < ps."failure_count")
          ),
          ranked AS (
            SELECT
              e."verb",
              e."subject",
              e."conjuguatedVerbWithSubject",
              e."phraseToShow",
              e."tense",
              ROW_NUMBER() OVER (PARTITION BY e."verb" ORDER BY random()) AS "row_num"
            FROM eligible e
          )
          SELECT
            r."verb",
            r."subject",
            r."conjuguatedVerbWithSubject",
            r."phraseToShow",
            r."tense"
          FROM ranked r
          WHERE r."row_num" = 1;
        `
      : await prisma.$queryRaw<CombinationRow[]>`
          SELECT
            v."name" AS "verb",
            s."name" AS "subject",
            conj."text" AS "conjuguatedVerbWithSubject",
            ctx."text" AS "phraseToShow",
            ${tenseRow.name} AS "tense"
          FROM "Verb" v
          JOIN LATERAL (
            SELECT c."subject_id", c."text"
            FROM "Conjugation" c
            WHERE c."verb_id" = v."id"
              AND c."tense_id" = ${tenseRow.id}::uuid
            ORDER BY random()
            LIMIT 1
          ) conj ON true
          JOIN "Subject" s ON s."id" = conj."subject_id"
          JOIN LATERAL (
            SELECT c2."text"
            FROM "Context" c2
            WHERE c2."verb_id" = v."id"
            ORDER BY random()
            LIMIT 1
          ) ctx ON true
          WHERE v."name" IN (${verbNamesSql});
        `;

    const timeMarkers = await prisma.$queryRaw<TimeMarkerRow[]>`
      SELECT "text", "placement"
      FROM "TimeMarker"
      WHERE "tense_id" = ${tenseRow.id}::uuid
        AND "placement" IN ('beginningOfSentence', 'endOfSentence');
    `;

    const normalizedItems = items.map((item) => {
      const phraseWithOptionalMarker =
        timeMarkers.length > 0
          ? addTimeMarker(item.phraseToShow, getRandomItem(timeMarkers))
          : item.phraseToShow;

      return {
        ...item,
        phraseToShow: normalizePhraseToShow(phraseWithOptionalMarker),
      };
    });

    return res.status(200).json({ items: normalizedItems });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not generate combinations.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default combinationsRouter;
