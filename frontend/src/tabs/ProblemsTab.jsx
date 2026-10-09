import { useState, useMemo } from 'react';
import { ChevronDown, X, Search, Star, StarOff, FolderHeart, BookOpen, Eye, Pencil, Trash } from 'lucide-react';
import Tooltip from '../components/ui/Tooltip.jsx';
import Badge from '../components/ui/Badge.jsx';
import { CustomFilterSelect, CustomHeaderSelect } from '../components/ui/Selects.jsx';
import { formatDate } from '../utils/date.js';
import { getPlatformInfo, getRealUrl } from '../utils/platform.js';

export default function ProblemsTab({
  active,
  problems,
  collections,
  toggleStar,
  openAddModal,
  deleteProblem,
  setNoteModal,
  setDetailModal,
}) {
  // Encapsulated states
  const [filters, setFilters] = useState({ search: '', diff: '', status: '', tags: [], platforms: [], collId: '' });
  const [starFilter, setStarFilter] = useState('all'); // 'all' | 'starred' | 'unstarred'
  const [dateDisplayType, setDateDisplayType] = useState('added'); // 'added' | 'last' | 'next'
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

  // Computations
  const allUniqueTags = useMemo(() => {
    const set = new Set();
    problems.forEach(p => p.tags && p.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDiff = !filters.diff || p.diff === filters.diff;
      const matchesStatus = !filters.status || p.status === filters.status;
      const matchesCollection = !filters.collId || p.collId === filters.collId;
      const matchesTags = !filters.tags || filters.tags.length === 0 || filters.tags.some(t => p.tags && p.tags.includes(t));
      const matchesPlatforms = !filters.platforms || filters.platforms.length === 0 || (p.platforms && p.platforms.some(pl => filters.platforms.includes(pl.platform)));
      const matchesStar = starFilter === 'all' ? true : starFilter === 'starred' ? p.starred : !p.starred;
      return matchesSearch && matchesDiff && matchesStatus && matchesCollection && matchesTags && matchesPlatforms && matchesStar;
    });
  }, [problems, filters, starFilter]);

  if (!active) return null;

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3 items-end w-full">
          <div className="w-full lg:flex-1 min-w-0">
            <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5 block">Search</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 focus-within:border-sky-500 transition-colors h-[38px]">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                className="bg-transparent border-none outline-none text-sm p-2 w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          <CustomFilterSelect
            value={filters.collId}
            onChange={(val) => setFilters({ ...filters, collId: val })}
            options={[{ value: '', label: 'All Collections' }, ...collections.map((collection) => ({ value: collection.id, label: collection.name }))]}
            placeholder="All Collections"
            label="Collection"
            widthClass="w-full lg:w-36 shrink-0"
          />

          <div className="relative w-full lg:w-36 shrink-0">
            <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5 block">Platforms</label>
            <button
              type="button"
              onClick={() => { setPlatformDropdownOpen(!platformDropdownOpen); setTagDropdownOpen(false); }}
              className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:border-sky-500 transition-colors h-[38px]"
            >
              <span className="truncate">{filters.platforms.length === 0 ? 'All Platforms' : filters.platforms.join(', ')}</span>
              <ChevronDown size={14} className={`transition-transform ${platformDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {platformDropdownOpen && (
              <div className="absolute left-0 mt-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 p-2.5 max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                {['LeetCode', 'GFG', 'HackerRank', 'Codeforces', 'CodeChef', 'InterviewBit', 'Other'].map((platform) => {
                  const isSelected = filters.platforms.includes(platform);
                  return (
                    <label key={platform} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setFilters((prev) => {
                            const platforms = prev.platforms.includes(platform)
                              ? prev.platforms.filter((value) => value !== platform)
                              : [...prev.platforms, platform];
                            return { ...prev, platforms };
                          });
                        }}
                        className="rounded border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-sky-500 focus:ring-sky-500/20"
                      />
                      {platform}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative w-full lg:w-36 shrink-0">
            <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5 block">Tags</label>
            <button
              type="button"
              onClick={() => { setTagDropdownOpen(!tagDropdownOpen); setPlatformDropdownOpen(false); }}
              className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:border-sky-500 transition-colors h-[38px]"
            >
              <span className="truncate">{filters.tags.length === 0 ? 'All Tags' : filters.tags.join(', ')}</span>
              <ChevronDown size={14} className={`transition-transform ${tagDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {tagDropdownOpen && (
              <div className="absolute left-0 mt-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 p-2.5 max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                {allUniqueTags.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-1">No tags available</div>
                ) : (
                  allUniqueTags.map((tag) => {
                    const isSelected = filters.tags.includes(tag);
                    return (
                      <label key={tag} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setFilters((prev) => {
                              const tags = prev.tags.includes(tag) ? prev.tags.filter((value) => value !== tag) : [...prev.tags, tag];
                              return { ...prev, tags };
                            });
                          }}
                          className="rounded border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-sky-500 focus:ring-sky-500/20"
                        />
                        {tag}
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:w-24 shrink-0">
            <div className="hidden lg:block h-[16px] mb-1.5" />
            <button
              onClick={() => {
                setFilters({ search: '', diff: '', status: '', tags: [], platforms: [], collId: '' });
                setTagDropdownOpen(false);
                setPlatformDropdownOpen(false);
              }}
              className="w-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold rounded-lg text-sm transition-colors border border-rose-500/20 h-[38px] flex items-center justify-center gap-1.5"
            >
              Clear <X size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto lg:overflow-visible shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-500 font-mono text-[10px] uppercase tracking-widest border-b border-slate-800">
            <tr>
              <th className="py-3 px-2 rounded-tl-xl w-10 text-center">#</th>
              <th className="py-3 px-2 w-8 text-center">
                <Tooltip
                  content={
                    starFilter === 'all'
                      ? 'Showing All (Click to view Starred)'
                      : starFilter === 'starred'
                        ? 'Showing Starred Only (Click to view Unstarred)'
                        : 'Showing Unstarred Only (Click to view All)'
                  }
                >
                  <button
                    onClick={() => {
                      setStarFilter((prev) => {
                        if (prev === 'all') return 'starred';
                        if (prev === 'starred') return 'unstarred';
                        return 'all';
                      });
                    }}
                    className="focus:outline-none flex items-center justify-center w-full mx-auto"
                  >
                    {starFilter === 'all' && <Star size={16} className="text-slate-500 hover:text-slate-300 transition-colors" />}
                    {starFilter === 'starred' && <Star size={16} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)] transition-colors" />}
                    {starFilter === 'unstarred' && <StarOff size={16} className="text-rose-500 hover:text-rose-400 transition-colors" />}
                  </button>
                </Tooltip>
              </th>
              <th className="py-3 px-2 max-w-[200px]">Name</th>
              <th className="py-3 px-2 w-28 text-center">
                <CustomHeaderSelect
                  value={filters.diff}
                  onChange={(val) => setFilters({ ...filters, diff: val })}
                  options={[{ value: '', label: 'Diff' }, { value: 'Easy', label: 'Easy' }, { value: 'Medium', label: 'Medium' }, { value: 'Hard', label: 'Hard' }]}
                  placeholder="Diff"
                  triggerWidth="w-24"
                  menuWidth="w-32"
                />
              </th>
              <th className="py-3 px-2 w-28 text-center">
                <CustomHeaderSelect
                  value={filters.status}
                  onChange={(val) => setFilters({ ...filters, status: val })}
                  options={[{ value: '', label: 'Status' }, { value: 'Solved', label: 'Solved' }, { value: 'Attempted', label: 'Attempted' }, { value: 'Mastered', label: 'Mastered' }]}
                  placeholder="Status"
                  triggerWidth="w-24"
                  menuWidth="w-32"
                />
              </th>
              <th className="py-3 px-2 w-40 max-w-[180px]">Tags</th>
              <th className="py-3 px-2 w-24">Platforms</th>
              <th className="py-3 px-2 w-28 whitespace-nowrap text-center">
                <CustomHeaderSelect
                  value={dateDisplayType}
                  onChange={(val) => setDateDisplayType(val)}
                  options={[
                    { value: 'added', label: 'Date Added' },
                    { value: 'solved', label: 'Date Solved' },
                    { value: 'mastered', label: 'Mastered' },
                    { value: 'last', label: 'Last Solved' },
                    { value: 'next', label: 'Next Review' },
                  ]}
                  placeholder="Date"
                  triggerWidth="w-24"
                  menuWidth="w-32"
                />
              </th>
              <th className="py-3 px-2 text-right rounded-tr-xl w-20 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-3 px-2">
                  <div className="p-12 text-center text-slate-500 font-mono border border-dashed border-slate-800 rounded-lg">
                    No problems found matching criteria.
                  </div>
                </td>
              </tr>
            ) : (
              filteredProblems.map((problem, index) => (
                <tr key={problem.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 px-2 text-slate-600 font-mono text-xs text-center">{String(index + 1).padStart(3, '0')}</td>
                  <td className="py-3 px-2 text-center">
                    <Tooltip content={problem.starred ? 'Starred' : 'Star Problem'}>
                      <button onClick={() => toggleStar(problem.id)} className="focus:outline-none flex items-center justify-center w-full">
                        <Star size={16} className={`transition-colors ${problem.starred ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]' : 'text-slate-600 hover:text-slate-400'}`} />
                      </button>
                    </Tooltip>
                  </td>
                  <td className="py-3 px-2 max-w-[200px] whitespace-normal">
                    <div className="font-bold text-slate-200 text-sm line-clamp-2 break-words leading-tight" title={problem.name}>{problem.name}</div>
                    {problem.collId && collections.find((collection) => collection.id === problem.collId) && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded flex items-center gap-1.5 text-[10px] font-bold tracking-widest"><FolderHeart size={10} /> {collections.find((collection) => collection.id === problem.collId).name}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 w-28 text-center">
                    <Badge color={problem.diff === 'Easy' ? 'green' : problem.diff === 'Medium' ? 'yellow' : 'red'}>{problem.diff === 'Easy' ? 'E' : problem.diff === 'Medium' ? 'M' : 'H'}</Badge>
                  </td>
                  <td className="py-3 px-2 w-28 text-center">
                    <Badge color={problem.status === 'Solved' ? 'green' : problem.status === 'Mastered' ? 'blue' : 'yellow'}>{problem.status}</Badge>
                  </td>
                  <td className="py-3 px-2 max-w-[180px] whitespace-normal">
                    <div className="flex flex-wrap gap-1.5">
                      {[...problem.tags].sort((a, b) => a.length - b.length).map((tag) => (
                        <span key={tag} className="text-[9px] font-semibold bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded-full border border-sky-500/20 whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 whitespace-normal">
                    <div className="flex flex-wrap gap-1">
                      {problem.platforms && problem.platforms.map((platform, idx) => {
                        const info = getPlatformInfo(platform.platform);
                        return (
                          <a key={idx} href={getRealUrl(problem.name, platform.platform, platform.url)} target="_blank" rel="noreferrer" className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 transition-colors ${info.text}`}>
                            {info.short}
                          </a>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-2 w-28 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap text-center">
                    {dateDisplayType === 'added' && (formatDate(problem.date) || '—')}
                    {dateDisplayType === 'solved' && (
                      problem.status === 'Attempted'
                        ? <span className="text-slate-500 italic text-[11px]">Unsolved</span>
                        : (formatDate(problem.solvedDate || problem.date) || '—')
                    )}
                    {dateDisplayType === 'mastered' && (
                      problem.status === 'Mastered'
                        ? (formatDate(problem.masteredDate || problem.date) || '—')
                        : <span className="text-slate-500 italic text-[11px]">Not Mastered</span>
                    )}
                    {dateDisplayType === 'last' && (
                      formatDate(problem.lastReviewed || problem.solvedDate || (problem.status !== 'Attempted' ? problem.date : null)) || <span className="text-slate-500 italic text-[11px]">Never</span>
                    )}
                    {dateDisplayType === 'next' && (
                      (problem.status === 'Mastered' || problem.noRep)
                        ? <span className="text-sky-400 text-[11px] font-semibold">Mastered</span>
                        : (formatDate(problem.nextRev) || <span className="text-slate-500 italic text-[11px]">None</span>)
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="grid grid-cols-2 gap-1.5 w-max ml-auto">
                      <Tooltip content={problem.notes ? 'Read Notes' : 'Add Notes'}>
                        <button
                          onClick={() => setNoteModal(problem)}
                          className={`p-1.5 border rounded-lg transition-all ${
                            problem.notes
                              ? 'text-slate-500 hover:text-emerald-400 border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10'
                              : 'text-slate-600 hover:text-emerald-400 border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 opacity-70'
                          }`}
                        >
                          <BookOpen size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="View Details">
                        <button onClick={() => setDetailModal(problem)} className="p-1.5 text-slate-500 hover:text-sky-400 border border-slate-700 hover:border-sky-500/50 hover:bg-sky-500/10 rounded-lg transition-all">
                          <Eye size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <button onClick={() => openAddModal(problem.id)} className="p-1.5 text-slate-500 hover:text-amber-400 border border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/10 rounded-lg transition-all">
                          <Pencil size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <button onClick={() => deleteProblem(problem.id)} className="p-1.5 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/10 rounded-lg transition-all">
                          <Trash size={12} />
                        </button>
                      </Tooltip>
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
