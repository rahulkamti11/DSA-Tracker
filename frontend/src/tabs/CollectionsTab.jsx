import { Star, Pencil, Trash } from 'lucide-react';
import Tooltip from '../components/ui/Tooltip.jsx';
import Badge from '../components/ui/Badge.jsx';
import { getPlatformInfo, getRealUrl } from '../utils/platform.js';
import { updateProblem, mapProblem } from '../services/problems.service.js';

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

  if (selectedCollection) {
    const collection = collections.find((item) => item.id === selectedCollection);
    const list = collection && collection.id === 'starred' ? problems.filter((problem) => problem.starred) : problems.filter((problem) => problem.collId === selectedCollection);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-200">{collection ? collection.name : 'Collection'}</h3>
            <p className="text-sm text-slate-400">{list.length} problems</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedCollection(null)} className="text-slate-400 bg-slate-800 px-3 py-2 rounded-lg">Back</button>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-sm whitespace-nowrap">
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
                      No problems in this collection.
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((problem) => (
                  <tr key={problem.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 font-bold text-slate-200 text-[15px] flex items-center gap-2">
                      <button onClick={() => toggleStar(problem.id)} className="focus:outline-none">
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
                        {collection && collection.id === 'starred' ? (
                          <Tooltip content="Unstar">
                            <button onClick={() => toggleStar(problem.id)} className="p-2 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-all">
                              <Trash size={14} />
                            </button>
                          </Tooltip>
                        ) : (
                          <Tooltip content="Remove from Collection">
                            <button
                              onClick={() => {
                                if (user && user.token) {
                                  updateProblem(user.token, problem._id || problem.id, { collId: '' })
                                    .then((updated) => {
                                      setProblems((items) => items.map((item) => item.id === problem.id ? mapProblem(updated) : item));
                                    })
                                    .catch(err => console.error(err));
                                } else {
                                  setProblems((items) => items.map((item) => item.id === problem.id ? { ...item, collId: '' } : item));
                                }
                              }}
                              className="p-2 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-all"
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
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-slate-200">Study Collections</h2>
          <p className="text-sm text-slate-400 mt-1">Group problems into curated lists.</p>
        </div>
        <button onClick={() => { setNewCollColor('blue'); setCollModal(true); }} className="bg-sky-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all">+ New List</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {collections.length ? collections.map((collection) => {
          const count = collection.id === 'starred' ? problems.filter((problem) => problem.starred).length : problems.filter((problem) => problem.collId === collection.id).length;
          const colorMap = { blue: 'from-sky-500 to-blue-500', green: 'from-emerald-500 to-teal-500', yellow: 'from-amber-400 to-yellow-500', red: 'from-rose-500 to-red-500', purple: 'from-violet-500 to-purple-600', orange: 'from-orange-400 to-amber-500' };
          const gradient = colorMap[collection.color] || colorMap.blue;
          return (
            <div key={collection.id} onClick={() => setSelectedCollection(collection.id)} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between group shadow-lg hover:border-slate-600 transition-colors relative overflow-hidden cursor-pointer">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div>
                <h3 className="text-xl font-bold text-slate-200 mb-1">{collection.name}</h3>
                <p className="text-sm font-mono text-sky-400">{count} problems</p>
                {collection.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{collection.description}</p>}
              </div>
              <div className="mt-6 flex justify-end">
                {collection.id !== 'starred' && (
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
                    className="text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Trash size={12} /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        }) : <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono">Create study lists like "Blind 75".</p>}
      </div>
    </div>
  );
}
