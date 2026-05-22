import { useMemo } from 'react';
import type { SolarDataPoint, DateFilterOption } from '@/types/solar';
import { DAYS_MAP } from '@/constants';

interface UseFilteredDataOptions {
  data: SolarDataPoint[] | null;
  filter: DateFilterOption;
  customStart: string;
  customEnd: string;
}

export const useFilteredData = ({
  data,
  filter,
  customStart,
  customEnd,
}: UseFilteredDataOptions): SolarDataPoint[] => {
  return useMemo<SolarDataPoint[]>(() => {
    if (!data) return [];

    if (filter === 'custom') {
      if (!customStart && !customEnd) return data;
      return data.filter((d) => {
        const t = new Date(d.date + 'T00:00:00').getTime();
        const s = customStart
          ? new Date(customStart + 'T00:00:00').getTime()
          : -Infinity;
        const e = customEnd
          ? new Date(customEnd + 'T23:59:59').getTime()
          : Infinity;
        return t >= s && t <= e;
      });
    }

    if (filter === 'all') return data;

    const days = DAYS_MAP[filter as keyof typeof DAYS_MAP];
    const last = new Date(
      data[data.length - 1].date + 'T00:00:00'
    ).getTime();
    const cutoff = last - days * 86_400_000;
    return data.filter(
      (d) => new Date(d.date + 'T00:00:00').getTime() >= cutoff
    );
  }, [data, filter, customStart, customEnd]);
};
