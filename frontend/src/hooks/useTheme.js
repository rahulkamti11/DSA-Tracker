import { useState, useEffect, useCallback } from 'react';

export default function useTheme() {
  const [themeMode, setThemeModeState] = useState(() => {
    const urlTheme = new URLSearchParams(window.location.search).get('theme');
    return urlTheme || localStorage.getItem('dsa_theme') || 'dark';
  });

  const applyTheme = useCallback((mode) => {
    const root = document.documentElement;
    const body = document.body;

    let isDark;
    if (mode === 'light') {
      isDark = false;
    } else if (mode === 'system') {
      isDark = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      isDark = true;
    }

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
        body.style.backgroundColor = '#020617';
      }
      root.style.backgroundColor = '#020617';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      if (body) {
        body.classList.add('light');
        body.classList.remove('dark');
        body.style.backgroundColor = '#f8fafc';
      }
      root.style.backgroundColor = '#f8fafc';
    }
  }, []);

  useEffect(() => {
    applyTheme(themeMode);

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode, applyTheme]);

  const setTheme = (mode) => {
    setThemeModeState(mode);
    localStorage.setItem('dsa_theme', mode);
    applyTheme(mode);
  };

  return { themeMode, setTheme };
}
