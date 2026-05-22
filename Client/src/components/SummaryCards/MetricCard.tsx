interface MetricCardProps {
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  subLabel: string;
}

const MetricCard = ({
  iconBg,
  iconColor,
  icon,
  value,
  label,
  subLabel,
}: MetricCardProps) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-xl)] p-5 pb-[1.4rem] transition-[border-color,transform] duration-150 cursor-default hover:border-[var(--border-2)] hover:-translate-y-px">
    <div
      className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center mb-4"
      style={{ background: iconBg, color: iconColor }}
    >
      {icon}
    </div>
    <p className="font-display text-[1.75rem] font-bold text-[var(--text)] tracking-[-0.03em] leading-[1.1] tabular-nums mb-[0.35rem]">
      {value}
    </p>
    <p className="text-sm font-medium text-[var(--text-2)] mb-0.5">{label}</p>
    <p className="text-xs text-[var(--text-3)]">{subLabel}</p>
  </div>
);

export default MetricCard;
