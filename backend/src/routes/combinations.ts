import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';

type GenerateCombinationsBody = {
  tense?: unknown;
  verbs?: unknown;
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

combinationsRouter.post('/generate', async (req: Request<unknown, unknown, GenerateCombinationsBody>, res: Response) => {
  const { tense, verbs } = req.body ?? {};

  if (typeof tense !== 'string' || tense.trim().length === 0) {
    return res.status(400).json({ message: 'tense must be a non-empty string.' });
  }

  if (!Array.isArray(verbs) || verbs.length === 0) {
    return res.status(400).json({ message: 'verbs must be a non-empty string array.' });
  }

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
    const items = await prisma.$queryRaw<CombinationRow[]>`
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

    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not generate combinations.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default combinationsRouter;
