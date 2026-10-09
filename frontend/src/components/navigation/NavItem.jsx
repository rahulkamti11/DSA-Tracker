import Tooltip from '../ui/Tooltip.jsx';

export default function NavItem({
  id,
  icon: Icon,
  label,
  alert,
  active,
  sidebarCollapsed,
  onClick,
}) {
  const button = (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
        sidebarCollapsed
          ? 'w-10 h-10 justify-center mx-auto'
          : 'w-full h-10 px-3 gap-3'
      } ${
        active
          ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold shadow-xs'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      {!sidebarCollapsed && (
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="truncate whitespace-nowrap text-xs font-semibold tracking-wide">{label}</span>
          {alert > 0 && (
            <span className="ml-auto bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0">
              {alert}
            </span>
          )}
        </div>
      )}
      {sidebarCollapsed && alert > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
      )}
    </button>
  );

  return sidebarCollapsed ? (
    <Tooltip content={label} className="relative flex w-full justify-center">
      {button}
    </Tooltip>
  ) : button;
}
