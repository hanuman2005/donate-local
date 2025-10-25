// src/styles/globalStyles.js

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Light theme variables (default) */
    --bg-primary: #f7fafc;
    --bg-secondary: #ffffff;
    --text-primary: #2d3748;
    --text-secondary: #718096;
    --border-color: #e2e8f0;
  }

  /* Dark theme variables */
  [data-theme='dark'] {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --border-color: #334155;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
    padding-top: 80px; /* For fixed header */
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Modal scroll lock */
  body.modal-open {
    overflow: hidden;
    padding-right: 15px;
  }

  /* Selection color */
  ::selection {
    background: #f093fb;
    color: white;
  }

  ::-moz-selection {
    background: #f093fb;
    color: white;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 5px;
  }

  [data-theme='dark'] ::-webkit-scrollbar-thumb {
    background: #475569;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  [data-theme='dark'] ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  /* Loading spinner animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Fade in animation */
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

  /* Slide in animation */
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid #f093fb;
    outline-offset: 2px;
  }

  /* Disable focus outline for mouse users */
  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Link styling */
  a {
    color: #f093fb;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #e879f9;
  }

  /* Button reset */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Input styling */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Image loading placeholder */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Toast container dark mode support */
  .Toastify__toast-container {
    z-index: 9999;
  }

  [data-theme='dark'] .Toastify__toast {
    background: #1e293b;
    color: #f1f5f9;
  }

  [data-theme='dark'] .Toastify__toast--success {
    background: #1e293b;
    border-left: 4px solid #34d399;
  }

  [data-theme='dark'] .Toastify__toast--error {
    background: #1e293b;
    border-left: 4px solid #f87171;
  }

  [data-theme='dark'] .Toastify__toast--info {
    background: #1e293b;
    border-left: 4px solid #60a5fa;
  }

  [data-theme='dark'] .Toastify__toast--warning {
    background: #1e293b;
    border-left: 4px solid #fbbf24;
  }

  [data-theme='dark'] .Toastify__progress-bar {
    background: #f093fb;
  }
`;

export default GlobalStyles;