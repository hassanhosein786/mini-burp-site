import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getScan } from "../api/scans";
import { ShellCard } from "../components/ShellCard";

export const ScanProgressPage = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let timer;

    const poll = async () => {
      try {
        const nextScan = await getScan(scanId);
        if (cancelled) {
          return;
        }

        setScan(nextScan);

        if (nextScan.status === "completed") {
          navigate(`/scans/${scanId}`);
          return;
        }

        if (nextScan.status === "failed") {
          setError(nextScan.errorMessage || "Scan failed.");
          return;
        }

        timer = setTimeout(poll, 2500);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.message || "Unable to fetch scan progress.");
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigate, scanId]);

  return (
    <ShellCard className="mx-auto max-w-3xl">
      <div className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">Scan in progress</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">Tracking authorized crawl activity</h2>
          <p className="mt-3 text-slate-400">
            The scanner is collecting pages, recording headers, forms, and cookies, and running safe passive checks.
          </p>
        </div>

        <div className="overflow-hidden rounded-full bg-slate-900/80">
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-5">
            <div className="text-sm text-slate-400">Status</div>
            <div className="mt-2 text-xl font-semibold capitalize text-white">{scan?.status || "loading"}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-5">
            <div className="text-sm text-slate-400">Target</div>
            <div className="mt-2 truncate text-sm text-slate-200">{scan?.baseUrl || "Preparing scan..."}</div>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-rose-200">{error}</div> : null}

        <Link className="inline-flex rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5" to="/">
          Start another scan
        </Link>
      </div>
    </ShellCard>
  );
};

