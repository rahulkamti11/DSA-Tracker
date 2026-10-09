import { Eye, Pencil, Star, X } from 'lucide-react';
import { CompactLanguageSelect, CustomFormPlatformSelect, CustomSelect } from '../ui/Selects.jsx';

export default function ProblemFormDialog({
  open,
  probModalId,
  onClose,
  saveProblem,
  probForm,
  setProbForm,
  addFormTab,
  setAddFormTab,
  notesTab,
  setNotesTab,
  collections,
  formatDate,
  addDays,
  today,
  insertFormatting,
  parseMd,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[3px] z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl h-[650px] max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/60 rounded-t-2xl relative shrink-0">
          <h2 className="text-xl font-bold text-slate-200 shrink-0">{probModalId ? 'Edit Problem' : 'Add Problem'}</h2>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-slate-950 border border-slate-800 rounded-full p-1 gap-1">
            {[
              { id: 'details', label: 'Details' },
              { id: 'notes', label: 'Notes' },
              { id: 'code', label: 'Code' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAddFormTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  addFormTab === tab.id
                    ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
            {addFormTab !== 'code' && (
              <button
                type="button"
                onClick={() => {
                  if (addFormTab === 'details') setAddFormTab('notes');
                  else if (addFormTab === 'notes') setAddFormTab('code');
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                Next &rarr;
              </button>
            )}
            <button
              type="submit"
              form="problem-form"
              className="px-5 py-2 text-xs font-black text-slate-950 bg-sky-500 hover:bg-sky-400 rounded-lg transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] animate-in fade-in"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-all border border-rose-500/30 flex items-center justify-center"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form id="problem-form" onSubmit={saveProblem} className="flex-1 p-6 flex flex-col overflow-hidden bg-slate-900 rounded-b-2xl">
          {addFormTab === 'details' && (
            <div className="space-y-5 animate-in fade-in duration-250 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="col-span-3">
                  <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Problem Name *</label>
                  <input
                    value={probForm.name}
                    onChange={(e) => setProbForm({ ...probForm, name: e.target.value })}
                    required
                    placeholder="e.g. Valid Anagram"
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Bookmark</label>
                  <div className="flex items-center justify-between bg-slate-950 border border-slate-800 px-4 rounded-xl h-[46px]">
                    <Star size={16} className={probForm.starred ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]' : 'text-slate-600'} />
                    <button
                      type="button"
                      onClick={() => setProbForm({ ...probForm, starred: !probForm.starred })}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0 ${
                        probForm.starred ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          probForm.starred ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <CustomSelect
                  value={probForm.diff}
                  onChange={(value) => setProbForm({ ...probForm, diff: value })}
                  options={[
                    { value: 'Easy', label: 'Easy' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Hard', label: 'Hard' },
                  ]}
                  label="Difficulty"
                />
                <CustomSelect
                  value={probForm.status}
                  onChange={(status) => setProbForm((prev) => ({
                    ...prev,
                    status,
                    reminderInDays: status === 'Mastered' ? -2 : (prev.reminderInDays === -2 ? 3 : prev.reminderInDays),
                  }))}
                  options={[
                    { value: 'Solved', label: 'Solved' },
                    { value: 'Attempted', label: 'Attempted' },
                    { value: 'Mastered', label: 'Mastered' },
                  ]}
                  label="Status"
                />
                <CustomSelect
                  value={probForm.collId}
                  onChange={(value) => setProbForm({ ...probForm, collId: value })}
                  options={[
                    { value: '', label: 'None' },
                    ...collections.map((collection) => ({ value: collection.id, label: collection.name })),
                  ]}
                  label="Collection"
                />
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Date Solved/Added</label>
                  <input
                    type="date"
                    value={probForm.date}
                    onChange={(e) => setProbForm({ ...probForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors h-[46px] font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="col-span-2">
                  <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Tags (Comma separated) *</label>
                  <input
                    value={probForm.tags}
                    onChange={(e) => setProbForm({ ...probForm, tags: e.target.value })}
                    required
                    placeholder="e.g. Arrays, Sorting, Hash Table"
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors font-mono text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">Next Reminder</label>
                    {probForm.reminderInDays !== -1 && probForm.reminderInDays !== -2 && (
                      <span className="text-[9px] font-mono text-sky-400 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                        {formatDate(addDays(probForm.date || today(), probForm.reminderInDays))}
                      </span>
                    )}
                  </div>
                  <CustomSelect
                    value={probForm.reminderInDays}
                    onChange={(value) => {
                      const reminderInDays = Number(value);
                      setProbForm((prev) => ({
                        ...prev,
                        reminderInDays,
                        status: reminderInDays === -2 ? 'Mastered' : (prev.status === 'Mastered' ? 'Solved' : prev.status),
                      }));
                    }}
                    options={[
                      { value: 1, label: '1 Day' },
                      { value: 2, label: '2 Days' },
                      { value: 3, label: '3 Days (Default)' },
                      { value: 7, label: '7 Days' },
                      { value: 14, label: '14 Days' },
                      { value: 30, label: '30 Days' },
                      { value: 60, label: '60 Days' },
                      { value: -1, label: "Don't Repeat" },
                      { value: -2, label: 'Mastered' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">Problem/Platform Links</label>
                  <button
                    type="button"
                    onClick={() => setProbForm({ ...probForm, platforms: [...probForm.platforms, { platform: 'LeetCode', url: '' }] })}
                    className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-3 mt-2">
                  {probForm.platforms.length === 0 ? (
                    <div className="text-xs text-slate-600 font-mono italic py-4 border border-dashed border-slate-800 rounded-xl text-center">
                      No platform links added yet. Click "+ Add Link" to register a URL.
                    </div>
                  ) : (
                    probForm.platforms.map((platform, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 items-center animate-in slide-in-from-left-2">
                        <div className="col-span-1">
                          <CustomFormPlatformSelect
                            value={platform.platform}
                            onChange={(nextPlatform) => {
                              const updatedPlatforms = [...probForm.platforms];
                              updatedPlatforms[index].platform = nextPlatform;
                              setProbForm({ ...probForm, platforms: updatedPlatforms });
                            }}
                          />
                        </div>
                        <div className="col-span-3 flex gap-2 items-center">
                          <input
                            placeholder="https://..."
                            className="flex-1 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300 text-xs outline-none focus:border-sky-500 transition-colors font-mono h-[38px]"
                            value={platform.url}
                            onChange={(e) => {
                              const updatedPlatforms = [...probForm.platforms];
                              updatedPlatforms[index].url = e.target.value;
                              setProbForm({ ...probForm, platforms: updatedPlatforms });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setProbForm({ ...probForm, platforms: probForm.platforms.filter((_, itemIndex) => itemIndex !== index) })}
                            className="p-2.5 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors shrink-0"
                            title="Cancel Platform Link"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {addFormTab === 'notes' && (
            <div className="animate-in fade-in duration-250 flex-1 flex flex-col overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1">
                <div className="p-3 bg-slate-100/90 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                  <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 tracking-widest mb-3 uppercase font-bold">Notes / Approach (Markdown Supported)</div>

                  <div className="flex justify-between items-center mb-1 gap-2 flex-wrap bg-white dark:bg-slate-950/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full p-0.5 gap-0.5">
                      <button type="button" onClick={() => insertFormatting('**', '**')} className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-full text-xs font-serif font-bold transition-colors" title="Bold">B</button>
                      <button type="button" onClick={() => insertFormatting('*', '*')} className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-full text-xs font-serif italic transition-colors" title="Italic">I</button>
                      <button type="button" onClick={() => insertFormatting('`', '`')} className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-full text-xs font-mono transition-colors" title="Inline Code">`c`</button>
                      <button type="button" onClick={() => insertFormatting('`' + '``\n', '\n`' + '``')} className="px-2.5 h-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-mono transition-colors" title="Code Block">Block</button>
                      <button type="button" onClick={() => insertFormatting('- ')} className="px-2.5 h-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-full text-[10px] transition-colors gap-0.5" title="List item"><span className="text-sm font-bold">•</span> List</button>
                      <button type="button" onClick={() => insertFormatting('## ')} className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold transition-colors" title="Header 2">H2</button>
                      <button type="button" onClick={() => insertFormatting('**Time:** O(n) | **Space:** O(1)')} className="px-2.5 h-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold transition-colors" title="Time & Space complexity">T/S</button>
                    </div>

                    <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full p-0.5 gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setNotesTab('write')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          notesTab === 'write'
                            ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <Pencil size={11} /> Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotesTab('preview')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          notesTab === 'preview'
                            ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <Eye size={11} /> Preview
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
                  {notesTab === 'write' ? (
                    <textarea
                      id="notes-editor"
                      value={probForm.notes}
                      onChange={(e) => setProbForm({ ...probForm, notes: e.target.value })}
                      className="w-full h-full min-h-[200px] bg-transparent resize-none outline-none text-[13px] text-slate-800 dark:text-slate-300 font-mono leading-relaxed placeholder-slate-400 dark:placeholder-slate-700"
                      placeholder="## Approach...&#10;Use **sliding window**..."
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none text-slate-800 dark:text-slate-300 font-mono text-[13px] leading-relaxed dark:prose-invert" dangerouslySetInnerHTML={{ __html: parseMd(probForm.notes) || '<span class="text-slate-400 dark:text-slate-600 italic">Nothing to preview.</span>' }} />
                  )}
                </div>
              </div>
            </div>
          )}

          {addFormTab === 'code' && (
            <div className="animate-in fade-in duration-250 space-y-3 flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center shrink-0">
                <div className="border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/30 px-3 rounded-lg text-[10px] font-mono tracking-widest text-slate-600 dark:text-slate-400 uppercase flex items-center h-[32px]">Code Section</div>
                <CompactLanguageSelect
                  value={probForm.language || 'cpp'}
                  onChange={(value) => setProbForm({ ...probForm, language: value })}
                />
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 flex-1 flex flex-col shadow-sm">
                <textarea
                  value={probForm.code || ''}
                  onChange={(e) => setProbForm({ ...probForm, code: e.target.value })}
                  placeholder="// Paste your code here..."
                  className="w-full h-full min-h-[200px] p-4 bg-transparent text-slate-800 dark:text-slate-300 font-mono text-xs outline-none resize-none leading-relaxed custom-scrollbar flex-1 placeholder-slate-400 dark:placeholder-slate-700"
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
