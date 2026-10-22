import { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.js';

export default function Shell({ sidebar, topbar, bottomNav, sidebarOpen, onCloseSidebar, children }) {
  const containerRef = useRef(null);
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const canPull = useRef(false);

  const PULL_THRESHOLD = 52;

  const handleTouchStart = (e) => {
    if (isRefreshing) return;
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      canPull.current = true;
    } else {
      canPull.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (!canPull.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    if (diff > 0 && containerRef.current?.scrollTop <= 0) {
      // Damped pull distance
      const pull = Math.min(75, Math.pow(diff, 0.85));
      setPullY(pull);
    } else {
      setPullY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!canPull.current || isRefreshing) return;
    canPull.current = false;

    if (pullY >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      triggerHaptic(20);
      setPullY(42);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      setPullY(0);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[35] md:hidden animate-in fade-in duration-200"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      {sidebar}

      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative">
        {topbar}

        {/* Pull To Refresh Indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-150 flex items-center justify-center"
          style={{
            top: pullY > 0 ? `${Math.min(pullY + 6, 52)}px` : '-48px',
            opacity: pullY > 10 ? Math.min(1, pullY / 30) : 0,
          }}
        >
          <div className="bg-slate-900/95 border border-sky-500/30 text-sky-400 px-3 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center gap-2 text-xs font-semibold select-none">
            <RefreshCw
              size={13}
              className={`transition-transform duration-75 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`}
              style={!isRefreshing ? { transform: `rotate(${pullY * 4.5}deg)` } : undefined}
            />
            <span className="text-[11px] tracking-wide">
              {isRefreshing
                ? 'Reloading...'
                : pullY >= PULL_THRESHOLD
                ? 'Release to reload'
                : 'Pull down to reload'}
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => setPullY(0)}
          className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 pb-20 md:pb-8 overscroll-contain transition-transform"
          style={{
            transform: pullY > 0 ? `translateY(${pullY * 0.4}px)` : undefined,
          }}
        >
          {children}
        </div>
        {bottomNav}
      </main>
    </div>
  );
}
