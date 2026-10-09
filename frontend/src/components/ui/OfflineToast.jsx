import { X, HardDrive } from 'lucide-react';

export default function OfflineToast({ onClose }) {
  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-[calc(100%-2.5rem)] sm:w-96 animate-in slide-in-from-top-4 duration-300">
      <div className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-500/60 dark:border-amber-500/50 rounded-2xl p-4 shadow-[0_8px_30px_rgba(245,158,11,0.25)] dark:shadow-[0_8px_30px_rgba(245,158,11,0.2)]">
        {/* Subtle slowly pulsing ambient top border indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 animate-pulse duration-1000" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Slowly blinking beacon dot */}
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 duration-1000" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Backend Server Offline
                </h4>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  OFFLINE
                </span>
              </div>
            </div>
          </div>

          {/* Close Notification Button */}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Dismiss for this session"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-2.5 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Unable to connect to the backend server. Your changes and progress are currently being saved to your browser&apos;s <strong>Local Storage</strong>.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            <span className="flex items-center gap-1.5">
              <HardDrive size={13} />
              <span>Local Storage Active</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Start backend to sync with database
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
