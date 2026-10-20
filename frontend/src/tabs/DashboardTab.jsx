import { useMemo } from 'react';
import { Activity, Target, RotateCcw, ListTodo } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import { today, addDays } from '../utils/date.js';

export default function DashboardTab({
  active,
  problems,
  activity,
  setView,
  setReviewTab,
}) {
  const todayStr = today();

  const { solved, due, upcoming, overDue, diffCounts } = useMemo(() => {
    const solvedList = problems.filter(p => p.status === 'Solved' || p.status === 'Mastered');
    const srs = problems.filter(p => p.status === 'Solved' || p.status === 'Attempted');
    const dueList = srs.filter(p => p.nextRev && p.nextRev <= todayStr && !p.noRep).sort((a, b) => new Date(a.nextRev) - new Date(b.nextRev));
    const upcomingList = srs.filter(p => p.nextRev && p.nextRev > todayStr && p.nextRev <= addDays(todayStr, 7) && !p.noRep).sort((a, b) => new Date(a.nextRev) - new Date(b.nextRev));
    const overDueList = srs.filter(p => p.nextRev && p.nextRev < todayStr && !p.noRep).sort((a, b) => new Date(a.nextRev) - new Date(b.nextRev));
    const counts = {
      Easy: solvedList.filter(p => p.diff === 'Easy').length,
      Medium: solvedList.filter(p => p.diff === 'Medium').length,
      Hard: solvedList.filter(p => p.diff === 'Hard').length
    };
    return {
      solved: solvedList,
      due: dueList,
      upcoming: upcomingList,
      overDue: overDueList,
      diffCounts: counts
    };
  }, [problems, todayStr]);

  if (!active) return null;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-slate-900 p-3.5 sm:p-5 rounded-xl border border-slate-800 border-t-sky-500 border-t-2 shadow-xs">
          <p className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-mono">Total Solved</p>
          <p className="text-2xl sm:text-3xl font-black text-sky-400 mt-1 sm:mt-2">{solved.length}</p>
        </div>
        <div className="bg-slate-900 p-3.5 sm:p-5 rounded-xl border border-slate-800 border-t-emerald-500 border-t-2 shadow-xs">
          <p className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-mono">Solved Today</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 sm:mt-2">
            {problems.filter((problem) => problem.date === today() && problem.status === 'Solved').length}
          </p>
        </div>
        <div className="bg-slate-900 p-3.5 sm:p-5 rounded-xl border border-slate-800 border-t-amber-500 border-t-2 shadow-xs">
          <p className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-mono">Due Reviews</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 sm:mt-2">{due.length}</p>
        </div>
        <div className="bg-slate-900 p-3.5 sm:p-5 rounded-xl border border-slate-800 border-t-purple-500 border-t-2 shadow-xs">
          <p className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-mono">Total Logged</p>
          <p className="text-2xl sm:text-3xl font-black text-purple-400 mt-1 sm:mt-2">{problems.length}</p>
        </div>
      </div>

      {/* Middle Row: Heatmap & Distribution */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {(() => {
          const days = [];
          for (let i = 89; i >= 0; i -= 1) {
            const dateValue = addDays(today(), -i);
            days.push({ date: dateValue, count: activity[dateValue] || 0 });
          }

          return (
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-sm sm:text-base text-slate-200 flex items-center gap-2">
                    <Activity size={18} className="text-emerald-400 shrink-0" />
                    <span>Activity Heatmap (90 Days)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono sm:hidden">Swipe &rarr;</span>
                </div>
                <div className="overflow-x-auto pb-2 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="flex flex-col flex-wrap gap-1 h-[108px] min-w-max" style={{ alignContent: 'flex-start' }}>
                    {days.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.count} submissions`}
                        className={`w-3 h-3 rounded-[2px] transition-transform hover:scale-125 hover:z-10 ${
                          day.count === 0
                            ? 'bg-slate-800/50'
                            : day.count < 2
                              ? 'bg-emerald-500/40'
                              : day.count < 4
                                ? 'bg-emerald-500/70'
                                : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-4 text-[10px] font-mono text-slate-500 justify-end">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-800/50" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/70" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
                <span>More</span>
              </div>
            </div>
          );
        })()}

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-6 flex flex-col justify-center shadow-xl">
          <h3 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base text-slate-200 flex items-center gap-2">
            <Target size={18} className="text-sky-400 shrink-0" />
            <span>Difficulty Distribution</span>
          </h3>
          <div className="flex items-center justify-around gap-4 sm:gap-8 w-full">
            <svg viewBox="0 0 36 36" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-2xl shrink-0">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="3" />
              {solved.length > 0 && (
                <>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${(diffCounts.Easy / solved.length) * 100}, 100`} />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${(diffCounts.Medium / solved.length) * 100}, 100`} strokeDashoffset={`-${(diffCounts.Easy / solved.length) * 100}`} />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray={`${(diffCounts.Hard / solved.length) * 100}, 100`} strokeDashoffset={`-${((diffCounts.Easy + diffCounts.Medium) / solved.length) * 100}`} />
                </>
              )}
              <text x="18" y="20.5" className="text-sm font-bold fill-slate-800 dark:fill-slate-100" textAnchor="middle">{solved.length}</text>
            </svg>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm font-mono flex-1 max-w-[150px]">
              <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/50 px-2.5 sm:px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] shrink-0" /> <span className="text-slate-600 dark:text-slate-400 w-10 sm:w-12 font-bold">EASY</span> <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-auto">{diffCounts.Easy}</span></div>
              <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/50 px-2.5 sm:px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] shrink-0" /> <span className="text-slate-600 dark:text-slate-400 w-10 sm:w-12 font-bold">MED</span> <span className="text-amber-600 dark:text-amber-400 font-bold ml-auto">{diffCounts.Medium}</span></div>
              <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/50 px-2.5 sm:px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444] shrink-0" /> <span className="text-slate-600 dark:text-slate-400 w-10 sm:w-12 font-bold">HARD</span> <span className="text-rose-600 dark:text-rose-400 font-bold ml-auto">{diffCounts.Hard}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Lists */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-slate-200 flex items-center gap-2">
              <RotateCcw size={18} className="text-rose-400 shrink-0" />
              <span>Due Reviews ({due.length})</span>
            </h3>
            <button onClick={() => { setView('review'); setReviewTab(overDue.length > 0 ? 'overDue' : 'dueToday'); }} className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1 p-1">view &rarr;</button>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar flex-1">
            {due.length === 0 ? (
              <p className="text-slate-500 text-xs sm:text-sm font-mono border border-dashed border-slate-700/50 p-4 rounded-lg text-center">No reviews due. All caught up! 🎉</p>
            ) : (
              due.map((problem) => (
                <div key={problem.id} onClick={() => { setView('review'); setReviewTab(problem.nextRev < today() ? 'overDue' : 'dueToday'); }} className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-rose-500/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <span className="font-medium text-xs sm:text-sm truncate text-slate-800 dark:text-slate-300 pr-2">{problem.name}</span>
                  <Badge color="red">Due</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-slate-200 flex items-center gap-2">
              <ListTodo size={18} className="text-amber-400 shrink-0" />
              <span>Upcoming Reviews (7 Days) ({upcoming.length})</span>
            </h3>
            <button onClick={() => { setView('review'); setReviewTab('upcoming'); }} className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1 p-1">view &rarr;</button>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar flex-1">
            {upcoming.length === 0 ? (
              <p className="text-slate-500 text-xs sm:text-sm font-mono border border-dashed border-slate-700/50 p-4 rounded-lg text-center">No upcoming reviews for next 7 days.</p>
            ) : (
              upcoming.map((problem) => (
                <div key={problem.id} onClick={() => { setView('review'); setReviewTab('upcoming'); }} className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-sky-500/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <span className="font-medium text-xs sm:text-sm truncate text-slate-800 dark:text-slate-300 pr-2">{problem.name}</span>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">{problem.nextRev}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
