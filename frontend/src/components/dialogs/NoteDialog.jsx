import { X } from 'lucide-react';

export default function NoteDialog({ noteModal, onClose, parseMd, openAddModal }) {
  if (!noteModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-sky-400">{noteModal.name}</h2>
            <div className="flex gap-2 mt-2">{noteModal.tags.map((tag) => <span key={tag} className="text-[10px] uppercase tracking-widest font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{tag}</span>)}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-800 p-2 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
          <div className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-300 font-mono text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMd(noteModal.notes) || '<span class="text-slate-400 dark:text-slate-600 italic">No notes provided.</span>' }} />
        </div>
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button onClick={() => { onClose(); openAddModal(noteModal.id); }} className="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-6 py-2 rounded-lg text-sm font-bold hover:bg-sky-500/20 transition-colors">Edit Notes</button>
        </div>
      </div>
    </div>
  );
}
