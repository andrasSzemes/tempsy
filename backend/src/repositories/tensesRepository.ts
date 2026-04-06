import prisma from '../lib/prisma.js';

export type TenseLookupRow = {
  id: string;
  name: string;
};

type TenseNameRow = {
  name: string;
};

export async function listTenseNames(): Promise<string[]> {
  const rows = await prisma.$queryRaw<TenseNameRow[]>`
    SELECT "name"
    FROM "Tense"
    ORDER BY "name" ASC;
  `;

  return rows.map((row) => row.name);
}

export async function findTenseByName(tenseName: string): Promise<TenseLookupRow | null> {
  const tenseRows = await prisma.$queryRaw<TenseLookupRow[]>`
    SELECT "id", "name"
    FROM "Tense"
    WHERE "name" = ${tenseName}
    LIMIT 1;
  `;

  return tenseRows[0] ?? null;
}
