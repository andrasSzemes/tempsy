import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import type { TenseLookupRow } from './tensesRepository.js';

export type CombinationRow = {
  verb: string;
  subject: string;
  conjuguatedVerbWithSubject: string;
  phraseToShow: string;
  tense: string;
};

export async function findCombinationsByTenseAndVerbs(
  tenseRow: TenseLookupRow,
  normalizedVerbs: string[],
): Promise<CombinationRow[]> {
  const verbNamesSql = Prisma.join(normalizedVerbs.map((name) => Prisma.sql`${name}`));

  return prisma.$queryRaw<CombinationRow[]>`
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
}

export async function findPersonalisedCombinationsByTenseAndVerbs(
  tenseRow: TenseLookupRow,
  normalizedVerbs: string[],
  userId: string,
): Promise<CombinationRow[]> {
  const verbNamesSql = Prisma.join(normalizedVerbs.map((name) => Prisma.sql`${name}`));

  return prisma.$queryRaw<CombinationRow[]>`
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
  `;
}
