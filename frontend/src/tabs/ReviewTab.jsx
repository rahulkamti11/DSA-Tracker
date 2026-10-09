import { useMemo } from 'react';
import Badge from '../components/ui/Badge.jsx';
import { today } from '../utils/date.js';

export default function ReviewTab({ active, reviewTab, setReviewTab, problems, markReviewed, setRemModal }) {
  const srsProblems = useMemo(() => problems.filter(p => p.status === 'Solved' || p.status === 'Attempted'), [problems]);
  const todayStr = today();
  const dueToday = useMemo(() => srsProblems.filter(p => p.nextRev === todayStr && !p.noRep).sort((a, b) => new Date(a.nextRev) - new Date(b.nextRev)), [srsProblems, todayStr]);
  const overDue = useMemo(() => srsProblems.filter(p => p.nextRev < todayStr && !p.noRep).sort((a, b) => new Date(a.nextRev) - new Date(b.nextRev)), [srsProblems, todayStr]);
  const allUpcoming = useMemo(() => srsProblems.filter(p => p.nextRev > todayStr && !p.noRep).sort((a, b) => new Date(a.nextRev) - new Date(b.nextRev)), [srsProblems, todayStr]);

  if (!active) return null;


  const currentList = reviewTab === 'dueToday' ? dueToday : reviewTab === 'overDue' ? overDue : allUpcoming;
  const headingMap = {
    dueToday: { title: `${dueToday.length} Due Today`, emoji: '🧠', text: 'Spaced repetition queue. Complete these tasks today.' },
    overDue: { title: `${overDue.length} Overdue Reviews`, emoji: '🚨', text: 'Catch up on missed reviews to lock in your memory.' },
    upcoming: { title: `${allUpcoming.length} Upcoming Reviews`, emoji: '📅', text: 'Upcoming scheduled reviews. Stay ahead of your game.' },
  };
  const activeHeader = headingMap[reviewTab] || headingMap.dueToday;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-5 shadow-lg">
        <span className="text-4xl drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">{activeHeader.emoji}</span>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200">{activeHeader.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activeHeader.text}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {[
          { id: 'dueToday', label: 'Due Today', count: dueToday.length, activeColor: 'text-sky-500 dark:text-sky-400 border-sky-500', badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
          { id: 'overDue', label: 'Over Due', count: overDue.length, activeColor: 'text-rose-500 dark:text-rose-400 border-rose-500', badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
          { id: 'upcoming', label: 'Upcoming', count: allUpcoming.length, activeColor: 'text-amber-500 dark:text-amber-400 border-amber-500', badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
        ].map((tab) => {
          const isActive = reviewTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setReviewTab(tab.id)}
              className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 relative -mb-[2px] ${
                isActive ? `${tab.activeColor} border-current` : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono border font-bold ${
                isActive ? tab.badgeColor : 'bg-slate-100 dark:bg-slate-950/40 text-slate-500 dark:text-slate-600 border-slate-200 dark:border-slate-800/40'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {currentList.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500 font-mono bg-slate-50/50 dark:bg-slate-900/10">
            No questions in this section.
          </div>
        ) : (
          currentList.map((problem) => (
            <div key={problem.id} className={`bg-white dark:bg-slate-900 border rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all hover:shadow-lg ${
              problem.nextRev < today() ? 'border-rose-500/30 hover:border-rose-500/50' : problem.nextRev === today() ? 'border-blue-500/30 hover:border-blue-500/50' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">{problem.name}</h3>
                  {problem.nextRev < today() ? (
                    <Badge color="red">Overdue</Badge>
                  ) : problem.nextRev === today() ? (
                    <Badge color="blue">Today</Badge>
                  ) : (
                    <Badge color="yellow">In {Math.ceil((new Date(problem.nextRev) - new Date(today())) / (1000 * 60 * 60 * 24))} days</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-2">Level: <span className="text-slate-700 dark:text-slate-300">{problem.revCount}</span> | Tags: <span className="text-sky-500 dark:text-sky-400/80">{problem.tags.join(', ')}</span></p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                {problem.nextRev <= today() && (
                  <button onClick={() => markReviewed(problem.id)} className="flex-1 md:flex-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-500/20 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]">✓ Marked Done</button>
                )}
                <button onClick={() => setRemModal({ open: true, id: problem.id })} className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">⏰ Change Date</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
