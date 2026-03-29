import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScanPages } from "../api/scans";
import { PagesTable } from "../components/PagesTable";
import { ShellCard } from "../components/ShellCard";

export const PagesPage = () => {
  const { scanId } = useParams();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setPages(await getScanPages(scanId));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load pages.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [scanId]);

  if (loading) {
    return <ShellCard>Loading discovered pages...</ShellCard>;
  }

  if (error) {
    return <ShellCard>{error}</ShellCard>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Pages discovered</h2>
          <p className="mt-2 text-sm text-slate-400">Stored crawl data for this authorized assessment.</p>
        </div>
        <Link className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5" to={`/scans/${scanId}`}>
          Back to findings
        </Link>
      </div>
      <PagesTable pages={pages} />
    </div>
  );
};

