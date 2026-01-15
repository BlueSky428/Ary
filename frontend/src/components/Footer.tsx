'use client';

/**
 * Footer Component
 * Clean, minimal footer with enhanced styling
 */

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative border-t border-neutral-200/50 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Company Name */}
            <div>
              <h3 className="text-lg font-semibold tracking-wide text-neutral-900 dark:text-neutral-100 mb-2">
                Inlyth, Inc.
              </h3>
            </div>

            {/* Tagline */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
              Accountability is the prerequisite for scale.
            </p>

            {/* Collaboration Text */}
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Developed in collaboration with academic and institutional partners.
            </p>

            {/* Links */}
            <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              <Link
                href="https://drive.google.com/file/d/1wEJRnby4ILSFfAt_jmOEv3iWaWuvhUhY/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Doctrine
              </Link>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              <Link
                href="mailto:hello@inlyth.com"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Divider */}
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-4" />
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

