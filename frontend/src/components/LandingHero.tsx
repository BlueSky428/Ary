'use client';

/**
 * Landing Hero Section
 * Matches the exact design from workflow
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function LandingHero() {
  return (
    <section className="container mx-auto px-4 pt-24 pb-16 md:pt-28 md:pb-24">
      <div className="max-w-3xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/20 rounded-xl blur-xl" />
            <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 ml-3">
            Ary
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-medium text-neutral-800 dark:text-neutral-200 mb-8"
        >
          Your strength-spotting AI companion.
        </motion.h2>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4 mb-12 text-left"
        >
          <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Ary helps you see and articulate your professional capabilities through natural conversation and structured reflection.
          </p>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
            No scores. No judgment. Just a calm, clear mirror that shows you the strengths you already demonstrate.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md font-medium text-lg"
          >
            Try a quick demo
          </Link>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Takes about 3 minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}

