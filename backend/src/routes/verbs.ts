import { Router, Request, Response } from 'express';
import { listTenseNames } from '../repositories/tensesRepository.js';
import { listIrregularRows, listVerbNames } from '../repositories/verbsRepository.js';

const verbsRouter = Router();

verbsRouter.get('/tense', async (_req: Request, res: Response) => {
  try {
    const tenses = await listTenseNames();
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
    const rows = await listIrregularRows();

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
    const verbs = await listVerbNames();
    return res.status(200).json({ verbs });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch verbs.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default verbsRouter;
