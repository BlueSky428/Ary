'use client';

/**
 * Theme Toggle Component
 * Beautiful toggle switch for light/dark mode
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/useThemeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  // Ensure theme is applied on mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center w-14 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-full p-0.5 transition-colors shadow-sm hover:shadow-md"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Toggle circle */}
      <motion.div
        animate={{
          x: theme === 'dark' ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        className="w-6 h-6 bg-white dark:bg-neutral-900 rounded-full shadow-sm"
      />
    </motion.button>
  );
}

