// src/globalStyles.js - Updated with new color scheme
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* CSS Variables - Light Theme (Default) */
  :root {
    /* Background colors */
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --bg-card: #ffffff;
    --bg-hover: rgba(35, 76, 106, 0.05);
    --bg-overlay: rgba(27, 60, 83, 0.8);
    
    /* Text colors */
    --text-primary: #1B3C53;
    --text-secondary: #456882;
    --text-tertiary: #6b7280;
    --text-inverse: #ffffff;
    --text-muted: #9ca3af;
    
    /* Border colors */
    --border-color: #E3E3E3;
    --border-light: #f3f4f6;
    --border-dark: rgba(35, 76, 106, 0.2);
    
    /* Brand colors */
    --primary: #234C6A;
    --primary-dark: #1B3C53;
    --primary-light: #456882;
    --primary-rgb: 35, 76, 106;
    
    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #1B3C53 0%, #234C6A 50%, #456882 100%);
    --gradient-subtle: linear-gradient(135deg, rgba(35, 76, 106, 0.1) 0%, rgba(69, 104, 130, 0.1) 100%);
    
    /* Status colors */
    --success: #10b981;
    --success-bg: rgba(16, 185, 129, 0.1);
    --success-light: #d1fae5;
    
    --warning: #f59e0b;
    --warning-bg: rgba(245, 158, 11, 0.1);
    --warning-light: #fef3c7;
    
    --danger: #ef4444;
    --danger-bg: rgba(239, 68, 68, 0.1);
    --danger-light: #fee2e2;
    
    --info: #3b82f6;
    --info-bg: rgba(59, 130, 246, 0.1);
    --info-light: #dbeafe;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(27, 60, 83, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(27, 60, 83, 0.1), 0 2px 4px -1px rgba(27, 60, 83, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(27, 60, 83, 0.1), 0 4px 6px -2px rgba(27, 60, 83, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(27, 60, 83, 0.1), 0 10px 10px -5px rgba(27, 60, 83, 0.04);
    
    /* Glass effect */
    --glass-background: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(35, 76, 106, 0.2);
    --glass-blur: 20px;
    
    /* Transitions */
    --transition-base: 0.3s ease;
    --transition-fast: 0.15s ease;
    --transition-slow: 0.5s ease;
    
    /* Border radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-2xl: 24px;
    --radius-full: 9999px;
  }

  /* Dark Theme */
  [data-theme="dark"] {
    /* Background colors */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-card: #1e293b;
    --bg-hover: rgba(69, 104, 130, 0.1);
    --bg-overlay: rgba(15, 23, 42, 0.9);
    
    /* Text colors */
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-tertiary: #94a3b8;
    --text-inverse: #1B3C53;
    --text-muted: #64748b;
    
    /* Border colors */
    --border-color: rgba(69, 104, 130, 0.2);
    --border-light: rgba(69, 104, 130, 0.1);
    --border-dark: rgba(69, 104, 130, 0.3);
    
    /* Brand colors (brighter for dark mode) */
    --primary: #456882;
    --primary-dark: #234C6A;
    --primary-light: #5a8099;
    --primary-rgb: 69, 104, 130;
    
    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #234C6A 0%, #456882 50%, #5a8099 100%);
    --gradient-subtle: linear-gradient(135deg, rgba(69, 104, 130, 0.15) 0%, rgba(90, 128, 153, 0.15) 100%);
    
    /* Status colors (brighter for dark mode) */
    --success: #34d399;
    --success-bg: rgba(52, 211, 153, 0.15);
    --success-light: rgba(52, 211, 153, 0.2);
    
    --warning: #fbbf24;
    --warning-bg: rgba(251, 191, 36, 0.15);
    --warning-light: rgba(251, 191, 36, 0.2);
    
    --danger: #f87171;
    --danger-bg: rgba(248, 113, 113, 0.15);
    --danger-light: rgba(248, 113, 113, 0.2);
    
    --info: #60a5fa;
    --info-bg: rgba(96, 165, 250, 0.15);
    --info-light: rgba(96, 165, 250, 0.2);
    
    /* Shadows (darker) */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5);
    
    /* Glass effect (darker) */
    --glass-background: rgba(30, 41, 59, 0.7);
    --glass-border: rgba(69, 104, 130, 0.3);
    --glass-blur: 20px;
  }

  /* Reset & Base Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    transition: background-color var(--transition-base), color var(--transition-base);
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-light);
    border-radius: var(--radius-full);
    border: 2px solid var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
  }

  /* Selection */
  ::selection {
    background: var(--primary);
    color: var(--text-inverse);
  }

  ::-moz-selection {
    background: var(--primary);
    color: var(--text-inverse);
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--primary-dark);
  }

  /* Button reset */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Focus styles */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  /* Utility classes */
  .text-primary { color: var(--text-primary) !important; }
  .text-secondary { color: var(--text-secondary) !important; }
  .text-muted { color: var(--text-muted) !important; }

  .bg-primary { background: var(--bg-primary) !important; }
  .bg-secondary { background: var(--bg-secondary) !important; }
  .bg-card { background: var(--bg-card) !important; }

  .gradient-primary { background: var(--gradient-primary) !important; }
  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Responsive typography */
  @media (max-width: 768px) {
    html { font-size: 15px; }
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
    h4 { font-size: 1.25rem; }
    h5 { font-size: 1.1rem; }
  }

  @media (max-width: 480px) {
    html { font-size: 14px; }
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }

  /* Print styles */
  @media print {
    * {
      background: white !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`;

export default GlobalStyles;