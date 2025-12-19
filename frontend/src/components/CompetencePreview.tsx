'use client';

/**
 * Competence Tree Preview
 * Beautiful visualization of extracted signals
 */

import { motion } from 'framer-motion';
import { CompetenceBranch, COMPETENCE_BRANCH_LABELS } from '@ary/shared';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface Signal {
  branch: CompetenceBranch;
  trait: string;
}

interface CompetencePreviewProps {
  signals: Signal[];
}

const branchColors: Record<CompetenceBranch, string> = {
  [CompetenceBranch.COGNITIVE]: 'from-blue-500 to-blue-600',
  [CompetenceBranch.INTERPERSONAL]: 'from-purple-500 to-purple-600',
  [CompetenceBranch.MOTIVATION]: 'from-pink-500 to-pink-600',
  [CompetenceBranch.EXECUTION]: 'from-green-500 to-green-600',
};

const branchBgColors: Record<CompetenceBranch, string> = {
  [CompetenceBranch.COGNITIVE]: 'bg-blue-50 border-blue-200',
  [CompetenceBranch.INTERPERSONAL]: 'bg-purple-50 border-purple-200',
  [CompetenceBranch.MOTIVATION]: 'bg-pink-50 border-pink-200',
  [CompetenceBranch.EXECUTION]: 'bg-green-50 border-green-200',
};

export function CompetencePreview({ signals }: CompetencePreviewProps) {
  if (signals.length === 0) return null;

  const signalsByBranch = signals.reduce((acc, signal) => {
    if (!acc[signal.branch]) {
      acc[signal.branch] = [];
    }
    acc[signal.branch].push(signal);
    return acc;
  }, {} as Record<CompetenceBranch, Signal[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-br from-white via-primary-50/20 to-accent-50/20 dark:from-neutral-900 dark:via-primary-950/20 dark:to-accent-950/20 border-t border-neutral-200/50 dark:border-neutral-700/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/25">
          <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Here&apos;s what I see in you
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            Your competence reflected back
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(signalsByBranch).map(([branch, branchSignals], branchIndex) => (
          <motion.div
            key={branch}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: branchIndex * 0.1 }}
            className={`p-5 rounded-xl border-2 ${branchBgColors[branch as CompetenceBranch]} backdrop-blur-sm`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${branchColors[branch as CompetenceBranch]}`} />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {COMPETENCE_BRANCH_LABELS[branch as CompetenceBranch]}
              </h4>
            </div>
            <ul className="space-y-2.5">
              {branchSignals.map((signal, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: branchIndex * 0.1 + idx * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {signal.trait}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-neutral-500 dark:text-neutral-400 mt-6 text-center italic"
      >
        This is a demo. Sign up to experience the full Ary companion and build
        your complete competence tree.
      </motion.p>
    </motion.div>
  );
}
