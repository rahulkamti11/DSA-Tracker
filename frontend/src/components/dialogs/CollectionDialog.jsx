import { X } from 'lucide-react';

export default function CollectionDialog({ open, onClose, newCollColor, setNewCollColor, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <form onSubmit={onSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-100 font-sans tracking-wide">New Collection</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2 block">Collection Name *</label>
            <input name="name" required placeholder="e.g. Blind 75, Top Interview 150..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none focus:border-sky-500 font-bold text-sm" />
          </div>
          <div>
            <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2 block">Description (Optional)</label>
            <input name="description" placeholder="Short description..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none focus:border-sky-500 text-sm" />
          </div>
          <div>
            <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2 block">Color</label>
            <div className="flex gap-3 mt-2">
              {['blue', 'green', 'yellow', 'red', 'purple', 'orange'].map((color) => {
                const bgClasses = { blue: 'bg-sky-400', green: 'bg-emerald-400', yellow: 'bg-amber-400', red: 'bg-rose-400', purple: 'bg-violet-400', orange: 'bg-orange-400' };
                const isSelected = newCollColor === color;
                return (
                  <button key={color} type="button" onClick={() => setNewCollColor(color)} className={`w-6 h-6 rounded-full ${bgClasses[color]} transition-transform ${isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110 shadow-lg' : 'hover:scale-105'}`} />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-800/50 pt-5">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-colors">Cancel</button>
          <button type="submit" className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]">Save</button>
        </div>
      </form>
    </div>
  );
}
