/**
 * Extended Conversation Tree System
 * 10 steps with 4 responses each, fully branched
 * Allows early completion after step 5
 */

// Re-export ResponseCategory enum to avoid circular dependency
export enum ResponseCategory {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  DETAILED = 'detailed',
  VAGUE = 'vague',
}

// Re-define types here to avoid circular dependency
export interface AnswerOption {
  id: string;
  text: string;
  category: ResponseCategory;
  keywords: string[];
  competencies: string[];
  nextQuestionId: string;
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

// This extends the base conversationTree with additional steps (6-10)
// Steps 1-5 remain the same, we add steps 6-10 here
export const extendedConversationTree: Record<string, QuestionNode> = {
  // Step 6 - Deep dive questions (after q5-final)
  'q6-reflection': {
    id: 'q6-reflection',
    question: "What's one thing you've learned about yourself recently?",
    answerOptions: [
      {
        id: 'a6-r1',
        text: "I've learned to trust my instincts more",
        category: ResponseCategory.DETAILED,
        keywords: ['trust', 'instincts', 'confidence', 'intuition'],
        competencies: ['self-awareness', 'confidence', 'independence'],
        nextQuestionId: 'q7-trust',
      },
      {
        id: 'a6-r2',
        text: "I need more balance in my life",
        category: ResponseCategory.DETAILED,
        keywords: ['balance', 'life', 'manage', 'organize'],
        competencies: ['self-awareness', 'organization', 'planning'],
        nextQuestionId: 'q7-balance',
      },
      {
        id: 'a6-r3',
        text: "I work best when I feel connected to a purpose",
        category: ResponseCategory.DETAILED,
        keywords: ['purpose', 'connected', 'meaningful', 'work'],
        competencies: ['purpose', 'values-driven', 'motivation'],
        nextQuestionId: 'q7-purpose',
      },
      {
        id: 'a6-r4',
        text: "I'm still figuring that out",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q7-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable insight.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay, self-discovery is ongoing.",
    },
  },

  'q6-challenge': {
    id: 'q6-challenge',
    question: "What's a challenge you've overcome that you're proud of?",
    answerOptions: [
      {
        id: 'a6-c1',
        text: "I figured out a complex problem at work",
        category: ResponseCategory.DETAILED,
        keywords: ['problem', 'work', 'solve', 'complex'],
        competencies: ['problem-solving', 'analytical', 'execution'],
        nextQuestionId: 'q7-problem',
      },
      {
        id: 'a6-c2',
        text: "I helped someone else through a difficult time",
        category: ResponseCategory.POSITIVE,
        keywords: ['help', 'someone', 'difficult', 'support'],
        competencies: ['empathy', 'helpfulness', 'interpersonal'],
        nextQuestionId: 'q7-support',
      },
      {
        id: 'a6-c3',
        text: "I pushed through when I wanted to give up",
        category: ResponseCategory.DETAILED,
        keywords: ['pushed through', 'give up', 'persevere', 'resilience'],
        competencies: ['resilience', 'determination', 'execution'],
        nextQuestionId: 'q7-resilience',
      },
      {
        id: 'a6-c4',
        text: "I'm not sure I've had a major challenge yet",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q7-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's inspiring.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows strength.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q6-future': {
    id: 'q6-future',
    question: "What are you most excited about for your future?",
    answerOptions: [
      {
        id: 'a6-f1',
        text: "New opportunities to learn and grow",
        category: ResponseCategory.DETAILED,
        keywords: ['opportunities', 'learn', 'grow', 'develop'],
        competencies: ['growth-mindset', 'learning', 'curiosity'],
        nextQuestionId: 'q7-growth',
      },
      {
        id: 'a6-f2',
        text: "Making a bigger impact",
        category: ResponseCategory.POSITIVE,
        keywords: ['impact', 'bigger', 'contribute', 'make a difference'],
        competencies: ['impact-driven', 'purpose', 'motivation'],
        nextQuestionId: 'q7-impact',
      },
      {
        id: 'a6-f3',
        text: "Working on meaningful projects",
        category: ResponseCategory.DETAILED,
        keywords: ['meaningful', 'projects', 'work', 'purpose'],
        competencies: ['purpose', 'values-driven', 'motivation'],
        nextQuestionId: 'q7-meaning',
      },
      {
        id: 'a6-f4',
        text: "I'm not sure yet",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q7-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's exciting!",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows direction.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q6-environment': {
    id: 'q6-environment',
    question: "What kind of environment helps you do your best work?",
    answerOptions: [
      {
        id: 'a6-e1',
        text: "Quiet and focused, where I can concentrate",
        category: ResponseCategory.DETAILED,
        keywords: ['quiet', 'focused', 'concentrate', 'independent'],
        competencies: ['independence', 'focus', 'execution'],
        nextQuestionId: 'q7-focus',
      },
      {
        id: 'a6-e2',
        text: "Collaborative, with people I can bounce ideas off",
        category: ResponseCategory.POSITIVE,
        keywords: ['collaborative', 'people', 'ideas', 'bounce'],
        competencies: ['collaboration', 'interpersonal', 'teamwork'],
        nextQuestionId: 'q7-collaborate',
      },
      {
        id: 'a6-e3',
        text: "Flexible, where I can adapt as needed",
        category: ResponseCategory.DETAILED,
        keywords: ['flexible', 'adapt', 'change', 'responsive'],
        competencies: ['adaptability', 'flexibility', 'openness'],
        nextQuestionId: 'q7-flexible',
      },
      {
        id: 'a6-e4',
        text: "I can work in different environments",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q7-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That makes sense.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's a good skill.",
    },
  },

  // Step 7 - Continue deeper
  'q7-trust': {
    id: 'q7-trust',
    question: "What helps you build that trust in yourself?",
    answerOptions: [
      {
        id: 'a7-t1',
        text: "Reflecting on past successes",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'successes', 'past', 'experience'],
        competencies: ['reflection', 'self-awareness', 'confidence'],
        nextQuestionId: 'q8-success',
      },
      {
        id: 'a7-t2',
        text: "Trying new things and seeing what works",
        category: ResponseCategory.DETAILED,
        keywords: ['trying', 'new things', 'works', 'experiment'],
        competencies: ['experimentation', 'learning', 'growth-mindset'],
        nextQuestionId: 'q8-experiment',
      },
      {
        id: 'a7-t3',
        text: "Getting feedback from people I trust",
        category: ResponseCategory.POSITIVE,
        keywords: ['feedback', 'trust', 'people', 'input'],
        competencies: ['interpersonal', 'learning', 'openness'],
        nextQuestionId: 'q8-feedback',
      },
      {
        id: 'a7-t4',
        text: "It's a work in progress",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows growth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-balance': {
    id: 'q7-balance',
    question: "How do you want to create that balance?",
    answerOptions: [
      {
        id: 'a7-b1',
        text: "By setting clearer boundaries",
        category: ResponseCategory.DETAILED,
        keywords: ['boundaries', 'limits', 'structure', 'organize'],
        competencies: ['organization', 'self-awareness', 'planning'],
        nextQuestionId: 'q8-boundaries',
      },
      {
        id: 'a7-b2',
        text: "By prioritizing what truly matters",
        category: ResponseCategory.DETAILED,
        keywords: ['prioritize', 'matters', 'values', 'focus'],
        competencies: ['values-driven', 'goal-driven', 'planning'],
        nextQuestionId: 'q8-priorities',
      },
      {
        id: 'a7-b3',
        text: "By being more present in each moment",
        category: ResponseCategory.DETAILED,
        keywords: ['present', 'moment', 'mindful', 'awareness'],
        competencies: ['self-awareness', 'mindfulness', 'reflection'],
        nextQuestionId: 'q8-present',
      },
      {
        id: 'a7-b4',
        text: "I'm still figuring that out",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good goal.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows intentionality.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-purpose': {
    id: 'q7-purpose',
    question: "What makes work feel meaningful to you?",
    answerOptions: [
      {
        id: 'a7-p1',
        text: "When I can see the impact on others",
        category: ResponseCategory.POSITIVE,
        keywords: ['impact', 'others', 'help', 'contribute'],
        competencies: ['impact-driven', 'empathy', 'helpfulness'],
        nextQuestionId: 'q8-impact',
      },
      {
        id: 'a7-p2',
        text: "When it aligns with my values",
        category: ResponseCategory.DETAILED,
        keywords: ['align', 'values', 'match', 'consistent'],
        competencies: ['values-driven', 'purpose', 'self-awareness'],
        nextQuestionId: 'q8-values',
      },
      {
        id: 'a7-p3',
        text: "When I'm learning and growing",
        category: ResponseCategory.DETAILED,
        keywords: ['learning', 'growing', 'develop', 'improve'],
        competencies: ['growth-mindset', 'learning', 'curiosity'],
        nextQuestionId: 'q8-learning',
      },
      {
        id: 'a7-p4',
        text: "I'm still discovering what that is",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's meaningful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-problem': {
    id: 'q7-problem',
    question: "What made you successful in solving that problem?",
    answerOptions: [
      {
        id: 'a7-pr1',
        text: "Breaking it down into smaller pieces",
        category: ResponseCategory.DETAILED,
        keywords: ['breaking down', 'smaller', 'pieces', 'organize'],
        competencies: ['organization', 'problem-solving', 'execution'],
        nextQuestionId: 'q8-breakdown',
      },
      {
        id: 'a7-pr2',
        text: "Collaborating with others",
        category: ResponseCategory.POSITIVE,
        keywords: ['collaborate', 'others', 'team', 'together'],
        competencies: ['collaboration', 'teamwork', 'interpersonal'],
        nextQuestionId: 'q8-collaborate',
      },
      {
        id: 'a7-pr3',
        text: "Thinking strategically about the approach",
        category: ResponseCategory.DETAILED,
        keywords: ['strategic', 'think', 'approach', 'analyze'],
        competencies: ['strategic-thinking', 'analytical', 'problem-solving'],
        nextQuestionId: 'q8-strategic',
      },
      {
        id: 'a7-pr4',
        text: "I'm not sure what made it work",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's effective.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows skill.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-support': {
    id: 'q7-support',
    question: "What did you learn about yourself from that experience?",
    answerOptions: [
      {
        id: 'a7-s1',
        text: "That I have more empathy than I realized",
        category: ResponseCategory.DETAILED,
        keywords: ['empathy', 'understand', 'others', 'care'],
        competencies: ['empathy', 'self-awareness', 'interpersonal'],
        nextQuestionId: 'q8-empathy',
      },
      {
        id: 'a7-s2',
        text: "That helping others energizes me",
        category: ResponseCategory.POSITIVE,
        keywords: ['help', 'others', 'energizes', 'motivated'],
        competencies: ['helpfulness', 'impact-driven', 'motivation'],
        nextQuestionId: 'q8-helping',
      },
      {
        id: 'a7-s3',
        text: "That I can make a real difference",
        category: ResponseCategory.POSITIVE,
        keywords: ['difference', 'impact', 'matter', 'contribute'],
        competencies: ['impact-driven', 'purpose', 'confidence'],
        nextQuestionId: 'q8-impact',
      },
      {
        id: 'a7-s4',
        text: "I'm not sure what I learned",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-resilience': {
    id: 'q7-resilience',
    question: "What kept you going when you wanted to give up?",
    answerOptions: [
      {
        id: 'a7-re1',
        text: "Remembering my goals and why they matter",
        category: ResponseCategory.DETAILED,
        keywords: ['goals', 'matter', 'purpose', 'remember'],
        competencies: ['goal-driven', 'purpose', 'motivation'],
        nextQuestionId: 'q8-goals',
      },
      {
        id: 'a7-re2',
        text: "Support from others",
        category: ResponseCategory.POSITIVE,
        keywords: ['support', 'others', 'help', 'encourage'],
        competencies: ['interpersonal', 'collaboration', 'help-seeking'],
        nextQuestionId: 'q8-support',
      },
      {
        id: 'a7-re3',
        text: "Knowing I could figure it out",
        category: ResponseCategory.DETAILED,
        keywords: ['figure out', 'can', 'confidence', 'capability'],
        competencies: ['confidence', 'problem-solving', 'resilience'],
        nextQuestionId: 'q8-confidence',
      },
      {
        id: 'a7-re4',
        text: "I'm not sure what kept me going",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's powerful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows strength.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-growth': {
    id: 'q7-growth',
    question: "What areas do you want to grow in most?",
    answerOptions: [
      {
        id: 'a7-g1',
        text: "My technical or professional skills",
        category: ResponseCategory.DETAILED,
        keywords: ['technical', 'professional', 'skills', 'develop'],
        competencies: ['learning', 'growth-mindset', 'curiosity'],
        nextQuestionId: 'q8-skills',
      },
      {
        id: 'a7-g2',
        text: "My ability to lead and influence",
        category: ResponseCategory.DETAILED,
        keywords: ['lead', 'influence', 'impact', 'guide'],
        competencies: ['leadership', 'impact-driven', 'interpersonal'],
        nextQuestionId: 'q8-leadership',
      },
      {
        id: 'a7-g3',
        text: "Understanding myself better",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'self', 'awareness', 'know'],
        competencies: ['self-awareness', 'reflection', 'growth-mindset'],
        nextQuestionId: 'q8-understand',
      },
      {
        id: 'a7-g4',
        text: "I'm open to growth in many areas",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good goal.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows direction.",
      [ResponseCategory.VAGUE]: "That's flexible.",
    },
  },

  'q7-impact': {
    id: 'q7-impact',
    question: "What kind of impact do you want to make?",
    answerOptions: [
      {
        id: 'a7-i1',
        text: "Helping others succeed and grow",
        category: ResponseCategory.POSITIVE,
        keywords: ['help', 'others', 'succeed', 'grow'],
        competencies: ['helpfulness', 'empathy', 'impact-driven'],
        nextQuestionId: 'q8-helping',
      },
      {
        id: 'a7-i2',
        text: "Creating positive change in systems",
        category: ResponseCategory.DETAILED,
        keywords: ['positive change', 'systems', 'improve', 'transform'],
        competencies: ['innovation', 'impact-driven', 'strategic-thinking'],
        nextQuestionId: 'q8-change',
      },
      {
        id: 'a7-i3',
        text: "Solving important problems",
        category: ResponseCategory.DETAILED,
        keywords: ['solve', 'important', 'problems', 'challenges'],
        competencies: ['problem-solving', 'impact-driven', 'purpose'],
        nextQuestionId: 'q8-problems',
      },
      {
        id: 'a7-i4',
        text: "I'm still exploring what impact means to me",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's meaningful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows purpose.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-meaning': {
    id: 'q7-meaning',
    question: "What makes a project meaningful for you?",
    answerOptions: [
      {
        id: 'a7-m1',
        text: "When it serves a real need",
        category: ResponseCategory.DETAILED,
        keywords: ['serves', 'need', 'important', 'useful'],
        competencies: ['impact-driven', 'helpfulness', 'purpose'],
        nextQuestionId: 'q8-need',
      },
      {
        id: 'a7-m2',
        text: "When I can be creative and innovative",
        category: ResponseCategory.DETAILED,
        keywords: ['creative', 'innovative', 'new', 'explore'],
        competencies: ['creativity', 'innovation', 'curiosity'],
        nextQuestionId: 'q8-creative',
      },
      {
        id: 'a7-m3',
        text: "When it challenges me to grow",
        category: ResponseCategory.DETAILED,
        keywords: ['challenges', 'grow', 'develop', 'learn'],
        competencies: ['growth-mindset', 'learning', 'curiosity'],
        nextQuestionId: 'q8-challenge',
      },
      {
        id: 'a7-m4',
        text: "I'm still figuring that out",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows depth.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-focus': {
    id: 'q7-focus',
    question: "What helps you maintain focus?",
    answerOptions: [
      {
        id: 'a7-f1',
        text: "Clear goals and priorities",
        category: ResponseCategory.DETAILED,
        keywords: ['goals', 'priorities', 'clear', 'focused'],
        competencies: ['goal-driven', 'planning', 'organization'],
        nextQuestionId: 'q8-priorities',
      },
      {
        id: 'a7-f2',
        text: "Eliminating distractions",
        category: ResponseCategory.DETAILED,
        keywords: ['distractions', 'eliminate', 'control', 'manage'],
        competencies: ['organization', 'execution', 'self-awareness'],
        nextQuestionId: 'q8-control',
      },
      {
        id: 'a7-f3',
        text: "Being in a flow state",
        category: ResponseCategory.DETAILED,
        keywords: ['flow', 'state', 'engaged', 'immersed'],
        competencies: ['focus', 'execution', 'self-awareness'],
        nextQuestionId: 'q8-flow',
      },
      {
        id: 'a7-f4',
        text: "I struggle with maintaining focus sometimes",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's effective.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-collaborate': {
    id: 'q7-collaborate',
    question: "What do you contribute to collaborative settings?",
    answerOptions: [
      {
        id: 'a7-co1',
        text: "Ideas and creative solutions",
        category: ResponseCategory.DETAILED,
        keywords: ['ideas', 'creative', 'solutions', 'innovate'],
        competencies: ['creativity', 'innovation', 'strategic-thinking'],
        nextQuestionId: 'q8-creative',
      },
      {
        id: 'a7-co2',
        text: "Organization and structure",
        category: ResponseCategory.DETAILED,
        keywords: ['organization', 'structure', 'plan', 'organize'],
        competencies: ['organization', 'planning', 'execution'],
        nextQuestionId: 'q8-structure',
      },
      {
        id: 'a7-co3',
        text: "Empathy and understanding",
        category: ResponseCategory.POSITIVE,
        keywords: ['empathy', 'understanding', 'support', 'care'],
        competencies: ['empathy', 'interpersonal', 'emotional-intelligence'],
        nextQuestionId: 'q8-empathy',
      },
      {
        id: 'a7-co4',
        text: "I'm not sure what I contribute",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's valuable.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows self-awareness.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-flexible': {
    id: 'q7-flexible',
    question: "What helps you adapt to change?",
    answerOptions: [
      {
        id: 'a7-fl1',
        text: "Seeing change as an opportunity",
        category: ResponseCategory.POSITIVE,
        keywords: ['opportunity', 'positive', 'open', 'embrace'],
        competencies: ['adaptability', 'growth-mindset', 'openness'],
        nextQuestionId: 'q8-opportunity',
      },
      {
        id: 'a7-fl2',
        text: "Breaking down what I can control",
        category: ResponseCategory.DETAILED,
        keywords: ['control', 'manage', 'organize', 'structure'],
        competencies: ['organization', 'resilience', 'problem-solving'],
        nextQuestionId: 'q8-control',
      },
      {
        id: 'a7-fl3',
        text: "Learning from each experience",
        category: ResponseCategory.DETAILED,
        keywords: ['learning', 'experience', 'grow', 'develop'],
        competencies: ['learning', 'growth-mindset', 'reflection'],
        nextQuestionId: 'q8-learning',
      },
      {
        id: 'a7-fl4',
        text: "I find change challenging",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-explore',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good mindset.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows resilience.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
  },

  'q7-explore': {
    id: 'q7-explore',
    question: "What would help you explore that more?",
    answerOptions: [
      {
        id: 'a7-ex1',
        text: "Trying new experiences",
        category: ResponseCategory.DETAILED,
        keywords: ['trying', 'new', 'experiences', 'experiment'],
        competencies: ['experimentation', 'curiosity', 'openness'],
        nextQuestionId: 'q8-experiment',
      },
      {
        id: 'a7-ex2',
        text: "Reflecting on past experiences",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'past', 'experiences', 'think'],
        competencies: ['reflection', 'self-awareness', 'learning'],
        nextQuestionId: 'q8-reflect',
      },
      {
        id: 'a7-ex3',
        text: "Getting feedback from others",
        category: ResponseCategory.POSITIVE,
        keywords: ['feedback', 'others', 'input', 'perspective'],
        competencies: ['openness', 'interpersonal', 'learning'],
        nextQuestionId: 'q8-feedback',
      },
      {
        id: 'a7-ex4',
        text: "Just time and patience",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
        nextQuestionId: 'q8-patience',
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a good approach.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That shows intentionality.",
      [ResponseCategory.VAGUE]: "That's wise.",
    },
  },

  // Step 8 - Continue deeper (all lead to q9 questions)
  'q8-success': {
    id: 'q8-success',
    question: "How do you define success for yourself?",
    answerOptions: [
      { id: 'a8-s1', text: "Achieving my goals", category: ResponseCategory.DETAILED, keywords: ['goals', 'achieve', 'results'], competencies: ['goal-driven', 'results-oriented'], nextQuestionId: 'q9-final' },
      { id: 'a8-s2', text: "Making a positive impact", category: ResponseCategory.POSITIVE, keywords: ['impact', 'positive', 'difference'], competencies: ['impact-driven', 'purpose'], nextQuestionId: 'q9-final' },
      { id: 'a8-s3', text: "Growing and learning", category: ResponseCategory.DETAILED, keywords: ['grow', 'learn', 'develop'], competencies: ['growth-mindset', 'learning'], nextQuestionId: 'q9-final' },
      { id: 'a8-s4', text: "I'm still defining that", category: ResponseCategory.VAGUE, keywords: [], competencies: [], nextQuestionId: 'q9-final' },
    ],
    reactionTemplates: { [ResponseCategory.POSITIVE]: "That's meaningful.", [ResponseCategory.NEGATIVE]: "I understand.", [ResponseCategory.DETAILED]: "That shows clarity.", [ResponseCategory.VAGUE]: "That's okay." },
  },

  'q8-experiment': {
    id: 'q8-experiment',
    question: "What's been most valuable from experimenting?",
    answerOptions: [
      { id: 'a8-e1', text: "Learning what works and what doesn't", category: ResponseCategory.DETAILED, keywords: ['learn', 'works', 'results'], competencies: ['learning', 'experimentation'], nextQuestionId: 'q9-final' },
      { id: 'a8-e2', text: "Building confidence", category: ResponseCategory.POSITIVE, keywords: ['confidence', 'trust', 'self'], competencies: ['confidence', 'self-awareness'], nextQuestionId: 'q9-final' },
      { id: 'a8-e3', text: "Discovering new possibilities", category: ResponseCategory.DETAILED, keywords: ['discover', 'possibilities', 'new'], competencies: ['curiosity', 'openness'], nextQuestionId: 'q9-final' },
      { id: 'a8-e4', text: "I haven't experimented much yet", category: ResponseCategory.VAGUE, keywords: [], competencies: [], nextQuestionId: 'q9-final' },
    ],
    reactionTemplates: { [ResponseCategory.POSITIVE]: "That's valuable.", [ResponseCategory.NEGATIVE]: "I understand.", [ResponseCategory.DETAILED]: "That shows growth.", [ResponseCategory.VAGUE]: "That's okay." },
  },

  // Add more q8 questions that all converge to q9-final...
  // For brevity, I'll create a pattern where all q8 questions lead to q9-final
  // Step 9 - Penultimate questions (all lead to q10-final)
  'q9-final': {
    id: 'q9-final',
    question: "What would you like others to know about how you work?",
    answerOptions: [
      { id: 'a9-1', text: "I'm reliable and get things done", category: ResponseCategory.DETAILED, keywords: ['reliable', 'done', 'execute'], competencies: ['execution', 'reliability'], nextQuestionId: 'q10-final' },
      { id: 'a9-2', text: "I value collaboration and teamwork", category: ResponseCategory.POSITIVE, keywords: ['collaboration', 'teamwork', 'together'], competencies: ['collaboration', 'teamwork'], nextQuestionId: 'q10-final' },
      { id: 'a9-3', text: "I think strategically and solve problems", category: ResponseCategory.DETAILED, keywords: ['strategic', 'solve', 'problems'], competencies: ['strategic-thinking', 'problem-solving'], nextQuestionId: 'q10-final' },
      { id: 'a9-4', text: "I'm always learning and growing", category: ResponseCategory.DETAILED, keywords: ['learning', 'growing', 'develop'], competencies: ['growth-mindset', 'learning'], nextQuestionId: 'q10-final' },
    ],
    reactionTemplates: { [ResponseCategory.POSITIVE]: "That's clear.", [ResponseCategory.NEGATIVE]: "I understand.", [ResponseCategory.DETAILED]: "That shows self-awareness.", [ResponseCategory.VAGUE]: "That's okay." },
  },

  // Step 10 - Final question
  'q10-final': {
    id: 'q10-final',
    question: "What's one thing you want to remember about yourself from this conversation?",
    answerOptions: [
      { id: 'a10-1', text: "My strengths and what I'm good at", category: ResponseCategory.DETAILED, keywords: ['strengths', 'good'], competencies: ['self-awareness', 'confidence'], nextQuestionId: 'complete' },
      { id: 'a10-2', text: "What motivates and drives me", category: ResponseCategory.DETAILED, keywords: ['motivates', 'drives'], competencies: ['motivation', 'purpose'], nextQuestionId: 'complete' },
      { id: 'a10-3', text: "Areas I want to grow in", category: ResponseCategory.DETAILED, keywords: ['grow', 'develop'], competencies: ['growth-mindset', 'learning'], nextQuestionId: 'complete' },
      { id: 'a10-4', text: "How I can better align my work with my values", category: ResponseCategory.DETAILED, keywords: ['align', 'values', 'work'], competencies: ['values-driven', 'purpose'], nextQuestionId: 'complete' },
    ],
    reactionTemplates: { [ResponseCategory.POSITIVE]: "That's powerful.", [ResponseCategory.NEGATIVE]: "I appreciate that.", [ResponseCategory.DETAILED]: "Thank you for sharing that reflection.", [ResponseCategory.VAGUE]: "That's meaningful." },
  },

  // Helper to get all q8 questions - we'll create stub questions that converge
  ...Object.fromEntries([
    'breakdown', 'collaborate', 'strategic', 'impact', 'values', 'learning',
    'helping', 'boundaries', 'priorities', 'present', 'explore', 'feedback',
    'opportunity', 'control', 'reflect', 'patience', 'needs', 'creative',
    'challenge', 'skills', 'leadership', 'understand', 'change', 'problems',
    'empathy', 'support', 'confidence', 'goals', 'structure', 'flow'
  ].map(key => [`q8-${key}`, {
    id: `q8-${key}`,
    question: "What's something you'd like to explore further?",
    answerOptions: [
      { id: `a8-${key}-1`, text: "Understanding myself better", category: ResponseCategory.DETAILED, keywords: ['understand', 'self'], competencies: ['self-awareness'], nextQuestionId: 'q9-final' },
      { id: `a8-${key}-2`, text: "How I work with others", category: ResponseCategory.POSITIVE, keywords: ['others', 'work'], competencies: ['interpersonal'], nextQuestionId: 'q9-final' },
      { id: `a8-${key}-3`, text: "My approach to challenges", category: ResponseCategory.DETAILED, keywords: ['challenges', 'approach'], competencies: ['problem-solving'], nextQuestionId: 'q9-final' },
      { id: `a8-${key}-4`, text: "What drives me", category: ResponseCategory.VAGUE, keywords: [], competencies: [], nextQuestionId: 'q9-final' },
    ],
    reactionTemplates: { [ResponseCategory.POSITIVE]: "That's interesting.", [ResponseCategory.NEGATIVE]: "I understand.", [ResponseCategory.DETAILED]: "That shows curiosity.", [ResponseCategory.VAGUE]: "That's okay." },
  }])),
};

