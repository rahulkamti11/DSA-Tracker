export default function Shell({ sidebar, topbar, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      {sidebar}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {topbar}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 overscroll-contain">
          {children}
        </div>
      </main>
    </div>
  );
}
