export default function Badge({ children, color }) {
  const colors = {
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 dark:border-emerald-500/20',
    yellow: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 dark:border-amber-500/20',
    red: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 dark:border-rose-500/20',
    blue: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25 dark:border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25 dark:border-purple-500/20',
  };

  return (
    <span className={`px-2 py-0.5 border rounded-md text-[10px] font-mono whitespace-nowrap uppercase tracking-wider font-semibold ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}
