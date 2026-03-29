import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ShellCard } from "./ShellCard";

const colors = {
  high: "#fb7185",
  medium: "#fbbf24",
  low: "#38bdf8",
  info: "#94a3b8"
};

export const SeverityChart = ({ data }) => (
  <ShellCard>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">Severity distribution</h3>
      <p className="text-sm text-slate-400">A quick view of the current risk mix.</p>
    </div>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="_id" innerRadius={70} outerRadius={100} paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry._id} fill={colors[entry._id] || colors.info} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </ShellCard>
);

