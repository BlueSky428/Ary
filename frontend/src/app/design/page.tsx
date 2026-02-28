'use client';

import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';

const ease = [0.22, 1, 0.36, 1] as const;
const vp = { once: true, margin: '-60px' };

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const listItem = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease } },
};

function Divider() {
  return (
    <div className="max-w-5xl mb-16 sm:mb-20 overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.9, ease }}
        className="h-px bg-neutral-100 dark:bg-neutral-800 origin-left"
      />
    </div>
  );
}

type Principle = {
  number: string;
  title: string;
  lead: string;
  negations?: string[];
  body?: string[];
  closing?: string;
};

const principles: Principle[] = [
  {
    number: '01',
    title: 'Deterministic Compilation',
    lead: 'Sessions are compiled deterministically. Identical input produces identical structure.',
    negations: ['No inference.', 'No generative drift.', 'No post-hoc interpretation.'],
  },
  {
    number: '02',
    title: 'Verbatim Anchoring',
    lead: 'Extracted elements are preserved exactly as articulated.',
    negations: ['No paraphrasing.', 'No abstraction.', 'No narrative smoothing.'],
    closing: 'This prevents retrospective adjustment.',
  },
  {
    number: '03',
    title: 'Structural Discipline',
    lead: 'Each reasoning element belongs to a defined category.',
    body: [
      'Categories are distinct.',
      'Ambiguity is surfaced, not silently resolved.',
      'Structure is enforced.',
    ],
    closing: 'If articulation does not meet structural criteria, it is not accepted.',
  },
  {
    number: '04',
    title: 'Governance by Structure',
    lead: 'Ary does not dictate decisions. It structures how they are articulated.',
    body: ['Whatever decision is taken, the reasoning context is preserved.'],
    closing: 'That preservation becomes institutional memory.',
  },
];

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 md:pb-32">

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-5xl mb-16 sm:mb-20"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium select-none">
            Design Principles
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-6 max-w-2xl">
            Ary does not optimize decisions.
          </h1>
          <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 font-light max-w-2xl">
            It enforces structured articulation.
          </p>
        </motion.section>

        {principles.map((p, index) => (
          <div key={p.number}>
            <Divider />
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6, ease, delay: 0.04 * index }}
              className="max-w-5xl mb-16 sm:mb-20"
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xs tracking-[0.2em] uppercase text-neutral-300 dark:text-neutral-600 mb-4 font-medium select-none"
              >
                {p.number}
              </motion.p>
              <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
                {p.title}
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-6">
                {p.lead}
              </p>
              {p.negations && (
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="space-y-1 mb-5"
                >
                  {p.negations.map((line) => (
                    <motion.p
                      key={line}
                      variants={listItem}
                      className="text-neutral-400 dark:text-neutral-500 font-light text-base"
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>
              )}
              {p.body && (
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="space-y-2 mb-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light"
                >
                  {p.body.map((line) => (
                    <motion.p key={line} variants={listItem}>
                      {line}
                    </motion.p>
                  ))}
                </motion.div>
              )}
              {p.closing && (
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-light"
                >
                  {p.closing}
                </motion.p>
              )}
            </motion.section>
          </div>
        ))}

      </div>

      <Footer />
    </main>
  );
}
