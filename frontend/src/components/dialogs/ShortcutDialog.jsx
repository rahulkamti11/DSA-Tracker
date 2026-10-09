import { Keyboard, X } from 'lucide-react';

export default function ShortcutDialog({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-sky-400 flex items-center gap-2"><Keyboard /> Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Add Problem Modal</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">N</kbd></div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Go to Dashboard</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">D</kbd></div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Go to Problem Log</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">P</kbd></div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Close any Modal</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">Esc</kbd></div>
          <div className="flex justify-between items-center"><span className="text-slate-300 font-medium text-sm">Show this Help</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">?</kbd></div>
        </div>
      </div>
    </div>
  );
}
