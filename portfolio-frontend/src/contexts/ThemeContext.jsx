import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

// Wrap this around your whole app (in App.jsx) if you want the theme to
// persist across every page, not just Home. It already saves to
// localStorage, so lifting it up is a drop-in change.
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('portfolio-theme') || 'dark';
  });

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
