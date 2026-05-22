import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const keySet = !!process.env.GROQ_API_KEY;
  logger.info(`🟢 Solar API running on http://localhost:${PORT}`);
  logger.info(
    keySet
      ? '✅ GROQ_API_KEY loaded'
      : '⚠️  GROQ_API_KEY not set — AI insights will return an error'
  );
});
