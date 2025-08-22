// Design System Configuration for Personalized Nutrition Planner

export const designSystem = {
  // Color Palette - Extracted from Tailwind config
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main primary
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main secondary
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#0f2319',
    },
    accent: {
      50: '#fef7ee',
      100: '#fdedd3',
      200: '#fad7a5',
      300: '#f6bb6d',
      400: '#f19332',
      500: '#ed7611', // Main accent
      600: '#de5a07',
      700: '#b84408',
      800: '#92360e',
      900: '#782d0f',
      950: '#411505',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Main neutral
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },

  // Typography System
  typography: {
    fontFamily: {
      display: ['Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],
      '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.05em' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },

  // Spacing System
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    colored: '0 10px 25px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Breakpoints (Mobile-first approach)
  breakpoints: {
    sm: '640px',      // Mobile landscape
    md: '768px',      // Tablet
    lg: '1024px',     // Desktop
    xl: '1280px',     // Large desktop
    '2xl': '1536px',  // Extra large desktop
  },

  // Z-Index Scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1010',
    fixed: '1020',
    overlay: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
    toast: '1070',
  },

  // Transitions & Animations
  transitions: {
    duration: {
      fastest: '75ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slowest: '500ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  },

  // Component Variants
  variants: {
    button: {
      sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
      variants: ['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      states: ['default', 'hover', 'active', 'focus', 'disabled', 'loading'],
    },
    input: {
      sizes: ['sm', 'md', 'lg'],
      variants: ['default', 'error', 'success'],
      states: ['default', 'hover', 'focus', 'disabled'],
    },
    card: {
      variants: ['default', 'elevated', 'outlined', 'filled'],
      sizes: ['sm', 'md', 'lg', 'xl'],
    },
    badge: {
      variants: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'outline'],
      sizes: ['sm', 'md', 'lg'],
    }
  },

  // Utility Classes
  utilities: {
    // Focus styles
    focus: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    
    // Disabled styles
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    
    // Hover transitions
    hoverTransition: 'transition-all duration-200 ease-in-out',
    
    // Glass morphism effect
    glass: 'backdrop-blur-md bg-white/80 border border-white/20',
    
    // Scrollbar styles
    scrollbar: 'scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100',
  }
} as const;

// Helper functions for consistent styling
export const getColorValue = (colorPath: string) => {
  const parts = colorPath.split('.');
  let current: any = designSystem.colors;
  
  for (const part of parts) {
    current = current[part];
    if (!current) return null;
  }
  
  return current;
};

export const getSpacingValue = (spacingKey: keyof typeof designSystem.spacing) => {
  return designSystem.spacing[spacingKey];
};

export const getBreakpointValue = (breakpointKey: keyof typeof designSystem.breakpoints) => {
  return designSystem.breakpoints[breakpointKey];
};

// CSS Custom Properties for dynamic theming
export const cssVariables = {
  ':root': {
    // Primary colors
    '--color-primary-50': designSystem.colors.primary[50],
    '--color-primary-500': designSystem.colors.primary[500],
    '--color-primary-600': designSystem.colors.primary[600],
    '--color-primary-700': designSystem.colors.primary[700],
    
    // Secondary colors
    '--color-secondary-50': designSystem.colors.secondary[50],
    '--color-secondary-500': designSystem.colors.secondary[500],
    '--color-secondary-600': designSystem.colors.secondary[600],
    
    // Neutral colors
    '--color-neutral-50': designSystem.colors.neutral[50],
    '--color-neutral-100': designSystem.colors.neutral[100],
    '--color-neutral-500': designSystem.colors.neutral[500],
    '--color-neutral-800': designSystem.colors.neutral[800],
    '--color-neutral-900': designSystem.colors.neutral[900],
    
    // Semantic colors
    '--color-success': designSystem.colors.semantic.success,
    '--color-warning': designSystem.colors.semantic.warning,
    '--color-error': designSystem.colors.semantic.error,
    '--color-info': designSystem.colors.semantic.info,
    
    // Spacing
    '--spacing-xs': designSystem.spacing.xs,
    '--spacing-sm': designSystem.spacing.sm,
    '--spacing-md': designSystem.spacing.md,
    '--spacing-lg': designSystem.spacing.lg,
    '--spacing-xl': designSystem.spacing.xl,
    
    // Border radius
    '--radius-sm': designSystem.borderRadius.sm,
    '--radius-md': designSystem.borderRadius.md,
    '--radius-lg': designSystem.borderRadius.lg,
    
    // Transitions
    '--transition-fast': `${designSystem.transitions.duration.fast} ${designSystem.transitions.easing.out}`,
    '--transition-normal': `${designSystem.transitions.duration.normal} ${designSystem.transitions.easing.out}`,
  }
};

export default designSystem;