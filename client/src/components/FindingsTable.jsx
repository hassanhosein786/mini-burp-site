import { Link } from "react-router-dom";
import { SeverityBadge } from "./SeverityBadge";
import { ShellCard } from "./ShellCard";

export const FindingsTable = ({ scanId, findings, filter, onFilterChange }) => (
  <ShellCard className="overflow-hidden p-0">
    <div className="flex flex-col gap-4 border-b border-white/6 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">Findings</h3>
        <p className="text-sm text-slate-400">Review stored passive and limited active-check results.</p>
      </div>
      <select
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 outline-none"
      >
        <option value="all">All severities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="info">Info</option>
      </select>
    </div>
    {findings.length === 0 ? (
      <div className="px-6 py-12 text-center text-sm text-slate-400">No findings match the current filter.</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/40 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Severity</th>
              <th className="px-6 py-4 font-medium">Page</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding) => (
              <tr key={finding._id} className="border-t border-white/6">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{finding.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{finding.type}</div>
                </td>
                <td className="px-6 py-4">
                  <SeverityBadge severity={finding.severity} />
                </td>
                <td className="max-w-xs truncate px-6 py-4 text-slate-300">{finding.pageUrl}</td>
                <td className="px-6 py-4">
                  <Link className="text-cyan-300 transition hover:text-cyan-200" to={`/scans/${scanId}/findings/${finding._id}`}>
                    View detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </ShellCard>
);

