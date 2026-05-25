import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import type { SolarDataPoint } from '@/types/solar';
import { formatDateShort, formatDate } from '@/utils/formatters';
import { CHART_COLORS } from '@/constants';
import DateFilter from '@/components/DateFilter';
import ChartTooltip from './ChartTooltip';
import ChartDot from './ChartDot';
import type { ProductionChartProps } from './types';

const ProductionChart = ({
  filteredData,
  fullDataset,
  metrics,
  activeFilter,
  onFilterChange,
  customStart,
  customEnd,
  onCustomRangeChange,
}: ProductionChartProps) => {
  const chartData = filteredData.map((d) => ({
    ...d,
    label: formatDateShort(d.date),
  }));

  const tickInterval = Math.max(1, Math.floor(filteredData.length / 9));
  const hasAnomalies = filteredData.some((d) => d.anomaly_detected);
  const dataMin = fullDataset[0]?.date;
  const dataMax = fullDataset[fullDataset.length - 1]?.date;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-xl)] p-[1.35rem] pb-[1.1rem] flex-1">
      <div className="flex items-start justify-between gap-4 mb-[0.9rem]">
        <div>
          <h2 className="font-display text-base font-bold text-[var(--text)] tracking-[-0.01em]">
            Production Trend
          </h2>
          <p className="text-xs text-[var(--text-3)] mt-[3px]">
            Daily solar energy output over time
          </p>
        </div>
        <div className="flex items-center gap-[1.1rem] shrink-0">
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)] before:content-[''] before:block before:w-5 before:h-0.5 before:bg-[var(--accent)] before:rounded">
            Production
          </span>
          {hasAnomalies && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)] before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:bg-[var(--red)]">
              Anomaly
            </span>
          )}
        </div>
      </div>

      <div className="mb-[1.1rem]">
        <DateFilter
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          customStart={customStart}
          customEnd={customEnd}
          onCustomRangeChange={onCustomRangeChange}
          dataMin={dataMin}
          dataMax={dataMax}
        />
      </div>

      <ResponsiveContainer width="100%" height={310}>
        <ComposedChart
          data={chartData}
          margin={{ top: 6, right: 10, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor={CHART_COLORS.line} stopOpacity={0.38} />
              <stop offset="90%" stopColor={CHART_COLORS.line} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 4"
            stroke={CHART_COLORS.grid}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: CHART_COLORS.axis, fontFamily: 'Inter, sans-serif' }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval - 1}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_COLORS.axis, fontFamily: 'Inter, sans-serif' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => String(v)}
            domain={[0, 'auto']}
            width={36}
          />
          <Tooltip content={<ChartTooltip />} />
          <ReferenceLine
            y={metrics.averageKwh}
            stroke={CHART_COLORS.reference}
            strokeDasharray="4 3"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="production_kwh"
            stroke={CHART_COLORS.line}
            strokeWidth={2.5}
            fill="url(#solarGrad)"
            dot={(props: { cx?: number; cy?: number; payload?: SolarDataPoint }) =>
              ChartDot({ ...props, dataLength: filteredData.length })
            }
            activeDot={{
              r: 6,
              fill: CHART_COLORS.line,
              stroke: CHART_COLORS.background,
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-xs text-[var(--text-4)] mt-3 pt-3 border-t border-[var(--border)]">
        {filteredData.length > 0
          ? `${formatDate(filteredData[0].date)} — ${formatDate(filteredData[filteredData.length - 1].date)} · ${filteredData.length} days`
          : 'No data in selected range'}
      </p>
    </div>
  );
};

export default ProductionChart;
