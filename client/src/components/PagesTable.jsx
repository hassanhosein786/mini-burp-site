import { ShellCard } from "./ShellCard";

export const PagesTable = ({ pages }) => (
  <ShellCard className="overflow-hidden p-0">
    <div className="border-b border-white/6 px-6 py-5">
      <h3 className="text-lg font-semibold text-white">Discovered pages</h3>
      <p className="text-sm text-slate-400">Normalized crawl results kept within the authorized host.</p>
    </div>
    {pages.length === 0 ? (
      <div className="px-6 py-12 text-center text-sm text-slate-400">No pages have been stored for this scan yet.</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/40 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">URL</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Links</th>
              <th className="px-6 py-4 font-medium">Forms</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page._id} className="border-t border-white/6">
                <td className="max-w-lg truncate px-6 py-4 text-slate-200">{page.url}</td>
                <td className="px-6 py-4 text-slate-300">{page.statusCode || "n/a"}</td>
                <td className="px-6 py-4 text-slate-300">{page.links.length}</td>
                <td className="px-6 py-4 text-slate-300">{page.forms.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </ShellCard>
);

