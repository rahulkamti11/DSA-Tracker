export default function Topbar({ children }) {
  return (
    <header className="h-14 md:h-[73px] flex items-center justify-between px-3 md:px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30 shrink-0">
      {children}
    </header>
  );
}
