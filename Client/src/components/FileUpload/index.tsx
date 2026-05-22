import { useRef, useState } from 'react';
import type { SolarDataPoint } from '@/types/solar';
import parseCsvFile from '@/utils/parseCsv';

interface FileUploadProps {
  onDataLoaded: (data: SolarDataPoint[], fileName: string) => void;
}

const UploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[26px] h-[26px] stroke-white"
  >
    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file.');
      return;
    }
    setError(null);
    setProcessing(true);
    const result = await parseCsvFile(file);
    setProcessing(false);
    if (!result.ok) { setError(result.error); return; }
    onDataLoaded(result.data, file.name);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div
      role="button"
      aria-label="Upload CSV"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
      className={`border-[1.5px] border-dashed border-[var(--accent)] rounded-[var(--r-xl)] py-[3.25rem] px-8 text-center cursor-pointer transition-colors ${isDragOver ? 'bg-[var(--bg-card-2)]' : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-2)]'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={onInput}
      />

      <div className="w-14 h-14 rounded-[14px] bg-[var(--accent)] flex items-center justify-center mx-auto mb-[1.4rem] shadow-[0_0_22px_var(--accent-glow)]">
        <UploadIcon />
      </div>

      {processing ? (
        <p className="text-[0.97rem] font-medium text-[var(--text)]">
          Parsing CSV…
        </p>
      ) : (
        <>
          <p className="text-[0.97rem] font-medium text-[var(--text)] mb-1.5">
            Drop your CSV file here, or{' '}
            <span className="text-[var(--accent)] font-bold underline underline-offset-2">
              browse
            </span>
          </p>
          <p className="text-[0.8rem] text-[var(--text-3)]">
            Expected format: date, production_kwh
          </p>
        </>
      )}

      {error && (
        <p
          className="inline-block mt-[0.9rem] px-[0.9rem] py-[0.4rem] rounded-[var(--r-md)] bg-[var(--red-bg)] border border-[rgba(244,63,94,0.3)] text-[#f87171] text-[0.78rem]"
          onClick={(e) => e.stopPropagation()}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
