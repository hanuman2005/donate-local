// src/context/ThemeContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme colors
export const lightTheme = {
  name: 'light',
  colors: {
    // Backgrounds
    background: '#f7fafc',
    surface: '#ffffff',
    surfaceHover: '#f8f9fa',
    
    // Text
    textPrimary: '#2d3748',
    textSecondary: '#718096',
    textTertiary: '#a0aec0',
    
    // Brand colors
    primary: '#f093fb',
    primaryHover: '#e879f9',
    secondary: '#f5576c',
    
    // Status colors
    success: '#48bb78',
    warning: '#ed8936',
    error: '#e53e3e',
    info: '#4299e1',
    
    // Borders
    border: '#e2e8f0',
    borderHover: '#cbd5e0',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.15)',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Cards
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    
    // Header
    headerBg: '#ffffff',
    headerBorder: '#e2e8f0',
    
    // Input
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    inputFocus: '#f093fb',
  }
};

export const darkTheme = {
  name: 'dark',
  colors: {
    // Backgrounds
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    
    // Text
    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    
    // Brand colors
    primary: '#f093fb',
    primaryHover: '#e879f9',
    secondary: '#f5576c',
    
    // Status colors
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    // Borders
    border: '#334155',
    borderHover: '#475569',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHover: 'rgba(0, 0, 0, 0.5)',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    // Cards
    cardBg: '#1e293b',
    cardBorder: '#334155',
    
    // Header
    headerBg: '#1e293b',
    headerBorder: '#334155',
    
    // Input
    inputBg: '#0f172a',
    inputBorder: '#334155',
    inputFocus: '#f093fb',
  }
};

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme());

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update document class for global styling
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#1e293b' : '#ffffff'
      );
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const value = {
    theme,
    themeColors: currentTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;