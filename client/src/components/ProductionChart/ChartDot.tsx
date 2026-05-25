import { CHART_COLORS } from '@/constants';
import type { ChartDotProps } from './types';

const ChartDot = ({ cx = 0, cy = 0, payload, dataLength }: ChartDotProps) => {
  if (!payload) return <g key={`d-${cx}`} />;

  if (payload.anomaly_detected) {
    return (
      <circle key={`anom-${cx}`} cx={cx} cy={cy} r={5}
        fill={CHART_COLORS.anomaly} />
    );
  }

  if (dataLength > 45) return <g key={`d-${cx}`} />;

  return (
    <circle key={`dot-${cx}`} cx={cx} cy={cy} r={3}
      fill={CHART_COLORS.line} />
  );
};

export default ChartDot;
