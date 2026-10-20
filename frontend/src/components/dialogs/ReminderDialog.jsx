import { X } from 'lucide-react';

export default function ReminderDialog({ open, problem, selectedInterval, setSelectedInterval, onClose, onConfirm, formatDate, addDays, today }) {
  if (!open || !problem) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide font-mono flex items-center gap-1.5">
              ⏰ Set Next Review Date
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1 break-words">{problem.name}</h3>
            <p className="text-xs text-slate-400 font-medium">
              <span className={problem.diff === 'Easy' ? 'text-emerald-500 dark:text-emerald-400' : problem.diff === 'Medium' ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'}>{problem.diff}</span>
              {problem.tags && problem.tags.length > 0 && ` · ${problem.tags.join(', ')}`}
              {` · Reviewed ${problem.revCount || 0}×`}
            </p>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2.5">When should you review this again?</p>
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {[1, 2, 3, 7, 14, 30, 60].map((day) => {
              const isSelected = selectedInterval === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedInterval(day)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${isSelected ? 'bg-sky-500/10 border-sky-500 text-sky-500 dark:text-sky-400 font-bold shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'bg-slate-800/40 dark:bg-slate-950/40 border-slate-700/60 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  {day} {day === 1 ? 'Day' : 'Days'}
                </button>
              );
            })}
            <button type="button" onClick={() => setSelectedInterval(-2)} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 active:scale-95 ${selectedInterval === -2 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-800/40 dark:bg-slate-950/40 border-slate-700/60 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}>🏆 Mastered</button>
            <button type="button" onClick={() => setSelectedInterval(-1)} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 active:scale-95 ${selectedInterval === -1 ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-bold' : 'bg-slate-800/40 dark:bg-slate-950/40 border-slate-700/60 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}>🚫 Don't Repeat</button>
          </div>
          <div className="bg-slate-800/30 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-700/60 dark:border-slate-800/80 mb-4 sm:mb-6 text-xs font-mono">
            {selectedInterval === -1 ? (
              <span className="text-rose-400 font-medium">No reviews scheduled (Don't Repeat)</span>
            ) : selectedInterval === -2 ? (
              <span className="text-emerald-400 font-medium">🏆 Marked as Mastered (No reviews scheduled)</span>
            ) : (
              <span className="text-sky-400">Next review: <span className="font-bold">{formatDate(addDays(today(), selectedInterval))}</span> (in {selectedInterval} {selectedInterval === 1 ? 'day' : 'days'})</span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 sm:gap-3 border-t border-slate-800/50 pt-3 sm:pt-4">
          <button type="button" onClick={onClose} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-colors">Cancel</button>
          <button type="button" onClick={() => onConfirm(selectedInterval)} className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 active:scale-95 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]">✓ Confirm</button>
        </div>
      </div>
    </div>
  );
}
