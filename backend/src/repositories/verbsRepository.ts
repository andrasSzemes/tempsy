import prisma from '../lib/prisma.js';

type VerbRow = {
  name: string;
};

export type IrregularRow = {
  tense: string;
  verb: string;
};

export async function listVerbNames(): Promise<string[]> {
  const rows = await prisma.$queryRaw<VerbRow[]>`
    SELECT "name"
    FROM "Verb"
    ORDER BY "name" ASC;
  `;

  return rows.map((row) => row.name);
}

export async function listIrregularRows(): Promise<IrregularRow[]> {
  return prisma.$queryRaw<IrregularRow[]>`
    SELECT
      t."name" AS "tense",
      v."name" AS "verb"
    FROM "Irregular" i
    JOIN "Verb" v ON v."id" = i."verb_id"
    JOIN "Tense" t ON t."id" = i."tense_id"
    ORDER BY t."name" ASC, v."name" ASC;
  `;
}
