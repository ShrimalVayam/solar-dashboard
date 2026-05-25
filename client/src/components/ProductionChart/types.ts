import type { SolarDataPoint, SummaryMetrics, DateFilterOption } from '@/types/solar';

export interface ProductionChartProps {
  filteredData: SolarDataPoint[];
  fullDataset: SolarDataPoint[];
  metrics: SummaryMetrics;
  activeFilter: DateFilterOption;
  onFilterChange: (value: DateFilterOption) => void;
  customStart: string;
  customEnd: string;
  onCustomRangeChange: (start: string, end: string) => void;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: SolarDataPoint & { label: string } }>;
  label?: string;
}

export interface ChartDotProps {
  cx?: number;
  cy?: number;
  payload?: SolarDataPoint;
  dataLength: number;
}
