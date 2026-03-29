import { ShieldCheck, TerminalSquare } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export const DashboardLayout = () => (
  <div className="grid-surface min-h-screen">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 md:px-6">
      <header className="mb-8 rounded-3xl border border-white/8 bg-slate-950/60 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-400/12 p-3 text-cyan-300 ring-1 ring-cyan-400/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Mini Burp Suite</h1>
              <p className="text-sm text-slate-400">
                Authorized defensive scanning with passive checks and limited non-destructive probes.
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-2xl px-4 py-2 transition ${isActive ? "bg-cyan-400/15 text-cyan-200" : "text-slate-300 hover:bg-white/5"}`
              }
            >
              Home
            </NavLink>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-slate-400">
              <TerminalSquare size={16} />
              Local MVP
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  </div>
);
