import { Star, Pencil, Trash, ArrowLeft } from 'lucide-react';
import Tooltip from '../components/ui/Tooltip.jsx';
import Badge from '../components/ui/Badge.jsx';
import { getPlatformInfo, getRealUrl } from '../utils/platform.js';
import { triggerHaptic } from '../utils/haptics.js';
import { updateProblem, mapProblem } from '../services/problems.service.js';

// Virtual built-in collection dynamically mapped to problem.starred
const VIRTUAL_STARRED_COLLECTION = {
  id: 'starred',
  name: 'Starred',
  description: 'Priority & bookmarked problems.',
  color: 'yellow',
  isVirtual: true,
};

export default function CollectionsTab({
  active,
  collections,
  selectedCollection,
  setSelectedCollection,
  problems,
  toggleStar,
  openAddModal,
  user,
  setProblems,
  setConfirmModal,
  deleteCollection,
  setNewCollColor,
  setCollModal,
}) {
  if (!active) return null;

  // Filter out any legacy 'starred' rows stored in database/cache
  const safeCollections = Array.isArray(collections) ? collections.filter((c) => c && c.id !== 'starred') : [];
  const safeProblems = Array.isArray(problems) ? problems : [];

  // Always present the virtual Starred collection alongside custom lists
  const allCollections = [VIRTUAL_STARRED_COLLECTION, ...safeCollections];

  if (selectedCollection) {
    const isStarred = selectedCollection === 'starred';
    const collection = isStarred
      ? VIRTUAL_STARRED_COLLECTION
      : safeCollections.find((item) => item.id === selectedCollection);

    const list = isStarred
      ? safeProblems.filter((problem) => problem.starred)
      : safeProblems.filter((problem) => problem.collId === selectedCollection || (Array.isArray(problem.collections) && problem.collections.includes(selectedCollection)));

    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Collection:</span>
              <span className={isStarred ? 'text-amber-500 dark:text-amber-400 flex items-center gap-1.5' : 'text-purple-600 dark:text-purple-400'}>
                {isStarred && <Star size={18} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]" />}
                <span>{collection ? collection.name : 'Collection'}</span>
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{list.length} {list.length === 1 ? 'problem' : 'problems'}</p>
          </div>
          <button
            onClick={() => setSelectedCollection(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        {/* Mobile Horizontal Scroll Cue */}
        <div className="flex md:hidden items-center justify-between px-1 text-[11px] font-mono text-slate-400">
          <span className="text-slate-500">{list.length} {list.length === 1 ? 'problem' : 'problems'}</span>
          <span className="text-sky-500 dark:text-sky-400 font-semibold animate-pulse">&larr; Swipe sideways to view columns &rarr;</span>
        </div>

        {/* TABLE VIEW: Unified table for all screen sizes with horizontal sliding */}
        <div
          className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl custom-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <table className="min-w-[760px] w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/80 text-slate-500 font-mono text-[10px] uppercase tracking-widest border-b border-slate-800">
              <tr>
                <th className="p-4 rounded-tl-xl">Name</th>
                <th className="p-4">Platforms</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Diff</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {list.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4">
                    <div className="p-12 text-center text-slate-500 font-mono border border-dashed border-slate-800 rounded-lg">
                      {isStarred ? 'No starred problems yet. Bookmark questions to see them here!' : 'No problems in this collection.'}
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((problem) => (
                  <tr key={problem.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 font-bold text-slate-200 text-[15px] flex items-center gap-2">
                      <button onClick={() => { triggerHaptic(12); toggleStar(problem.id); }} className="focus:outline-none">
                        <Star size={16} className={`transition-colors ${problem.starred ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]' : 'text-slate-600 hover:text-slate-400'}`} />
                      </button>
                      <span>{problem.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {problem.platforms && problem.platforms.map((platform, idx) => {
                          const info = getPlatformInfo(platform.platform);
                          return (
                            <a key={idx} href={getRealUrl(problem.name, platform.platform, platform.url)} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 transition-colors ${info.text}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
                              {info.short}
                            </a>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {[...problem.tags].sort((a, b) => a.length - b.length).map((tag) => <span key={tag} className="text-[10px] font-bold tracking-wider bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/20">{tag}</span>)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge color={problem.diff === 'Easy' ? 'green' : problem.diff === 'Medium' ? 'yellow' : 'red'}>{problem.diff}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge color={problem.status === 'Solved' ? 'green' : problem.status === 'Mastered' ? 'blue' : 'yellow'}>{problem.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip content="Edit">
                          <button onClick={() => openAddModal(problem.id)} className="p-2 text-slate-500 hover:text-sky-400 border border-slate-700 hover:border-sky-500/50 rounded-lg transition-all">
                            <Pencil size={14} />
                          </button>
                        </Tooltip>
                        {isStarred ? (
                          <Tooltip content="Unstar">
                            <button onClick={() => toggleStar(problem.id)} className="p-2 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-all cursor-pointer">
                              <Trash size={14} />
                            </button>
                          </Tooltip>
                        ) : (
                          <Tooltip content="Remove from Collection">
                            <button
                              onClick={() => {
                                // Optimistic update immediately (offline-first)
                                setProblems((items) => items.map((item) => {
                                  if (item.id !== problem.id) return item;
                                  const filteredColls = Array.isArray(item.collections)
                                    ? item.collections.filter((cid) => cid !== selectedCollection)
                                    : [];
                                  const updatedCollId = item.collId === selectedCollection ? '' : item.collId;
                                  return { ...item, collId: updatedCollId, collections: filteredColls };
                                }));
                                if (user && user.token && !user.isGuest) {
                                  updateProblem(user.token, problem._id || problem.id, { collId: '' })
                                    .then((updated) => {
                                      setProblems((items) => items.map((item) => item.id === problem.id ? mapProblem(updated) : item));
                                    })
                                    .catch(err => console.warn('Failed to sync remove from collection with server:', err.message));
                                }
                              }}
                              className="p-2 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash size={14} />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Study Collections</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Group problems into curated lists.</p>
        </div>
        <button
          onClick={() => { setNewCollColor('blue'); setCollModal(true); }}
          className="bg-sky-500 text-slate-950 px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] active:scale-95 transition-all cursor-pointer"
        >
          + New List
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {allCollections.map((collection) => {
          const isStarred = collection.id === 'starred';
          const count = isStarred
            ? safeProblems.filter((problem) => problem.starred).length
            : safeProblems.filter((problem) => problem.collId === collection.id || (Array.isArray(problem.collections) && problem.collections.includes(collection.id))).length;

          const colorMap = {
            blue: 'from-sky-500 to-blue-500',
            green: 'from-emerald-500 to-teal-500',
            yellow: 'from-amber-400 to-yellow-500',
            red: 'from-rose-500 to-red-500',
            purple: 'from-violet-500 to-purple-600',
            orange: 'from-orange-400 to-amber-500',
          };
          const gradient = isStarred ? colorMap.yellow : (colorMap[collection.color] || colorMap.blue);

          return (
            <div
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-xl flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-slate-400 dark:hover:border-slate-700 transition-all relative overflow-hidden cursor-pointer active:scale-[0.99]"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {isStarred && <Star size={18} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]" />}
                    <span>{collection.name}</span>
                  </h3>
                  {isStarred && (
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-mono text-sky-500 dark:text-sky-400 font-bold">{count} {count === 1 ? 'problem' : 'problems'}</p>
                {collection.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{collection.description}</p>}
              </div>
              <div className="mt-5 flex justify-end">
                {!isStarred && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModal({
                        open: true,
                        title: 'Delete Collection?',
                        message: `Are you sure you want to delete the "${collection.name}" collection? This will not delete the problems inside it.`,
                        onConfirm: () => {
                          deleteCollection(collection.id).catch((err) => console.error(err));
                        },
                      });
                    }}
                    className="text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash size={12} /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
