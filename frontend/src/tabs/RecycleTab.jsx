import { Recycle } from 'lucide-react';

export default function RecycleTab({ active, trash, emptyTrash, restoreProblem, deletePermanent }) {
  if (!active) return null;

  const isTrashEmpty = !trash || trash.length === 0;

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-6 rounded-xl shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-rose-400">Recycle Bin</h2>
          <p className="text-sm text-rose-400/70 mt-1">Items remain here until permanently deleted.</p>
        </div>
        <button
          onClick={emptyTrash}
          disabled={isTrashEmpty}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)] ${
            isTrashEmpty
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-rose-500 hover:bg-rose-600 text-white'
          }`}
        >
          Empty Bin
        </button>
      </div>

      <div className="space-y-3">
        {trash.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10 min-h-[300px] animate-in fade-in">
            <Recycle size={56} className="text-emerald-400/90 animate-pulse mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
            <h3 className="text-lg font-bold text-slate-300">Recycle Bin is empty.</h3>
            <p className="text-sm text-slate-500 mt-2">Deleted problems will appear here.</p>
          </div>
        ) : trash.map((problem) => (
          <div key={problem.id} className="flex flex-col md:flex-row justify-between p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-md gap-4">
            <div><span className="font-bold text-slate-300 text-lg line-through">{problem.name}</span><p className="text-xs text-slate-500 font-mono mt-2">Deleted on: {problem.delDate} | Difficulty: {problem.diff}</p></div>
            <div className="flex items-center gap-3">
              <button onClick={() => restoreProblem(problem.id)} className="text-sm font-bold bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">Restore</button>
              <button onClick={() => deletePermanent(problem.id)} className="text-sm font-bold bg-rose-500/10 text-rose-400 px-4 py-2 rounded-lg border border-rose-500/20 hover:bg-rose-500/20 transition-colors">Delete Forever</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
