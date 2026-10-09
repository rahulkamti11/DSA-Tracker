import { FolderHeart, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import Badge from '../ui/Badge.jsx';

export default function ProblemDetailDialog({
  detailModal,
  onClose,
  openAddModal,
  collections,
  formatDate,
  parseMd,
  getPlatformInfo,
  getRealUrl,
}) {
  const [codeCopied, setCodeCopied] = useState(false);

  if (!detailModal) return null;

  const collection = detailModal.collId ? collections.find((item) => item.id === detailModal.collId) : null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-100">{detailModal.name}</h2>
              <Badge color={detailModal.diff === 'Easy' ? 'green' : detailModal.diff === 'Medium' ? 'yellow' : 'red'}>
                {detailModal.diff}
              </Badge>
              <Badge color={detailModal.status === 'Solved' ? 'green' : detailModal.status === 'Mastered' ? 'blue' : 'yellow'}>
                {detailModal.status}
              </Badge>
            </div>
            {collection && (
              <p className="text-xs text-purple-400 font-bold mt-2 flex items-center gap-1.5">
                <FolderHeart size={12} /> Collection: {collection.name}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-800/80 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-slate-800/30 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-700/60 dark:border-slate-800/60 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-1">Times Reviewed</span>
              <span className="text-slate-200 font-bold">{detailModal.revCount || 0} times</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-1">Interval</span>
              <span className="text-slate-200 font-bold">{detailModal.interval} days</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-1">Last Reviewed</span>
              <span className="text-slate-200 font-bold">{formatDate(detailModal.lastReviewed) || 'Never'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-1">Next Review</span>
              <span className="text-sky-400 font-bold">{formatDate(detailModal.nextRev) || 'None'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-1">Date Added</span>
              <span className="text-slate-200 font-bold">{formatDate(detailModal.date)}</span>
            </div>
          </div>

          {detailModal.platforms && detailModal.platforms.length > 0 && (
            <div>
              <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {detailModal.platforms.map((platform, index) => {
                  const info = getPlatformInfo(platform.platform);
                  return (
                    <a
                      key={index}
                      href={getRealUrl(detailModal.name, platform.platform, platform.url)}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800 transition-colors ${info.text}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${info.dot}`} />
                      {info.short} (Click to solve)
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {detailModal.tags && detailModal.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[...detailModal.tags].sort((a, b) => a.length - b.length).map((tag) => (
                  <span key={tag} className="text-xs font-bold tracking-wider bg-sky-500/10 text-sky-400 px-3 py-1.5 rounded-full border border-sky-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-3">Notes</h3>
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-300 font-mono text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMd(detailModal.notes) || '<span class="text-slate-400 dark:text-slate-600 italic">No notes provided.</span>' }} />
          </div>

          {detailModal.code && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase">Code ({detailModal.language || 'C++'})</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(detailModal.code);
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 hover:bg-sky-500/20 transition-all flex items-center gap-1"
                >
                  {codeCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs font-mono text-slate-800 dark:text-slate-300 max-h-72 custom-scrollbar leading-relaxed">
                <code>{detailModal.code}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              openAddModal(detailModal.id);
            }}
            className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
          >
            <Pencil size={14} /> Edit Problem
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-700 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
