/**
 * Simplified Conversation Tree System
 * 2 fixed opening questions + 5 AI follow-up placeholders
 * Competencies map to all five pillars: Collaboration & Stakeholder Navigation,
 * Decision Framing & Judgment, Execution & Ownership, Learning & Adaptation,
 * Initiative & Impact Orientation
 */

export enum ResponseCategory {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  DETAILED = 'detailed',
  VAGUE = 'vague',
}

export interface AnswerOption {
  id: string;
  text: string;
  category: ResponseCategory;
  keywords: string[];
  competencies: string[];
  nextQuestionId: string; // Points to next question
}

export interface QuestionNode {
  id: string;
  question: string;
  answerOptions: AnswerOption[];
  reactionTemplates: {
    [ResponseCategory.POSITIVE]: string;
    [ResponseCategory.NEGATIVE]: string;
    [ResponseCategory.DETAILED]: string;
    [ResponseCategory.VAGUE]: string;
  };
}

export interface ConversationResult {
  id: string;
  title: string;
  summary: string;
  competencies: string[];
  detailedEvaluation: string;
  matchingPatterns: {
    questionIds: string[];
    keywordPatterns: string[];
    competencePatterns: string[];
  };
}

/**
 * Simplified Conversation Tree
 * - First 2 questions are fixed (Ary Opening Lines)
 * - Next 5 questions are AI-driven follow-ups (placeholders for now)
 * - Competencies map to all five pillars
 */
