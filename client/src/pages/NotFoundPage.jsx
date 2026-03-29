import { Link } from "react-router-dom";
import { ShellCard } from "../components/ShellCard";

export const NotFoundPage = () => (
  <ShellCard className="mx-auto max-w-2xl text-center">
    <h2 className="text-3xl font-semibold text-white">Page not found</h2>
    <p className="mt-3 text-slate-400">The route you requested does not exist in this MVP.</p>
    <Link className="mt-6 inline-flex rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950" to="/">
      Return home
    </Link>
  </ShellCard>
);

