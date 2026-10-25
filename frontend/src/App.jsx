import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  RotateCcw,
  FolderHeart,
  Tags,
  BookOpen,
  Trash2,
  Settings,
  MoreHorizontal,
  Menu,
  X,
  Plus,
  Upload,
  ChevronDown,
  LogIn,
  LogOut,
  Keyboard,
} from 'lucide-react';

import Shell from './layout/Shell.jsx';
import Sidebar from './layout/Sidebar.jsx';
import Topbar from './layout/Topbar.jsx';

import DashboardTab from './tabs/DashboardTab.jsx';
import ProblemsTab from './tabs/ProblemsTab.jsx';
import ReviewTab from './tabs/ReviewTab.jsx';
import TopicsTab from './tabs/TopicsTab.jsx';
import CollectionsTab from './tabs/CollectionsTab.jsx';
import NotesTab from './tabs/NotesTab.jsx';
import RecycleTab from './tabs/RecycleTab.jsx';
import SettingsTab from './tabs/SettingsTab.jsx';
import MoreTab from './tabs/MoreTab.jsx';
import AddProblemTab from './tabs/AddProblemTab.jsx';

import ShortcutDialog from './components/dialogs/ShortcutDialog.jsx';
import AuthDialog from './components/dialogs/AuthDialog.jsx';
import ReminderDialog from './components/dialogs/ReminderDialog.jsx';
import CollectionDialog from './components/dialogs/CollectionDialog.jsx';
import NoteDialog from './components/dialogs/NoteDialog.jsx';
import ConfirmDialog from './components/dialogs/ConfirmDialog.jsx';
import ProblemFormDialog from './components/dialogs/ProblemFormDialog.jsx';
import ProblemDetailDialog from './components/dialogs/ProblemDetailDialog.jsx';

import NavItem from './components/navigation/NavItem.jsx';
import MobileBottomNav from './components/navigation/MobileBottomNav.jsx';
import Tooltip from './components/ui/Tooltip.jsx';
import OfflineToast from './components/ui/OfflineToast.jsx';
import { checkBackendHealth } from './services/api.js';

import useAuth from './hooks/useAuth.js';
import useData from './hooks/useData.js';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts.js';
import useTheme from './hooks/useTheme.js';
import useAnimatedFavicon from './hooks/useAnimatedFavicon.js';

import { today, addDays, formatDate } from './utils/date.js';
import { getPlatformInfo, getRealUrl } from './utils/platform.js';
import { parseMd } from './utils/markdown.js';
import { triggerHaptic } from './utils/haptics.js';

