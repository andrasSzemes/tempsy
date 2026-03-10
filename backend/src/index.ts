import express, { Request, Response } from 'express';
import cors from 'cors';
import combinationsRouter from './routes/combinations.js';
import usersRouter from './routes/users.js';
import verbsRouter from './routes/verbs.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to tempsy backend API' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/users', usersRouter);
app.use('/api/combinations', combinationsRouter);
app.use('/api/verbs', verbsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
