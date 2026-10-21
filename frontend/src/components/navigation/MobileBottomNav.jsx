import { useState } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  RotateCcw,
  Plus,
  Code2,
  FolderHeart,
  Tags,
  BookOpen,
  Trash2,
  Settings,
  X,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics.js';

export default function MobileBottomNav({
  view,
  setView,
  dueCount,
  trashCount = 0,
  isAddOpen,
  onAddProblem,
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreItems = [
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'topics', label: 'Topics', icon: Tags },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'trash', label: 'Recycle Bin', icon: Trash2, badge: trashCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isMoreActive = isMoreOpen || moreItems.some((item) => item.id === view);

  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: ListTodo },
    { id: 'review', label: 'Review', icon: RotateCcw, badge: dueCount },
    { id: 'add', label: 'Add', icon: Plus, isAdd: true },
    { id: 'more', label: 'More', icon: Code2, isMore: true },
  ];

  return (
    <>
      {/* More Menu Backdrop */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-150"
          onClick={() => setIsMoreOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* More Menu Box */}
      {isMoreOpen && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] left-3 right-3 z-50 md:hidden bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 px-2">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-sky-400 stroke-[2.2]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                More Tabs
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMoreOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {moreItems.map((item) => {
              const ItemIcon = item.icon;
              const isItemActive = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setView(item.id);
                    setIsMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left ${
                    isItemActive
                      ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent active:scale-[0.98]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      isItemActive
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ItemIcon size={18} />
                  </div>
                  <span className="text-sm font-semibold flex-1 truncate">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-rose-500 text-white rounded-full text-[10px] font-mono font-bold px-2 py-0.5 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Persistent Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom,0px)] px-2 py-1 shadow-lg transition-all">
        <div className="flex items-center justify-around h-14">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isAdd
              ? Boolean(isAddOpen)
              : item.isMore
              ? isMoreActive
              : view === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  if (item.isAdd) {
                    setIsMoreOpen(false);
                    onAddProblem?.();
                  } else if (item.isMore) {
                    setIsMoreOpen((prev) => !prev);
                  } else {
                    setIsMoreOpen(false);
                    setView(item.id);
                  }
                }}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none active:scale-95 ${
                  isActive
                    ? 'text-sky-500 dark:text-sky-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white rounded-full text-[9px] font-mono font-bold min-w-[16px] h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
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
    </>
  );
}
