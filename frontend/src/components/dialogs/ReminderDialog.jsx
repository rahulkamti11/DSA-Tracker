import { X } from 'lucide-react';

export default function ReminderDialog({ open, problem, selectedInterval, setSelectedInterval, onClose, onConfirm, formatDate, addDays, today }) {
  if (!open || !problem) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-slate-200 tracking-wide font-mono flex items-center gap-1.5">⏰ Set Next Review Date</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-100 mb-1">{problem.name}</h3>
          <p className="text-xs text-slate-400 font-medium">
            <span className={problem.diff === 'Easy' ? 'text-emerald-500 dark:text-emerald-400' : problem.diff === 'Medium' ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'}>{problem.diff}</span>
            {problem.tags && problem.tags.length > 0 && ` · ${problem.tags.join(', ')}`}
            {` · Reviewed ${problem.revCount || 0}×`}
          </p>
        </div>
        <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">When should you review this again?</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 7, 14, 30, 60].map((day) => {
            const isSelected = selectedInterval === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedInterval(day)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${isSelected ? 'bg-sky-500/10 border-sky-500 text-sky-500 dark:text-sky-400 font-bold shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'bg-slate-800/40 dark:bg-slate-950/40 border-slate-700/60 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                {day} {day === 1 ? 'Day' : 'Days'}
              </button>
            );
          })}
          <button type="button" onClick={() => setSelectedInterval(-2)} className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${selectedInterval === -2 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-800/40 dark:bg-slate-950/40 border-slate-700/60 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}>🏆 Mastered</button>
          <button type="button" onClick={() => setSelectedInterval(-1)} className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${selectedInterval === -1 ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-bold' : 'bg-slate-800/40 dark:bg-slate-950/40 border-slate-700/60 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}>🚫 Don't Repeat</button>
        </div>
        <div className="bg-slate-800/30 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-700/60 dark:border-slate-800/80 mb-6 text-xs font-mono">
          {selectedInterval === -1 ? (
            <span className="text-rose-400 font-medium">No reviews scheduled (Don't Repeat)</span>
          ) : selectedInterval === -2 ? (
            <span className="text-emerald-400 font-medium">🏆 Marked as Mastered (No reviews scheduled)</span>
          ) : (
            <span className="text-sky-400">Next review: <span className="font-bold">{formatDate(addDays(today(), selectedInterval))}</span> (in {selectedInterval} {selectedInterval === 1 ? 'day' : 'days'})</span>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-800/50 pt-5">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-colors">Cancel</button>
          <button type="button" onClick={() => onConfirm(selectedInterval)} className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]">✓ Confirm</button>
        </div>
      </div>
    </div>
  );
}
