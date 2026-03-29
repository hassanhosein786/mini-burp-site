import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ShellCard } from "./ShellCard";

export const TopTypesChart = ({ data }) => (
  <ShellCard>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">Top finding types</h3>
      <p className="text-sm text-slate-400">Most frequent observations in this scan.</p>
    </div>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
          <XAxis dataKey="_id" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={60} />
          <YAxis tick={{ fill: "#94a3b8" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </ShellCard>
);

