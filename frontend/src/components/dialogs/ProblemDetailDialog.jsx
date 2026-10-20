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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-start mb-4 sm:mb-6 border-b border-slate-800 pb-3 sm:pb-4 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-100 break-words">{detailModal.name}</h2>
              <Badge color={detailModal.diff === 'Easy' ? 'green' : detailModal.diff === 'Medium' ? 'yellow' : 'red'}>
                {detailModal.diff}
              </Badge>
              <Badge color={detailModal.status === 'Solved' ? 'green' : detailModal.status === 'Mastered' ? 'blue' : 'yellow'}>
                {detailModal.status}
              </Badge>
            </div>
            {collection && (
              <p className="text-xs text-purple-400 font-bold mt-1.5 flex items-center gap-1.5">
                <FolderHeart size={12} /> Collection: {collection.name}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-lg transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex-1 space-y-4 sm:space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 bg-slate-800/30 dark:bg-slate-950/40 p-3 sm:p-4 rounded-xl border border-slate-700/60 dark:border-slate-800/60 font-mono text-[10px] sm:text-[11px]">
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">Reviews</span>
              <span className="text-slate-200 font-bold">{detailModal.revCount || 0} times</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">Interval</span>
              <span className="text-slate-200 font-bold">{detailModal.interval} days</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">Last Solved</span>
              <span className="text-slate-200 font-bold truncate block">{formatDate(detailModal.lastReviewed) || 'Never'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">Next Due</span>
              <span className="text-sky-400 font-bold truncate block">{formatDate(detailModal.nextRev) || 'None'}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">Added</span>
              <span className="text-slate-200 font-bold truncate block">{formatDate(detailModal.date)}</span>
            </div>
          </div>

          {detailModal.platforms && detailModal.platforms.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-xs font-mono tracking-widest text-slate-500 uppercase mb-2 sm:mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {detailModal.platforms.map((platform, index) => {
                  const info = getPlatformInfo(platform.platform);
                  return (
                    <a
                      key={index}
                      href={getRealUrl(detailModal.name, platform.platform, platform.url)}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800 transition-colors ${info.text}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
                      {info.short} (Click to solve)
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {detailModal.tags && detailModal.tags.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-xs font-mono tracking-widest text-slate-500 uppercase mb-2 sm:mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {[...detailModal.tags].sort((a, b) => a.length - b.length).map((tag) => (
                  <span key={tag} className="text-xs font-bold tracking-wider bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {detailModal.notes && detailModal.notes.trim() !== '' && (
            <div>
              <h3 className="text-[10px] sm:text-xs font-mono tracking-widest text-slate-500 uppercase mb-2 sm:mb-3">Approach & Notes</h3>
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div
                  className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-300 font-mono text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseMd(detailModal.notes) }}
                />
              </div>
            </div>
          )}

          {detailModal.code && detailModal.code.trim() !== '' && (
            <div>
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h3 className="text-[10px] sm:text-xs font-mono tracking-widest text-slate-500 uppercase">
                  Code ({detailModal.language || 'cpp'})
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(detailModal.code);
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20 hover:bg-sky-500/20 active:scale-95 transition-all flex items-center gap-1"
                >
                  {codeCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs font-mono text-slate-800 dark:text-slate-300 max-h-72 custom-scrollbar leading-relaxed">
                <code>{detailModal.code}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800/80 flex justify-end gap-2 sm:gap-3">
          <button
            onClick={() => {
              onClose();
              openAddModal(detailModal.id);
            }}
            className="flex-1 sm:flex-none bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-amber-500/20 active:scale-95 transition-colors flex items-center justify-center gap-1.5"
          >
            <Pencil size={14} /> Edit Problem
          </button>
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none bg-slate-800 text-slate-200 border border-slate-700 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-700 hover:text-white active:scale-95 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
