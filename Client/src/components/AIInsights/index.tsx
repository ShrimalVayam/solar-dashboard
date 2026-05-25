import { useState } from 'react';
import clsx from 'clsx';

import type {
  SolarDataPoint,
  SummaryMetrics,
} from '@/types/solar';

import { generateInsights } from '@/utils/api';

interface AIInsightsProps {
  filteredData: SolarDataPoint[];
  metrics: SummaryMetrics | null;
  siteName?: string;
}

type InsightStatus =
  | 'idle'
  | 'loading'
  | 'done'
  | 'error';

interface SparklesIconProps {
  className?: string;
}

const CARD_BASE_CLASSNAME =
  'w-full overflow-hidden rounded-[var(--r-xl)] border border-[var(--border)] bg-[var(--bg-card)]';

const PRIMARY_BUTTON_BASE_CLASSNAME =
  'flex shrink-0 items-center gap-2 rounded-[var(--r-md)] bg-[var(--accent)] px-5 py-[0.55em] text-[0.84rem] font-semibold text-white shadow-[0_0_16px_var(--accent-glow)] transition-colors hover:bg-[var(--accent-2)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none';

const EMPTY_STATE_BASE_CLASSNAME =
  'flex flex-col items-center gap-3 rounded-[var(--r-lg)] border-[1.5px] border-dashed border-[var(--border-2)] px-6 py-9 text-center';

const EMPTY_STATE_ICON_WRAPPER_CLASSNAME =
  'flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--bg-card-2)] text-[var(--text-3)]';

const SparklesIcon = ({
  className = 'h-5 w-5',
}: SparklesIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3l1.88 5.76a1 1 0 00.63.63L20.25 11.5l-5.76 1.88a1 1 0 00-.63.63L12 19.75l-1.88-5.76a1 1 0 00-.63-.63L3.75 11.5l5.76-1.88a1 1 0 00.63-.63L12 3z" />

    <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
  </svg>
);

const AIInsights = ({
  filteredData,
  metrics,
  siteName,
}: AIInsightsProps) => {
  const [insightStatus, setInsightStatus] =
    useState<InsightStatus>('idle');

  const [generatedInsightText, setGeneratedInsightText] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const isLoading =
    insightStatus === 'loading';

  const hasData =
    filteredData.length > 0 && Boolean(metrics);

  const handleGenerateInsights =
    async (): Promise<void> => {
      if (!hasData || isLoading || !metrics) {
        return;
      }

      setInsightStatus('loading');
      setGeneratedInsightText('');
      setErrorMessage('');

      try {
        const generatedInsights =
          await generateInsights(
            filteredData,
            metrics,
            siteName
          );

        setGeneratedInsightText(
          generatedInsights
        );

        setInsightStatus('done');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unknown error occurred while generating insights.'
        );

        setInsightStatus('error');
      }
    };

  return (
    <div className={CARD_BASE_CLASSNAME}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-[1.2rem]">
        <div className="flex items-center gap-[0.8rem]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--c-purple-bg)] text-[var(--c-purple)]">
            <SparklesIcon />
          </div>

          <div>
            <h2 className="text-[0.97rem] font-bold leading-tight text-[var(--text)]">
              AI Insights
            </h2>

            <p className="mt-px text-[0.72rem] text-[var(--text-3)]">
              Powered analysis of your solar data
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateInsights}
          disabled={!hasData || isLoading}
          className={PRIMARY_BUTTON_BASE_CLASSNAME}
        >
          <SparklesIcon className="h-[15px] w-[15px]" />

          {isLoading
            ? 'Generating…'
            : 'Generate Insights'}
        </button>
      </div>

      <div className="px-6 py-5">
        {(insightStatus === 'idle' ||
          insightStatus === 'loading') && (
          <div
            className={
              EMPTY_STATE_BASE_CLASSNAME
            }
          >
            <div
              className={clsx(
                EMPTY_STATE_ICON_WRAPPER_CLASSNAME,
                isLoading &&
                  'text-[var(--accent)]'
              )}
            >
              <SparklesIcon
                className={clsx(
                  'h-5 w-5',
                  isLoading &&
                    'animate-spin'
                )}
              />
            </div>

            <p className="max-w-[380px] text-[0.84rem] leading-[1.6] text-[var(--text-3)]">
              {isLoading
                ? 'Analysing your solar data…'
                : 'Click "Generate Insights" to get AI-powered analysis of your production data.'}
            </p>
          </div>
        )}

        {insightStatus === 'done' &&
          generatedInsightText && (
            <p className="rounded-[var(--r-lg)] border-[1.5px] border-[var(--border-2)] bg-[var(--bg-card-2)] px-[1.35rem] py-5 text-[0.9rem] leading-[1.75] text-[var(--text-2)]">
              {generatedInsightText}
            </p>
          )}

        {insightStatus === 'error' && (
          <div className="rounded-[var(--r-lg)] border border-[rgba(244,63,94,0.3)] bg-[var(--red-bg)] px-5 py-[1.1rem]">
            <p className="mb-1 text-[0.85rem] font-semibold text-[#f87171]">
              Failed to generate insights
            </p>

            <p className="mb-2 text-[0.8rem] text-[rgba(248,113,113,0.8)]">
              {errorMessage}
            </p>

            <p className="text-xs leading-[1.6] text-[var(--text-3)]">
              Make sure the backend is running:{' '}
              <code>
                cd backend &amp;&amp; pnpm dev
              </code>

              <br />

              And{' '}
              <code>GROQ_API_KEY</code> is
              set in{' '}
              <code>backend/.env</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;