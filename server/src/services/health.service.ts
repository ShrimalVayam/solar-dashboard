import { Request, Response } from 'express';

export class HealthService {
  static handleHealthService = (_req: Request, res: Response) => {
    res.send('Solar Dashboard API is running!');
  };
}
