// src/styles/globalStyles.js - COMPLETE THEME SYSTEM
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* ========================================
       LIGHT THEME (Default)
       ======================================== */
    
    /* Backgrounds */
    --bg-primary: #f7fafc;
    --bg-secondary: #ffffff;
    --bg-tertiary: #edf2f7;
    --bg-card: #ffffff;
    --bg-hover: #f7fafc;
    
    /* Text Colors */
    --text-primary: #2d3748;
    --text-secondary: #718096;
    --text-tertiary: #a0aec0;
    --text-inverse: #ffffff;
    
    /* Border & Divider */
    --border-color: #e2e8f0;
    --border-hover: #cbd5e0;
    --divider: #e2e8f0;
    
    /* Brand Colors */
    --primary: #667eea;
    --primary-dark: #5a67d8;
    --primary-light: #7f9cf5;
    --secondary: #764ba2;
    --accent: #f093fb;
    
    /* Status Colors */
    --success: #48bb78;
    --success-light: #9ae6b4;
    --success-bg: #f0fff4;
    --error: #f56565;
    --error-light: #fc8181;
    --error-bg: #fff5f5;
    --warning: #ed8936;
    --warning-light: #fbd38d;
    --warning-bg: #fffaf0;
    --info: #4299e1;
    --info-light: #90cdf4;
    --info-bg: #ebf8ff;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
    
    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-success: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    --gradient-info: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    
    /* Spacing (for consistency) */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    /* Border Radius */
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-base: 0.2s ease;
    --transition-slow: 0.3s ease;
  }

  /* ========================================
     DARK THEME
     ======================================== */
  [data-theme='dark'] {
    /* Backgrounds */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --bg-card: #1e293b;
    --bg-hover: #334155;
    
    /* Text Colors */
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-tertiary: #94a3b8;
    --text-inverse: #0f172a;
    
    /* Border & Divider */
    --border-color: #334155;
    --border-hover: #475569;
    --divider: #334155;
    
    /* Brand Colors (slightly adjusted for dark) */
    --primary: #7f9cf5;
    --primary-dark: #6b7fd7;
    --primary-light: #a3bffa;
    --secondary: #9f7aea;
    --accent: #f6ad55;
    
    /* Status Colors (adjusted for dark) */
    --success: #68d391;
    --success-light: #9ae6b4;
    --success-bg: #1a3a2a;
    --error: #fc8181;
    --error-light: #feb2b2;
    --error-bg: #3a1a1a;
    --warning: #f6ad55;
    --warning-light: #fbd38d;
    --warning-bg: #3a2a1a;
    --info: #63b3ed;
    --info-light: #90cdf4;
    --info-bg: #1a2a3a;
    
    /* Shadows (darker in dark mode) */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
    
    /* Keep gradients same or adjust slightly */
    --gradient-primary: linear-gradient(135deg, #7f9cf5 0%, #9f7aea 100%);
    --gradient-success: linear-gradient(135deg, #68d391 0%, #48bb78 100%);
    --gradient-info: linear-gradient(135deg, #63b3ed 0%, #4299e1 100%);
  }

  /* ========================================
     BASE STYLES
     ======================================== */
  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color var(--transition-base), 
                color var(--transition-base);
    line-height: 1.6;
    
    /* NO padding-top needed - Sidebar handles it */
    padding: 0;
    margin: 0;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* ========================================
     UTILITY CLASSES
     ======================================== */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .container-fluid {
    max-width: 100%;
    padding: 0 var(--spacing-lg);
  }

  /* Modal scroll lock */
  body.modal-open {
    overflow: hidden;
  }

  /* ========================================
     SELECTION & FOCUS
     ======================================== */
  ::selection {
    background: var(--primary);
    color: white;
  }

  ::-moz-selection {
    background: var(--primary);
    color: white;
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* ========================================
     SCROLLBAR STYLING
     ======================================== */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: var(--radius-sm);
    border: 3px solid var(--bg-primary);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--border-hover);
  }

  /* ========================================
     ANIMATIONS
     ======================================== */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* ========================================
     LINK STYLING
     ======================================== */
  a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  a:hover {
    color: var(--primary-dark);
  }

  /* ========================================
     BUTTON RESET
     ======================================== */
  button {
    font-family: inherit;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* ========================================
     INPUT/FORM STYLING
     ======================================== */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: var(--text-primary);
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    transition: border-color var(--transition-base),
                background-color var(--transition-base);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary);
  }

  input::placeholder, textarea::placeholder {
    color: var(--text-tertiary);
  }

  /* ========================================
     IMAGE STYLING
     ======================================== */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* ========================================
     TOAST NOTIFICATIONS (React Toastify)
     ======================================== */
  .Toastify__toast-container {
    z-index: 99999;
  }

  .Toastify__toast {
    background: var(--bg-card);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
  }

  .Toastify__toast--success {
    border-left: 4px solid var(--success);
  }

  .Toastify__toast--error {
    border-left: 4px solid var(--error);
  }

  .Toastify__toast--info {
    border-left: 4px solid var(--info);
  }

  .Toastify__toast--warning {
    border-left: 4px solid var(--warning);
  }

  .Toastify__progress-bar {
    background: var(--gradient-primary);
  }

  .Toastify__close-button {
    color: var(--text-secondary);
  }

  /* ========================================
     RESPONSIVE BREAKPOINTS
     ======================================== */
  /* Mobile: < 768px */
  /* Tablet: 768px - 1023px */
  /* Desktop: >= 1024px */
`;

export default GlobalStyles;