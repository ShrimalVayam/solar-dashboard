import type { SolarDataPoint } from '@/types/solar';
import { formatDate, formatKwh } from '@/utils/formatters';

interface AnomaliesTableProps {
  filteredData: SolarDataPoint[];
}

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-[15px] h-[15px]">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9"  x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-7 h-7 text-[var(--green)] opacity-70">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AnomaliesTable = ({ filteredData }: AnomaliesTableProps) => {
  const anomalies = filteredData.filter((d) => d.anomaly_detected);
  const hasAnomalies = anomalies.length > 0;

  return (
    <div className="w-full marker:bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden flex flex-col sticky top-[calc(62px+1.5rem)]">
      <div className="flex items-center justify-between px-[1.1rem] py-4 border-b border-[var(--border)] gap-2 shrink-0">
        <div className="flex items-center gap-[0.6rem]">
          <div className="w-[34px] h-[34px] rounded-[var(--r-sm)] bg-[var(--red-bg)] border border-[rgba(244,63,94,0.25)] flex items-center justify-center text-[var(--red)] shrink-0">
            <WarningIcon />
          </div>
          <div>
            <h2 className="text-[0.9375rem] font-semibold text-[var(--text)] leading-tight">
              Anomaly Log
            </h2>
            <p className="text-[0.6875rem] text-[var(--text-3)] mt-px">
              Flagged production days
            </p>
          </div>
        </div>

        <span
          className={`text-[0.6875rem] font-semibold px-[0.65em] py-[0.25em] rounded-full whitespace-nowrap shrink-0 border ${
            hasAnomalies
              ? 'bg-[var(--red-bg)] text-[var(--red)] border-[rgba(244,63,94,0.25)]'
              : 'bg-[var(--green-bg)] text-[var(--green)] border-[rgba(34,197,94,0.2)]'
          }`}
        >
          {anomalies.length} flagged
        </span>
      </div>

      {!hasAnomalies ? (
        <div className="flex flex-col items-center gap-[0.6rem] py-10 px-4 text-[var(--text-3)] text-center">
          <CheckIcon />
          <p className="text-sm leading-[1.5]">
            No anomalies detected in this period.
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[480px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Date', 'Output', 'Weather'].map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 bg-[var(--bg-card-2)] px-4 py-[0.55rem] text-left text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-[var(--text-3)] border-b border-[var(--border)] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {anomalies.map((d) => (
                <tr
                  key={d.date}
                  className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--bg-card-2)]"
                >
                  <td className="px-4 py-[0.6rem] text-sm font-medium text-[var(--text)] whitespace-nowrap">
                    {formatDate(d.date)}
                  </td>
                  <td className="px-4 py-[0.6rem] text-sm font-semibold text-[var(--red)] whitespace-nowrap tabular-nums">
                    {formatKwh(d.production_kwh)}
                  </td>
                  <td className="px-4 py-[0.6rem]">
                    <span className="inline-block text-[0.6875rem] bg-[var(--bg-hover)] text-[var(--text-2)] px-[0.55em] py-[0.2em] rounded whitespace-nowrap">
                      {d.weather ?? '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnomaliesTable;
