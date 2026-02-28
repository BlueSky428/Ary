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

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 md:pb-32">

        {/* About Inlyth */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-5xl mb-16 sm:mb-20"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium select-none">
            About Inlyth
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-7 max-w-2xl">
            Structured decision infrastructure for institutional defensibility.
          </h1>
          <div className="space-y-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
            <p>
              Inlyth was founded to address a structural gap in high-stakes decision environments:
              institutions record outcomes but rarely preserve the structured reasoning context that
              justified them.
            </p>
            <p>
              Ary is the result of disciplined design and iterative refinement — system architecture built
              for real institutional use, not theoretical research.
            </p>
          </div>
        </motion.section>

        <Divider />

        {/* Collins Mbeutcha */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-16 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 tracking-tight mb-1.5">
            Collins Mbeutcha
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-500 font-light mb-7">
            Founder &amp; CEO &nbsp;·&nbsp; University of Oxford &nbsp;·&nbsp; Former World Bank
          </p>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-7">
            Collins architected the Ary reasoning-to-decision framework. His work focuses on structuring
            reasoning without influencing judgment, preserving contemporaneous articulation in high-stakes
            institutional environments.
          </p>
          <p className="text-xs tracking-[0.16em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium">
            He designed:
          </p>
          <DashList
            items={[
              'The reasoning mechanisms and structural ontology',
              'The deterministic articulation protocol',
              'The reasoning-to-decision ledger model',
              'The governance architecture behind Ary',
            ]}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-light max-w-2xl leading-relaxed"
          >
            Ary&apos;s structure reflects that philosophy: discipline over narrative, preservation over
            reconstruction.
          </motion.p>
        </motion.section>

        <Divider />

        {/* Yamate Sasaki */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl mb-16 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 tracking-tight mb-1.5">
            Yamate Sasaki
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-500 font-light mb-7">
            Founding Engineer &nbsp;·&nbsp; Ledger Architecture &amp; Deterministic Systems
          </p>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-7">
            Yamate implemented the Ary ledger and deterministic compilation system. He specializes in
            building stable, production-grade systems where correctness and structural integrity are
            critical.
          </p>
          <p className="text-xs tracking-[0.16em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium">
            He built:
          </p>
          <DashList
            items={[
              'The reasoning extraction pipeline',
              'The versioned ledger architecture',
              'The executive retrieval interface',
              'The production artifact generation system',
            ]}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-light max-w-2xl leading-relaxed"
          >
            Ary&apos;s implementation emphasizes stability, clarity, and deterministic behavior — ensuring
            reasoning is preserved exactly as articulated.
          </motion.p>
        </motion.section>

        <Divider />

        {/* Advisors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease }}
          className="max-w-5xl"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 tracking-tight mb-6">
            Advisors
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
            Inlyth engages with senior practitioners across legal, procurement, governance, and
            institutional decision environments. Their role is to test structure against real-world
            conditions and ensure practical defensibility.
          </p>
        </motion.section>

      </div>

      <Footer />
    </main>
  );
}
