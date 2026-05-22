import type { SolarDataPoint } from '@/types/solar';
import FileUpload from '@/components/FileUpload';

interface EmptyStateProps {
  onDataLoaded: (data: SolarDataPoint[], fileName: string) => void;
}

const EmptyState = ({ onDataLoaded }: EmptyStateProps) => (
  <>
    <FileUpload onDataLoaded={onDataLoaded} />

    <div className="flex flex-col items-center text-center pt-16 pb-8 gap-3">
      <div className="w-[68px] h-[68px] rounded-[18px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-1 text-[var(--text-3)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[30px] h-[30px]"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-bold text-[var(--text)] tracking-tight">
        No data yet
      </h2>
      <p className="text-sm text-[var(--text-3)] max-w-[340px] leading-[1.65]">
        Upload a CSV file with your solar production data, or load demo data
        to explore the dashboard.
      </p>
    </div>
  </>
);

export default EmptyState;
