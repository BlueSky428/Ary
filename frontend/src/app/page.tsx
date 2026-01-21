/**
 * Landing Page
 * Clean, scrollable layout aligned with institutional messaging
 * Enhanced UI/UX with refined design
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ArrowRight, Check, Minus } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
};

export default function HomePage() {
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 md:pb-32 relative">
        {/* Section 1 — The Claim */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48 relative"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-3 mb-8"
          >
            <Minus className="w-8 h-px text-neutral-400 dark:text-neutral-600" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400 font-medium">
              Infrastructure for Auditable Human Judgment
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-neutral-900 dark:text-neutral-50 leading-[1.1] sm:leading-[1.08] mb-8 sm:mb-12 tracking-tight"
          >
            Ary is infrastructure for{' '}
            <span className="font-normal text-neutral-950 dark:text-neutral-50">auditable human judgment</span>.
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 leading-[1.6] font-extralight max-w-4xl"
          >
            <p>Institutions can audit financial decisions.</p>
            <p>They cannot audit people decisions.</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">Ary is the missing layer.</p>
          </motion.div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 2 — The Black Box Analogy */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48 relative"
        >
          <div className="space-y-4 text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 leading-[1.6] font-extralight mb-10">
            <p>High-stakes systems require black boxes.</p>
            <p>Aviation has them.</p>
            <p>Finance has them.</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">Critical human decisions do not.</p>
          </div>
          
          <motion.div
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-8 md:pl-12 border-l-[1.5px] border-neutral-300 dark:border-neutral-700"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-transparent via-neutral-400 dark:via-neutral-600 to-transparent" />
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-800 dark:text-neutral-200 leading-[1.7] font-light">
              Ary records <span className="font-normal text-neutral-950 dark:text-neutral-50">how</span> judgment was exercised, not <span className="font-normal text-neutral-950 dark:text-neutral-50">what</span> judgment was made, producing a defensible record of deliberation when scrutiny arrives.
            </p>
          </motion.div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 3 — What Ary does */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48 relative"
        >
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            Ary compiles deliberation into a judgment artifact:
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
              'Evidence observed',
              'Reasoning patterns detected',
              'Constraints present',
              'Uncertainty acknowledged',
              'Absence explicitly recorded',
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
            No scores. No predictions. No recommendations.
          </motion.p>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 4 — Why this exists */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48 relative"
        >
          <motion.p
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            In regulated environments, defensibility is not optional.
          </motion.p>
          
          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
            className="space-y-4 mb-12 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              'Hiring',
              'Credentialing',
              'Promotion',
              'Termination',
              'Access to critical responsibility',
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 group"
              >
                <div className="w-2 h-2 rounded-full bg-neutral-400 dark:text-neutral-600 flex-shrink-0 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-400 transition-colors" />
                <span className="text-lg md:text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-[1.7] font-extralight">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          
          <motion.div
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-8 md:pl-12 border-l-[1.5px] border-neutral-300 dark:border-neutral-700"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-transparent via-neutral-400 dark:via-neutral-600 to-transparent" />
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-800 dark:text-neutral-200 leading-[1.7] font-light">
              Ary exists so institutions can answer, years later:{' '}
              <span className="font-normal italic text-neutral-950 dark:text-neutral-50">"What did we observe, and on what basis did we decide?"</span>
            </p>
          </motion.div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 5 — Who mandates this */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48 relative"
        >
          <motion.div
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            <p>Ary is not adopted by managers.</p>
            <p className="font-light text-neutral-950 dark:text-neutral-50">It is mandated by institutions.</p>
          </motion.div>
          
          <motion.ul
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            {['Legal', 'Compliance', 'Risk', 'Boards', 'Regulators'].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 rounded-lg text-base md:text-lg text-neutral-700 dark:text-neutral-300 font-light hover:bg-neutral-200 dark:hover:bg-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-default"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 6 — The gate (demo access) */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-24 sm:mb-32 md:mb-40 lg:mb-48 relative"
        >
          <motion.div
            {...fadeInUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] mb-10 font-extralight"
          >
            <p>Access the system</p>
            <p className="text-base md:text-lg lg:text-xl text-neutral-500 dark:text-neutral-500 font-light">
              Demo access is currently restricted.
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/demo-access"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all duration-300 font-medium text-lg md:text-xl shadow-xl hover:shadow-2xl"
            >
              <span>Enter access code</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.section>

      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
