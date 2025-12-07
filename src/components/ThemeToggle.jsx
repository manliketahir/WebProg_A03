import React, { useEffect, useState } from 'react';

const KEY = 'sw-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(KEY, theme);
    } catch {}
  }, [theme]);

  return (
    <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
      <label style={{fontSize:'0.9rem', color:'var(--muted)'}}>Theme</label>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{padding:'6px 10px', borderRadius:6, border:'none', background:'var(--accent)', color:'#fff'}}>
        {theme === 'light' ? 'Light' : 'Dark'}
      </button>
    </div>
  );
}