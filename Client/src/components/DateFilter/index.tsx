import { useState } from 'react';
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-3 h-3 shrink-0">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
  </svg>
);

const PILL_BASE_CLASSES =
  'text-xs font-medium px-[0.8em] py-[0.3em] rounded-[var(--r-sm)] bg-[var(--bg-card-2)] border border-[var(--border)] text-[var(--text-3)] whitespace-nowrap transition-[background,color,border-color] duration-[120ms] hover:text-[var(--text-2)] hover:border-[var(--border-2)] hover:bg-[var(--bg-hover)]';

const PILL_ACTIVE_CLASSES =
  'bg-[var(--accent)] border-[var(--accent)] !text-white hover:bg-[var(--accent-2)] hover:border-[var(--accent-2)]';

const getPillClasses = (isActive: boolean, extra = ''): string =>
  [PILL_BASE_CLASSES, isActive ? PILL_ACTIVE_CLASSES : '', extra]
    .filter(Boolean)
    .join(' ');

const DateFilter = ({
  activeFilter,
  onFilterChange,
  customStart,
  customEnd,
  onCustomRangeChange,
  dataMin,
  dataMax,
}: DateFilterProps) => {
  const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(
    activeFilter === 'custom'
  );

  const handlePresetFilterSelect = (
    value: Exclude<DateFilterOption, 'custom'>
  ): void => {
    setIsCustomPickerVisible(false);
    onFilterChange(value);
  };

  const handleCustomRangeToggle = (): void => {
    const nextVisible = !isCustomPickerVisible;
    setIsCustomPickerVisible(nextVisible);
    onFilterChange(nextVisible ? 'custom' : 'all');
  };

  const dateRangeFields: DateRangeField[] = [
    {
      id: 'from',
      label: 'From',
      value: customStart,
      min: dataMin,
      max: customEnd || dataMax,
      onChange: (value) => onCustomRangeChange(value, customEnd),
    },
    {
      id: 'to',
      label: 'To',
      value: customEnd,
      min: customStart || dataMin,
      max: dataMax,
      onChange: (value) => onCustomRangeChange(customStart, value),
    },
  ];

  return (
    <div className="flex flex-col gap-[0.6rem]">
      <div className="flex gap-1 flex-wrap">
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill.value}
            onClick={() => handlePresetFilterSelect(pill.value)}
            className={getPillClasses(activeFilter === pill.value)}
          >
            {pill.label}
          </button>
        ))}

        <button
          onClick={handleCustomRangeToggle}
          className={getPillClasses(
            activeFilter === 'custom',
            'flex items-center gap-[0.35rem] pl-[0.65em]'
          )}
        >
          <CalendarIcon />
          Custom range
        </button>
      </div>

      {isCustomPickerVisible && (
        <div className="flex items-end gap-[0.6rem] px-[0.9rem] py-3 bg-[var(--bg-card-2)] border border-[var(--border-2)] rounded-[var(--r-md)] flex-wrap animate-slide-down">
          {dateRangeFields.map((field, index) => (
              <div key={field.id} className="contents">
              <div className="flex flex-col gap-[0.3rem]">
                <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[var(--text-3)]">
                  {field.label}
                </label>
                <input
                  type="date"
                  value={field.value}
                  min={field.min}
                  max={field.max}
                  onChange={(e) => {
                    onFilterChange('custom');
                    field.onChange(e.target.value);
                  }}
                  className="bg-[var(--bg-card)] border border-[var(--border-2)] rounded-[var(--r-sm)] text-[var(--text)] text-sm px-[0.6em] py-[0.35em] transition-colors focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              {index === 0 && (
                <span className="text-sm text-[var(--text-3)] pb-[0.4rem] shrink-0">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateFilter;