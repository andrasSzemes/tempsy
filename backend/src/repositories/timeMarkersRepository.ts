import prisma from '../lib/prisma.js';

export type TimeMarkerRow = {
  placement: 'beginningOfSentence' | 'endOfSentence';
  text: string;
};

export async function findTimeMarkersByTenseId(tenseId: string): Promise<TimeMarkerRow[]> {
  return prisma.$queryRaw<TimeMarkerRow[]>`
    SELECT "text", "placement"
    FROM "TimeMarker"
    WHERE "tense_id" = ${tenseId}::uuid
      AND "placement" IN ('beginningOfSentence', 'endOfSentence');
  `;
}