export default function App() {
  useTheme();
  useAnimatedFavicon();
  // Custom Hooks for Auth and Data Services
  const {
    user,
    authModal,
    setAuthModal,
    authMode,
    setAuthMode,
    authError,
    setAuthError,
    syncProgress,
    setSyncProgress,
    handleAuth,
    handleLogout,
    handleUpdateProfile,
    handleDeleteAccount,
  } = useAuth();

  // Backend Connectivity & Offline Detection States
  const [isOffline, setIsOffline] = useState(false);
  const [offlineToastDismissed, setOfflineToastDismissed] = useState(false);

  const {
    problems,
    setProblems,
    collections,
    trash,
    activity,
    saveProblem,
    deleteProblem,
    restoreProblem,
    deletePermanent,
    emptyTrash,
    markReviewed,
    setReminder,
    toggleStar,
    addCollection,
    deleteCollection,
  } = useData(user, setIsOffline);

  // Layout and View States
  const [view, setViewState] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validViews = ['dashboard', 'problems', 'review', 'collections', 'topics', 'notes', 'trash', 'settings', 'more'];
    return validViews.includes(hash) ? hash : 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreSection, setMoreSection] = useState("feedback");
  const setView = (v) => {
    setViewState(v);
    setSidebarOpen(false);
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (window.location.hash.replace('#', '') !== view) {
      window.location.hash = view;
    }
  }, [view]);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    if (!exportOpen) return;
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportOpen]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = ['dashboard', 'problems', 'review', 'collections', 'topics', 'notes', 'trash', 'settings', 'more'];
      if (validViews.includes(hash)) setViewState(hash);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Selection state
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Dialog and Trigger States
  const [shortcutsModal, setShortcutsModal] = useState(false);
  const [remModal, setRemModal] = useState({ open: false, id: null });
  const [selectedInterval, setSelectedInterval] = useState(3);
  const [reviewTab, setReviewTab] = useState('dueToday');
  const [newCollColor, setNewCollColor] = useState('blue');
  const [collModal, setCollModal] = useState(false);
  const [noteModal, setNoteModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    let active = true;
    checkBackendHealth().then((healthy) => {
      if (active) {
        setIsOffline(!healthy);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Add/Edit Problem Dialog States
  const [probModal, setProbModal] = useState({ open: false, id: null });
  const [probForm, setProbForm] = useState({
    name: '',
    diff: 'Medium',
    status: 'Solved',
    tags: '',
    collId: '',
    starred: false,
    notes: '',
    platforms: [],
    code: '',
    language: 'cpp',
    date: '',
  });
  const [notesTab, setNotesTab] = useState('write');
  const [addFormTab, setAddFormTab] = useState('details');

  // Reset view state when changing user
  const [prevUser, setPrevUser] = useState(user?.username);
  if (user?.username !== prevUser) {
    const hadPrevious = Boolean(prevUser);
    setPrevUser(user?.username);
    setSelectedCollection(null);
    setSelectedTopic(null);
    if (hadPrevious) {
      setView('problems');
    }
  }

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onEscape: () => {
      setProbModal({ open: false, id: null });
      setRemModal({ open: false, id: null });
      setNoteModal(null);
      setShortcutsModal(false);
    },
    onN: () => openAddModal(),
    onD: () => setView('dashboard'),
    onP: () => setView('problems'),
    onQuestion: () => setShortcutsModal(true),
  });

  // Modal open handler
  const openAddModal = (id = null, forceTab = false) => {
    if (id) {
      const p = problems.find(x => x.id === id);
      if (p) {
        setProbForm({
          ...p,
          tags: p.tags.join(', '),
          platforms: p.platforms || [],
          reminderInDays: p.status === 'Mastered' ? -2 : p.noRep ? -1 : p.interval || 3,
          code: p.code || '',
          language: p.language || 'cpp',
          date: p.date || today(),
        });
      }
    } else {
      setProbForm({
        name: '',
        diff: 'Medium',
        status: 'Solved',
        tags: '',
        collId: '',
        starred: false,
        notes: '',
        platforms: [{ platform: 'LeetCode', url: '' }],
        reminderInDays: 3,
        code: '',
        language: 'cpp',
        date: today(),
      });
    }
    setNotesTab('write');
    setAddFormTab('details');
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile || forceTab) {
      setProbModal({ open: false, id });
      setView('add');
    } else {
      setProbModal({ open: true, id });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('modal') === 'add') {
      openAddModal();
    } else if (params.get('modal') === 'shortcuts') {
      setShortcutsModal(true);
    }
  }, []);

  const handleLogoutClick = () => {
    setConfirmModal({
      open: true,
      title: 'Log Out',
      message: 'Are you sure you want to log out of your account?',
      confirmText: 'Logout',
      isDestructive: true,
      onConfirm: () => {
        handleLogout();
      },
    });
  };

  // CRUD Handler wraps
  const handleSaveProblem = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    saveProblem(probForm, probModal.id)
      .then(() => {
        setProbModal({ open: false, id: null });
        if (view === 'add') {
          setView('problems');
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteProblem = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return;
    setConfirmModal({
      open: true,
      title: 'Move to Recycle Bin?',
      message: `Are you sure you want to move "${p.name}" to the Recycle Bin?`,
      onConfirm: () => {
        deleteProblem(id);
      },
    });
  };

  const handleDeletePermanent = (id) => {
    const p = trash.find(x => x.id === id);
    if (!p) return;
    setConfirmModal({
      open: true,
      title: 'Delete Permanently?',
      message: `This action cannot be undone. Are you sure you want to delete "${p.name}" forever?`,
      onConfirm: () => {
        deletePermanent(id);
      },
    });
  };

  const handleEmptyTrash = () => {
    setConfirmModal({
      open: true,
      title: 'Empty Recycle Bin?',
      message: 'All items currently in the Recycle Bin will be permanently deleted. This action is irreversible.',
      onConfirm: () => {
        emptyTrash();
      },
    });
  };

  const handleMarkReviewed = (id) => {
    markReviewed(id)
      .then(() => {
        const p = problems.find(x => x.id === id);
        if (p) {
          setSelectedInterval(p.noRep ? -1 : p.interval || 3);
        }
        setRemModal({ open: true, id });
      })
      .catch(err => console.error(err));
  };

  const handleSetReminder = (days) => {
    setReminder(remModal.id, days)
      .then(() => {
        setRemModal({ open: false, id: null });
      })
      .catch(err => console.error(err));
  };

  const exportJSON = () => {
    const data = { problems, collections, trash, activity };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsa_tracker_export.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Difficulty', 'Status', 'Tags', 'Date', 'Next Review', 'Reviews', 'Starred'];
    const rows = problems.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      p.diff,
      p.status,
      `"${p.tags.join(', ')}"`,
      p.date,
      p.nextRev || '',
      p.revCount,
      p.starred,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsa_tracker_export.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const insertFormatting = (before, after = '') => {
    const ta = document.getElementById('notes-editor');
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = probForm.notes;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    setProbForm({ ...probForm, notes: newText });
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Nav side badge counts
  const srsProblems = problems.filter(p => p.status === 'Solved' || p.status === 'Attempted');
  const dueCount = srsProblems.filter(p => p.nextRev <= today() && !p.noRep).length;

  const reminderProblem = remModal.open ? problems.find(x => x.id === remModal.id) : null;

  return (
    <>
      <Shell
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        bottomNav={(
          <MobileBottomNav
            view={view}
            setView={(v) => {
              setProbModal({ open: false, id: null });
              setView(v);
              setSidebarOpen(false);
            }}
            dueCount={dueCount}
            trashCount={trash.length}
            isAddOpen={probModal.open || view === 'add'}
            onAddProblem={() => {
              openAddModal(null, true);
            }}
          />
        )}
        sidebar={(
          <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarOpen={sidebarOpen}>
            <div className={`h-[73px] flex items-center border-b border-slate-200 dark:border-slate-800 transition-all duration-300 shrink-0 ${
              sidebarCollapsed ? 'justify-center px-2' : 'px-3'
            }`}>
              {sidebarCollapsed ? (
                <Tooltip content="Expand sidebar" className="relative flex w-full justify-center">
                  <button
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center font-mono font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-xs mx-auto cursor-pointer"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    title="Expand sidebar"
                  >
                    &lt;/&gt;
                  </button>
                </Tooltip>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <Tooltip content="Collapse sidebar">
                      <button
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 font-mono font-bold text-xs flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer ml-0.5"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title="Collapse sidebar"
                      >
                        &lt;/&gt;
                      </button>
                    </Tooltip>
                    <span className="text-[21px] font-black tracking-wide text-slate-900 dark:text-slate-100 uppercase truncate">
                      DSA TRACKER
                    </span>
                  </div>
                  <button className="md:hidden text-slate-400 hover:text-slate-200 p-1 cursor-pointer" onClick={() => setSidebarOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
            <nav className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
              <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" active={view === 'dashboard'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
              <NavItem id="problems" icon={ListTodo} label="Problem Log" active={view === 'problems'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
              <NavItem id="review" icon={RotateCcw} label="Review Queue" alert={dueCount} active={view === 'review'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
              <NavItem id="collections" icon={FolderHeart} label="Collections" active={view === 'collections'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
              <NavItem id="topics" icon={Tags} label="Topics" active={view === 'topics'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
              <NavItem id="notes" icon={BookOpen} label="Notes" active={view === 'notes'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <NavItem id="trash" icon={Trash2} label="Recycle Bin" alert={trash.length} active={view === 'trash'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
                <NavItem id="settings" icon={Settings} label="Settings" active={view === 'settings'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
                <NavItem id="more" icon={MoreHorizontal} label="More" active={view === 'more'} sidebarCollapsed={sidebarCollapsed} onClick={setView} />
              </div>
            </nav>

            {/* Guest Mode UI at bottom of sidebar */}
            {(!user || user.isGuest) && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100/60 dark:bg-slate-900/60">
                {sidebarCollapsed ? (
                  <Tooltip content="Guest Mode (Login to save progress)" className="relative flex w-full justify-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 font-black text-sm shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">
                      G
                    </div>
                  </Tooltip>
                ) : (
                  <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl flex flex-col items-center gap-1.5 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 relative">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -left-3.5"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute -left-[11px]"></span>
                      <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Guest Mode</span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 text-center leading-normal">Login to save progress</span>
                  </div>
                )}
              </div>
            )}
          </Sidebar>
        )}
        topbar={(
          <Topbar>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="md:hidden text-base font-black tracking-wider uppercase text-slate-100 font-sans">
                DSA TRACKER
              </span>
              <h2 className="hidden md:block text-lg font-bold capitalize truncate text-slate-800 dark:text-slate-100">{view.replace('-', ' ')}</h2>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
              <Tooltip content="Keyboard Shortcuts">
                <button onClick={() => setShortcutsModal(true)} className="hidden sm:flex text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors"><Keyboard size={18}/></button>
              </Tooltip>
              
              <div className="relative" ref={exportRef}>
                <button onClick={() => setExportOpen(!exportOpen)} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors border border-slate-300 dark:border-slate-700/50"><Upload size={14} className="sm:w-4 sm:h-4"/><span className="hidden sm:inline">Export</span><ChevronDown size={13} className={exportOpen ? 'rotate-180 transition-transform' : 'transition-transform'}/></button>
                {exportOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                    <button onClick={() => { exportJSON(); setExportOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors">Export JSON</button>
                    <button onClick={() => { exportCSV(); setExportOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors">Export CSV</button>
                  </div>
                )}
              </div>

              <button onClick={() => openAddModal()} className="hidden md:flex bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm items-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] cursor-pointer"><Plus size={16} /><span>Add Problem</span></button>
              
              {(!user || user.isGuest) ? 
                <button onClick={() => setAuthModal(true)} className="flex items-center gap-1.5 text-xs sm:text-sm text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-sky-500/20 active:scale-95 transition-colors cursor-pointer"><LogIn size={15}/> <span className="hidden sm:inline">Login / Register</span><span className="sm:hidden font-semibold">Login</span></button> :
                <button onClick={handleLogoutClick} className="flex items-center gap-1.5 text-xs sm:text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-rose-500/20 active:scale-95 transition-colors cursor-pointer"><LogOut size={15}/> <span className="hidden sm:inline">Logout</span></button>
              }
            </div>
          </Topbar>
        )}
      >
        <DashboardTab
          active={view === 'dashboard'}
          problems={problems}
          activity={activity}
          setView={setView}
          setReviewTab={setReviewTab}
        />

        <ProblemsTab
          active={view === 'problems'}
          problems={problems}
          collections={collections}
          toggleStar={toggleStar}
          openAddModal={openAddModal}
          deleteProblem={handleDeleteProblem}
          setNoteModal={setNoteModal}
          setDetailModal={setDetailModal}
        />

        <ReviewTab
          active={view === 'review'}
          reviewTab={reviewTab}
          setReviewTab={setReviewTab}
          problems={problems}
          markReviewed={handleMarkReviewed}
          setRemModal={setRemModal}
        />

        <TopicsTab active={view === 'topics'} problems={problems} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} formatDate={formatDate} openAddModal={openAddModal} />

        <CollectionsTab
          active={view === 'collections'}
          collections={collections}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          problems={problems}
          toggleStar={toggleStar}
          openAddModal={openAddModal}
          user={user}
          setProblems={setProblems}
          setConfirmModal={setConfirmModal}
          deleteCollection={deleteCollection}
          setNewCollColor={setNewCollColor}
          setCollModal={setCollModal}
        />

        {/* VIEW: NOTES */}
        <NotesTab active={view === 'notes'} problems={problems} setNoteModal={setNoteModal} />

        {/* VIEW: TRASH */}
        <RecycleTab active={view === 'trash'} trash={trash} emptyTrash={handleEmptyTrash} restoreProblem={restoreProblem} deletePermanent={handleDeletePermanent} />

        {/* VIEW: SETTINGS */}
        <SettingsTab
          key={user?.username || 'guest'}
          active={view === 'settings'}
          user={user}
          onUpdateProfile={handleUpdateProfile}
          onDeleteAccount={handleDeleteAccount}
          openAuthModal={() => setAuthModal(true)}
        />

        {/* VIEW: MORE (Privacy, Legal, Feedback, Contact) */}
        <MoreTab active={view === 'more'} user={user} initialSection={moreSection} openAuthModal={() => setAuthModal(true)} />

        {/* VIEW: ADD PROBLEM (Mobile Tab & View) */}
        <AddProblemTab
          active={view === 'add'}
          probModalId={probModal.id}
          onCancel={() => setView('problems')}
          saveProblem={handleSaveProblem}
          probForm={probForm}
          setProbForm={setProbForm}
          addFormTab={addFormTab}
          setAddFormTab={setAddFormTab}
          notesTab={notesTab}
          setNotesTab={setNotesTab}
          collections={collections}
          formatDate={formatDate}
          addDays={addDays}
          today={today}
          insertFormatting={insertFormatting}
          parseMd={parseMd}
        />
      </Shell>



      <ProblemFormDialog
        open={probModal.open}
        probModalId={probModal.id}
        onClose={() => setProbModal({ open: false, id: null })}
        saveProblem={handleSaveProblem}
        probForm={probForm}
        setProbForm={setProbForm}
        addFormTab={addFormTab}
        setAddFormTab={setAddFormTab}
        notesTab={notesTab}
        setNotesTab={setNotesTab}
        collections={collections}
        formatDate={formatDate}
        addDays={addDays}
        today={today}
        insertFormatting={insertFormatting}
        parseMd={parseMd}
      />

      <ShortcutDialog open={shortcutsModal} onClose={() => setShortcutsModal(false)} />
      <AuthDialog
        open={authModal}
        onClose={() => setAuthModal(false)}
        handleAuth={handleAuth}
        authMode={authMode}
        setAuthMode={setAuthMode}
        setAuthError={setAuthError}
        authError={authError}
        syncProgress={syncProgress}
        setSyncProgress={setSyncProgress}
        onNavigateToLegal={(section) => {
          setMoreSection(section);
          setView('more');
        }}
      />
      <ReminderDialog
        open={remModal.open}
        problem={reminderProblem}
        selectedInterval={selectedInterval}
        setSelectedInterval={setSelectedInterval}
        onClose={() => setRemModal({ open: false, id: null })}
        onConfirm={handleSetReminder}
        formatDate={formatDate}
        addDays={addDays}
        today={today}
      />
      <CollectionDialog
        open={collModal}
        onClose={() => setCollModal(false)}
        newCollColor={newCollColor}
        setNewCollColor={setNewCollColor}
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const description = e.target.description.value;
          const color = newCollColor;
          addCollection(name, description, color)
            .then(() => {
              setCollModal(false);
            });
        }}
      />
      <NoteDialog noteModal={noteModal} onClose={() => setNoteModal(null)} parseMd={parseMd} openAddModal={openAddModal} />
      <ConfirmDialog confirmModal={confirmModal} setConfirmModal={setConfirmModal} />
      <ProblemDetailDialog
        detailModal={detailModal}
        onClose={() => setDetailModal(null)}
        openAddModal={openAddModal}
        collections={collections}
        formatDate={formatDate}
        parseMd={parseMd}
        getPlatformInfo={getPlatformInfo}
        getRealUrl={getRealUrl}
      />

      {isOffline && !offlineToastDismissed && (
        <OfflineToast onClose={() => setOfflineToastDismissed(true)} />
      )}
    </>
  );
}
