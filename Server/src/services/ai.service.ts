import { Response } from 'express';
import logger from '../utils/logger';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

export class AIService {
  static generateInsights = async (
    system: string,
    messages: Message[],
    res: Response
  ): Promise<void> => {
    const apiKey = process.env.GROQ_API_KEY;
    const apiUrl = process.env.GROQ_API_URL;

    if (!apiKey) {
      res.status(500).json({ error: 'GROQ_API_KEY is not set in backend/.env' });
      return;
    }
    if (!apiUrl) {
      res.status(500).json({ error: 'GROQ_API_URL is not set in backend/.env' });
      return;
    }

    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 30_000);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 500,
          temperature: 0.5,
          messages: [{ role: 'system', content: system }, ...messages],
        }),
        signal: abort.signal,
      });

      clearTimeout(timeout);

      const data = (await response.json()) as GroqResponse;

      if (!response.ok) {
        res.status(response.status).json({
          error: data?.error?.message || response.statusText,
        });
        return;
      }

      res.json({ text: data?.choices?.[0]?.message?.content || '' });
    } catch (err) {
      clearTimeout(timeout);

      if (err instanceof Error && err.name === 'AbortError') {
        logger.error('Groq request timed out after 30s');
        res.status(504).json({ error: 'Request to Groq timed out. Try again.' });
        return;
      }

      logger.error('Groq AI service error: ' + String(err));
      res.status(500).json({ error: 'Failed to reach Groq API.' });
    }
  };
}