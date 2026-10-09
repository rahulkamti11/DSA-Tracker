import { BookOpen } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import { parseMd } from '../utils/markdown.js';

export default function NotesTab({ active, problems, setNoteModal }) {
  if (!active) return null;

  const notesProblems = problems.filter((problem) => problem.notes && problem.notes.trim() !== '');

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex gap-4 items-center">
        <BookOpen size={32} className="text-purple-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
        <div>
          <h2 className="text-xl font-bold text-slate-200">Knowledge Base</h2>
          <p className="text-sm text-slate-400 mt-1">All your written approaches and notes.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {notesProblems.length === 0 ? <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono">No notes written yet. Add notes to problems to see them here.</p> :
          notesProblems.map((problem) => (
            <div key={problem.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sky-400 text-lg">{problem.name}</h3>
                <Badge color={problem.diff === 'Easy' ? 'green' : problem.diff === 'Medium' ? 'yellow' : 'red'}>{problem.diff}</Badge>
              </div>
              <div className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-300 line-clamp-4 mb-4 flex-1 font-mono text-xs" dangerouslySetInnerHTML={{ __html: parseMd(problem.notes) }} />
              <button onClick={() => setNoteModal(problem)} className="self-start text-xs font-bold text-sky-400 bg-sky-500/10 px-4 py-2 rounded-lg hover:bg-sky-500/20 transition-colors">Read Full Note →</button>
            </div>
          ))}
      </div>
    </div>
  );
}
