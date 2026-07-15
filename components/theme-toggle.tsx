'use client';

import React, { useState } from 'react';
import { useTheme, type Theme, type AccentColor } from '@/context/theme';

const ACCENT_COLORS: Array<{ value: AccentColor; label: string; lightColor: string; darkColor: string }> = [
  { value: 'brown', label: 'Brown', lightColor: '#8B6F47', darkColor: '#D4A373' },
  { value: 'rust', label: 'Rust', lightColor: '#C85A54', darkColor: '#F4A582' },
  { value: 'forest', label: 'Forest', lightColor: '#2D5016', darkColor: '#7CB342' },
  { value: 'navy', label: 'Navy', lightColor: '#1E3A5F', darkColor: '#64B5F6' },
  { value: 'plum', label: 'Plum', lightColor: '#6B4C7A', darkColor: '#CE93D8' },
];

export default function ThemeToggle() {
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-md hover:bg-muted transition"
        title="Theme and accent settings"
        aria-label="Theme settings"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-50">
          {/* Theme Toggle */}
          <div className="p-4 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">THEME</p>
            <div className="flex gap-2">
              {(['light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    setShowDropdown(false);
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded transition ${
                    theme === t
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {t === 'light' ? '☀️ Light' : '🌙 Dark'}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Selector */}
          <div className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">ACCENT COLOR</p>
            <div className="grid grid-cols-5 gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setAccentColor(color.value);
                    setShowDropdown(false);
                  }}
                  className="w-full aspect-square rounded-md border-2 transition"
                  style={{
                    backgroundColor: theme === 'light' ? color.lightColor : color.darkColor,
                    borderColor: accentColor === color.value ? '#000' : '#ccc',
                    opacity: accentColor === color.value ? 1 : 0.7,
                  }}
                  title={color.label}
                  aria-label={`${color.label} accent`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
