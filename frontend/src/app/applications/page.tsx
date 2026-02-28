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

type Domain = {
  name: string;
  items: string[];
  context: string[];
  closing: string;
};

const domains: Domain[] = [
  {
    name: 'Procurement',
    items: [
      'Tender evaluation',
      'Direct award justification',
      'Competitive assessment',
      'Regulatory defensibility',
      'Audit preparation',
    ],
    context: ['Procurement outcomes are published.', 'Reasoning attribution is rarely preserved.'],
    closing: 'Ary provides that missing layer.',
  },
  {
    name: 'Legal Strategy',
    items: [
      'Case strategy articulation',
      'Settlement positioning',
      'Procedural decision records',
      'Litigation defensibility',
      'Internal review documentation',
    ],
    context: ['Legal work evolves.', 'Context changes.', 'Scrutiny arrives later.'],
    closing:
      'Ary does not constrain judgment. It preserves contemporaneous articulation when defensibility matters.',
  },
  {
    name: 'Compliance',
    items: [
      'Internal reviews',
      'Risk assessments',
      'Board approvals',
      'Policy interpretation',
      'Escalation documentation',
    ],
    context: ['Compliance requires traceability.'],
    closing: 'Ary preserves contemporaneous reasoning context.',
  },
  {
    name: 'Executive Governance',
    items: [
      'Strategic shifts',
      'Capital allocation',
      'Market entry decisions',
      'Policy revisions',
      'Institutional transitions',
    ],
    context: ['Leadership changes.', 'Context disappears.'],
    closing: 'Ary preserves continuity.',
  },
];

export default function ApplicationsPage() {
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
            Applications
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-6 max-w-2xl">
            Structured defensibility across high-stakes domains.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
            Ary records the structured reasoning context behind defined strategy options at time T,
            wherever defensibility matters.
          </p>
        </motion.section>

        {domains.map((domain, index) => (
          <div key={domain.name}>
            <Divider />
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6, ease, delay: 0.04 * index }}
              className="max-w-5xl mb-16 sm:mb-20"
            >
              <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-7 tracking-tight">
                {domain.name}
              </h2>
              <DashList items={domain.items} />
              <motion.div
                variants={listContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="mt-7 space-y-1"
              >
                {domain.context.map((line) => (
                  <motion.p
                    key={line}
                    variants={listItem}
                    className="text-base text-neutral-500 dark:text-neutral-500 font-light"
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-light"
              >
                {domain.closing}
              </motion.p>
            </motion.section>
          </div>
        ))}

      </div>

      <Footer />
    </main>
  );
}
