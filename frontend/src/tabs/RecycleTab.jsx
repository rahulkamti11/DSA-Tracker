import { Recycle, RotateCcw, Trash2 } from 'lucide-react';

export default function RecycleTab({ active, trash, emptyTrash, restoreProblem, deletePermanent }) {
  if (!active) return null;

  const isTrashEmpty = !trash || trash.length === 0;

  return (
    <div className="animate-in fade-in space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-4 sm:p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-rose-500 dark:text-rose-400">Recycle Bin</h2>
          <p className="text-xs sm:text-sm text-rose-600/70 dark:text-rose-400/70 mt-0.5">Items remain here until permanently deleted.</p>
        </div>
        <button
          onClick={emptyTrash}
          disabled={isTrashEmpty}
          className={`px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 ${
            isTrashEmpty
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-rose-500 hover:bg-rose-600 text-white active:scale-95'
          }`}
        >
          Empty Bin
        </button>
      </div>

      <div className="space-y-3">
        {trash.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 sm:p-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-slate-900/10 min-h-[250px] sm:min-h-[300px]">
            <Recycle size={48} className="text-emerald-500 dark:text-emerald-400/90 animate-pulse mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">Recycle Bin is empty.</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Deleted problems will appear here.</p>
          </div>
        ) : (
          trash.map((problem) => (
            <div
              key={problem.id}
              className="flex flex-col sm:flex-row justify-between p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs gap-3 sm:gap-4"
            >
              <div className="min-w-0">
                <span className="font-bold text-slate-600 dark:text-slate-300 text-base sm:text-lg line-through break-words block">
                  {problem.name}
                </span>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Deleted: {problem.delDate} | Diff: {problem.diff}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-1 sm:pt-0">
                <button
                  onClick={() => restoreProblem(problem.id)}
                  className="flex-1 sm:flex-none text-xs sm:text-sm font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-2.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={14} /> Restore
                </button>
                <button
                  onClick={() => deletePermanent(problem.id)}
                  className="flex-1 sm:flex-none text-xs sm:text-sm font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3.5 py-2.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete Forever
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
