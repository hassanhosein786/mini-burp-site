import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFindingDetail } from "../api/scans";
import { SeverityBadge } from "../components/SeverityBadge";
import { ShellCard } from "../components/ShellCard";

export const FindingDetailPage = () => {
  const { scanId, findingId } = useParams();
  const [finding, setFinding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setFinding(await getFindingDetail(scanId, findingId));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load finding.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [findingId, scanId]);

  if (loading) {
    return <ShellCard>Loading finding detail...</ShellCard>;
  }

  if (error || !finding) {
    return <ShellCard>{error || "Finding not found."}</ShellCard>;
  }

  return (
    <div className="space-y-6">
      <ShellCard className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">{finding.type}</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">{finding.title}</h2>
          </div>
          <SeverityBadge severity={finding.severity} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-5">
            <div className="text-sm text-slate-400">Page URL</div>
            <div className="mt-2 break-all text-slate-200">{finding.pageUrl}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-5">
            <div className="text-sm text-slate-400">Created</div>
            <div className="mt-2 text-slate-200">{new Date(finding.createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Description</h3>
            <p className="mt-2 text-slate-300">{finding.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Evidence</h3>
            <pre className="mt-2 overflow-x-auto rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-200">
              {JSON.stringify(finding.evidence, null, 2)}
            </pre>
          </div>
          {finding.affectedPages?.length ? (
            <div>
              <h3 className="text-lg font-semibold text-white">Affected pages</h3>
              <div className="mt-2 rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-200">
                {finding.affectedPages.map((url) => (
                  <div key={url} className="break-all py-1">
                    {url}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <h3 className="text-lg font-semibold text-white">Remediation</h3>
            <p className="mt-2 text-slate-300">{finding.remediation}</p>
          </div>
        </div>

        <Link className="inline-flex rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5" to={`/scans/${scanId}`}>
          Back to dashboard
        </Link>
      </ShellCard>
    </div>
  );
};
