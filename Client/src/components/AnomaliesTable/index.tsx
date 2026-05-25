import clsx from 'clsx';

import type { SolarDataPoint } from '@/types/solar';
import { formatDate, formatKwh } from '@/utils/formatters';

interface AnomaliesTableProps {
  filteredData: SolarDataPoint[];
}

const TABLE_HEADERS = ['Date', 'Output', 'Weather'];

const WarningIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[15px] w-[15px]"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-7 w-7 text-[var(--green)] opacity-70"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AnomaliesTable = ({
  filteredData,
}: AnomaliesTableProps) => {
  const anomalyRecords = filteredData.filter(
    ({ anomaly_detected }) => anomaly_detected
  );

  const hasAnomalies = anomalyRecords.length > 0;

  const anomalyBadgeClassName = clsx(
    'shrink-0 whitespace-nowrap rounded-full border px-[0.65em] py-[0.25em] text-[0.6875rem] font-semibold',
    {
      'border-[rgba(244,63,94,0.25)] bg-[var(--red-bg)] text-[var(--red)]':
        hasAnomalies,
      'border-[rgba(34,197,94,0.2)] bg-[var(--green-bg)] text-[var(--green)]':
        !hasAnomalies,
    }
  );

  return (
    <div className="sticky top-[calc(62px+1.5rem)] flex w-full flex-col overflow-hidden rounded-[var(--r-xl)] border border-[var(--border)] bg-[var(--bg-card)]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] px-[1.1rem] py-4">
        <div className="flex items-center gap-[0.6rem]">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[var(--r-sm)] border border-[rgba(244,63,94,0.25)] bg-[var(--red-bg)] text-[var(--red)]">
            <WarningIcon />
          </div>

          <div>
            <h2 className="leading-tight text-[0.9375rem] font-semibold text-[var(--text)]">
              Anomaly Log
            </h2>

            <p className="mt-px text-[0.6875rem] text-[var(--text-3)]">
              Flagged production days
            </p>
          </div>
        </div>

        <span className={anomalyBadgeClassName}>
          {anomalyRecords.length} flagged
        </span>
      </div>

      {!hasAnomalies ? (
        <div className="flex flex-col items-center gap-[0.6rem] px-4 py-10 text-center text-[var(--text-3)]">
          <CheckIcon />

          <p className="text-sm leading-[1.5]">
            No anomalies detected in this period.
          </p>
        </div>
      ) : (
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {TABLE_HEADERS.map((headerLabel) => (
                  <th
                    key={headerLabel}
                    className="sticky top-0 whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-card-2)] px-4 py-[0.55rem] text-left text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-[var(--text-3)]"
                  >
                    {headerLabel}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {anomalyRecords.map(
                ({
                  date,
                  production_kwh,
                  weather,
                }) => (
                  <tr
                    key={date}
                    className="border-b border-[var(--border)] transition-colors last:border-b-0 hover:bg-[var(--bg-card-2)]"
                  >
                    <td className="whitespace-nowrap px-4 py-[0.6rem] text-sm font-medium text-[var(--text)]">
                      {formatDate(date)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-[0.6rem] text-sm font-semibold tabular-nums text-[var(--red)]">
                      {formatKwh(production_kwh)}
                    </td>

                    <td className="px-4 py-[0.6rem]">
                      <span className="inline-block whitespace-nowrap rounded bg-[var(--bg-hover)] px-[0.55em] py-[0.2em] text-[0.6875rem] text-[var(--text-2)]">
                        {weather ?? '—'}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnomaliesTable;