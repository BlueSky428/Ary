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

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const tagContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const tagItem = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
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

function DashList({ items }: { items: string[] }) {
  return (
    <motion.ul
      variants={listContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="space-y-2.5"
    >
      {items.map((item) => (
        <motion.li key={item} variants={listItem} className="flex items-start gap-3">
          <span className="text-neutral-300 dark:text-neutral-600 shrink-0 mt-[4px] text-sm select-none">
            —
          </span>
          <span className="text-neutral-600 dark:text-neutral-400 font-light text-base sm:text-lg leading-relaxed">
            {item}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

const atomicElements = [
  'Strategy',
  'Trade-off',
  'Constraint',
  'Uncertainty',
  'Rejected alternative',
  'Priority declaration',
  'Conditional logic',
  'Information source',
];

const elementProperties = ['Verbatim anchored', 'Time-stamped', 'Categorized', 'Queryable'];

const filterDimensions = [
  'Strategy option',
  'Constraint',
  'Uncertainty',
  'Rejected alternative',
  'Priority',
  'Information source',
  'Date',
  'Session',
  'Version',
];

export default function LedgerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 md:pb-32">

        {/* Intro */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-5xl mb-16 sm:mb-20"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium select-none">
            The Ledger
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-6 max-w-2xl">
            Ary compiles structured sessions into a versioned decision ledger.
          </h1>
          <div className="space-y-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
            <p>
              Each session captures the structured reasoning context for one defined strategy option at time T.
            </p>
            <p>
              Institutions already record outcomes. The ledger preserves the structured context that
              justified them.
            </p>
          </div>
        </motion.section>

        <Divider />

        {/* Atomic Structure */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-16 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
            Atomic Structure
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light mb-7">
            Reasoning is captured in discrete elements:
          </p>
          <motion.ul
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 mb-10 max-w-2xl"
          >
            {atomicElements.map((item) => (
              <motion.li key={item} variants={gridItem} className="flex items-start gap-3">
                <span className="text-neutral-300 dark:text-neutral-600 shrink-0 mt-[3px] text-[13px] select-none">
                  —
                </span>
                <span className="text-neutral-600 dark:text-neutral-400 font-light text-base">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light mb-4">
            Each element is:
          </p>
          <motion.div
            variants={tagContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {elementProperties.map((prop) => (
              <motion.span
                key={prop}
                variants={tagItem}
                whileHover={{ scale: 1.04, y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="px-4 py-2 text-sm font-light text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700/60 rounded-md cursor-default"
              >
                {prop}
              </motion.span>
            ))}
          </motion.div>
          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-1"
          >
            {['No summaries.', 'No narrative reconstruction.', 'No reinterpretation.'].map((line) => (
              <motion.p
                key={line}
                variants={listItem}
                className="text-neutral-400 dark:text-neutral-500 font-light text-base"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        </motion.section>

        <Divider />

        {/* Versioning */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-16 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
            Versioning
          </h2>
          <div className="space-y-2 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light mb-7">
            <p>Context evolves.</p>
            <p>Records do not.</p>
          </div>
          <div className="space-y-2 text-base sm:text-lg text-neutral-500 dark:text-neutral-500 font-light mb-7">
            <p>If assumptions change, a new session is created.</p>
            <p>Previous records remain intact.</p>
          </div>
          <p className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light">
            Continuity without revision.
          </p>
        </motion.section>

        <Divider />

        {/* Retrieval */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
            Retrieval
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light mb-7">
            The ledger supports structured retrieval across time.
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light mb-5">Filter by:</p>
          <DashList items={filterDimensions} />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <p className="text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100 font-light">
              When scrutiny arrives, you don&apos;t reconstruct.
            </p>
            <p className="mt-1 text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100 font-light">
              You retrieve.
            </p>
          </motion.div>
        </motion.section>

      </div>

      <Footer />
    </main>
  );
}
