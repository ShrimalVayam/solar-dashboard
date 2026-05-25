import { useRef, useState } from 'react';
import clsx from 'clsx';

import type { SolarDataPoint } from '@/types/solar';
import parseCsvFile from '@/utils/parseCsv';

interface FileUploadProps {
  onDataLoaded: (
    data: SolarDataPoint[],
    fileName: string
  ) => void;
}

const DROPZONE_BASE_CLASSNAME =
  'cursor-pointer rounded-[var(--r-xl)] border-[1.5px] border-dashed border-[var(--accent)] px-8 py-[3.25rem] text-center transition-colors';

const DROPZONE_IDLE_CLASSNAME =
  'bg-[var(--bg-card)] hover:bg-[var(--bg-card-2)]';

const DROPZONE_ACTIVE_CLASSNAME =
  'bg-[var(--bg-card-2)]';

const UploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[26px] w-[26px] stroke-white"
  >
    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const FileUpload = ({
  onDataLoaded,
}: FileUploadProps) => {
  const fileInputReference =
    useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isProcessingFile, setIsProcessingFile] =
    useState(false);

  const processUploadedFile = async (
    file: File
  ): Promise<void> => {
    const isCsvFile = file.name
      .toLowerCase()
      .endsWith('.csv');

    if (!isCsvFile) {
      setErrorMessage(
        'Please upload a valid .csv file.'
      );

      return;
    }

    setErrorMessage(null);
    setIsProcessingFile(true);

    try {
      const parsingResult = await parseCsvFile(file);

      if (!parsingResult.ok) {
        setErrorMessage(parsingResult.error);

        return;
      }

      onDataLoaded(
        parsingResult.data,
        file.name
      );
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFile =
      event.target.files?.[0];

    if (selectedFile) {
      processUploadedFile(selectedFile);
    }

    event.target.value = '';
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (): void => {
    setIsDragOver(false);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    event.preventDefault();

    setIsDragOver(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (droppedFile) {
      processUploadedFile(droppedFile);
    }
  };

  const handleUploadAreaClick = (): void => {
    fileInputReference.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload CSV"
      onClick={handleUploadAreaClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        DROPZONE_BASE_CLASSNAME,
        isDragOver
          ? DROPZONE_ACTIVE_CLASSNAME
          : DROPZONE_IDLE_CLASSNAME
      )}
    >
      <input
        ref={fileInputReference}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className="mx-auto mb-[1.4rem] flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--accent)] shadow-[0_0_22px_var(--accent-glow)]">
        <UploadIcon />
      </div>

      {isProcessingFile ? (
        <p className="text-[0.97rem] font-medium text-[var(--text)]">
          Parsing CSV…
        </p>
      ) : (
        <>
          <p className="mb-1.5 text-[0.97rem] font-medium text-[var(--text)]">
            Drop your CSV file here, or{' '}
            <span className="font-bold text-[var(--accent)] underline underline-offset-2">
              browse
            </span>
          </p>

          <p className="text-[0.8rem] text-[var(--text-3)]">
            Expected format: date,
            production_kwh
          </p>
        </>
      )}

      {errorMessage && (
        <p
          className="mt-[0.9rem] inline-block rounded-[var(--r-md)] border border-[rgba(244,63,94,0.3)] bg-[var(--red-bg)] px-[0.9rem] py-[0.4rem] text-[0.78rem] text-[#f87171]"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FileUpload;