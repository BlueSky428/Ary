'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ArrowRight } from 'lucide-react';

// ─── Shared animation primitives ─────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

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
  show: { transition: { staggerChildren: 0.06 } },
};

const tagItem = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
};

const vp = { once: true, margin: '-60px' };

// ─── Shared components ────────────────────────────────────────────────────────

function Eyebrow({ label }: { label: string }) {
  return (
    <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium select-none">
      {label}
    </p>
  );
}

function Divider() {
  return (
    <div className="max-w-5xl mb-20 sm:mb-24 overflow-hidden">
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

function CtaButton({ href, label }: { href: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="inline-block"
    >
      <Link
        href={href}
        className="group inline-flex items-center gap-3 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-base font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors duration-200 rounded-lg"
      >
        {label}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const whatAryRecords = [
  'Strategy under consideration',
  'Trade-offs',
  'Constraints',
  'Uncertainties',
  'Rejected alternatives',
  'Priority declarations',
  'Conditional logic',
  'Information sources',
];

const whoItIsFor = [
  'Procurement teams',
  'Legal strategy teams',
  'Compliance departments',
  'Institutional decision bodies',
  'Executive committees',
];

const howItWorks = [
  'Structured articulation',
  'Deterministic compilation',
  'Immutable ledger',
  'Queryable executive view',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 md:pb-32">

        {/* ── Hero — animate on mount, not scroll ── */}
        <section className="max-w-5xl mb-20 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0 }}
          >
            <Eyebrow label="The Core Proposition" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight leading-[1.15] mb-7 max-w-3xl"
          >
            Record the structured decision context at time T.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light mb-6 max-w-2xl"
          >
            Context evolves. History should not.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="space-y-2 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-8"
          >
            <p>Institutions routinely record outcomes.</p>
            <p>They do not preserve the structured context that supported them.</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light mb-10 max-w-2xl"
          >
            Defensibility requires preserving both.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.55 }}
          >
            <CtaButton href="/request-pilot" label="Request a Pilot" />
          </motion.div>
        </section>

        <Divider />

        {/* ── The Problem ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-20 sm:mb-24"
        >
          <Eyebrow label="The Problem" />
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-4 max-w-2xl">
            Decisions survive. Context disappears.
          </h2>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light mb-6">
            When scrutiny arrives:
          </p>
          <DashList
            items={[
              'Teams reconstruct from memory.',
              'Explanations evolve.',
              'Documentation is fragmented.',
              'Institutional memory is incomplete.',
            ]}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-lg sm:text-2xl text-neutral-900 dark:text-neutral-100 font-medium tracking-tight"
          >
            Reconstruction is risk.
          </motion.p>
        </motion.section>

        <Divider />

        {/* ── The Shift ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-20 sm:mb-24"
        >
          <Eyebrow label="The Shift" />
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-7 max-w-2xl">
            Defensibility requires contemporaneous structure.
          </h2>
          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-2 mb-8"
          >
            {['Not summaries.', 'Not hindsight reports.', 'Not narrative reconstruction.'].map((line) => (
              <motion.p
                key={line}
                variants={listItem}
                className="text-neutral-400 dark:text-neutral-500 font-light text-base"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
          <p className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light max-w-2xl leading-relaxed">
            Structured reasoning, captured at the moment of decision.
          </p>
        </motion.section>

        <Divider />

        {/* ── What Ary Does ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-20 sm:mb-24"
        >
          <Eyebrow label="What Ary Does" />
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-8 max-w-2xl">
            Ary records the structured reasoning context behind defined strategy options.
          </h2>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light mb-5">
            Captured elements:
          </p>
          <motion.ul
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 mb-10 max-w-2xl"
          >
            {whatAryRecords.map((item) => (
              <motion.li key={item} variants={gridItem} className="flex items-start gap-3">
                <span className="text-neutral-300 dark:text-neutral-600 shrink-0 mt-[3px] text-[13px] select-none">
                  —
                </span>
                <span className="text-neutral-600 dark:text-neutral-400 font-light text-base">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-2 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light mb-7"
          >
            {[
              'Each element is captured atomically.',
              'Each entry is time-anchored.',
              'Each session is versioned.',
            ].map((line) => (
              <motion.p key={line} variants={listItem}>
                {line}
              </motion.p>
            ))}
          </motion.div>
          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-1 mb-7"
          >
            {['No scoring.', 'No recommendations.', 'No rewriting decisions.'].map((line) => (
              <motion.p
                key={line}
                variants={listItem}
                className="text-neutral-400 dark:text-neutral-500 font-light text-base"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
          <p className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light">
            Only structured reasoning context.
          </p>
        </motion.section>

        <Divider />

        {/* ── Why It Matters ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-20 sm:mb-24"
        >
          <Eyebrow label="Why It Matters" />
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-8 max-w-2xl leading-snug">
            When scrutiny arrives, you don&apos;t reconstruct. You retrieve.
          </h2>
          <DashList
            items={[
              'When leadership changes, knowledge persists.',
              'When audits occur, reasoning is attributable.',
              'When litigation emerges, context is preserved.',
            ]}
          />
          <p className="mt-8 text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light max-w-2xl">
            By the time scrutiny arrives, reconstruction is already risk.
          </p>
        </motion.section>

        <Divider />

        {/* ── Who It Is For ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-20 sm:mb-24"
        >
          <Eyebrow label="Who It Is For" />
          <motion.div
            variants={tagContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {whoItIsFor.map((item) => (
              <motion.span
                key={item}
                variants={tagItem}
                whileHover={{ scale: 1.04, y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="px-4 py-2 text-sm font-light text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700/60 rounded-md cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
          <p className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light">
            Organizations where defensibility is non-negotiable.
          </p>
        </motion.section>

        <Divider />

        {/* ── How It Works ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-20 sm:mb-24"
        >
          <Eyebrow label="How It Works" />
          <motion.ol
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-3.5 mb-8 max-w-sm"
          >
            {howItWorks.map((item, index) => (
              <motion.li key={item} variants={listItem} className="flex items-start gap-4">
                <span className="text-neutral-300 dark:text-neutral-600 font-light text-base shrink-0 w-6 tabular-nums mt-[2px] select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-neutral-700 dark:text-neutral-300 font-light text-base sm:text-lg">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ol>
          <p className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 font-light">
            Simple. Disciplined. Defensible.
          </p>
        </motion.section>

        <Divider />

        {/* ── Deliberate Invocation ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-20 sm:mb-24"
        >
          <Eyebrow label="Deliberate Invocation" />
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-7 max-w-2xl">
            Ary is invoked deliberately when defensibility is required.
          </h2>
          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-2 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-2xl"
          >
            <motion.p variants={listItem}>It does not monitor or capture decisions automatically.</motion.p>
            <motion.p variants={listItem}>Institutions retain full control over when context is preserved.</motion.p>
          </motion.div>
        </motion.section>

        <div className="max-w-5xl overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.9, ease }}
            className="h-px bg-neutral-100 dark:bg-neutral-800 origin-left"
          />
        </div>

        {/* ── Request a Pilot CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mt-20 sm:mt-24"
        >
          <Eyebrow label="Request a Pilot" />
          <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 font-light max-w-xl mb-8 leading-relaxed">
            If your institution makes high-stakes decisions, structured context is not optional.
          </p>
          <CtaButton href="/request-pilot" label="Request a Pilot" />
        </motion.section>

      </div>

      <Footer />
    </main>
  );
}
