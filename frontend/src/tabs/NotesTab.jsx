import { BookOpen } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import { parseMd } from '../utils/markdown.js';

export default function NotesTab({ active, problems, setNoteModal }) {
  if (!active) return null;

  const notesProblems = problems.filter((problem) => problem.notes && problem.notes.trim() !== '');

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-xl shadow-sm flex gap-3 sm:gap-4 items-center">
        <BookOpen size={28} className="text-purple-500 dark:text-purple-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] shrink-0" />
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">Knowledge Base</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">All your written approaches and notes.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
        {notesProblems.length === 0 ? (
          <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono text-sm">
            No notes written yet. Add notes to problems to see them here.
          </p>
        ) : (
          notesProblems.map((problem) => (
            <div key={problem.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sky-500 dark:text-sky-400 text-base sm:text-lg break-words flex-1">{problem.name}</h3>
                  <Badge color={problem.diff === 'Easy' ? 'green' : problem.diff === 'Medium' ? 'yellow' : 'red'}>{problem.diff}</Badge>
                </div>
                <div className="prose dark:prose-invert prose-sm max-w-none text-slate-700 dark:text-slate-300 line-clamp-4 mb-4 font-mono text-xs overflow-hidden" dangerouslySetInnerHTML={{ __html: parseMd(problem.notes) }} />
              </div>
              <button
                onClick={() => setNoteModal(problem)}
                className="self-start text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-4 py-2.5 rounded-lg hover:bg-sky-500/20 active:scale-95 transition-all mt-2"
              >
                Read Full Note →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
