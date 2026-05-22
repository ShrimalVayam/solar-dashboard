import type { SolarDataPoint, SummaryMetrics } from '@/types/solar';

export const computeMetrics = (data: SolarDataPoint[]): SummaryMetrics => {
  const totalKwh = data.reduce((sum, d) => sum + d.production_kwh, 0);
  const averageKwh = totalKwh / data.length;

  const peakDay = data.reduce((best, d) =>
    d.production_kwh > best.production_kwh ? d : best
  );
  const lowestDay = data.reduce((worst, d) =>
    d.production_kwh < worst.production_kwh ? d : worst
  );
  const anomalyCount = data.filter((d) => d.anomaly_detected === true).length;

  return {
    totalKwh,
    averageKwh,
    peakDay,
    lowestDay,
    dataPoints: data.length,
    anomalyCount,
  };
};
