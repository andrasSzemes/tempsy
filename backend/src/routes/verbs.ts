import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';

type VerbRow = {
  name: string;
};

type TenseRow = {
  name: string;
};

type IrregularRow = {
  tense: string;
  verb: string;
};

const verbsRouter = Router();

verbsRouter.get('/tense', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.$queryRaw<TenseRow[]>`
      SELECT "name"
      FROM "Tense"
      ORDER BY "name" ASC;
    `;

    const tenses = rows.map((row) => row.name);
    return res.status(200).json({ tenses });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch tenses.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

verbsRouter.get('/irregular', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.$queryRaw<IrregularRow[]>`
      SELECT
        t."name" AS "tense",
        v."name" AS "verb"
      FROM "Irregular" i
      JOIN "Verb" v ON v."id" = i."verb_id"
      JOIN "Tense" t ON t."id" = i."tense_id"
      ORDER BY t."name" ASC, v."name" ASC;
    `;

    const irregularByTense: Record<string, string[]> = {};

    for (const row of rows) {
      if (!irregularByTense[row.tense]) {
        irregularByTense[row.tense] = [];
      }
      irregularByTense[row.tense].push(row.verb);
    }

    return res.status(200).json({ irregularByTense });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch irregular verbs.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

verbsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.$queryRaw<VerbRow[]>`
      SELECT "name"
      FROM "Verb"
      ORDER BY "name" ASC;
    `;

    const verbs = rows.map((row) => row.name);
    return res.status(200).json({ verbs });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch verbs.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default verbsRouter;
