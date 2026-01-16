/**
 * Infrastructure Page
 * Clean, scrollable layout explaining Ary's infrastructure
 */

'use client';

import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Check, Minus } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
};

export default function InfrastructurePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <Navigation />

      {/* Theme Toggle - Fixed position */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-20 right-6 z-50"
      >
        <ThemeToggle />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 relative">
        {/* Page Title */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-3 mb-8"
          >
            <Minus className="w-8 h-px text-neutral-400 dark:text-neutral-600" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400 font-medium">
              Accountability infrastructure for human judgment
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-neutral-900 dark:text-neutral-50 leading-[1.08] mb-12 tracking-tight"
          >
            The Infrastructure
          </motion.h1>
        </motion.section>

        {/* Section 1 — The primitive */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <div className="space-y-5 text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 leading-[1.6] font-extralight">
            <p>Judgment is exercised constantly.</p>
            <p>It is almost never preserved.</p>
            <p>Institutions are increasingly required to justify decisions long after they are made.</p>
            <p className="text-neutral-700 dark:text-neutral-300">Today, those justifications rely on memory, notes, and reconstruction.</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">Ary exists to change that.</p>
          </div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 2 — What Ary actually produces */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <motion.div
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            <p>Ary produces a decision artifact.</p>
            <p>Not a score.</p>
            <p>Not a recommendation.</p>
            <p>Not an outcome.</p>
          </motion.div>
          
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            A structured, immutable record of:
          </motion.p>
          
          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
            className="space-y-5 mb-12"
          >
            {[
              'what was said',
              'what was considered',
              'what constraints were acknowledged',
              'what uncertainty existed',
              'what was absent',
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 group"
              >
                <div className="mt-1.5 flex-shrink-0">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-lg md:text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-[1.7] font-extralight flex-1">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-900 dark:text-neutral-100 leading-[1.6] font-light"
          >
            This artifact is the unit of value.
          </motion.p>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 3 — The database */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            Over time, these artifacts accumulate into an institutional database of judgment.
          </motion.p>
          
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            This database:
          </motion.p>
          
          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
            className="space-y-5 mb-12"
          >
            {[
              'is evidence-anchored',
              'is queryable',
              'is versioned',
              'is auditable',
              'cannot be reconstructed later',
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 group"
              >
                <div className="mt-1.5 flex-shrink-0">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-lg md:text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-[1.7] font-extralight flex-1">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          
          <motion.div
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] font-extralight"
          >
            <p>This is the infrastructure.</p>
            <p className="text-neutral-600 dark:text-neutral-400">Everything else — interfaces, analysis, governance — sits on top of it.</p>
          </motion.div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 4 — Invariants */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            Ary enforces a small number of non-negotiable invariants:
          </motion.p>
          
          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
            className="space-y-5 mb-12"
          >
            {[
              'No scoring',
              'No prediction',
              'No recommendation',
              'No inference beyond evidence',
              'Absence is first-class',
              'Deterministic compilation',
              'Immutable provenance',
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 group"
              >
                <div className="mt-1.5 flex-shrink-0">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-lg md:text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-[1.7] font-extralight flex-1">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          
          <motion.div
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] font-extralight"
          >
            <p>These constraints are not limitations.</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">They are what make the system defensible.</p>
          </motion.div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 5 — What Ary is not */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            Ary does not:
          </motion.p>
          
          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
            className="space-y-5 mb-12"
          >
            {[
              'decide who should be chosen',
              'certify correctness',
              'replace legal or regulatory eligibility',
              'optimize outcomes',
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 group"
              >
                <div className="mt-1.5 flex-shrink-0">
                  <Minus className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-lg md:text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-[1.7] font-extralight flex-1">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-900 dark:text-neutral-100 leading-[1.6] font-light"
          >
            Ary preserves judgment as it occurred.
          </motion.p>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 6 — Why this matters now */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <div className="space-y-5 text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 leading-[1.6] font-extralight">
            <p>As institutions adopt faster, more complex, AI-assisted workflows,</p>
            <p>the gap between decision-making and defensibility is widening.</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">Accountability is not the opposite of progress.</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">It is the prerequisite for scale.</p>
            <p className="text-neutral-800 dark:text-neutral-200">Ary is built to be the foundation all other "smart" systems can be accountable to.</p>
          </div>
        </motion.section>

      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