export const conversationTree: Record<string, QuestionNode> = {
  // Fixed Question 1: Ary Opening Line
  'q1': {
    id: 'q1',
    question: "Hello. My name is Ary. First, tell me your thoughts about an AI companion?",
    answerOptions: [
      {
        id: 'a1-1',
        text: "I'm curious about how AI can help with professional development.",
        category: ResponseCategory.DETAILED,
        keywords: ['curious', 'help', 'professional', 'development'],
        competencies: ['openness', 'learning'],
        nextQuestionId: 'q2',
      },
      {
        id: 'a1-2',
        text: "I think AI could be useful for reflection and self-awareness.",
        category: ResponseCategory.DETAILED,
        keywords: ['useful', 'reflection', 'self-awareness'],
        competencies: ['reflection', 'self-awareness'],
        nextQuestionId: 'q2',
      },
      {
        id: 'a1-3',
        text: "I'm not sure what to think about AI companions yet.",
        category: ResponseCategory.VAGUE,
        keywords: ['not sure'],
        competencies: [],
        nextQuestionId: 'q2',
      },
      {
        id: 'a1-4',
        text: "I'm interested in trying new tools for professional growth.",
        category: ResponseCategory.POSITIVE,
        keywords: ['interested', 'tools', 'professional', 'growth'],
        competencies: ['openness', 'growth-mindset'],
        nextQuestionId: 'q2',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "Thanks for sharing.",
      [ResponseCategory.NEGATIVE]: "Thanks for sharing.",
      [ResponseCategory.DETAILED]: "Thanks for sharing.",
      [ResponseCategory.VAGUE]: "Thanks for sharing.",
    },
  },

  // Fixed Question 2: Ary Opening Line
  'q2': {
    id: 'q2',
    question: "Thanks for sharing. Are you preparing for anything at the moment? Uni, internship, job applications, or something else?",
    answerOptions: [
      {
        id: 'a2-1',
        text: "I'm preparing for job applications.",
        category: ResponseCategory.DETAILED,
        keywords: ['job', 'applications', 'preparing'],
        competencies: ['goal-driven', 'planning'],
        nextQuestionId: 'q3',
      },
      {
        id: 'a2-2',
        text: "I'm looking for internships.",
        category: ResponseCategory.DETAILED,
        keywords: ['internships', 'looking'],
        competencies: ['goal-driven', 'planning'],
        nextQuestionId: 'q3',
      },
      {
        id: 'a2-3',
        text: "I'm currently in university.",
        category: ResponseCategory.DETAILED,
        keywords: ['university', 'studying'],
        competencies: ['learning', 'growth-mindset'],
        nextQuestionId: 'q3',
      },
      {
        id: 'a2-4',
        text: "I'm exploring my options.",
        category: ResponseCategory.VAGUE,
        keywords: ['exploring', 'options'],
        competencies: ['openness'],
        nextQuestionId: 'q3',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "Understood.",
      [ResponseCategory.NEGATIVE]: "Understood.",
      [ResponseCategory.DETAILED]: "Understood.",
      [ResponseCategory.VAGUE]: "Understood.",
    },
  },

  // AI Follow-up Question 1 (Placeholder - would normally come from GPT)
  'q3': {
    id: 'q3',
    question: "How do you typically work with others on projects?",
    answerOptions: [
      {
        id: 'a3-1',
        text: "I prefer collaborating closely and sharing ideas.",
        category: ResponseCategory.DETAILED,
        keywords: ['collaborating', 'sharing', 'ideas', 'closely'],
        competencies: ['collaboration', 'teamwork', 'interpersonal skills'],
        nextQuestionId: 'q4',
      },
      {
        id: 'a3-2',
        text: "I like to divide tasks and coordinate.",
        category: ResponseCategory.DETAILED,
        keywords: ['divide', 'tasks', 'coordinate'],
        competencies: ['coordination', 'teamwork'],
        nextQuestionId: 'q4',
      },
      {
        id: 'a3-3',
        text: "I work independently but check in regularly.",
        category: ResponseCategory.DETAILED,
        keywords: ['independently', 'check in'],
        competencies: ['coordination', 'active listening'],
        nextQuestionId: 'q4',
      },
      {
        id: 'a3-4',
        text: "It depends on the project.",
        category: ResponseCategory.VAGUE,
        keywords: ['depends'],
        competencies: ['adaptability'],
        nextQuestionId: 'q4',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "Got it.",
      [ResponseCategory.NEGATIVE]: "Got it.",
      [ResponseCategory.DETAILED]: "Got it.",
      [ResponseCategory.VAGUE]: "Got it.",
    },
  },

  // AI Follow-up Question 2 (Placeholder - would normally come from GPT)
  'q4': {
    id: 'q4',
    question: "What helps you communicate effectively with team members?",
    answerOptions: [
      {
        id: 'a4-1',
        text: "I listen actively and ask clarifying questions.",
        category: ResponseCategory.DETAILED,
        keywords: ['listen', 'actively', 'questions', 'clarifying'],
        competencies: ['active listening', 'interpersonal skills', 'empathy'],
        nextQuestionId: 'q5',
      },
      {
        id: 'a4-2',
        text: "I share updates regularly and keep everyone informed.",
        category: ResponseCategory.DETAILED,
        keywords: ['share', 'updates', 'informed'],
        competencies: ['coordination', 'helpfulness'],
        nextQuestionId: 'q5',
      },
      {
        id: 'a4-3',
        text: "I try to understand different perspectives.",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'perspectives'],
        competencies: ['empathy', 'interpersonal skills'],
        nextQuestionId: 'q5',
      },
      {
        id: 'a4-4',
        text: "I focus on clear and direct communication.",
        category: ResponseCategory.DETAILED,
        keywords: ['clear', 'direct', 'communication'],
        competencies: ['coordination'],
        nextQuestionId: 'q5',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "Noted.",
      [ResponseCategory.NEGATIVE]: "Noted.",
      [ResponseCategory.DETAILED]: "Noted.",
      [ResponseCategory.VAGUE]: "Noted.",
    },
  },

  // AI Follow-up Question 3 (Placeholder - would normally come from GPT)
  'q5': {
    id: 'q5',
    question: "How do you approach helping colleagues when they need support?",
    answerOptions: [
      {
        id: 'a5-1',
        text: "I offer help proactively when I see someone struggling.",
        category: ResponseCategory.DETAILED,
        keywords: ['offer', 'help', 'proactively', 'struggling'],
        competencies: ['helpfulness', 'empathy', 'teamwork'],
        nextQuestionId: 'q6',
      },
      {
        id: 'a5-2',
        text: "I respond when asked and try to be available.",
        category: ResponseCategory.DETAILED,
        keywords: ['respond', 'asked', 'available'],
        competencies: ['helpfulness', 'teamwork'],
        nextQuestionId: 'q6',
      },
      {
        id: 'a5-3',
        text: "I share knowledge and resources that might be useful.",
        category: ResponseCategory.DETAILED,
        keywords: ['share', 'knowledge', 'resources'],
        competencies: ['helpfulness', 'collaboration'],
        nextQuestionId: 'q6',
      },
      {
        id: 'a5-4',
        text: "I try to understand what they need first.",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'need'],
        competencies: ['active listening', 'empathy'],
        nextQuestionId: 'q6',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "Understood.",
      [ResponseCategory.NEGATIVE]: "Understood.",
      [ResponseCategory.DETAILED]: "Understood.",
      [ResponseCategory.VAGUE]: "Understood.",
    },
  },

  // AI Follow-up Question 4 (Placeholder - would normally come from GPT)
  'q6': {
    id: 'q6',
    question: "What role do you typically take in group settings?",
    answerOptions: [
      {
        id: 'a6-1',
        text: "I often facilitate discussions and help organize.",
        category: ResponseCategory.DETAILED,
        keywords: ['facilitate', 'discussions', 'organize'],
        competencies: ['coordination', 'teamwork', 'leadership'],
        nextQuestionId: 'q7',
      },
      {
        id: 'a6-2',
        text: "I contribute ideas and support others' suggestions.",
        category: ResponseCategory.DETAILED,
        keywords: ['contribute', 'ideas', 'support'],
        competencies: ['collaboration', 'teamwork'],
        nextQuestionId: 'q7',
      },
      {
        id: 'a6-3',
        text: "I listen and provide input when relevant.",
        category: ResponseCategory.DETAILED,
        keywords: ['listen', 'input', 'relevant'],
        competencies: ['active listening', 'interpersonal skills'],
        nextQuestionId: 'q7',
      },
      {
        id: 'a6-4',
        text: "I adapt my role based on what the group needs.",
        category: ResponseCategory.DETAILED,
        keywords: ['adapt', 'role', 'needs'],
        competencies: ['adaptability', 'empathy'],
        nextQuestionId: 'q7',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "Got it.",
      [ResponseCategory.NEGATIVE]: "Got it.",
      [ResponseCategory.DETAILED]: "Got it.",
      [ResponseCategory.VAGUE]: "Got it.",
    },
  },

  // AI Follow-up Question 5 (Placeholder - would normally come from GPT)
  'q7': {
    id: 'q7',
    question: "One last question: How do you build trust with people you work with?",
    answerOptions: [
      {
        id: 'a7-1',
        text: "I follow through on commitments and communicate honestly.",
        category: ResponseCategory.DETAILED,
        keywords: ['follow through', 'commitments', 'honestly'],
        competencies: ['teamwork', 'interpersonal skills'],
        nextQuestionId: 'complete',
      },
      {
        id: 'a7-2',
        text: "I show consistency and reliability in my work.",
        category: ResponseCategory.DETAILED,
        keywords: ['consistency', 'reliability'],
        competencies: ['teamwork', 'coordination'],
        nextQuestionId: 'complete',
      },
      {
        id: 'a7-3',
        text: "I listen and try to understand others' perspectives.",
        category: ResponseCategory.DETAILED,
        keywords: ['listen', 'understand', 'perspectives'],
        competencies: ['empathy', 'active listening', 'interpersonal skills'],
        nextQuestionId: 'complete',
      },
      {
        id: 'a7-4',
        text: "I'm transparent about challenges and ask for help when needed.",
        category: ResponseCategory.DETAILED,
        keywords: ['transparent', 'challenges', 'help'],
        competencies: ['interpersonal skills', 'collaboration'],
        nextQuestionId: 'complete',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "Thank you.",
      [ResponseCategory.NEGATIVE]: "Thank you.",
      [ResponseCategory.DETAILED]: "Thank you.",
      [ResponseCategory.VAGUE]: "Thank you.",
    },
  },
};

/**
 * Get question by ID
 */
export function getQuestionById(questionId: string): QuestionNode | null {
  if (conversationTree[questionId]) {
    return conversationTree[questionId];
  }
  return null;
}

/**
 * Get starting question
 */
export function getStartingQuestion(): QuestionNode {
  return conversationTree['q1'];
}
