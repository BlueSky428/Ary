'use client';

/**
 * Footer Component
 * Clean, minimal footer with enhanced styling
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-neutral-200/50 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center md:text-left"
            >
              <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
                <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 p-1.5 rounded-lg shadow-sm">
                  <MessageCircle className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Ary
                </h3>
              </Link>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Built for inspectable, defensible human judgment.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center md:items-end gap-2"
            >
              <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                <Link
                  href="/demo"
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Demo
                </Link>
                <Link
                  href="/waitlist"
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Waitlist
                </Link>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                © {new Date().getFullYear()} Ary. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}

