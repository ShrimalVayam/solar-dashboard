import { useMemo } from 'react';
import type { SolarDataPoint, DateFilterOption } from '@/types/solar';
import { DAYS_MAP } from '@/constants';

interface UseFilteredDataOptions {
  data: SolarDataPoint[] | null;
  filter: DateFilterOption;
  customStart: string;
  customEnd: string;
}

const toEpochMs = (dateStr: string, endOfDay = false): number =>
  new Date(`${dateStr}T${endOfDay ? '23:59:59' : '00:00:00'}`).getTime();

export const useFilteredData = ({
  data,
  filter,
  customStart,
  customEnd,
}: UseFilteredDataOptions): SolarDataPoint[] => {
  return useMemo<SolarDataPoint[]>(() => {
    if (!data?.length) return [];

    if (filter === 'all') return data;

    if (filter === 'custom') {
      if (!customStart && !customEnd) return data;
      const windowStart = customStart ? toEpochMs(customStart) : -Infinity;
      const windowEnd = customEnd ? toEpochMs(customEnd, true) : Infinity;
      return data.filter((point) => {
        const pointMs = toEpochMs(point.date);
        return pointMs >= windowStart && pointMs <= windowEnd;
      });
    }

    const windowDays = DAYS_MAP[filter as keyof typeof DAYS_MAP];
    const latestMs = toEpochMs(data[data.length - 1].date);
    const cutoffMs = latestMs - windowDays * 86_400_000;

    return data.filter((point) => toEpochMs(point.date) >= cutoffMs);
  }, [data, filter, customStart, customEnd]);
};