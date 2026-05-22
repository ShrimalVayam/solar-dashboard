import type { SummaryMetrics } from '@/types/solar';
import { formatKwh, formatDate } from '@/utils/formatters';
import MetricCard from './MetricCard';
import { IconBolt, IconTrend, IconArrowUp, IconArrowDown } from './icons';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
  siteName?: string;
}

const SummaryCards = ({ metrics, siteName }: SummaryCardsProps) => (
  <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
    <MetricCard
      iconBg="var(--c-amber-bg)"
      iconColor="var(--c-amber)"
      icon={<IconBolt />}
      value={formatKwh(metrics.totalKwh)}
      label="Total Production"
      subLabel={`Across ${metrics.dataPoints} days${siteName ? ' · ' + siteName : ''}`}
    />
    <MetricCard
      iconBg="var(--c-blue-bg)"
      iconColor="var(--c-blue)"
      icon={<IconTrend />}
      value={formatKwh(metrics.averageKwh)}
      label="Daily Average"
      subLabel="Per day average"
    />
    <MetricCard
      iconBg="var(--c-teal-bg)"
      iconColor="var(--c-teal)"
      icon={<IconArrowUp />}
      value={formatKwh(metrics.peakDay.production_kwh)}
      label="Peak Production"
      subLabel={formatDate(metrics.peakDay.date)}
    />
    <MetricCard
      iconBg="var(--c-rose-bg)"
      iconColor="var(--c-rose)"
      icon={<IconArrowDown />}
      value={formatKwh(metrics.lowestDay.production_kwh)}
      label="Lowest Production"
      subLabel={formatDate(metrics.lowestDay.date)}
    />
  </div>
);

export default SummaryCards;
