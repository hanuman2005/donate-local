// src/theme/theme.js - Centralized Theme Configuration

export const colors = {
  // Your brand colors
  primaryDark: '#1B3C53',
  primary: '#234C6A',
  primaryLight: '#456882',
  neutral: '#E3E3E3',
  
  // Semantic colors derived from your palette
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const lightTheme = {
  // Background colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f8f9fa',
  bgCard: '#ffffff',
  bgHover: 'rgba(35, 76, 106, 0.05)',
  bgOverlay: 'rgba(27, 60, 83, 0.8)',
  
  // Text colors
  textPrimary: '#1B3C53',
  textSecondary: '#456882',
  textTertiary: '#6b7280',
  textInverse: '#ffffff',
  textMuted: '#9ca3af',
  
  // Border colors
  borderColor: '#E3E3E3',
  borderLight: '#f3f4f6',
  borderDark: 'rgba(35, 76, 106, 0.2)',
  
  // Brand colors
  primary: '#234C6A',
  primaryDark: '#1B3C53',
  primaryLight: '#456882',
  primaryRgb: '35, 76, 106',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #1B3C53 0%, #234C6A 50%, #456882 100%)',
  gradientSubtle: 'linear-gradient(135deg, rgba(35, 76, 106, 0.1) 0%, rgba(69, 104, 130, 0.1) 100%)',
  
  // Status colors
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  successLight: '#d1fae5',
  
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  warningLight: '#fef3c7',
  
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.1)',
  errorLight: '#fee2e2',
  
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.1)',
  infoLight: '#dbeafe',
  
  // Shadows
  shadowSm: '0 1px 2px 0 rgba(27, 60, 83, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(27, 60, 83, 0.1), 0 2px 4px -1px rgba(27, 60, 83, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(27, 60, 83, 0.1), 0 4px 6px -2px rgba(27, 60, 83, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(27, 60, 83, 0.1), 0 10px 10px -5px rgba(27, 60, 83, 0.04)',
  
  // Glass effect (for modern UI)
  glassBackground: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(35, 76, 106, 0.2)',
  glassBlur: '20px',
  
  // Transitions
  transitionBase: '0.3s ease',
  transitionFast: '0.15s ease',
  transitionSlow: '0.5s ease',
  
  // Border radius
  radiusSm: '4px',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusXl: '16px',
  radius2xl: '24px',
  radiusFull: '9999px',
};

export const darkTheme = {
  // Background colors
  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgCard: '#1e293b',
  bgHover: 'rgba(69, 104, 130, 0.1)',
  bgOverlay: 'rgba(15, 23, 42, 0.9)',
  
  // Text colors
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  textInverse: '#1B3C53',
  textMuted: '#64748b',
  
  // Border colors
  borderColor: 'rgba(69, 104, 130, 0.2)',
  borderLight: 'rgba(69, 104, 130, 0.1)',
  borderDark: 'rgba(69, 104, 130, 0.3)',
  
  // Brand colors (slightly brighter for dark mode)
  primary: '#456882',
  primaryDark: '#234C6A',
  primaryLight: '#5a8099',
  primaryRgb: '69, 104, 130',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #234C6A 0%, #456882 50%, #5a8099 100%)',
  gradientSubtle: 'linear-gradient(135deg, rgba(69, 104, 130, 0.15) 0%, rgba(90, 128, 153, 0.15) 100%)',
  
  // Status colors (adjusted for dark mode)
  success: '#34d399',
  successBg: 'rgba(52, 211, 153, 0.15)',
  successLight: 'rgba(52, 211, 153, 0.2)',
  
  warning: '#fbbf24',
  warningBg: 'rgba(251, 191, 36, 0.15)',
  warningLight: 'rgba(251, 191, 36, 0.2)',
  
  error: '#f87171',
  errorBg: 'rgba(248, 113, 113, 0.15)',
  errorLight: 'rgba(248, 113, 113, 0.2)',
  
  info: '#60a5fa',
  infoBg: 'rgba(96, 165, 250, 0.15)',
  infoLight: 'rgba(96, 165, 250, 0.2)',
  
  // Shadows (darker for dark mode)
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
  
  // Glass effect (darker for dark mode)
  glassBackground: 'rgba(30, 41, 59, 0.7)',
  glassBorder: 'rgba(69, 104, 130, 0.3)',
  glassBlur: '20px',
  
  // Transitions (same as light)
  transitionBase: '0.3s ease',
  transitionFast: '0.15s ease',
  transitionSlow: '0.5s ease',
  
  // Border radius (same as light)
  radiusSm: '4px',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusXl: '16px',
  radius2xl: '24px',
  radiusFull: '9999px',
};

// Helper function to get theme
export const getTheme = (isDark = false) => (isDark ? darkTheme : lightTheme);

// CSS variables generator
export const generateCSSVariables = (theme) => {
  return Object.entries(theme)
    .map(([key, value]) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
    .join('\n  ');
};