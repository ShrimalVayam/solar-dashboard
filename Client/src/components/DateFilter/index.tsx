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

const pillBase =
  'text-xs font-medium px-[0.8em] py-[0.3em] rounded-[var(--r-sm)] bg-[var(--bg-card-2)] border border-[var(--border)] text-[var(--text-3)] whitespace-nowrap transition-[background,color,border-color] duration-[120ms] hover:text-[var(--text-2)] hover:border-[var(--border-2)] hover:bg-[var(--bg-hover)]';
const pillActive =
  'bg-[var(--accent)] border-[var(--accent)] !text-white hover:bg-[var(--accent-2)] hover:border-[var(--accent-2)]';

const DateFilter = ({
  activeFilter,
  onFilterChange,
  customStart,
  customEnd,
  onCustomRangeChange,
  dataMin,
  dataMax,
}: DateFilterProps) => {
  const [showPicker, setShowPicker] = useState(activeFilter === 'custom');

  const handlePill = (value: Exclude<DateFilterOption, 'custom'>) => {
    setShowPicker(false);
    onFilterChange(value);
  };

  const handleCustomToggle = () => {
    const next = !showPicker;
    setShowPicker(next);
    onFilterChange(next ? 'custom' : 'all');
  };

  return (
    <div className="flex flex-col gap-[0.6rem]">
      <div className="flex gap-1 flex-wrap">
        {FILTER_PILLS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handlePill(opt.value)}
            className={`${pillBase} ${activeFilter === opt.value ? pillActive : ''}`}
          >
            {opt.label}
          </button>
        ))}

        <button
          onClick={handleCustomToggle}
          className={`${pillBase} flex items-center gap-[0.35rem] pl-[0.65em] ${activeFilter === 'custom' ? pillActive : ''}`}
        >
          <CalendarIcon />
          Custom range
        </button>
      </div>

      {showPicker && (
        <div className="flex items-end gap-[0.6rem] px-[0.9rem] py-3 bg-[var(--bg-card-2)] border border-[var(--border-2)] rounded-[var(--r-md)] flex-wrap animate-slide-down">
          {(
            [
              {
                id: 'from',
                label: 'From',
                value: customStart,
                min: dataMin,
                max: customEnd || dataMax,
                onChange: (v: string) => onCustomRangeChange(v, customEnd),
              },
              {
                id: 'to',
                label: 'To',
                value: customEnd,
                min: customStart || dataMin,
                max: dataMax,
                onChange: (v: string) => onCustomRangeChange(customStart, v),
              },
            ] as const
          ).map((field, i) => (
            <>
              <div key={field.id} className="flex flex-col gap-[0.3rem]">
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
              {i === 0 && (
                <span key="sep" className="text-sm text-[var(--text-3)] pb-[0.4rem] shrink-0">
                  →
                </span>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateFilter;
