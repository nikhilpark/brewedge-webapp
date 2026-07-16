'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type AccentColor = 'brown' | 'rust' | 'forest' | 'navy' | 'plum';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLOR_MAP: Record<AccentColor, { light: string; dark: string }> = {
  brown: {
    light: '#8B6F47',
    dark: '#D4A373',
  },
  rust: {
    light: '#C85A54',
    dark: '#F4A582',
  },
  forest: {
    light: '#2D5016',
    dark: '#7CB342',
  },
  navy: {
    light: '#1E3A5F',
    dark: '#64B5F6',
  },
  plum: {
    light: '#6B4C7A',
    dark: '#CE93D8',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [accentColor, setAccentColorState] = useState<AccentColor>('brown');
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedAccent = localStorage.getItem('accentColor') as AccentColor | null;

    let initialTheme: Theme = 'light';
    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark';
    }

    setThemeState(initialTheme);
    setAccentColorState(savedAccent || 'brown');
    
    // Apply to DOM immediately
    const htmlElement = document.documentElement;
    if (initialTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    htmlElement.style.setProperty('--accent-color-id', savedAccent || 'brown');
    
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Apply accent color via CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const accentVars = ACCENT_COLOR_MAP[accentColor];
    const accentColor_value = theme === 'dark' ? accentVars.dark : accentVars.light;
    
    // Set accent color - for simplicity, using it for primary button/link colors
    root.style.setProperty('--accent-color', accentColor_value);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor, theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
