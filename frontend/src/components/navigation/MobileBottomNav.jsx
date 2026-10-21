import { LayoutDashboard, ListTodo, RotateCcw, Plus, Menu } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics.js';

export default function MobileBottomNav({ view, setView, dueCount, onOpenMenu, onAddProblem }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: ListTodo },
    { id: 'review', label: 'Review', icon: RotateCcw, badge: dueCount },
    { id: 'add', label: 'Add', icon: Plus, isAdd: true },
    { id: 'menu', label: 'More', icon: Menu, isAction: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom,0px)] px-2 py-1 shadow-lg transition-all">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHaptic(item.isAdd ? 15 : 10);
                if (item.isAdd) {
                  onAddProblem?.();
                } else if (item.isAction) {
                  onOpenMenu?.();
                } else {
                  setView(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none active:scale-95 ${
                isActive
                  ? 'text-sky-500 dark:text-sky-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {item.isAdd ? (
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center shadow-[0_2px_8px_rgba(56,189,248,0.35)] transition-transform hover:scale-105 active:scale-90">
                  <Icon size={18} className="stroke-[2.5]" />
                </div>
              ) : (
                <div className="relative">
                  <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white rounded-full text-[9px] font-mono font-bold min-w-[16px] h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-[64px] ${item.isAdd ? 'font-bold text-sky-500 dark:text-sky-400' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
