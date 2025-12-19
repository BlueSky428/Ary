/**
 * Question Taxonomy
 * Defines permissible question types for psychological calibration
 * Enforces non-evaluative, non-therapeutic boundaries
 */

import { QuestionType } from '@ary/shared';

export interface Question {
  type: QuestionType;
  text: string;
  branch?: string; // Optional: which competence branch this explores
}

/**
 * Question Templates
 * These are examples - actual questions are generated dynamically
 */
export const QUESTION_TEMPLATES: Record<QuestionType, string[]> = {
  [QuestionType.REFLECTIVE]: [
    'What did that experience show you about how you work?',
    'How did that moment feel for you?',
    'What stands out to you about that situation?',
  ],
  [QuestionType.EXPLORATORY]: [
    'What feels important to you right now?',
    'What would you like to explore today?',
    'What\'s on your mind?',
  ],
  [QuestionType.STRENGTH_ELICITING]: [
    'When do you feel most capable?',
    'Can you think of a time when you felt useful or effective?',
    'What activities energize you?',
  ],
  [QuestionType.GROWTH_INVITATION]: [
    'Would you like to explore this further?',
    'Is there more you\'d like to reflect on?',
    'Would it be helpful to dive deeper into this?',
  ],
};

/**
 * Prohibited Question Patterns
 * These must never be used
 */
export const PROHIBITED_QUESTION_PATTERNS = [
  /how (?:well|good|bad) (?:are|were) you/i,
  /what (?:is|are) your (?:weakness|strength|score|rating)/i,
  /you should/i,
  /you need to/i,
  /you must/i,
  /have you (?:ever|been) (?:diagnosed|treated)/i,
  /do you (?:suffer|have) (?:from|with)/i,
];

/**
 * Validate question text against boundaries
 */
export function validateQuestion(text: string): {
  valid: boolean;
  violation?: string;
} {
  for (const pattern of PROHIBITED_QUESTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        valid: false,
        violation: 'Question contains prohibited evaluative or diagnostic language',
      };
    }
  }

  return { valid: true };
}

/**
 * Generate appropriate question based on context
 */
export function generateQuestion(
  type: QuestionType,
  context?: string
): Question {
  const templates = QUESTION_TEMPLATES[type];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  return {
    type,
    text: randomTemplate,
  };
}

