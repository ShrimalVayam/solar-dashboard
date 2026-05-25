import { useMemo, useState } from 'react';
import type { SolarDataPoint, DateFilterOption } from '@/types/solar';
import { computeMetrics } from '@/utils/computeMetrics';
import { DEMO_DATA } from '@/utils/demoData';
import { DEMO_FILE_NAME } from '@/constants';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useDashboardPersistence } from '@/hooks/useDashboardPersistence';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import FileStatusBar from '@/components/FileStatusBar';
import SummaryCards from '@/components/SummaryCards';
import ProductionChart from '@/components/ProductionChart';
import AnomaliesTable from '@/components/AnomaliesTable';
import AIInsights from '@/components/AIInsights';

const App = () => {
  const { persistedState, persistDashboard, clearPersistedDashboard } =
    useDashboardPersistence();

  const [dataPoints, setDataPoints] = useState<SolarDataPoint[] | null>(
    persistedState?.data ?? null
  );
  const [sourceFileName, setSourceFileName] = useState(
    persistedState?.fileName ?? ''
  );
  const [activeDateFilter, setActiveDateFilter] =
    useState<DateFilterOption>('all');
  const [customRangeStart, setCustomRangeStart] = useState('');
  const [customRangeEnd, setCustomRangeEnd] = useState('');

  const filteredDataPoints = useFilteredData({
    data: dataPoints,
    filter: activeDateFilter,
    customStart: customRangeStart,
    customEnd: customRangeEnd,
  });

  const metrics = useMemo(
    () =>
      filteredDataPoints.length > 0
        ? computeMetrics(filteredDataPoints)
        : null,
    [filteredDataPoints]
  );

  const siteName = dataPoints?.[0]?.site_name;

  const handleDataLoaded = (
    incomingData: SolarDataPoint[],
    fileName: string
  ): void => {
    setDataPoints(incomingData);
    setSourceFileName(fileName);
    setActiveDateFilter('all');
    setCustomRangeStart('');
    setCustomRangeEnd('');
    persistDashboard({ data: incomingData, fileName });
  };

  const handleDashboardClear = (): void => {
    setDataPoints(null);
    setSourceFileName('');
    setCustomRangeStart('');
    setCustomRangeEnd('');
    clearPersistedDashboard();
  };

  const handleCustomRangeChange = (start: string, end: string): void => {
    setCustomRangeStart(start);
    setCustomRangeEnd(end);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <Header
        onDemoLoad={() => handleDataLoaded(DEMO_DATA, DEMO_FILE_NAME)}
      />

      <main className="flex-1 p-6 px-7 flex flex-col gap-[1.1rem]">
        {!dataPoints ? (
          <EmptyState onDataLoaded={handleDataLoaded} />
        ) : (
          <>
            <FileStatusBar
              fileName={sourceFileName}
              onClear={handleDashboardClear}
            />

            {metrics && (
              <SummaryCards metrics={metrics} siteName={siteName} />
            )}

            <div className="flex gap-[1.1rem] items-stretch max-[1100px]:flex-col">
              <div className="flex-1 flex min-w-0">
                {metrics && filteredDataPoints.length > 0 && (
                  <ProductionChart
                    filteredData={filteredDataPoints}
                    fullDataset={dataPoints}
                    metrics={metrics}
                    activeFilter={activeDateFilter}
                    onFilterChange={setActiveDateFilter}
                    customStart={customRangeStart}
                    customEnd={customRangeEnd}
                    onCustomRangeChange={handleCustomRangeChange}
                  />
                )}
              </div>

              <div className="w-72 flex max-[1100px]:w-full">
                <AnomaliesTable filteredData={filteredDataPoints} />
              </div>
            </div>

            <AIInsights
              filteredData={filteredDataPoints}
              metrics={metrics}
              siteName={siteName}
            />
          </>
        )}
      </main>

      {!dataPoints && (
        <footer className="p-[1.1rem] text-center text-xs text-[var(--text-4)] border-t border-[var(--border)] bg-[var(--bg-2)] mt-auto">
          Solar Production Dashboard · Built with React, Recharts.
        </footer>
      )}
    </div>
  );
};

export default App;


