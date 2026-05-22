import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import logger from './utils/logger';
import healthRouter from './routes/health.route';
import aiRouter from './routes/ai.route';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/', healthRouter);
app.use('/api/ai', aiRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;
