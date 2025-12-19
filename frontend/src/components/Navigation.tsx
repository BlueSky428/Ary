'use client';

/**
 * Navigation Component
 * Header with logo that links to home page
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200/50 dark:border-neutral-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary-500/20 rounded-xl blur-xl group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl shadow-lg">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
            </motion.div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Ary
            </span>
          </Link>
          <Link 
            href="/"
            className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

