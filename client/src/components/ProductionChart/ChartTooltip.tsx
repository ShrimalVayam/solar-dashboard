import { formatKwh } from '@/utils/formatters';
import type { ChartTooltipProps } from './types';

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-[var(--bg-card-2)] border border-[var(--border-2)] rounded-[var(--r-md)] px-[0.9rem] py-[0.6rem] shadow-[0_8px_28px_rgba(0,0,0,0.55)] min-w-[120px]">
      <p className="text-xs text-[var(--text-3)] mb-0.5 font-medium">{label}</p>
      <p className="text-[0.9375rem] font-bold text-[var(--text)] tabular-nums">
        {formatKwh(payload[0].value)}
      </p>
      {d.weather && (
        <p className="text-xs text-[var(--text-2)] mt-0.5">{d.weather}</p>
      )}
      {d.anomaly_detected && (
        <p className="text-xs text-[var(--red)] mt-0.5 font-semibold">⚠ Anomaly</p>
      )}
    </div>
  );
};

export default ChartTooltip;
