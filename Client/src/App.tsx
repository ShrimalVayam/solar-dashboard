import { useEffect, useState } from 'react';
import type { SolarDataPoint, DateFilterOption } from '@/types/solar';
import { computeMetrics } from '@/utils/computeMetrics';
import { DEMO_DATA } from '@/utils/demoData';
import { DEMO_FILE_NAME } from '@/constants';
import { useFilteredData } from '@/hooks/useFilteredData';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import FileStatusBar from '@/components/FileStatusBar';
import SummaryCards from '@/components/SummaryCards';
import ProductionChart from '@/components/ProductionChart';
import AnomaliesTable from '@/components/AnomaliesTable';
import AIInsights from '@/components/AIInsights';

const STORAGE_KEY = 'solar-dashboard-data';

interface PersistedDashboardState {
  data: SolarDataPoint[];
  fileName: string;
}

const App = () => {
  const [data, setData] = useState<SolarDataPoint[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [activeFilter, setActiveFilter] = useState<DateFilterOption>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return;

      const parsed: PersistedDashboardState = JSON.parse(saved);

      if (parsed?.data?.length) {
        setData(parsed.data);
        setFileName(parsed.fileName || 'Uploaded File');
      }
    } catch (error) {
      console.error('Failed to restore dashboard state:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const filteredData = useFilteredData({
    data,
    filter: activeFilter,
    customStart,
    customEnd,
  });

  const metrics = filteredData.length > 0
    ? computeMetrics(filteredData)
    : null;

  const siteName = data?.[0]?.site_name;

  const handleLoad = (newData: SolarDataPoint[], name: string) => {
    setData(newData);
    setFileName(name);
    setActiveFilter('all');
    setCustomStart('');
    setCustomEnd('');

    try {
      const payload: PersistedDashboardState = {
        data: newData,
        fileName: name,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to persist dashboard state:', error);
    }
  };

  const handleClear = () => {
    setData(null);
    setFileName('');
    setCustomStart('');
    setCustomEnd('');

    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <Header onDemoLoad={() => handleLoad(DEMO_DATA, DEMO_FILE_NAME)} />

      <main className="flex-1 p-6 px-7 flex flex-col gap-[1.1rem]">
        {!data ? (
          <EmptyState onDataLoaded={handleLoad} />
        ) : (
          <>
            <FileStatusBar fileName={fileName} onClear={handleClear} />

            {metrics && (
              <SummaryCards metrics={metrics} siteName={siteName} />
            )}

            <div className="flex gap-[1.1rem] items-stretch max-[1100px]:flex-col">
              <div className="flex-1 flex min-w-0">
                {metrics && filteredData.length > 0 && (
                  <ProductionChart
                    filteredData={filteredData}
                    fullDataset={data}
                    metrics={metrics}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    customStart={customStart}
                    customEnd={customEnd}
                    onCustomRangeChange={(s, e) => {
                      setCustomStart(s);
                      setCustomEnd(e);
                    }}
                  />
                )}
              </div>

              <div className="w-72 flex max-[1100px]:w-full">
                <AnomaliesTable filteredData={filteredData} />
              </div>
            </div>

            <AIInsights
              filteredData={filteredData}
              metrics={metrics}
              siteName={siteName}
            />
          </>
        )}
      </main>

      {!data && (
        <footer className="p-[1.1rem] text-center text-xs text-[var(--text-4)] border-t border-[var(--border)] bg-[var(--bg-2)] mt-auto">
          Solar Production Dashboard · Built with React, Recharts.
        </footer>
      )}
    </div>
  );
};

export default App;


