import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';

export class AIController {
  static generateInsights = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { system, messages } = req.body;

      if (!system || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Invalid request: system and messages required.' });
        return;
      }

      await AIService.generateInsights(system, messages, res);
    } catch (err) {
      next(err);
    }
  };
}