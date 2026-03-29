import { ShieldAlert, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startScan } from "../api/scans";
import { ShellCard } from "../components/ShellCard";

export const HomePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    baseUrl: "",
    maxDepth: 2,
    maxPages: 25,
    activeChecks: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const scan = await startScan({
        baseUrl: form.baseUrl,
        maxDepth: Number(form.maxDepth),
        maxPages: Number(form.maxPages),
        activeChecks: form.activeChecks
      });
      navigate(`/scans/${scan._id}/progress`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to start scan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <ShellCard className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-cyan-400/15 via-transparent to-teal-400/10" />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200">
              Authorized defensive testing only
            </div>
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white">
                Crawl a target you own, store safe findings, and review results in one clean dashboard.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                This MVP keeps active checks non-destructive, stays inside the allowed host, and avoids logout links,
                downloads, and obviously destructive routes.
              </p>
            </div>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Target base URL</span>
                <input
                  required
                  type="url"
                  name="baseUrl"
                  placeholder="https://example.com"
                  value={form.baseUrl}
                  onChange={onChange}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-slate-100 outline-none transition focus:border-cyan-400/40"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-300">Max depth</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    name="maxDepth"
                    value={form.maxDepth}
                    onChange={onChange}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-slate-100 outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-300">Max pages</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    name="maxPages"
                    value={form.maxPages}
                    onChange={onChange}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-slate-100 outline-none"
                  />
                </label>
              </div>
              <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-4">
                <div>
                  <div className="font-medium text-white">Enable limited active checks</div>
                  <div className="text-sm text-slate-400">Harmless marker-only reflected input detection.</div>
                </div>
                <input
                  type="checkbox"
                  name="activeChecks"
                  checked={form.activeChecks}
                  onChange={onChange}
                  className="h-5 w-5 rounded border-white/10 bg-slate-950"
                />
              </label>
              {error ? <div className="text-sm text-rose-300">{error}</div> : null}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Starting scan..." : "Launch scan"}
              </button>
            </form>
          </div>
        </ShellCard>

        <div className="grid gap-6">
          <ShellCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <Target />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Crawl controls</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Queue-based crawl with normalized URLs, host restrictions, max depth, and max page limits.
                </p>
              </div>
            </div>
          </ShellCard>
          <ShellCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-300">
                <ShieldAlert />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Safe checks</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Passive header, cookie, robots, sitemap, and insecure form checks plus non-destructive reflected marker detection.
                </p>
              </div>
            </div>
          </ShellCard>
          <ShellCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <Sparkles />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Mongo-backed history</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Every page and finding is stored for dashboard review, filtering, and follow-up triage.
                </p>
              </div>
            </div>
          </ShellCard>
        </div>
      </section>
    </div>
  );
};

