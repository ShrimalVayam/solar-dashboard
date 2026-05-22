import type { SolarDataPoint, SummaryMetrics } from '@/types/solar';
import { formatKwh, formatDate } from '@/utils/formatters';
import { post } from '@/utils/httpClient';
import { INSIGHT_USER_PROMPT } from '@/constants';

interface InsightResponse {
  text?: string;
  error?: string;
}

interface InsightRequestBody {
  system: string;
  messages: Array<{ role: string; content: string }>;
}

const buildSystemPrompt = (
  data: SolarDataPoint[],
  metrics: SummaryMetrics,
  siteName?: string
): string => {
  const rows = data
    .slice(0, 90)
    .map((d) => {
      const parts = [`${d.date}: ${d.production_kwh} kWh`];
      if (d.weather) parts.push(d.weather);
      if (d.anomaly_detected) parts.push('ANOMALY');
      return parts.join(' | ');
    })
    .join('\n');

  return [
    'You are a solar production analyst assistant.',
    siteName ? `Site: ${siteName}` : '',
    `Period: ${data[0]?.date} to ${data[data.length - 1]?.date}`,
    `Total: ${formatKwh(metrics.totalKwh)} | Average: ${formatKwh(metrics.averageKwh)}/day`,
    `Peak: ${formatDate(metrics.peakDay.date)} (${formatKwh(metrics.peakDay.production_kwh)})`,
    `Lowest: ${formatDate(metrics.lowestDay.date)} (${formatKwh(metrics.lowestDay.production_kwh)})`,
    metrics.anomalyCount ? `Anomaly days: ${metrics.anomalyCount}` : '',
    '',
    'Daily data:',
    rows,
    '',
    'Instructions: Write 4-5 concise, friendly sentences. Be specific with dates and numbers. No bullet points.',
  ]
    .filter(Boolean)
    .join('\n');
};

export const generateInsights = async (
  data: SolarDataPoint[],
  metrics: SummaryMetrics,
  siteName?: string
): Promise<string> => {
  const system = buildSystemPrompt(data, metrics, siteName);
  const response = await post<InsightResponse, InsightRequestBody>(
    '/api/ai/insights',
    { system, messages: [{ role: 'user', content: INSIGHT_USER_PROMPT }] }
  );
  if (!response.ok || response.data.error) {
    throw new Error(response.data.error ?? 'API request failed');
  }
  return response.data.text ?? '';
};
