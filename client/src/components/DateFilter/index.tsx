import { useEffect, useState } from 'react';
import clsx from 'clsx';

import type { DateFilterOption } from '@/types/solar';
import { FILTER_PILLS } from '@/constants';

interface DateFilterProps {
  activeFilter: DateFilterOption;
  onFilterChange: (value: DateFilterOption) => void;
  customStart: string;
  customEnd: string;
  onCustomRangeChange: (start: string, end: string) => void;
  dataMin?: string;
  dataMax?: string;
}

interface DateRangeField {
  id: 'from' | 'to';
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3 w-3 shrink-0"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FILTER_PILL_BASE_CLASSNAME =
  'rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg-card-2)] px-[0.8em] py-[0.3em] text-xs font-medium whitespace-nowrap text-[var(--text-3)] transition-[background,color,border-color] duration-[120ms] hover:border-[var(--border-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-2)]';

const FILTER_PILL_ACTIVE_CLASSNAME =
  'border-[var(--accent)] bg-[var(--accent)] !text-white hover:border-[var(--accent-2)] hover:bg-[var(--accent-2)]';

const DateFilter = ({
  activeFilter,
  onFilterChange,
  customStart,
  customEnd,
  onCustomRangeChange,
  dataMin,
  dataMax,
}: DateFilterProps) => {
  const [isCustomPickerVisible, setIsCustomPickerVisible] =
    useState(activeFilter === 'custom');

  useEffect(() => {
    setIsCustomPickerVisible(activeFilter === 'custom');
  }, [activeFilter]);

  const handlePresetFilterSelect = (
    filterValue: Exclude<DateFilterOption, 'custom'>
  ): void => {
    setIsCustomPickerVisible(false);
    onFilterChange(filterValue);
  };

  const handleCustomRangeToggle = (): void => {
    const nextVisibilityState = !isCustomPickerVisible;

    setIsCustomPickerVisible(nextVisibilityState);

    onFilterChange(
      nextVisibilityState ? 'custom' : 'all'
    );
  };

  const dateRangeFields: DateRangeField[] = [
    {
      id: 'from',
      label: 'From',
      value: customStart,
      min: dataMin,
      max: customEnd || dataMax,
      onChange: (value) =>
        onCustomRangeChange(value, customEnd),
    },
    {
      id: 'to',
      label: 'To',
      value: customEnd,
      min: customStart || dataMin,
      max: dataMax,
      onChange: (value) =>
        onCustomRangeChange(customStart, value),
    },
  ];

  return (
    <div className="flex flex-col gap-[0.6rem]">
      <div className="flex flex-wrap gap-1">
        {FILTER_PILLS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              handlePresetFilterSelect(value)
            }
            className={clsx(
              FILTER_PILL_BASE_CLASSNAME,
              activeFilter === value &&
                FILTER_PILL_ACTIVE_CLASSNAME
            )}
          >
            {label}
          </button>
        ))}

        <button
          type="button"
          onClick={handleCustomRangeToggle}
          className={clsx(
            FILTER_PILL_BASE_CLASSNAME,
            'flex items-center gap-[0.35rem] pl-[0.65em]',
            activeFilter === 'custom' &&
              FILTER_PILL_ACTIVE_CLASSNAME
          )}
        >
          <CalendarIcon />
          Custom range
        </button>
      </div>

      {isCustomPickerVisible && (
        <div className="animate-slide-down flex flex-wrap items-end gap-[0.6rem] rounded-[var(--r-md)] border border-[var(--border-2)] bg-[var(--bg-card-2)] px-[0.9rem] py-3">
          {dateRangeFields.map(
            (
              {
                id,
                label,
                value,
                min,
                max,
                onChange,
              },
              index
            ) => (
              <div key={id} className="contents">
                <div className="flex flex-col gap-[0.3rem]">
                  <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[var(--text-3)]">
                    {label}
                  </label>

                  <input
                    type="date"
                    value={value}
                    min={min}
                    max={max}
                    onChange={(event) => {
                      onFilterChange('custom');
                      onChange(event.target.value);
                    }}
                    className="rounded-[var(--r-sm)] border border-[var(--border-2)] bg-[var(--bg-card)] px-[0.6em] py-[0.35em] text-sm text-[var(--text)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                {index === 0 && (
                  <span className="shrink-0 pb-[0.4rem] text-sm text-[var(--text-3)]">
                    →
                  </span>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DateFilter;