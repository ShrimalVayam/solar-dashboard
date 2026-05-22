interface HeaderProps {
  onDemoLoad: () => void;
}

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 stroke-white"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const DatabaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[14px] h-[14px] opacity-70"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const Header = ({ onDemoLoad }: HeaderProps) => (
  <header className="h-[62px] flex items-center justify-between px-7 bg-[var(--bg-2)] border-b border-[var(--border)] sticky top-0 z-30 shrink-0">
    <div className="flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-[10px] bg-[var(--accent)] flex items-center justify-center shrink-0 shadow-[0_0_16px_var(--accent-glow)]">
        <SunIcon />
      </div>
      <div>
        <h1 className="font-display text-[1.125rem] font-bold text-[var(--text)] tracking-[-0.02em]">
          Solar Dashboard
        </h1>
        <p className="text-[0.6875rem] text-[var(--text-3)] mt-px font-normal">
          Production analytics &amp; AI insights
        </p>
      </div>
    </div>

    <button
      onClick={onDemoLoad}
      className="flex items-center gap-[0.45rem] px-4 py-[0.4em] rounded-[var(--r-md)] bg-transparent border border-[var(--border-2)] text-[var(--text-2)] text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
    >
      <DatabaseIcon />
      Load Demo Data
    </button>
  </header>
);

export default Header;
