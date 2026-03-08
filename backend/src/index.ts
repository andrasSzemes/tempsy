import express, { Request, Response } from 'express';
import cors from 'cors';
import prisma from './lib/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  const SECRETS = JSON.parse(process.env.AWS_SECRETS || '{}');

  res.json({ message: `Welcome to tempsy backend API: ${SECRETS?.DATABASE_URL?.substring(0, 20)}...` });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/users/count', async (_req: Request, res: Response) => {
  try {
    const count = await prisma.user.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: 'Database is not ready or migration is missing.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
