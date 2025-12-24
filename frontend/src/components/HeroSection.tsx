'use client';

/**
 * Hero Section
 * Beautiful hero with animated elements
 */

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/20 dark:from-neutral-900 dark:via-neutral-950 dark:to-primary-950/20" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/20 dark:bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-lg shadow-sm">
                <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-neutral-900 dark:text-neutral-100 mb-6 leading-tight tracking-tight"
          >
            See what you{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
                can do
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-3 bg-primary-100/50 dark:bg-primary-500/20 -z-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Ary is a strength-spotting companion that helps you see and
            articulate your professional capabilities through natural
            conversation.
          </motion.p>

          {/* Tagline */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-full shadow-gentle"
          >
            <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse" />
            <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-200 font-medium">
              Not an assessment. Not therapy. Just clarity.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500"
          >
            <span className="text-sm">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 border-2 border-neutral-300 dark:border-neutral-600 rounded-full flex justify-center pt-2"
            >
              <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

