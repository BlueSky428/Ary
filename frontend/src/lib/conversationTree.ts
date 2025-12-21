/**
 * Complete Conversation Tree System
 * 6-8 steps with 4 responses each, fully branched
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
  matchingPatterns: string[]; // Question IDs that lead to this result
}

/**
 * Complete Conversation Tree - 6 steps with 4 answers each
 */
export const conversationTree: Record<string, QuestionNode> = {
  // Step 1
  'q1': {
    id: 'q1',
    question: "Hi there. How are you feeling today?",
    answerOptions: [
      {
        id: 'a1-1',
        text: "Good!",
        category: ResponseCategory.POSITIVE,
        keywords: ['good', 'positive', 'well'],
        competencies: ['optimism', 'motivation'],
        nextQuestionId: 'q2-positive',
      },
      {
        id: 'a1-2',
        text: "Not great, to be honest.",
        category: ResponseCategory.NEGATIVE,
        keywords: ['not', 'struggle', 'difficult'],
        competencies: ['resilience', 'self-awareness'],
        nextQuestionId: 'q2-negative',
      },
      {
        id: 'a1-3',
        text: "I'm feeling thoughtful about some things.",
        category: ResponseCategory.DETAILED,
        keywords: ['thoughtful', 'reflection', 'considering'],
        competencies: ['reflection', 'self-awareness'],
        nextQuestionId: 'q2-detailed',
      },
      {
        id: 'a1-4',
        text: "Okay.",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q2-vague',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's wonderful to hear.",
      [ResponseCategory.NEGATIVE]: "I appreciate you sharing that with me.",
      [ResponseCategory.DETAILED]: "Thank you for sharing that.",
      [ResponseCategory.VAGUE]: "I see.",
    },
  },

  // Step 2 - Branch from positive
  'q2-positive': {
    id: 'q2-positive',
    question: "When you're feeling good, what usually motivates you most?",
    answerOptions: [
      {
        id: 'a2-1',
        text: "Progress - seeing things move forward",
        category: ResponseCategory.POSITIVE,
        keywords: ['progress', 'move forward', 'momentum', 'achieve'],
        competencies: ['goal-driven', 'execution-style', 'impact-driven'],
        nextQuestionId: 'q3-progress',
      },
      {
        id: 'a2-2',
        text: "Connection - working with others",
        category: ResponseCategory.POSITIVE,
        keywords: ['connection', 'others', 'team', 'collaborate'],
        competencies: ['collaboration', 'interpersonal', 'empathy'],
        nextQuestionId: 'q3-connection',
      },
      {
        id: 'a2-3',
        text: "New ideas - exploring possibilities",
        category: ResponseCategory.DETAILED,
        keywords: ['ideas', 'explore', 'possibilities', 'creative'],
        competencies: ['strategic-thinking', 'innovation', 'analytical'],
        nextQuestionId: 'q3-ideas',
      },
      {
        id: 'a2-4',
        text: "I'm not sure what motivates me",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q3-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's powerful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That's insightful.",
      [ResponseCategory.VAGUE]: "Interesting.",
    },
  },

  // Step 2 - Branch from negative
  'q2-negative': {
    id: 'q2-negative',
    question: "What helps you feel a bit better when things are challenging?",
    answerOptions: [
      {
        id: 'a2-n1',
        text: "Talking with someone I trust",
        category: ResponseCategory.POSITIVE,
        keywords: ['talking', 'trust', 'someone', 'support'],
        competencies: ['interpersonal', 'help-seeking', 'collaboration'],
        nextQuestionId: 'q3-support',
      },
      {
        id: 'a2-n2',
        text: "Taking time to reflect and understand",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'understand', 'time', 'think'],
        competencies: ['self-awareness', 'reflection', 'resilience'],
        nextQuestionId: 'q3-reflect',
      },
      {
        id: 'a2-n3',
        text: "Focusing on what I can control",
        category: ResponseCategory.DETAILED,
        keywords: ['control', 'focus', 'manage', 'structure'],
        competencies: ['resilience', 'execution', 'structure'],
        nextQuestionId: 'q3-control',
      },
      {
        id: 'a2-n4',
        text: "I'm not sure what helps",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q3-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good strategy.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 2 - Branch from detailed
  'q2-detailed': {
    id: 'q2-detailed',
    question: "That sounds meaningful. What stands out to you most from what you shared?",
    answerOptions: [
      {
        id: 'a2-d1',
        text: "The importance of understanding myself better",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'self', 'better', 'awareness'],
        competencies: ['self-awareness', 'reflection'],
        nextQuestionId: 'q3-understand',
      },
      {
        id: 'a2-d2',
        text: "How I want to grow or change",
        category: ResponseCategory.POSITIVE,
        keywords: ['grow', 'change', 'improve', 'develop'],
        competencies: ['growth-mindset', 'motivation'],
        nextQuestionId: 'q3-grow',
      },
      {
        id: 'a2-d3',
        text: "The patterns I notice in my life",
        category: ResponseCategory.DETAILED,
        keywords: ['patterns', 'notice', 'life', 'recognize'],
        competencies: ['pattern-recognition', 'analytical'],
        nextQuestionId: 'q3-patterns',
      },
      {
        id: 'a2-d4',
        text: "I'm not sure what stands out",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q3-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's insightful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "You have a clear sense of yourself.",
      [ResponseCategory.VAGUE]: "That's interesting.",
    },
  },

  // Step 2 - Branch from vague
  'q2-vague': {
    id: 'q2-vague',
    question: "What's on your mind today?",
    answerOptions: [
      {
        id: 'a2-v1',
        text: "Work and responsibilities",
        category: ResponseCategory.DETAILED,
        keywords: ['work', 'responsibilities', 'tasks', 'duties'],
        competencies: ['execution', 'responsibility'],
        nextQuestionId: 'q3-work',
      },
      {
        id: 'a2-v2',
        text: "Relationships and connections",
        category: ResponseCategory.POSITIVE,
        keywords: ['relationships', 'connections', 'people', 'others'],
        competencies: ['interpersonal', 'collaboration'],
        nextQuestionId: 'q3-relationships',
      },
      {
        id: 'a2-v3',
        text: "Personal growth and goals",
        category: ResponseCategory.DETAILED,
        keywords: ['growth', 'goals', 'personal', 'develop'],
        competencies: ['goal-driven', 'growth-mindset'],
        nextQuestionId: 'q3-goals',
      },
      {
        id: 'a2-v4',
        text: "Nothing specific",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q3-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "I see.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That makes sense.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Progress branch
  'q3-progress': {
    id: 'q3-progress',
    question: "Can you describe a time you felt really proud of what you accomplished?",
    answerOptions: [
      {
        id: 'a3-p1',
        text: "I launched a project that helped others organize their work",
        category: ResponseCategory.DETAILED,
        keywords: ['launch', 'project', 'help', 'organize', 'others'],
        competencies: ['organization', 'leadership', 'initiative', 'helpfulness', 'execution'],
        nextQuestionId: 'q4-accomplishment',
      },
      {
        id: 'a3-p2',
        text: "I solved a complex problem that had been blocking progress",
        category: ResponseCategory.DETAILED,
        keywords: ['solve', 'problem', 'complex', 'progress', 'strategic'],
        competencies: ['strategic-thinking', 'problem-solving', 'analytical', 'execution'],
        nextQuestionId: 'q4-problem',
      },
      {
        id: 'a3-p3',
        text: "I helped a team member succeed when they were struggling",
        category: ResponseCategory.POSITIVE,
        keywords: ['help', 'team', 'succeed', 'support'],
        competencies: ['collaboration', 'empathy', 'helpfulness', 'interpersonal'],
        nextQuestionId: 'q4-help',
      },
      {
        id: 'a3-p4',
        text: "I'm not sure, I don't think about accomplishments much",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's inspiring.",
      [ResponseCategory.NEGATIVE]: "I appreciate you sharing that.",
      [ResponseCategory.DETAILED]: "That's a powerful example.",
      [ResponseCategory.VAGUE]: "Can you tell me more about that?",
    },
  },

  // Step 3 - Connection branch
  'q3-connection': {
    id: 'q3-connection',
    question: "What do you value most in your relationships with others?",
    answerOptions: [
      {
        id: 'a3-c1',
        text: "Mutual support and understanding",
        category: ResponseCategory.POSITIVE,
        keywords: ['support', 'understanding', 'mutual', 'empathy'],
        competencies: ['empathy', 'interpersonal', 'collaboration'],
        nextQuestionId: 'q4-support',
      },
      {
        id: 'a3-c2',
        text: "Working together toward shared goals",
        category: ResponseCategory.DETAILED,
        keywords: ['working together', 'shared goals', 'collaborate', 'team'],
        competencies: ['collaboration', 'goal-driven', 'teamwork'],
        nextQuestionId: 'q4-goals',
      },
      {
        id: 'a3-c3',
        text: "Learning from each other",
        category: ResponseCategory.DETAILED,
        keywords: ['learning', 'each other', 'grow', 'develop'],
        competencies: ['growth-mindset', 'learning', 'interpersonal'],
        nextQuestionId: 'q4-learn',
      },
      {
        id: 'a3-c4',
        text: "I haven't thought much about it",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's beautiful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Ideas branch
  'q3-ideas': {
    id: 'q3-ideas',
    question: "What kind of problems or challenges do you enjoy tackling?",
    answerOptions: [
      {
        id: 'a3-i1',
        text: "Complex problems that require strategic thinking",
        category: ResponseCategory.DETAILED,
        keywords: ['complex', 'strategic', 'think', 'analyze'],
        competencies: ['strategic-thinking', 'analytical', 'problem-solving'],
        nextQuestionId: 'q4-strategic',
      },
      {
        id: 'a3-i2',
        text: "Creative challenges that need new approaches",
        category: ResponseCategory.POSITIVE,
        keywords: ['creative', 'new approaches', 'innovate', 'explore'],
        competencies: ['innovation', 'creativity', 'strategic-thinking'],
        nextQuestionId: 'q4-creative',
      },
      {
        id: 'a3-i3',
        text: "Problems that help others",
        category: ResponseCategory.POSITIVE,
        keywords: ['help others', 'support', 'serve'],
        competencies: ['helpfulness', 'empathy', 'impact-driven'],
        nextQuestionId: 'q4-help',
      },
      {
        id: 'a3-i4',
        text: "I'm not sure what I enjoy",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That sounds engaging.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That's interesting.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Support branch (from negative path)
  'q3-support': {
    id: 'q3-support',
    question: "When you talk with someone you trust, what do you usually discuss?",
    answerOptions: [
      {
        id: 'a3-s1',
        text: "My challenges and how to work through them",
        category: ResponseCategory.DETAILED,
        keywords: ['challenges', 'work through', 'solve', 'problem'],
        competencies: ['resilience', 'problem-solving', 'help-seeking'],
        nextQuestionId: 'q4-challenges',
      },
      {
        id: 'a3-s2',
        text: "Our goals and how we can support each other",
        category: ResponseCategory.POSITIVE,
        keywords: ['goals', 'support', 'each other', 'collaborate'],
        competencies: ['collaboration', 'goal-driven', 'interpersonal'],
        nextQuestionId: 'q4-goals',
      },
      {
        id: 'a3-s3',
        text: "Understanding my feelings and patterns",
        category: ResponseCategory.DETAILED,
        keywords: ['feelings', 'patterns', 'understand', 'self'],
        competencies: ['self-awareness', 'reflection', 'emotional-intelligence'],
        nextQuestionId: 'q4-understand',
      },
      {
        id: 'a3-s4',
        text: "I don't really talk about deep things",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Reflect branch
  'q3-reflect': {
    id: 'q3-reflect',
    question: "What do you usually discover when you take time to reflect?",
    answerOptions: [
      {
        id: 'a3-r1',
        text: "Patterns in how I think and act",
        category: ResponseCategory.DETAILED,
        keywords: ['patterns', 'think', 'act', 'recognize'],
        competencies: ['pattern-recognition', 'self-awareness', 'analytical'],
        nextQuestionId: 'q4-patterns',
      },
      {
        id: 'a3-r2',
        text: "What I need to change or improve",
        category: ResponseCategory.DETAILED,
        keywords: ['change', 'improve', 'grow', 'develop'],
        competencies: ['growth-mindset', 'self-awareness'],
        nextQuestionId: 'q4-grow',
      },
      {
        id: 'a3-r3',
        text: "What I'm grateful for or what's going well",
        category: ResponseCategory.POSITIVE,
        keywords: ['grateful', 'going well', 'positive', 'appreciate'],
        competencies: ['optimism', 'gratitude', 'resilience'],
        nextQuestionId: 'q4-gratitude',
      },
      {
        id: 'a3-r4',
        text: "I don't usually reflect much",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good practice.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Control branch
  'q3-control': {
    id: 'q3-control',
    question: "When you focus on what you can control, what do you usually do?",
    answerOptions: [
      {
        id: 'a3-co1',
        text: "Make a plan and take action",
        category: ResponseCategory.DETAILED,
        keywords: ['plan', 'action', 'execute', 'structure'],
        competencies: ['planning', 'execution', 'structure'],
        nextQuestionId: 'q4-plan',
      },
      {
        id: 'a3-co2',
        text: "Break things down into manageable steps",
        category: ResponseCategory.DETAILED,
        keywords: ['break down', 'manageable', 'steps', 'organize'],
        competencies: ['organization', 'execution', 'problem-solving'],
        nextQuestionId: 'q4-organize',
      },
      {
        id: 'a3-co3',
        text: "Focus on my own growth and learning",
        category: ResponseCategory.POSITIVE,
        keywords: ['growth', 'learning', 'develop', 'improve'],
        competencies: ['growth-mindset', 'learning', 'self-awareness'],
        nextQuestionId: 'q4-learn',
      },
      {
        id: 'a3-co4',
        text: "I'm not sure what I do",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good approach.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows structure.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Understand branch
  'q3-understand': {
    id: 'q3-understand',
    question: "What helps you understand yourself better?",
    answerOptions: [
      {
        id: 'a3-u1',
        text: "Reflecting on my experiences and patterns",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'experiences', 'patterns', 'analyze'],
        competencies: ['reflection', 'pattern-recognition', 'self-awareness'],
        nextQuestionId: 'q4-patterns',
      },
      {
        id: 'a3-u2',
        text: "Getting feedback from others",
        category: ResponseCategory.POSITIVE,
        keywords: ['feedback', 'others', 'input', 'perspective'],
        competencies: ['interpersonal', 'learning', 'openness'],
        nextQuestionId: 'q4-feedback',
      },
      {
        id: 'a3-u3',
        text: "Trying new things and seeing what works",
        category: ResponseCategory.DETAILED,
        keywords: ['trying', 'new things', 'works', 'experiment'],
        competencies: ['learning', 'experimentation', 'growth-mindset'],
        nextQuestionId: 'q4-experiment',
      },
      {
        id: 'a3-u4',
        text: "I'm not sure what helps",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows curiosity.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Grow branch
  'q3-grow': {
    id: 'q3-grow',
    question: "What areas do you want to grow or change in?",
    answerOptions: [
      {
        id: 'a3-g1',
        text: "My ability to execute and deliver results",
        category: ResponseCategory.DETAILED,
        keywords: ['execute', 'deliver', 'results', 'achieve'],
        competencies: ['execution', 'goal-driven', 'results-oriented'],
        nextQuestionId: 'q4-execution',
      },
      {
        id: 'a3-g2',
        text: "How I connect and work with others",
        category: ResponseCategory.POSITIVE,
        keywords: ['connect', 'work with others', 'collaborate', 'team'],
        competencies: ['interpersonal', 'collaboration', 'teamwork'],
        nextQuestionId: 'q4-connect',
      },
      {
        id: 'a3-g3',
        text: "My thinking and problem-solving skills",
        category: ResponseCategory.DETAILED,
        keywords: ['think', 'problem-solving', 'skills', 'analyze'],
        competencies: ['strategic-thinking', 'analytical', 'problem-solving'],
        nextQuestionId: 'q4-thinking',
      },
      {
        id: 'a3-g4',
        text: "I'm not sure what I want to change",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good goal.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows direction.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Patterns branch
  'q3-patterns': {
    id: 'q3-patterns',
    question: "What patterns have you noticed in your life?",
    answerOptions: [
      {
        id: 'a3-pa1',
        text: "I thrive when I have clear goals and can track progress",
        category: ResponseCategory.DETAILED,
        keywords: ['goals', 'progress', 'track', 'thrive'],
        competencies: ['goal-driven', 'pattern-recognition', 'execution'],
        nextQuestionId: 'q4-goals',
      },
      {
        id: 'a3-pa2',
        text: "I do best when working with supportive people",
        category: ResponseCategory.POSITIVE,
        keywords: ['supportive', 'people', 'team', 'collaborate'],
        competencies: ['collaboration', 'interpersonal', 'teamwork'],
        nextQuestionId: 'q4-support',
      },
      {
        id: 'a3-pa3',
        text: "I need autonomy to figure things out my own way",
        category: ResponseCategory.DETAILED,
        keywords: ['autonomy', 'figure out', 'own way', 'independence'],
        competencies: ['independence', 'problem-solving', 'initiative'],
        nextQuestionId: 'q4-autonomy',
      },
      {
        id: 'a3-pa4',
        text: "I haven't noticed clear patterns",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's insightful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "You have a clear understanding of yourself.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Work branch
  'q3-work': {
    id: 'q3-work',
    question: "What do you enjoy most about your work?",
    answerOptions: [
      {
        id: 'a3-w1',
        text: "Solving problems and making things work",
        category: ResponseCategory.DETAILED,
        keywords: ['solve', 'problems', 'making things work', 'execute'],
        competencies: ['problem-solving', 'execution', 'analytical'],
        nextQuestionId: 'q4-problem',
      },
      {
        id: 'a3-w2',
        text: "Working with a team toward shared goals",
        category: ResponseCategory.POSITIVE,
        keywords: ['team', 'shared goals', 'collaborate', 'together'],
        competencies: ['collaboration', 'teamwork', 'goal-driven'],
        nextQuestionId: 'q4-goals',
      },
      {
        id: 'a3-w3',
        text: "Learning and growing in my role",
        category: ResponseCategory.DETAILED,
        keywords: ['learning', 'growing', 'develop', 'improve'],
        competencies: ['growth-mindset', 'learning', 'self-awareness'],
        nextQuestionId: 'q4-learn',
      },
      {
        id: 'a3-w4',
        text: "I'm not sure what I enjoy",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's good to hear.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That sounds meaningful.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Relationships branch
  'q3-relationships': {
    id: 'q3-relationships',
    question: "What do you value most in your relationships?",
    answerOptions: [
      {
        id: 'a3-re1',
        text: "Mutual support and understanding",
        category: ResponseCategory.POSITIVE,
        keywords: ['support', 'understanding', 'mutual', 'empathy'],
        competencies: ['empathy', 'interpersonal', 'collaboration'],
        nextQuestionId: 'q4-support',
      },
      {
        id: 'a3-re2',
        text: "Shared goals and working together",
        category: ResponseCategory.DETAILED,
        keywords: ['shared goals', 'working together', 'collaborate'],
        competencies: ['collaboration', 'goal-driven', 'teamwork'],
        nextQuestionId: 'q4-goals',
      },
      {
        id: 'a3-re3',
        text: "Learning from each other",
        category: ResponseCategory.DETAILED,
        keywords: ['learning', 'each other', 'grow', 'develop'],
        competencies: ['growth-mindset', 'learning', 'interpersonal'],
        nextQuestionId: 'q4-learn',
      },
      {
        id: 'a3-re4',
        text: "I haven't thought much about it",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's beautiful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Goals branch
  'q3-goals': {
    id: 'q3-goals',
    question: "What kind of goals are most important to you?",
    answerOptions: [
      {
        id: 'a3-go1',
        text: "Personal growth and development",
        category: ResponseCategory.DETAILED,
        keywords: ['personal growth', 'development', 'improve', 'grow'],
        competencies: ['growth-mindset', 'self-awareness', 'learning'],
        nextQuestionId: 'q4-grow',
      },
      {
        id: 'a3-go2',
        text: "Achieving results and making impact",
        category: ResponseCategory.POSITIVE,
        keywords: ['results', 'impact', 'achieve', 'accomplish'],
        competencies: ['goal-driven', 'impact-driven', 'execution'],
        nextQuestionId: 'q4-impact',
      },
      {
        id: 'a3-go3',
        text: "Building meaningful connections",
        category: ResponseCategory.POSITIVE,
        keywords: ['meaningful', 'connections', 'relationships', 'others'],
        competencies: ['interpersonal', 'collaboration', 'empathy'],
        nextQuestionId: 'q4-connect',
      },
      {
        id: 'a3-go4',
        text: "I'm not sure what goals matter to me",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's meaningful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows direction.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 4 - All branches converge to final questions
  'q4-accomplishment': {
    id: 'q4-accomplishment',
    question: "What strengths do you think helped you in that situation?",
    answerOptions: [
      {
        id: 'a4-ac1',
        text: "My ability to organize and plan things out",
        category: ResponseCategory.DETAILED,
        keywords: ['organize', 'plan', 'structure', 'system'],
        competencies: ['structure', 'planning', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-ac2',
        text: "My willingness to take initiative",
        category: ResponseCategory.POSITIVE,
        keywords: ['initiative', 'take action', 'start'],
        competencies: ['initiative', 'execution', 'leadership'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-ac3',
        text: "My ability to work well with others",
        category: ResponseCategory.POSITIVE,
        keywords: ['work with others', 'team', 'collaborate'],
        competencies: ['collaboration', 'interpersonal', 'teamwork'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-ac4',
        text: "I'm not really sure",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's great self-awareness.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of yourself.",
      [ResponseCategory.VAGUE]: "That's interesting.",
    },
  },

  'q4-problem': {
    id: 'q4-problem',
    question: "What do you enjoy most about solving problems?",
    answerOptions: [
      {
        id: 'a4-pr1',
        text: "The strategic thinking and analysis",
        category: ResponseCategory.DETAILED,
        keywords: ['strategic', 'think', 'analysis', 'analyze'],
        competencies: ['strategic-thinking', 'analytical', 'problem-solving'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-pr2',
        text: "Seeing the impact of the solution",
        category: ResponseCategory.POSITIVE,
        keywords: ['impact', 'solution', 'results', 'outcome'],
        competencies: ['impact-driven', 'results-oriented', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-pr3',
        text: "Working through it with others",
        category: ResponseCategory.POSITIVE,
        keywords: ['working', 'others', 'together', 'collaborate'],
        competencies: ['collaboration', 'teamwork', 'interpersonal'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-pr4',
        text: "I'm not sure what I enjoy about it",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's interesting.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-help': {
    id: 'q4-help',
    question: "What motivates you to help others?",
    answerOptions: [
      {
        id: 'a4-h1',
        text: "Seeing them succeed and grow",
        category: ResponseCategory.POSITIVE,
        keywords: ['succeed', 'grow', 'impact', 'support'],
        competencies: ['empathy', 'helpfulness', 'impact-driven'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-h2',
        text: "The sense of connection and teamwork",
        category: ResponseCategory.POSITIVE,
        keywords: ['connection', 'teamwork', 'together', 'collaborate'],
        competencies: ['collaboration', 'interpersonal', 'teamwork'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-h3',
        text: "Understanding their challenges and finding solutions",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'challenges', 'solutions', 'problem-solving'],
        competencies: ['empathy', 'problem-solving', 'analytical'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-h4',
        text: "I'm not sure what motivates me",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's beautiful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows empathy.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 3 - Unsure branch (for vague responses in step 2)
  'q3-unsure': {
    id: 'q3-unsure',
    question: "That's okay. What would help you explore this further?",
    answerOptions: [
      {
        id: 'a3-us1',
        text: "More time to reflect",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'time', 'think'],
        competencies: ['reflection', 'self-awareness'],
        nextQuestionId: 'q4-patterns',
      },
      {
        id: 'a3-us2',
        text: "Trying different things",
        category: ResponseCategory.DETAILED,
        keywords: ['trying', 'different', 'experiment'],
        competencies: ['experimentation', 'learning'],
        nextQuestionId: 'q4-experiment',
      },
      {
        id: 'a3-us3',
        text: "Getting support from others",
        category: ResponseCategory.POSITIVE,
        keywords: ['support', 'others', 'help'],
        competencies: ['interpersonal', 'help-seeking'],
        nextQuestionId: 'q4-support',
      },
      {
        id: 'a3-us4',
        text: "I'm still not sure",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q4-unsure',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good approach.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows openness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-unsure': {
    id: 'q4-unsure',
    question: "What would help you feel more certain or clear?",
    answerOptions: [
      {
        id: 'a4-u1',
        text: "More time to reflect and understand myself",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'understand', 'self', 'awareness'],
        competencies: ['self-awareness', 'reflection'],
        nextQuestionId: 'q5-final',
      },
      {
        id: 'a4-u2',
        text: "Trying different things and seeing what works",
        category: ResponseCategory.DETAILED,
        keywords: ['trying', 'different', 'works', 'experiment'],
        competencies: ['learning', 'experimentation', 'growth-mindset'],
        nextQuestionId: 'q5-final',
      },
      {
        id: 'a4-u3',
        text: "Getting support or guidance from others",
        category: ResponseCategory.POSITIVE,
        keywords: ['support', 'guidance', 'others', 'help'],
        competencies: ['help-seeking', 'interpersonal', 'openness'],
        nextQuestionId: 'q5-final',
      },
      {
        id: 'a4-u4',
        text: "I'm not sure what would help",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good approach.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Additional Step 4 questions (simplified - all lead to q5-final)
  'q4-support': {
    id: 'q4-support',
    question: "How do you show support to others?",
    answerOptions: [
      {
        id: 'a4-s1',
        text: "By listening and understanding their perspective",
        category: ResponseCategory.DETAILED,
        keywords: ['listening', 'understanding', 'perspective', 'empathy'],
        competencies: ['empathy', 'interpersonal', 'listening'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-s2',
        text: "By helping them solve problems or achieve goals",
        category: ResponseCategory.POSITIVE,
        keywords: ['help', 'solve', 'achieve', 'goals'],
        competencies: ['helpfulness', 'problem-solving', 'goal-driven'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-s3',
        text: "By working together on shared challenges",
        category: ResponseCategory.DETAILED,
        keywords: ['working together', 'shared', 'challenges', 'collaborate'],
        competencies: ['collaboration', 'teamwork', 'interpersonal'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-s4',
        text: "I'm not sure how I show support",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows care.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-goals': {
    id: 'q4-goals',
    question: "What makes a goal meaningful to you?",
    answerOptions: [
      {
        id: 'a4-g1',
        text: "When it aligns with my values and purpose",
        category: ResponseCategory.DETAILED,
        keywords: ['values', 'purpose', 'align', 'meaningful'],
        competencies: ['values-driven', 'purpose', 'self-awareness'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-g2',
        text: "When it creates positive impact for others",
        category: ResponseCategory.POSITIVE,
        keywords: ['impact', 'others', 'positive', 'help'],
        competencies: ['impact-driven', 'helpfulness', 'empathy'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-g3',
        text: "When it challenges me to grow",
        category: ResponseCategory.DETAILED,
        keywords: ['challenges', 'grow', 'develop', 'improve'],
        competencies: ['growth-mindset', 'learning', 'self-awareness'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-g4',
        text: "I'm not sure what makes goals meaningful",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's meaningful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-learn': {
    id: 'q4-learn',
    question: "How do you prefer to learn and grow?",
    answerOptions: [
      {
        id: 'a4-l1',
        text: "By reflecting on my experiences",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'experiences', 'think', 'analyze'],
        competencies: ['reflection', 'self-awareness', 'learning'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-l2',
        text: "By trying new things and experimenting",
        category: ResponseCategory.POSITIVE,
        keywords: ['trying', 'new things', 'experiment', 'explore'],
        competencies: ['experimentation', 'learning', 'growth-mindset'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-l3',
        text: "By learning from others and getting feedback",
        category: ResponseCategory.POSITIVE,
        keywords: ['learning', 'others', 'feedback', 'input'],
        competencies: ['learning', 'interpersonal', 'openness'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-l4',
        text: "I'm not sure how I learn best",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good approach.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // More Step 4 questions (all simplified to lead to q5-final)
  'q4-strategic': {
    id: 'q4-strategic',
    question: "What do you enjoy about strategic thinking?",
    answerOptions: [
      {
        id: 'a4-st1',
        text: "Analyzing complex situations and finding patterns",
        category: ResponseCategory.DETAILED,
        keywords: ['analyze', 'complex', 'patterns', 'think'],
        competencies: ['analytical', 'pattern-recognition', 'strategic-thinking'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-st2',
        text: "Creating plans that lead to results",
        category: ResponseCategory.POSITIVE,
        keywords: ['plans', 'results', 'execute', 'achieve'],
        competencies: ['planning', 'execution', 'results-oriented'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-st3',
        text: "Solving problems in innovative ways",
        category: ResponseCategory.DETAILED,
        keywords: ['solve', 'problems', 'innovative', 'creative'],
        competencies: ['innovation', 'problem-solving', 'strategic-thinking'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-st4',
        text: "I'm not sure what I enjoy about it",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's interesting.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-creative': {
    id: 'q4-creative',
    question: "What inspires your creativity?",
    answerOptions: [
      {
        id: 'a4-cr1',
        text: "Exploring new possibilities and ideas",
        category: ResponseCategory.DETAILED,
        keywords: ['explore', 'possibilities', 'ideas', 'innovate'],
        competencies: ['innovation', 'creativity', 'strategic-thinking'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-cr2',
        text: "Solving problems in unique ways",
        category: ResponseCategory.POSITIVE,
        keywords: ['solve', 'problems', 'unique', 'creative'],
        competencies: ['creativity', 'problem-solving', 'innovation'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-cr3',
        text: "Collaborating with others on creative projects",
        category: ResponseCategory.POSITIVE,
        keywords: ['collaborate', 'others', 'creative', 'projects'],
        competencies: ['collaboration', 'creativity', 'teamwork'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-cr4',
        text: "I'm not sure what inspires me",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's inspiring.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows creativity.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-challenges': {
    id: 'q4-challenges',
    question: "How do you approach challenges?",
    answerOptions: [
      {
        id: 'a4-ch1',
        text: "By breaking them down into manageable steps",
        category: ResponseCategory.DETAILED,
        keywords: ['break down', 'manageable', 'steps', 'organize'],
        competencies: ['organization', 'problem-solving', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-ch2',
        text: "By seeking support and collaboration",
        category: ResponseCategory.POSITIVE,
        keywords: ['support', 'collaboration', 'help', 'team'],
        competencies: ['collaboration', 'help-seeking', 'interpersonal'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-ch3',
        text: "By analyzing the situation and planning",
        category: ResponseCategory.DETAILED,
        keywords: ['analyze', 'situation', 'plan', 'strategic'],
        competencies: ['analytical', 'planning', 'strategic-thinking'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-ch4',
        text: "I'm not sure how I approach challenges",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good approach.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows structure.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-understand': {
    id: 'q4-understand',
    question: "What helps you understand yourself better?",
    answerOptions: [
      {
        id: 'a4-un1',
        text: "Reflecting on my experiences and patterns",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'experiences', 'patterns', 'analyze'],
        competencies: ['reflection', 'pattern-recognition', 'self-awareness'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-un2',
        text: "Getting feedback from others",
        category: ResponseCategory.POSITIVE,
        keywords: ['feedback', 'others', 'input', 'perspective'],
        competencies: ['interpersonal', 'learning', 'openness'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-un3',
        text: "Trying new things and seeing what works",
        category: ResponseCategory.DETAILED,
        keywords: ['trying', 'new things', 'works', 'experiment'],
        competencies: ['learning', 'experimentation', 'growth-mindset'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-un4',
        text: "I'm not sure what helps",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows curiosity.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-patterns': {
    id: 'q4-patterns',
    question: "What patterns do you notice in situations where you thrive?",
    answerOptions: [
      {
        id: 'a4-pa1',
        text: "I see clear goals and can track progress",
        category: ResponseCategory.DETAILED,
        keywords: ['goals', 'progress', 'track', 'clear'],
        competencies: ['goal-driven', 'pattern-recognition', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-pa2',
        text: "I'm working with supportive people",
        category: ResponseCategory.POSITIVE,
        keywords: ['supportive', 'people', 'team', 'collaborate'],
        competencies: ['collaboration', 'interpersonal', 'teamwork'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-pa3',
        text: "I have autonomy to figure things out",
        category: ResponseCategory.DETAILED,
        keywords: ['autonomy', 'figure out', 'independence'],
        competencies: ['independence', 'problem-solving', 'initiative'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-pa4',
        text: "I haven't noticed clear patterns",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's insightful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "You have a clear understanding of yourself.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-grow': {
    id: 'q4-grow',
    question: "What helps you grow the most?",
    answerOptions: [
      {
        id: 'a4-gr1',
        text: "Reflecting on my experiences and learning from them",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'experiences', 'learning', 'analyze'],
        competencies: ['reflection', 'learning', 'self-awareness'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-gr2',
        text: "Trying new things and taking on challenges",
        category: ResponseCategory.POSITIVE,
        keywords: ['trying', 'new things', 'challenges', 'experiment'],
        competencies: ['growth-mindset', 'experimentation', 'learning'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-gr3',
        text: "Getting feedback and learning from others",
        category: ResponseCategory.POSITIVE,
        keywords: ['feedback', 'learning', 'others', 'input'],
        competencies: ['learning', 'interpersonal', 'openness'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-gr4',
        text: "I'm not sure what helps me grow",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good approach.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-gratitude': {
    id: 'q4-gratitude',
    question: "What are you most grateful for?",
    answerOptions: [
      {
        id: 'a4-ga1',
        text: "The people who support me",
        category: ResponseCategory.POSITIVE,
        keywords: ['people', 'support', 'others', 'relationships'],
        competencies: ['interpersonal', 'gratitude', 'collaboration'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-ga2',
        text: "Opportunities to learn and grow",
        category: ResponseCategory.DETAILED,
        keywords: ['opportunities', 'learn', 'grow', 'develop'],
        competencies: ['growth-mindset', 'learning', 'self-awareness'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-ga3',
        text: "The ability to make a positive impact",
        category: ResponseCategory.POSITIVE,
        keywords: ['impact', 'positive', 'help', 'contribute'],
        competencies: ['impact-driven', 'helpfulness', 'purpose'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-ga4',
        text: "I'm not sure what I'm grateful for",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's beautiful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows gratitude.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-plan': {
    id: 'q4-plan',
    question: "What do you consider when making a plan?",
    answerOptions: [
      {
        id: 'a4-pl1',
        text: "The goals and desired outcomes",
        category: ResponseCategory.DETAILED,
        keywords: ['goals', 'outcomes', 'results', 'achieve'],
        competencies: ['goal-driven', 'planning', 'results-oriented'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-pl2',
        text: "The steps needed to get there",
        category: ResponseCategory.DETAILED,
        keywords: ['steps', 'needed', 'structure', 'organize'],
        competencies: ['planning', 'organization', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-pl3',
        text: "Who I need to involve or collaborate with",
        category: ResponseCategory.POSITIVE,
        keywords: ['involve', 'collaborate', 'team', 'others'],
        competencies: ['collaboration', 'teamwork', 'interpersonal'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-pl4',
        text: "I don't usually make detailed plans",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's thoughtful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows structure.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-organize': {
    id: 'q4-organize',
    question: "What helps you stay organized?",
    answerOptions: [
      {
        id: 'a4-or1',
        text: "Having clear systems and structures",
        category: ResponseCategory.DETAILED,
        keywords: ['systems', 'structures', 'organize', 'plan'],
        competencies: ['organization', 'structure', 'planning'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-or2',
        text: "Breaking things into manageable pieces",
        category: ResponseCategory.DETAILED,
        keywords: ['breaking', 'manageable', 'pieces', 'steps'],
        competencies: ['organization', 'problem-solving', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-or3',
        text: "Working with others to stay on track",
        category: ResponseCategory.POSITIVE,
        keywords: ['others', 'track', 'team', 'collaborate'],
        competencies: ['collaboration', 'teamwork', 'interpersonal'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-or4',
        text: "I struggle with staying organized",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's helpful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows structure.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-feedback': {
    id: 'q4-feedback',
    question: "How do you use feedback to grow?",
    answerOptions: [
      {
        id: 'a4-f1',
        text: "By reflecting on it and identifying patterns",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'patterns', 'identify', 'analyze'],
        competencies: ['reflection', 'pattern-recognition', 'self-awareness'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-f2',
        text: "By trying new approaches based on it",
        category: ResponseCategory.POSITIVE,
        keywords: ['trying', 'new approaches', 'experiment', 'improve'],
        competencies: ['learning', 'experimentation', 'growth-mindset'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-f3',
        text: "By discussing it with others to understand better",
        category: ResponseCategory.POSITIVE,
        keywords: ['discussing', 'others', 'understand', 'collaborate'],
        competencies: ['interpersonal', 'learning', 'openness'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-f4',
        text: "I'm not sure how I use feedback",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-experiment': {
    id: 'q4-experiment',
    question: "What do you learn from trying new things?",
    answerOptions: [
      {
        id: 'a4-e1',
        text: "What works and what doesn't",
        category: ResponseCategory.DETAILED,
        keywords: ['works', 'doesn\'t', 'results', 'outcomes'],
        competencies: ['learning', 'experimentation', 'results-oriented'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-e2',
        text: "More about my strengths and preferences",
        category: ResponseCategory.DETAILED,
        keywords: ['strengths', 'preferences', 'self', 'awareness'],
        competencies: ['self-awareness', 'learning', 'reflection'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-e3',
        text: "New ways to approach problems",
        category: ResponseCategory.POSITIVE,
        keywords: ['new ways', 'approach', 'problems', 'innovate'],
        competencies: ['innovation', 'problem-solving', 'learning'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-e4',
        text: "I'm not sure what I learn",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows learning.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-execution': {
    id: 'q4-execution',
    question: "What helps you execute and deliver results?",
    answerOptions: [
      {
        id: 'a4-ex1',
        text: "Having a clear plan and structure",
        category: ResponseCategory.DETAILED,
        keywords: ['plan', 'structure', 'organize', 'system'],
        competencies: ['planning', 'structure', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-ex2',
        text: "Staying focused on the goal",
        category: ResponseCategory.POSITIVE,
        keywords: ['focused', 'goal', 'results', 'achieve'],
        competencies: ['goal-driven', 'execution', 'results-oriented'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-ex3',
        text: "Working with a team to get things done",
        category: ResponseCategory.POSITIVE,
        keywords: ['team', 'get things done', 'collaborate', 'together'],
        competencies: ['collaboration', 'teamwork', 'execution'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-ex4',
        text: "I struggle with execution sometimes",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's effective.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows structure.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-connect': {
    id: 'q4-connect',
    question: "What makes connections meaningful to you?",
    answerOptions: [
      {
        id: 'a4-co1',
        text: "Mutual understanding and support",
        category: ResponseCategory.POSITIVE,
        keywords: ['understanding', 'support', 'mutual', 'empathy'],
        competencies: ['empathy', 'interpersonal', 'collaboration'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-co2',
        text: "Working toward shared goals together",
        category: ResponseCategory.DETAILED,
        keywords: ['shared goals', 'together', 'collaborate', 'team'],
        competencies: ['collaboration', 'goal-driven', 'teamwork'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-co3',
        text: "Learning and growing together",
        category: ResponseCategory.DETAILED,
        keywords: ['learning', 'growing', 'together', 'develop'],
        competencies: ['growth-mindset', 'learning', 'interpersonal'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-co4',
        text: "I'm not sure what makes connections meaningful",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's beautiful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-thinking': {
    id: 'q4-thinking',
    question: "What do you enjoy about thinking and problem-solving?",
    answerOptions: [
      {
        id: 'a4-t1',
        text: "Analyzing complex situations",
        category: ResponseCategory.DETAILED,
        keywords: ['analyze', 'complex', 'situations', 'think'],
        competencies: ['analytical', 'strategic-thinking', 'problem-solving'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-t2',
        text: "Finding creative solutions",
        category: ResponseCategory.POSITIVE,
        keywords: ['creative', 'solutions', 'innovate', 'solve'],
        competencies: ['creativity', 'innovation', 'problem-solving'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-t3',
        text: "Seeing the impact of good solutions",
        category: ResponseCategory.POSITIVE,
        keywords: ['impact', 'solutions', 'results', 'outcome'],
        competencies: ['impact-driven', 'results-oriented', 'problem-solving'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-t4',
        text: "I'm not sure what I enjoy about it",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's interesting.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-impact': {
    id: 'q4-impact',
    question: "What kind of impact do you want to make?",
    answerOptions: [
      {
        id: 'a4-im1',
        text: "Helping others succeed and grow",
        category: ResponseCategory.POSITIVE,
        keywords: ['help', 'others', 'succeed', 'grow'],
        competencies: ['helpfulness', 'empathy', 'impact-driven'],
        nextQuestionId: 'q5-collaboration',
      },
      {
        id: 'a4-im2',
        text: "Solving important problems",
        category: ResponseCategory.DETAILED,
        keywords: ['solve', 'important', 'problems', 'challenges'],
        competencies: ['problem-solving', 'impact-driven', 'purpose'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-im3',
        text: "Creating positive change in systems or processes",
        category: ResponseCategory.DETAILED,
        keywords: ['positive change', 'systems', 'processes', 'improve'],
        competencies: ['innovation', 'impact-driven', 'execution'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-im4',
        text: "I'm not sure what impact I want to make",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's meaningful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows purpose.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q4-autonomy': {
    id: 'q4-autonomy',
    question: "What do you value about having autonomy?",
    answerOptions: [
      {
        id: 'a4-au1',
        text: "The freedom to figure things out my own way",
        category: ResponseCategory.DETAILED,
        keywords: ['freedom', 'figure out', 'own way', 'independence'],
        competencies: ['independence', 'problem-solving', 'initiative'],
        nextQuestionId: 'q5-thinking',
      },
      {
        id: 'a4-au2',
        text: "Being able to take initiative",
        category: ResponseCategory.POSITIVE,
        keywords: ['initiative', 'take action', 'start', 'lead'],
        competencies: ['initiative', 'leadership', 'independence'],
        nextQuestionId: 'q5-execution',
      },
      {
        id: 'a4-au3',
        text: "The ability to experiment and learn",
        category: ResponseCategory.DETAILED,
        keywords: ['experiment', 'learn', 'try', 'explore'],
        competencies: ['learning', 'experimentation', 'growth-mindset'],
        nextQuestionId: 'q5-growth',
      },
      {
        id: 'a4-au4',
        text: "I'm not sure what I value about it",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q5-final',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows independence.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Step 5 - Multiple final questions for better branching
  // Execution-focused paths
  'q5-execution': {
    id: 'q5-execution',
    question: "How do you want to use these insights about your execution style?",
    answerOptions: [
      {
        id: 'a5-e1',
        text: "To seek out opportunities that match my strengths",
        category: ResponseCategory.DETAILED,
        keywords: ['opportunities', 'strengths', 'match', 'seek'],
        competencies: ['self-awareness', 'goal-driven', 'strategic-thinking'],
        nextQuestionId: 'q6-reflection',
      },
      {
        id: 'a5-e2',
        text: "To be more intentional about how I approach work",
        category: ResponseCategory.POSITIVE,
        keywords: ['intentional', 'approach', 'work', 'plan'],
        competencies: ['self-awareness', 'planning', 'goal-driven'],
        nextQuestionId: 'q6-challenge',
      },
      {
        id: 'a5-e3',
        text: "To understand what environments help me thrive",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'environments', 'thrive', 'works'],
        competencies: ['self-awareness', 'reflection'],
        nextQuestionId: 'q6-future',
      },
      {
        id: 'a5-e4',
        text: "I'm still processing what this means",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q6-environment',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a powerful vision.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of direction.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Collaboration-focused paths
  'q5-collaboration': {
    id: 'q5-collaboration',
    question: "How do you want to use these insights about how you connect with others?",
    answerOptions: [
      {
        id: 'a5-c1',
        text: "To build stronger, more meaningful relationships",
        category: ResponseCategory.DETAILED,
        keywords: ['relationships', 'meaningful', 'stronger', 'connect'],
        competencies: ['interpersonal', 'empathy', 'collaboration'],
        nextQuestionId: 'q6-reflection',
      },
      {
        id: 'a5-c2',
        text: "To be more intentional in how I support others",
        category: ResponseCategory.POSITIVE,
        keywords: ['intentional', 'support', 'others', 'help'],
        competencies: ['helpfulness', 'interpersonal', 'empathy'],
        nextQuestionId: 'q6-challenge',
      },
      {
        id: 'a5-c3',
        text: "To understand what makes collaboration work for me",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'collaboration', 'works', 'team'],
        competencies: ['self-awareness', 'collaboration'],
        nextQuestionId: 'q6-future',
      },
      {
        id: 'a5-c4',
        text: "I'm still figuring this out",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q6-environment',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's meaningful.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of connection.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Growth/Reflection-focused paths
  'q5-growth': {
    id: 'q5-growth',
    question: "How do you want to use these insights about your growth and reflection?",
    answerOptions: [
      {
        id: 'a5-g1',
        text: "To be more intentional about my personal development",
        category: ResponseCategory.DETAILED,
        keywords: ['intentional', 'personal development', 'grow', 'improve'],
        competencies: ['self-awareness', 'growth-mindset', 'learning'],
        nextQuestionId: 'q6-reflection',
      },
      {
        id: 'a5-g2',
        text: "To create situations where I can thrive",
        category: ResponseCategory.POSITIVE,
        keywords: ['create', 'situations', 'thrive', 'opportunities'],
        competencies: ['self-awareness', 'goal-driven', 'strategic-thinking'],
        nextQuestionId: 'q6-challenge',
      },
      {
        id: 'a5-g3',
        text: "To understand myself better and make better choices",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'self', 'choices', 'awareness'],
        competencies: ['self-awareness', 'reflection'],
        nextQuestionId: 'q6-future',
      },
      {
        id: 'a5-g4',
        text: "I'm still exploring what this means for me",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q6-environment',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's thoughtful.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of growth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // Thinking/Problem-solving focused paths
  'q5-thinking': {
    id: 'q5-thinking',
    question: "How do you want to use these insights about how you think and solve problems?",
    answerOptions: [
      {
        id: 'a5-t1',
        text: "To seek out challenges that match my thinking style",
        category: ResponseCategory.DETAILED,
        keywords: ['challenges', 'thinking style', 'match', 'seek'],
        competencies: ['self-awareness', 'strategic-thinking', 'analytical'],
        nextQuestionId: 'q6-reflection',
      },
      {
        id: 'a5-t2',
        text: "To be more strategic about the problems I tackle",
        category: ResponseCategory.POSITIVE,
        keywords: ['strategic', 'problems', 'tackle', 'approach'],
        competencies: ['strategic-thinking', 'planning', 'self-awareness'],
        nextQuestionId: 'q6-challenge',
      },
      {
        id: 'a5-t3',
        text: "To understand what kinds of problems energize me",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'problems', 'energize', 'interest'],
        competencies: ['self-awareness', 'reflection'],
        nextQuestionId: 'q6-future',
      },
      {
        id: 'a5-t4',
        text: "I'm still processing these insights",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q6-environment',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's insightful.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of your thinking.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  // General/Unsure paths (original q5-final as fallback)
  'q5-final': {
    id: 'q5-final',
    question: "How do you want to use these insights moving forward?",
    answerOptions: [
      {
        id: 'a5-1',
        text: "To seek out opportunities that match my strengths",
        category: ResponseCategory.DETAILED,
        keywords: ['opportunities', 'strengths', 'match', 'seek'],
        competencies: ['self-awareness', 'goal-driven', 'strategic-thinking'],
        nextQuestionId: 'q6-reflection',
      },
      {
        id: 'a5-2',
        text: "To be more intentional about my choices",
        category: ResponseCategory.POSITIVE,
        keywords: ['intentional', 'choices', 'plan', 'decide'],
        competencies: ['self-awareness', 'planning', 'goal-driven'],
        nextQuestionId: 'q6-challenge',
      },
      {
        id: 'a5-3',
        text: "To understand myself better",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'self', 'better', 'awareness'],
        competencies: ['self-awareness', 'reflection'],
        nextQuestionId: 'q6-future',
      },
      {
        id: 'a5-4',
        text: "I'm not sure yet",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q6-environment',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a powerful vision.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of direction.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },
};

// Extended tree (steps 6-10) - merged directly to avoid circular dependency
// The extended questions are added below

/**
 * Get question by ID - checks extended tree if not found in main tree
 */
export function getQuestionById(questionId: string): QuestionNode | null {
  // Check main tree first
  if (conversationTree[questionId]) {
    return conversationTree[questionId];
  }
  
  // Check extended tree (loaded dynamically to avoid circular dependency)
  try {
    const { extendedConversationTree } = require('./conversationTreeExtended');
    return extendedConversationTree[questionId] || null;
  } catch {
    return null;
  }
}

/**
 * Get starting question
 */
export function getStartingQuestion(): QuestionNode {
  return conversationTree['q1'];
}

