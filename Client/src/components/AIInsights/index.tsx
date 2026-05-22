import { useState } from 'react';
import type { SolarDataPoint, SummaryMetrics } from '@/types/solar';
import { generateInsights } from '@/utils/api';

interface AIInsightsProps {
  filteredData: SolarDataPoint[];
  metrics: SummaryMetrics | null;
  siteName?: string;
}

type InsightStatus = 'idle' | 'loading' | 'done' | 'error';

const SparklesIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="M12 3l1.88 5.76a1 1 0 00.63.63L20.25 11.5l-5.76 1.88a1 1 0 00-.63.63L12 19.75l-1.88-5.76a1 1 0 00-.63-.63L3.75 11.5l5.76-1.88a1 1 0 00.63-.63L12 3z" />
    <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
  </svg>
);

const AIInsights = ({ filteredData, metrics, siteName }: AIInsightsProps) => {
  const [status, setStatus] = useState<InsightStatus>('idle');
  const [insightText, setInsightText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerate = async () => {
    if (!filteredData.length || !metrics || status === 'loading') return;
    setStatus('loading');
    setInsightText('');
    setErrorMessage('');
    try {
      const text = await generateInsights(filteredData, metrics, siteName);
      setInsightText(text);
      setStatus('done');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden w-full">
      <div className="flex items-center justify-between px-6 py-[1.2rem] border-b border-[var(--border)] gap-4 flex-wrap">
        <div className="flex items-center gap-[0.8rem]">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--c-purple-bg)] flex items-center justify-center text-[var(--c-purple)] shrink-0">
            <SparklesIcon />
          </div>
          <div>
            <h2 className="text-[0.97rem] font-bold text-[var(--text)] leading-tight">
              AI Insights
            </h2>
            <p className="text-[0.72rem] text-[var(--text-3)] mt-px">
              Powered analysis of your solar data
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!filteredData.length || isLoading}
          className="flex items-center gap-2 px-5 py-[0.55em] rounded-[var(--r-md)] bg-[var(--accent)] text-white text-[0.84rem] font-semibold shadow-[0_0_16px_var(--accent-glow)] shrink-0 transition-colors hover:bg-[var(--accent-2)] disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <SparklesIcon className="w-[15px] h-[15px]" />
          {isLoading ? 'Generating…' : 'Generate Insights'}
        </button>
      </div>

      <div className="px-6 py-5">
        {(status === 'idle' || status === 'loading') && (
          <div className="border-[1.5px] border-dashed border-[var(--border-2)] rounded-[var(--r-lg)] py-9 px-6 flex flex-col items-center text-center gap-3">
            <div className={`w-11 h-11 rounded-[10px] bg-[var(--bg-card-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] ${isLoading ? 'text-[var(--accent)]' : ''}`}>
              <SparklesIcon
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              />
            </div>
            <p className="text-[0.84rem] text-[var(--text-3)] max-w-[380px] leading-[1.6]">
              {isLoading
                ? 'Analysing your solar data…'
                : 'Click "Generate Insights" to get AI-powered analysis of your production data.'}
            </p>
          </div>
        )}

        {status === 'done' && insightText && (
          <p className="text-[0.9rem] text-[var(--text-2)] leading-[1.75] border-[1.5px] border-[var(--border-2)] rounded-[var(--r-lg)] px-[1.35rem] py-5 bg-[var(--bg-card-2)]">
            {insightText}
          </p>
        )}

        {status === 'error' && (
          <div className="border border-[rgba(244,63,94,0.3)] rounded-[var(--r-lg)] bg-[var(--red-bg)] px-5 py-[1.1rem]">
            <p className="text-[0.85rem] font-semibold text-[#f87171] mb-1">
              Failed to generate insights
            </p>
            <p className="text-[0.8rem] text-[rgba(248,113,113,0.8)] mb-2">
              {errorMessage}
            </p>
            <p className="text-xs text-[var(--text-3)] leading-[1.6]">
              Make sure the backend is running:{' '}
              <code>cd backend &amp;&amp; pnpm dev</code>
              <br />
              And <code>GROQ_API_KEY</code> is set in <code>backend/.env</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
