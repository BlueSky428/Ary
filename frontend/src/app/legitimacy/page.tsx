/**
 * Legitimacy Page
 * Clean, scrollable layout focused on legitimacy principle
 */

'use client';

import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Minus, Check } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
};

export default function LegitimacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
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
              Legitimacy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-neutral-900 dark:text-neutral-50 leading-[1.08] mb-12 tracking-tight"
          >
            The Legitimacy
          </motion.h1>
        </motion.section>

        {/* Section 1 */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <div className="space-y-6 text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 leading-[1.6] font-extralight">
            <p>A simple rule:</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">
              If a process cannot be performed honestly by a human, it must not be automated.
            </p>
          </div>
          <div className="mt-10 space-y-3 text-lg md:text-xl text-neutral-500 dark:text-neutral-500 font-light">
            <p>Automation does not create legitimacy.</p>
            <p>It only removes friction.</p>
          </div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 2 */}
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
            For decades, institutions relied on human processes to:
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
              'ask questions',
              'record answers',
              'note absence',
              'preserve uncertainty',
              'justify decisions after the fact',
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 group"
              >
                <div className="mt-1.5 flex-shrink-0">
                  <Check
                    className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors"
                    strokeWidth={1.5}
                  />
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
            className="text-xl md:text-2xl lg:text-3xl text-neutral-700 dark:text-neutral-300 leading-[1.6] font-extralight"
          >
            These processes were slow, inconsistent, and expensive — but they were legible.
          </motion.p>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 3 */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <div className="space-y-6 text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-400 leading-[1.6] font-extralight">
            <p>Modern AI systems reverse this order:</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">
              they automate first, and attempt to justify later.
            </p>
          </div>
          <div className="mt-10 text-xl md:text-2xl lg:text-3xl text-neutral-900 dark:text-neutral-100 font-light">
            <p>Ary does the opposite.</p>
          </div>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 4 */}
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
            Before anything is automated, we ask:
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
              'Can this be done manually?',
              'Can it be done without inference?',
              'Can absence be preserved honestly?',
              'Can the record survive scrutiny years later?',
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 group"
              >
                <div className="mt-1.5 flex-shrink-0">
                  <Check
                    className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors"
                    strokeWidth={1.5}
                  />
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
            className="text-xl md:text-2xl lg:text-3xl text-neutral-800 dark:text-neutral-200 leading-[1.6] font-extralight"
          >
            If the answer is no, we refuse to automate it.
          </motion.p>
        </motion.section>

        {/* Section Divider */}
        <div className="max-w-5xl mb-40 md:mb-56">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* Section 5 */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-20 md:mb-24 relative"
        >
          <div className="space-y-6 text-xl md:text-2xl lg:text-3xl text-neutral-700 dark:text-neutral-300 leading-[1.6] font-extralight">
            <p>This is not a limitation.</p>
            <p className="text-neutral-900 dark:text-neutral-100 font-light">
              It is the condition for scale.
            </p>
          </div>
          <div className="mt-12 space-y-3 text-xl md:text-2xl lg:text-3xl text-neutral-900 dark:text-neutral-100 font-light">
            <p>Accountability is not the opposite of progress.</p>
            <p>It is the prerequisite for it.</p>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
