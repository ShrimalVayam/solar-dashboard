import type { DateFilterOption } from '@/types/solar';

export const DAYS_MAP: Record<
  Exclude<DateFilterOption, 'all' | 'custom'>,
  number
> = {
  '7d': 7,
  '30d': 30,
  '60d': 60,
  '90d': 90,
};

export const FILTER_PILLS: {
  label: string;
  value: Exclude<DateFilterOption, 'custom'>;
}[] = [
  { label: 'Last 7 days',  value: '7d'  },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 60 days', value: '60d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time',     value: 'all' },
];

export const DEMO_FILE_NAME = 'solar_production_sample.csv';

export const INSIGHT_USER_PROMPT =
  'Generate a comprehensive analysis of this solar production data. ' +
  'Highlight key trends, the best and worst periods, any anomalies, ' +
  'and one actionable observation.';

export const CHART_COLORS = {
  line:       '#f59e0b',
  anomaly:    '#f43f5e',
  grid:       '#252d3f',
  axis:       '#5d6580',
  background: '#0e1017',
  reference:  '#3a4560',
} as const;
