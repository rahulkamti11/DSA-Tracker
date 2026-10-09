import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({ children, content, className = 'relative inline-flex' }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);
  const timerRef = useRef(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    
    // Check if there is enough space above (need ~40px)
    const showBelow = rect.top < 45;
    
    const top = showBelow ? rect.bottom + 6 : rect.top - 6;
    const left = Math.max(20, Math.min(window.innerWidth - 20, rect.left + rect.width / 2));
    
    setCoords({
      top,
      left,
      showBelow,
    });
  };

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    updatePosition();
    setVisible(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 4000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useLayoutEffect(() => {
    if (visible) {
      updatePosition();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {visible && content && coords && createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: coords.showBelow ? 'translateX(-50%)' : 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
          className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 text-[10px] font-mono text-slate-200 rounded-md shadow-2xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
