import { useMemo } from 'react';

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
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Topic: {selectedTopic}</h3>
            <p className="text-sm text-slate-400">{list.length} problems</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedTopic(null)} className="text-slate-400 bg-slate-800 px-3 py-2 rounded-lg">Back</button>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          {list.map((problem) => (
            <div key={problem.id} className="p-3 border-b last:border-b-0 border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-200">{problem.name}</div>
                <div className="text-xs text-slate-400">{problem.diff} • {formatDate(problem.date)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openAddModal(problem.id)} className="text-sky-400">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in">
      {sortedTopics.length ? sortedTopics.map(([tag, stats]) => (
        <div key={tag} onClick={() => setSelectedTopic(tag)} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-sky-500/50 transition-colors cursor-pointer group shadow-lg">
          <h3 className="font-semibold text-slate-300 truncate group-hover:text-sky-400 transition-colors">{tag}</h3>
          <p className="text-sky-500 text-3xl font-black mt-3">{stats.total}</p>
          <div className="flex gap-2 mt-3 text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400">E: {stats.Easy || 0}</span>
            <span className="text-amber-400">M: {stats.Medium || 0}</span>
            <span className="text-rose-400">H: {stats.Hard || 0}</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mt-1">Problems</p>
        </div>
      )) : <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono">No topics added yet.</p>}
    </div>
  );
}
