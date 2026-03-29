export const ShellCard = ({ className = "", children }) => (
  <div
    className={`rounded-3xl border border-[color:var(--line)] bg-[color:rgba(10,19,34,0.82)] p-6 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur ${className}`}
  >
    {children}
  </div>
);

