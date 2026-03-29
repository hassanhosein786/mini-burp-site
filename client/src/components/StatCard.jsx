import { ShellCard } from "./ShellCard";

export const StatCard = ({ label, value, tone = "cyan" }) => {
  const accent = {
    cyan: "from-cyan-400/20 to-cyan-300/5 text-cyan-200",
    green: "from-emerald-400/20 to-emerald-300/5 text-emerald-200",
    amber: "from-amber-400/20 to-amber-300/5 text-amber-100",
    rose: "from-rose-400/20 to-rose-300/5 text-rose-100"
  }[tone];

  return (
    <ShellCard className={`bg-gradient-to-br ${accent}`}>
      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className="mt-3 break-all text-3xl font-semibold text-white">{value}</div>
    </ShellCard>
  );
};
