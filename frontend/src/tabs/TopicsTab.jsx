import { useMemo } from 'react';
import Badge from '../components/ui/Badge.jsx';
import { ArrowLeft, Pencil } from 'lucide-react';

export default function TopicsTab({ active, problems, selectedTopic, setSelectedTopic, formatDate, openAddModal }) {
  const sortedTopics = useMemo(() => {
    const topicStats = {};
    problems.forEach((problem) => {
      if (Array.isArray(problem.tags)) {
        problem.tags.forEach((tag) => {
          if (!topicStats[tag]) topicStats[tag] = { total: 0, Easy: 0, Medium: 0, Hard: 0 };
          topicStats[tag].total += 1;
          topicStats[tag][problem.diff] = (topicStats[tag][problem.diff] || 0) + 1;
        });
      }
    });
    return Object.entries(topicStats).sort((a, b) => b[1].total - a[1].total);
  }, [problems]);

  if (!active) return null;

  if (selectedTopic) {
    const list = problems.filter((problem) => problem.tags.includes(selectedTopic));
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Topic:</span>
              <span className="text-sky-500 dark:text-sky-400">{selectedTopic}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{list.length} problems</p>
          </div>
          <button
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/60 shadow-sm overflow-hidden">
          {list.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-sm">
              No problems found under this topic.
            </div>
          ) : (
            list.map((problem) => (
              <div key={problem.id} className="p-3.5 sm:p-4 flex justify-between items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 dark:text-slate-200 text-sm truncate">{problem.name}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Badge color={problem.diff === 'Easy' ? 'green' : problem.diff === 'Medium' ? 'yellow' : 'red'}>
                      {problem.diff}
                    </Badge>
                    <span>•</span>
                    <span>{formatDate(problem.date)}</span>
                  </div>
                </div>
                <button
                  onClick={() => openAddModal(problem.id)}
                  className="p-2 text-slate-400 hover:text-sky-400 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors shrink-0"
                  title="Edit Problem"
                >
                  <Pencil size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 animate-in fade-in">
      {sortedTopics.length ? sortedTopics.map(([tag, stats]) => (
        <div
          key={tag}
          onClick={() => setSelectedTopic(tag)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-xl hover:border-sky-500/50 transition-all cursor-pointer group shadow-sm hover:shadow-md active:scale-95"
        >
          <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-300 truncate group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{tag}</h3>
          <p className="text-sky-500 text-2xl sm:text-3xl font-black mt-2 sm:mt-3">{stats.total}</p>
          <div className="flex gap-2 mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="text-emerald-500 font-bold">E:{stats.Easy || 0}</span>
            <span className="text-amber-500 font-bold">M:{stats.Medium || 0}</span>
            <span className="text-rose-500 font-bold">H:{stats.Hard || 0}</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-widest mt-1">Problems</p>
        </div>
      )) : (
        <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono text-sm">
          No topics added yet.
        </p>
      )}
    </div>
  );
}
