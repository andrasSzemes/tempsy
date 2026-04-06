import prisma from '../lib/prisma.js';

type MonthlyTotalRow = { count: number };
type AllTimeTotalRow = { count: number };
type DailyCountRow = { day: string; count: number };
type TenseBreakdownRow = { tense: string; count: number };

export type PracticeStatisticsData = {
  monthlyTotal: number;
  allTimeTotal: number;
  dailyRows: DailyCountRow[];
  tenseRows: TenseBreakdownRow[];
};

export type ResolvedPracticeIds = {
  verbId: string;
  tenseId: string;
  subjectId: string;
};

export async function getPracticeStatisticsData(
  userId: string,
  selectedMonthStart: Date,
  nextMonthStart: Date,
): Promise<PracticeStatisticsData> {
  const [monthlyTotalRows, allTimeTotalRows, dailyRows, tenseRows] = await Promise.all([
    prisma.$queryRaw<MonthlyTotalRow[]>`
      SELECT COUNT(*)::int AS "count"
      FROM "Practice"
      WHERE "user_id" = ${userId}
        AND "created_at" >= ${selectedMonthStart}
        AND "created_at" < ${nextMonthStart};
    `,
    prisma.$queryRaw<AllTimeTotalRow[]>`
      SELECT COUNT(*)::int AS "count"
      FROM "Practice"
      WHERE "user_id" = ${userId};
    `,
    prisma.$queryRaw<DailyCountRow[]>`
      SELECT TO_CHAR(("created_at" AT TIME ZONE 'Europe/Budapest')::date, 'YYYY-MM-DD') AS "day", COUNT(*)::int AS "count"
      FROM "Practice"
      WHERE "user_id" = ${userId}
        AND "created_at" >= ${selectedMonthStart}
        AND "created_at" < ${nextMonthStart}
      GROUP BY 1
      ORDER BY 1 ASC;
    `,
    prisma.$queryRaw<TenseBreakdownRow[]>`
      SELECT t."name" AS "tense", COUNT(*)::int AS "count"
      FROM "Practice" p
      INNER JOIN "Tense" t ON t."id" = p."tense_id"
      WHERE p."user_id" = ${userId}
        AND p."created_at" >= ${selectedMonthStart}
        AND p."created_at" < ${nextMonthStart}
      GROUP BY t."name"
      ORDER BY "count" DESC, t."name" ASC;
    `,
  ]);

  return {
    monthlyTotal: Number(monthlyTotalRows[0]?.count ?? 0),
    allTimeTotal: Number(allTimeTotalRows[0]?.count ?? 0),
    dailyRows,
    tenseRows,
  };
}

export async function resolvePracticeIds(
  verb: string,
  tense: string,
  subject: string,
): Promise<ResolvedPracticeIds | null> {
  const [verbRow, tenseRow, subjectRow] = await Promise.all([
    prisma.verb.findFirst({ where: { name: verb }, select: { id: true } }),
    prisma.tense.findFirst({ where: { name: tense }, select: { id: true } }),
    prisma.subject.findFirst({ where: { name: subject }, select: { id: true } }),
  ]);

  if (!verbRow || !tenseRow || !subjectRow) {
    return null;
  }

  return {
    verbId: verbRow.id,
    tenseId: tenseRow.id,
    subjectId: subjectRow.id,
  };
}

export async function createPracticeEntry(
  userId: string,
  resolvedIds: ResolvedPracticeIds,
  success: boolean,
): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "Practice" ("user_id", "verb_id", "tense_id", "subject_id", "success")
    VALUES (${userId}, ${resolvedIds.verbId}::uuid, ${resolvedIds.tenseId}::uuid, ${resolvedIds.subjectId}::uuid, ${success});
  `;
}
