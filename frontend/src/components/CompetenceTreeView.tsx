'use client';

/**
 * Competence Tree View
 * Shows competence summary and visual tree without progress bars/gauges
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { RedesignedCompetenceTreeView } from './RedesignedCompetenceTreeView';
import type { ConversationResult } from '@/lib/conversationResults';
import type { ConversationHistory } from '@/lib/conversationResults';

export function CompetenceTreeView() {
  // Use the redesigned component
  return <RedesignedCompetenceTreeView />;
}

export function OldCompetenceTreeView() {
  const router = useRouter();
  const [conversationResult, setConversationResult] = useState<ConversationResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);

  useEffect(() => {
    // Load conversation data from sessionStorage
    const storedResult = sessionStorage.getItem('conversationResult');
    const storedHistory = sessionStorage.getItem('conversationHistory');
    
    if (storedResult) {
      try {
        setConversationResult(JSON.parse(storedResult));
      } catch (e) {
        console.error('Failed to parse conversation result', e);
      }
    }
    
    if (storedHistory) {
      try {
        setConversationHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse conversation history', e);
      }
    }
  }, []);

  // Default result if none available
  const result: ConversationResult = conversationResult || {
    id: 'default',
    title: 'Reflective Thinker',
    summary: "You demonstrate thoughtful reflection and self-awareness.",
    competencies: ['Self-awareness', 'Reflection'],
    detailedEvaluation: "Based on your conversation, you show a thoughtful and reflective approach to understanding your strengths and patterns.",
    matchingPatterns: {
      questionIds: [],
      keywordPatterns: [],
      competencePatterns: [],
    },
  };

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
                  <div className="absolute w-8 h-8 md:w-9 md:w-9 border-2 border-white/40 rounded-full" />
                  
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
            className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2"
          >
            Your Identity Core
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-xl md:text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4"
          >
            {result.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
          >
            Here&apos;s what I see in you. This is a reflection, not a judgment—simply patterns of strength drawn from your own words.
          </motion.p>
        </div>

        {/* Competence Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 mb-8"
        >
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Competence Summary
          </h3>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
            {result.summary}
          </p>
          
          {/* Detailed Evaluation */}
          {result.detailedEvaluation && (
            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
              <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                Detailed Evaluation
              </h4>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
                {result.detailedEvaluation}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Mapped Competencies:
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.competencies.map((comp, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium border border-primary-200/50 dark:border-primary-800/50"
                >
                  {comp}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Visual Identity Core Tree with Conversation Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 mb-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 text-center">
              Your Competence Tree
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Each node shows patterns from your conversation. Click to see the evidence.
            </p>
          </div>
          <EnhancedIdentityCoreTree 
            competencies={result.competencies} 
            conversationHistory={conversationHistory}
          />
        </motion.div>

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
                This reflection is based on patterns in your own words, not external evaluation.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                You can edit, refine, or expand on any of these insights at any time.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                This is a starting point for deeper self-reflection, not a final assessment.
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
              onClick={() => router.push('/demo')}
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
