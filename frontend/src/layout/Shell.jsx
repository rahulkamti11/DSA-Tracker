export default function Shell({ sidebar, topbar, bottomNav, sidebarOpen, onCloseSidebar, children }) {
  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-35 md:hidden animate-in fade-in duration-200"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      {sidebar}

      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative">
        {topbar}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 pb-20 md:pb-8 overscroll-contain">
          {children}
        </div>
        {bottomNav}
      </main>
    </div>
  );
}
