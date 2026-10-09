import { useEffect, useRef } from 'react';

export default function useKeyboardShortcuts(callbacks) {
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT' ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        callbacksRef.current.onEscape?.();
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'n') {
        callbacksRef.current.onN?.();
      } else if (key === 'd') {
        callbacksRef.current.onD?.();
      } else if (key === 'p') {
        callbacksRef.current.onP?.();
      } else if (key === '?') {
        callbacksRef.current.onQuestion?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
