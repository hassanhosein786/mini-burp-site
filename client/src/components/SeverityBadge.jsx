const severityStyles = {
  high: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30",
  medium: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30",
  low: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30",
  info: "bg-slate-500/20 text-slate-200 ring-1 ring-slate-400/20"
};

export const SeverityBadge = ({ severity }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${severityStyles[severity] || severityStyles.info}`}>
    {severity}
  </span>
);

