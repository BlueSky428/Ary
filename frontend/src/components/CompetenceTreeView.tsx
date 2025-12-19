'use client';

/**
 * Competence Tree View
 * Shows all 4 branches with progress bars and icons
 */

import { motion } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Zap, 
  Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CompetenceBranch } from '@ary/shared';
import type { LucideIcon } from 'lucide-react';

interface BranchConfig {
  branch: CompetenceBranch;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient: string;
  progress: number;
}

const branches: BranchConfig[] = [
  {
    branch: CompetenceBranch.COGNITIVE,
    icon: Brain,
    title: 'Cognitive',
    description: 'How you think, analyze, and solve problems',
    color: 'pink',
    gradient: 'from-pink-500 to-purple-500',
    progress: 65,
  },
  {
    branch: CompetenceBranch.INTERPERSONAL,
    icon: Users,
    title: 'Interpersonal',
    description: 'How you connect, communicate, and work with others',
    color: 'yellow',
    gradient: 'from-yellow-500 to-purple-500',
    progress: 68,
  },
  {
    branch: CompetenceBranch.MOTIVATION,
    icon: Zap,
    title: 'Motivation',
    description: 'What energizes and drives you forward',
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    progress: 62,
  },
  {
    branch: CompetenceBranch.EXECUTION,
    icon: Target,
    title: 'Execution',
    description: 'How you get things done and deliver results',
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    progress: 70,
  },
];

export function CompetenceTreeView() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28 md:pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 via-accent-400/40 to-primary-400/40 rounded-2xl blur-xl animate-pulse" />
              
              {/* Main logo container */}
              <div className="relative w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl shadow-2xl overflow-hidden">
                {/* Abstract design - representing reflection/growth */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Central circle */}
                  <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full blur-sm" />
                  
                  {/* Rotating rings */}
                  <div className="absolute w-16 h-16 md:w-18 md:h-18 border-2 border-white/30 rounded-full" />
                  <div className="absolute w-8 h-8 md:w-9 md:h-9 border-2 border-white/40 rounded-full" />
                  
                  {/* Accent dots */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-white/60 rounded-full" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white/60 rounded-full" />
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-2 bg-white/60 rounded-full" />
                  <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-white/60 rounded-full" />
                  
                  {/* Central highlight */}
                  <div className="absolute w-4 h-4 md:w-5 md:h-5 bg-white/50 rounded-full blur-[2px]" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4"
          >
            Your Competence Tree
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
          >
            Here&apos;s what I see in you. This is a reflection, not a judgment—simply patterns of strength drawn from your own words.
          </motion.p>
        </div>

        {/* Competence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {branches.map((branch, index) => {
            const Icon = branch.icon;
            return (
              <motion.div
                key={branch.branch}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${branch.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {branch.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {branch.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400">Observed strength</span>
                    <span className={`font-medium ${
                      branch.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                      branch.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      branch.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      Emerging
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${branch.progress}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${branch.gradient} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* What this means */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 mb-8"
        >
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            What this means
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                You demonstrate thoughtful reflection and self-awareness.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                You&apos;re open to exploring your strengths and capabilities.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 text-center"
        >
          <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Want the full Ary experience?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
            This demo shows just a glimpse. The real Ary offers deeper reflection, ongoing sessions, and a continuously evolving view of your professional strengths.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => router.push('/waitlist')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md font-medium"
            >
              Join the waitlist
              <span>→</span>
            </motion.button>
            <motion.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all font-medium shadow-sm hover:shadow-md"
            >
              <span className="text-lg">↻</span>
              Try again
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

