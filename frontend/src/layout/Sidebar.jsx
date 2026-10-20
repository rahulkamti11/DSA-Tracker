export default function Sidebar({ children, sidebarCollapsed, sidebarOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out md:translate-x-0 md:relative flex flex-col h-[100dvh] overflow-hidden shadow-2xl md:shadow-none w-72 max-w-[85vw] ${
        sidebarCollapsed ? 'md:w-20' : 'md:w-60'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {children}
    </aside>
  );
}
