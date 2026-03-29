import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScanFindings, getScanSummary } from "../api/scans";
import { FindingsTable } from "../components/FindingsTable";
import { SeverityChart } from "../components/SeverityChart";
import { ShellCard } from "../components/ShellCard";
import { StatCard } from "../components/StatCard";
import { TopTypesChart } from "../components/TopTypesChart";

export const ScanDetailPage = () => {
  const { scanId } = useParams();
  const [summary, setSummary] = useState(null);
  const [findings, setFindings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResult, findingsResult] = await Promise.all([
          getScanSummary(scanId),
          getScanFindings(scanId)
        ]);
        setSummary(summaryResult);
        setFindings(findingsResult);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load scan details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [scanId]);

  const filteredFindings = useMemo(() => {
    if (filter === "all") {
      return findings;
    }
    return findings.filter((finding) => finding.severity === filter);
  }, [filter, findings]);

  if (loading) {
    return <ShellCard>Loading scan dashboard...</ShellCard>;
  }

  if (error) {
    return <ShellCard>{error}</ShellCard>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <ShellCard className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">Scan summary</div>
              <h2 className="mt-3 text-3xl font-semibold text-white">{summary.scan.baseUrl}</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Host-restricted crawl results with passive security observations and safe active markers.
              </p>
            </div>
            <Link className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5" to={`/scans/${scanId}/pages`}>
              View pages
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Status" value={summary.scan.status} tone="cyan" />
            <StatCard label="Pages" value={summary.pagesCount} tone="green" />
            <StatCard label="Findings" value={summary.scan.stats.findingsCount} tone="amber" />
            <StatCard label="Allowed Host" value={summary.scan.allowedHost} tone="rose" />
          </div>
        </ShellCard>

        <ShellCard className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Guardrails</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>Scans stay on the original host only.</li>
            <li>Logout links, downloads, and destructive-looking routes are skipped.</li>
            <li>Active checks use a harmless marker string only.</li>
            <li>No credential attacks, exploit delivery, or destructive actions are included.</li>
          </ul>
        </ShellCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <SeverityChart data={summary.severityBreakdown} />
        <TopTypesChart data={summary.topTypes} />
      </section>

      <FindingsTable scanId={scanId} findings={filteredFindings} filter={filter} onFilterChange={setFilter} />
    </div>
  );
};
