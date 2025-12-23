/**
 * Design System Constants
 * Centralized design tokens for consistent styling across the application
 */

// Animation Constants
export const ANIMATION = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    MEDIUM: 0.4,
    SLOW: 0.6,
  },
  EASING: {
    DEFAULT: [0.16, 1, 0.3, 1] as const,
    EASE_OUT: [0.25, 0.46, 0.45, 0.94] as const,
    EASE_IN_OUT: [0.4, 0, 0.2, 1] as const,
    SPRING: { stiffness: 200, damping: 15 } as const,
  },
  DELAY: {
    STAGGER: 0.05,
    SMALL: 0.1,
    MEDIUM: 0.2,
    LARGE: 0.3,
  },
} as const;

// Spacing Constants
export const SPACING = {
  CONTAINER: {
    PADDING: 'px-4 sm:px-6 lg:px-8',
    MAX_WIDTH: 'max-w-6xl',
    MAX_WIDTH_SMALL: 'max-w-4xl',
  },
  SECTION: {
    PY: 'py-16 md:py-24',
    PY_SMALL: 'py-12 md:py-16',
  },
} as const;

// Color Classes (for consistent usage)
export const COLORS = {
  PRIMARY: {
    BG: 'bg-primary-600',
    BG_HOVER: 'hover:bg-primary-700',
    TEXT: 'text-primary-600',
    TEXT_DARK: 'dark:text-primary-400',
    GRADIENT: 'bg-gradient-to-br from-primary-500 to-accent-500',
    GRADIENT_HOVER: 'hover:from-primary-600 hover:to-accent-600',
  },
  NEUTRAL: {
    BG: 'bg-white dark:bg-neutral-900',
    BG_LIGHT: 'bg-neutral-50 dark:bg-neutral-950',
    TEXT: 'text-neutral-900 dark:text-neutral-100',
    TEXT_SECONDARY: 'text-neutral-600 dark:text-neutral-400',
    BORDER: 'border-neutral-200 dark:border-neutral-800',
    BORDER_LIGHT: 'border-neutral-200/50 dark:border-neutral-700/50',
  },
} as const;

// Component Styles
export const STYLES = {
  CARD: {
    BASE: 'bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200/50 dark:border-neutral-700/50',
    PADDING: 'p-6 md:p-8',
  },
  BUTTON: {
    PRIMARY: 'px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl font-semibold',
    SECONDARY: 'px-6 py-3 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all font-medium',
  },
  INPUT: {
    BASE: 'w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
  },
  PAGE_BG: 'min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950',
} as const;

// Layout Constants
export const LAYOUT = {
  HEADER_HEIGHT: 'h-16',
  FOOTER_PADDING: 'pt-16 pb-8',
} as const;

