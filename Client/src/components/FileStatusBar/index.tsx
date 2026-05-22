interface FileStatusBarProps {
  fileName: string;
  onClear: () => void;
}

const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[14px] h-[14px]"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const FileStatusBar = ({ fileName, onClear }: FileStatusBarProps) => (
  <div className="flex items-center justify-between px-[1.1rem] py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-lg)]">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-[var(--r-sm)] bg-[var(--accent-bg)] border border-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)] shrink-0">
        <FileIcon />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">{fileName}</p>
        <p className="flex items-center gap-[0.3rem] text-[0.6875rem] text-[var(--green)] mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] inline-block" />
          Parsed successfully
        </p>
      </div>
    </div>

    <button
      onClick={onClear}
      aria-label="Clear"
      className="w-7 h-7 rounded-[var(--r-sm)] bg-transparent text-[var(--text-3)] text-xl leading-none flex items-center justify-center transition-colors hover:bg-[var(--bg-card-2)] hover:text-[var(--text)]"
    >
      ×
    </button>
  </div>
);

export default FileStatusBar;
