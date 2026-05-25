import type { ReactNode } from 'react';

import type { SummaryMetrics } from '@/types/solar';
import { formatDate, formatKwh } from '@/utils/formatters';

import MetricCard from './MetricCard';
import {
  IconArrowDown,
  IconArrowUp,
  IconBolt,
  IconTrend,
} from './icons';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
  siteName?: string;
}

interface MetricCardConfiguration {
  id: string;
  iconBackground: string;
  iconColor: string;
  icon: ReactNode;
  value: string;
  label: string;
  subLabel: string;
}

const SummaryCards = ({
  metrics,
  siteName,
}: SummaryCardsProps) => {
  const metricCardConfigurations: MetricCardConfiguration[] = [
    {
      id: 'total-production',
      iconBackground: 'var(--c-amber-bg)',
      iconColor: 'var(--c-amber)',
      icon: <IconBolt />,
      value: formatKwh(metrics.totalKwh),
      label: 'Total Production',
      subLabel: `Across ${metrics.dataPoints} days${
        siteName ? ` · ${siteName}` : ''
      }`,
    },
    {
      id: 'daily-average',
      iconBackground: 'var(--c-blue-bg)',
      iconColor: 'var(--c-blue)',
      icon: <IconTrend />,
      value: formatKwh(metrics.averageKwh),
      label: 'Daily Average',
      subLabel: 'Per day average',
    },
    {
      id: 'peak-production',
      iconBackground: 'var(--c-teal-bg)',
      iconColor: 'var(--c-teal)',
      icon: <IconArrowUp />,
      value: formatKwh(metrics.peakDay.production_kwh),
      label: 'Peak Production',
      subLabel: formatDate(metrics.peakDay.date),
    },
    {
      id: 'lowest-production',
      iconBackground: 'var(--c-rose-bg)',
      iconColor: 'var(--c-rose)',
      icon: <IconArrowDown />,
      value: formatKwh(metrics.lowestDay.production_kwh),
      label: 'Lowest Production',
      subLabel: formatDate(metrics.lowestDay.date),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
      {metricCardConfigurations.map(
        ({
          id,
          iconBackground,
          iconColor,
          icon,
          value,
          label,
          subLabel,
        }) => (
          <MetricCard
            key={id}
            iconBg={iconBackground}
            iconColor={iconColor}
            icon={icon}
            value={value}
            label={label}
            subLabel={subLabel}
          />
        )
      )}
    </div>
  );
};

export default SummaryCards;