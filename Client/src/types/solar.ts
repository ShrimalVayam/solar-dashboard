export interface SolarDataPoint {
  date: string;
  production_kwh: number;
  site_name?: string;
  weather?: string;
  anomaly_detected?: boolean;
}

export interface SummaryMetrics {
  totalKwh: number;
  averageKwh: number;
  peakDay: SolarDataPoint;
  lowestDay: SolarDataPoint;
  dataPoints: number;
  anomalyCount: number;
}

export type DateFilterOption = '7d' | '30d' | '60d' | '90d' | 'all' | 'custom';
