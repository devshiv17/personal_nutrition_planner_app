import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Remove default button styles */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Remove default input styles */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Remove default link styles */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* List styles */
  ul, ol {
    list-style: none;
  }

  /* Image styles */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    * {
      border-color: currentColor !important;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1a1a1a;
      color: #ffffff;
    }
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-sm {
    gap: ${({ theme }) => theme.spacing.sm};
  }

  .gap-md {
    gap: ${({ theme }) => theme.spacing.md};
  }

  .gap-lg {
    gap: ${({ theme }) => theme.spacing.lg};
  }

  .mt-sm {
    margin-top: ${({ theme }) => theme.spacing.sm};
  }

  .mt-md {
    margin-top: ${({ theme }) => theme.spacing.md};
  }

  .mt-lg {
    margin-top: ${({ theme }) => theme.spacing.lg};
  }

  .mb-sm {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .mb-md {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  .mb-lg {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  .p-sm {
    padding: ${({ theme }) => theme.spacing.sm};
  }

  .p-md {
    padding: ${({ theme }) => theme.spacing.md};
  }

  .p-lg {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  /* Mobile-first responsive design */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .container {
      padding: 0 ${({ theme }) => theme.spacing.sm};
    }
    
    html {
      font-size: 14px;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    html {
      font-size: 16px;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    html {
      font-size: 18px;
    }
  }
`;

export default GlobalStyles;