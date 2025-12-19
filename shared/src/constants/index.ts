/**
 * Shared constants for Ary application
 */

import { CompetenceBranch } from '../types';

/**
 * Session Configuration
 */
export const SESSION_CONFIG = {
  WARM_SESSION_DURATION_MINUTES: 20,
  FOLLOW_UP_DURATION_MINUTES: 10,
  MAX_FOLLOW_UPS: 2,
} as const;

/**
 * Competence Branch Labels
 */
export const COMPETENCE_BRANCH_LABELS: Record<CompetenceBranch, string> = {
  [CompetenceBranch.COGNITIVE]: 'Cognitive',
  [CompetenceBranch.INTERPERSONAL]: 'Interpersonal',
  [CompetenceBranch.MOTIVATION]: 'Motivation',
  [CompetenceBranch.EXECUTION]: 'Execution',
};

/**
 * Competence Branch Descriptions
 */
export const COMPETENCE_BRANCH_DESCRIPTIONS: Record<CompetenceBranch, string> = {
  [CompetenceBranch.COGNITIVE]: 'How you think, analyze, and process information',
  [CompetenceBranch.INTERPERSONAL]: 'How you connect, communicate, and relate to others',
  [CompetenceBranch.MOTIVATION]: 'What energizes you and drives your actions',
  [CompetenceBranch.EXECUTION]: 'How you act, organize, and deliver results',
};

/**
 * Boundary Rules
 */
export const BOUNDARY_RULES = {
  // Prohibited phrases/patterns
  PROHIBITED_PATTERNS: [
    /you should/i,
    /you need to/i,
    /you must/i,
    /you're (?:suffering from|diagnosed with|have)/i,
    /you have (?:a|an) (?:disorder|condition|problem)/i,
    /your score/i,
    /you rank/i,
    /you're (?:better|worse) than/i,
  ],
  // Distress indicators
  DISTRESS_INDICATORS: [
    /want to (?:die|kill myself|end it)/i,
    /suicide/i,
    /self harm/i,
    /can't go on/i,
  ],
} as const;

/**
 * Inference Keywords (MVP - Rule-based)
 * These will be replaced with LLM-based inference in future
 */
export const INFERENCE_KEYWORDS: Record<CompetenceBranch, string[]> = {
  [CompetenceBranch.COGNITIVE]: [
    'analyze', 'structure', 'organize', 'think', 'understand', 'solve',
    'complexity', 'pattern', 'logic', 'reasoning', 'strategy', 'plan',
  ],
  [CompetenceBranch.INTERPERSONAL]: [
    'help', 'support', 'listen', 'understand', 'calm', 'trust', 'connect',
    'communicate', 'relate', 'empathy', 'collaborate', 'team',
  ],
  [CompetenceBranch.MOTIVATION]: [
    'excited', 'energized', 'passionate', 'driven', 'motivated', 'purpose',
    'meaning', 'fulfillment', 'satisfaction', 'inspired', 'engaged',
  ],
  [CompetenceBranch.EXECUTION]: [
    'deliver', 'complete', 'finish', 'execute', 'implement', 'action',
    'results', 'outcome', 'achieve', 'accomplish', 'produce', 'create',
  ],
};

