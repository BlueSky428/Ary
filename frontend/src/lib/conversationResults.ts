/**
 * Conversation Results System
 * Pre-defined results that match all possible conversation paths
 */

import type { QuestionNode, AnswerOption } from './conversationTree';

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

export interface ConversationHistory {
  questionId: string;
  question: string;
  answerId: string;
  answer: string;
  keywords: string[];
  competencies: string[];
}

/**
 * All possible conversation results
 */
export const conversationResults: ConversationResult[] = [
  {
    id: 'result-goal-driven-executor',
    title: 'Goal-Driven Executor',
    summary: 'You appear to thrive on momentum and results. You combine goal orientation, initiative, and a structured thinking style.',
    competencies: ['Goal-driven', 'Impact-driven', 'Initiative', 'Structure', 'Execution Style', 'Results-oriented'],
    detailedEvaluation: 'Your conversation consistently shows a focus on progress, achievement, and getting things done. You demonstrate strong execution capabilities with multiple references to organizing, planning, and delivering results. You combine goal orientation with initiative and structured thinking, showing an ability to turn motivation into action.',
    matchingPatterns: {
      questionIds: ['q2-positive', 'q3-progress', 'q4-accomplishment', 'q4-execution'],
      keywordPatterns: ['progress', 'achieve', 'goal', 'execute', 'organize', 'plan', 'structure'],
      competencePatterns: ['goal-driven', 'execution', 'initiative', 'structure'],
    },
  },
  {
    id: 'result-collaborative-leader',
    title: 'Collaborative Leader',
    summary: 'You show a collaborative spirit and ability to turn motivation into execution. You value working with others and creating positive impact together.',
    competencies: ['Collaboration', 'Helpfulness', 'Interpersonal', 'Teamwork', 'Empathy', 'Leadership'],
    detailedEvaluation: 'Your responses reveal a strong collaborative orientation, with frequent mentions of teamwork, helping others, and working together. You demonstrate empathy and interpersonal skills, showing an ability to connect with others and support their success. You combine collaboration with execution, showing you can work effectively in teams while still delivering results.',
    matchingPatterns: {
      questionIds: ['q2-positive', 'q3-connection', 'q4-help', 'q4-support'],
      keywordPatterns: ['team', 'collaborate', 'help', 'others', 'support', 'together'],
      competencePatterns: ['collaboration', 'interpersonal', 'empathy', 'teamwork'],
    },
  },
  {
    id: 'result-strategic-thinker',
    title: 'Strategic Thinker',
    summary: 'You demonstrate strategic thinking and pattern recognition. You enjoy analyzing complex situations and finding innovative solutions.',
    competencies: ['Strategic Thinking', 'Pattern Recognition', 'Analytical', 'Problem-solving', 'Innovation'],
    detailedEvaluation: 'You show strong analytical thinking patterns, with multiple instances of strategic, problem-solving, or pattern-recognition language. You enjoy tackling complex problems and finding innovative solutions. You demonstrate an ability to see patterns and connections that others might miss, showing both analytical depth and creative problem-solving.',
    matchingPatterns: {
      questionIds: ['q2-positive', 'q3-ideas', 'q4-strategic', 'q4-thinking'],
      keywordPatterns: ['think', 'analyze', 'strategic', 'pattern', 'solve', 'problem', 'complex'],
      competencePatterns: ['strategic-thinking', 'analytical', 'problem-solving', 'pattern-recognition'],
    },
  },
  {
    id: 'result-self-aware-reflector',
    title: 'Self-Aware Reflector',
    summary: 'You demonstrate thoughtful reflection and self-awareness. You value understanding yourself and learning from your experiences.',
    competencies: ['Self-awareness', 'Reflection', 'Learning', 'Growth-mindset', 'Emotional Intelligence'],
    detailedEvaluation: 'Your responses consistently show self-awareness and reflection, appearing multiple times throughout the conversation. You demonstrate a thoughtful approach to understanding yourself, with frequent mentions of reflection, learning, and personal growth. You show an ability to recognize patterns in your own behavior and use that awareness to guide your choices.',
    matchingPatterns: {
      questionIds: ['q2-detailed', 'q3-understand', 'q4-reflect', 'q4-patterns'],
      keywordPatterns: ['reflect', 'understand', 'self', 'awareness', 'learn', 'grow', 'patterns'],
      competencePatterns: ['self-awareness', 'reflection', 'learning', 'growth-mindset'],
    },
  },
  {
    id: 'result-resilient-problem-solver',
    title: 'Resilient Problem-Solver',
    summary: 'You show resilience and a structured approach to challenges. You focus on what you can control and find ways to move forward.',
    competencies: ['Resilience', 'Problem-solving', 'Structure', 'Organization', 'Self-awareness'],
    detailedEvaluation: 'Your conversation shows resilience in how you approach challenges, with multiple references to focusing on what you can control and finding ways to work through difficulties. You demonstrate a structured approach to problem-solving, breaking things down into manageable steps. You combine resilience with self-awareness, showing an ability to reflect on challenges and learn from them.',
    matchingPatterns: {
      questionIds: ['q2-negative', 'q3-control', 'q4-challenges', 'q4-organize'],
      keywordPatterns: ['challenges', 'control', 'manage', 'structure', 'organize', 'solve'],
      competencePatterns: ['resilience', 'problem-solving', 'structure', 'organization'],
    },
  },
  {
    id: 'result-growth-oriented-learner',
    title: 'Growth-Oriented Learner',
    summary: 'You demonstrate a growth mindset and love of learning. You seek opportunities to develop and improve yourself.',
    competencies: ['Growth-mindset', 'Learning', 'Experimentation', 'Self-awareness', 'Openness'],
    detailedEvaluation: 'Your responses show a strong growth mindset, with frequent mentions of learning, trying new things, and seeking opportunities to develop. You demonstrate curiosity and openness to feedback, showing an ability to learn from experiences and others. You combine learning with self-awareness, using what you learn to understand yourself better.',
    matchingPatterns: {
      questionIds: ['q2-detailed', 'q3-grow', 'q4-learn', 'q4-experiment'],
      keywordPatterns: ['learn', 'grow', 'develop', 'improve', 'experiment', 'try', 'new'],
      competencePatterns: ['growth-mindset', 'learning', 'experimentation', 'self-awareness'],
    },
  },
  {
    id: 'result-impact-driven-helper',
    title: 'Impact-Driven Helper',
    summary: 'You are motivated by making a positive impact and helping others succeed. You combine empathy with action.',
    competencies: ['Impact-driven', 'Helpfulness', 'Empathy', 'Purpose', 'Results-oriented'],
    detailedEvaluation: 'Your conversation consistently shows a focus on helping others and making a positive impact. You demonstrate strong empathy and a desire to contribute meaningfully. You combine this with execution capabilities, showing you can turn your desire to help into actual results. You are motivated by purpose and the ability to make a difference.',
    matchingPatterns: {
      questionIds: ['q3-help', 'q4-help', 'q4-impact', 'q4-support'],
      keywordPatterns: ['help', 'others', 'impact', 'positive', 'support', 'succeed'],
      competencePatterns: ['helpfulness', 'empathy', 'impact-driven', 'purpose'],
    },
  },
  {
    id: 'result-independent-innovator',
    title: 'Independent Innovator',
    summary: 'You value autonomy and enjoy finding your own way. You combine independence with creative problem-solving.',
    competencies: ['Independence', 'Autonomy', 'Innovation', 'Problem-solving', 'Initiative'],
    detailedEvaluation: 'Your responses show a strong value for autonomy and independence, with multiple mentions of figuring things out your own way. You demonstrate initiative and creative problem-solving, showing an ability to work independently while still being effective. You combine independence with innovation, finding unique approaches to challenges.',
    matchingPatterns: {
      questionIds: ['q3-patterns', 'q4-autonomy', 'q4-creative', 'q4-thinking'],
      keywordPatterns: ['autonomy', 'independence', 'figure out', 'own way', 'innovate', 'creative'],
      competencePatterns: ['independence', 'autonomy', 'innovation', 'initiative'],
    },
  },
  {
    id: 'result-balanced-collaborator',
    title: 'Balanced Collaborator',
    summary: 'You balance independence with collaboration, showing strength in both working alone and with others.',
    competencies: ['Collaboration', 'Independence', 'Interpersonal', 'Balance', 'Adaptability'],
    detailedEvaluation: 'Your conversation shows a balance between working independently and collaborating with others. You demonstrate flexibility in how you approach work, adapting to what the situation requires. You show strength in both interpersonal skills and independent problem-solving, making you effective in various contexts.',
    matchingPatterns: {
      questionIds: ['q3-connection', 'q4-connect', 'q4-goals', 'q4-support'],
      keywordPatterns: ['collaborate', 'team', 'independence', 'autonomy', 'balance', 'together'],
      competencePatterns: ['collaboration', 'independence', 'interpersonal', 'adaptability'],
    },
  },
  {
    id: 'result-reflective-planner',
    title: 'Reflective Planner',
    summary: 'You combine reflection with planning, showing both self-awareness and execution capabilities.',
    competencies: ['Reflection', 'Planning', 'Self-awareness', 'Organization', 'Execution'],
    detailedEvaluation: 'Your responses show a combination of reflective thinking and practical planning. You demonstrate self-awareness through reflection, and you use that awareness to create effective plans. You combine introspection with action, showing you can both understand yourself deeply and execute on that understanding.',
    matchingPatterns: {
      questionIds: ['q3-reflect', 'q4-plan', 'q4-patterns', 'q4-organize'],
      keywordPatterns: ['reflect', 'plan', 'organize', 'structure', 'think', 'analyze'],
      competencePatterns: ['reflection', 'planning', 'self-awareness', 'organization'],
    },
  },
  {
    id: 'result-purpose-driven-achiever',
    title: 'Purpose-Driven Achiever',
    summary: 'You are driven by purpose and values, combining meaning with results. You want your work to matter.',
    competencies: ['Purpose', 'Values-driven', 'Impact-driven', 'Goal-driven', 'Results-oriented'],
    detailedEvaluation: 'Your conversation shows a strong connection between your values, purpose, and your goals. You are motivated by meaning and want your work to create positive impact. You combine this purpose-driven approach with execution capabilities, showing you can turn your values into results. You seek alignment between what matters to you and what you do.',
    matchingPatterns: {
      questionIds: ['q3-goals', 'q4-goals', 'q4-impact', 'q4-gratitude'],
      keywordPatterns: ['purpose', 'values', 'meaningful', 'impact', 'goals', 'achieve'],
      competencePatterns: ['purpose', 'values-driven', 'impact-driven', 'goal-driven'],
    },
  },
  {
    id: 'result-empathetic-connector',
    title: 'Empathetic Connector',
    summary: 'You excel at understanding and connecting with others. You value relationships and mutual support.',
    competencies: ['Empathy', 'Interpersonal', 'Collaboration', 'Emotional Intelligence', 'Support'],
    detailedEvaluation: 'Your responses consistently show empathy and strong interpersonal skills. You value relationships and demonstrate an ability to understand others\' perspectives. You show strength in creating connections and providing support, making you effective in collaborative settings. You combine empathy with action, showing you can both understand and help others.',
    matchingPatterns: {
      questionIds: ['q3-relationships', 'q4-connect', 'q4-support', 'q4-feedback'],
      keywordPatterns: ['empathy', 'understand', 'others', 'relationships', 'support', 'connect'],
      competencePatterns: ['empathy', 'interpersonal', 'collaboration', 'emotional-intelligence'],
    },
  },
  {
    id: 'result-analytical-innovator',
    title: 'Analytical Innovator',
    summary: 'You combine analytical thinking with creativity, showing both depth and innovation in your approach.',
    competencies: ['Analytical', 'Innovation', 'Strategic Thinking', 'Creativity', 'Problem-solving'],
    detailedEvaluation: 'Your conversation shows a unique combination of analytical depth and creative innovation. You demonstrate strong strategic thinking and pattern recognition, while also showing creativity in finding new approaches. You enjoy complex problems and innovative solutions, showing you can both analyze deeply and think outside the box.',
    matchingPatterns: {
      questionIds: ['q3-ideas', 'q4-creative', 'q4-strategic', 'q4-thinking'],
      keywordPatterns: ['analyze', 'innovate', 'creative', 'strategic', 'think', 'solve'],
      competencePatterns: ['analytical', 'innovation', 'strategic-thinking', 'creativity'],
    },
  },
  {
    id: 'result-structured-executor',
    title: 'Structured Executor',
    summary: 'You excel at organizing and executing. You create systems and follow through to deliver results.',
    competencies: ['Organization', 'Structure', 'Execution', 'Planning', 'Results-oriented'],
    detailedEvaluation: 'Your responses consistently show strong organizational and execution capabilities. You demonstrate an ability to create structure, break things down into manageable steps, and follow through to completion. You combine planning with execution, showing you can both organize effectively and deliver results. You value systems and processes that help you get things done.',
    matchingPatterns: {
      questionIds: ['q3-work', 'q4-plan', 'q4-organize', 'q4-execution'],
      keywordPatterns: ['organize', 'structure', 'plan', 'execute', 'system', 'steps'],
      competencePatterns: ['organization', 'structure', 'execution', 'planning'],
    },
  },
  {
    id: 'result-open-learner',
    title: 'Open Learner',
    summary: 'You demonstrate openness to learning and growth. You seek feedback and new experiences.',
    competencies: ['Openness', 'Learning', 'Growth-mindset', 'Curiosity', 'Adaptability'],
    detailedEvaluation: 'Your conversation shows openness to learning and growth, with frequent mentions of seeking feedback, trying new things, and learning from experiences. You demonstrate curiosity and adaptability, showing an ability to learn from various sources. You combine openness with self-awareness, using what you learn to understand yourself better.',
    matchingPatterns: {
      questionIds: ['q4-feedback', 'q4-learn', 'q4-experiment', 'q4-understand'],
      keywordPatterns: ['learn', 'feedback', 'open', 'try', 'new', 'experiment', 'grow'],
      competencePatterns: ['openness', 'learning', 'growth-mindset', 'curiosity'],
    },
  },
  {
    id: 'result-balanced-thinker',
    title: 'Balanced Thinker',
    summary: 'You show a balanced approach, combining reflection with action, independence with collaboration.',
    competencies: ['Balance', 'Adaptability', 'Self-awareness', 'Flexibility', 'Integration'],
    detailedEvaluation: 'Your responses show a balanced and integrated approach to work and life. You demonstrate flexibility in how you approach different situations, adapting as needed. You show strength in multiple areas - reflection and action, independence and collaboration, thinking and doing. This balance makes you effective across various contexts.',
    matchingPatterns: {
      questionIds: ['q2-vague', 'q3-unsure', 'q4-unsure'],
      keywordPatterns: ['balance', 'adapt', 'flexible', 'various', 'different'],
      competencePatterns: ['balance', 'adaptability', 'flexibility', 'integration'],
    },
  },
];

/**
 * Analyze conversation history and find matching result
 */
export function analyzeConversationHistory(
  history: ConversationHistory[]
): ConversationResult {
  if (history.length === 0) {
    // Default fallback if no history
    return conversationResults[0];
  }

  // Collect all data from conversation
  const allQuestionIds = history.map(h => h.questionId);
  const allKeywords = history.flatMap(h => h.keywords);
  const allCompetencies = history.flatMap(h => h.competencies);

  // Count occurrences
  const keywordCounts: Record<string, number> = {};
  allKeywords.forEach(k => {
    keywordCounts[k] = (keywordCounts[k] || 0) + 1;
  });

  const competenceCounts: Record<string, number> = {};
  allCompetencies.forEach(c => {
    competenceCounts[c] = (competenceCounts[c] || 0) + 1;
  });

  // Score results based on question, keyword, and competence matches
  const scoredResults = conversationResults.map(result => {
    let score = 0;

    const questionMatches = result.matchingPatterns.questionIds.filter(qId =>
      allQuestionIds.includes(qId)
    ).length;
    score += questionMatches * 10;

    const keywordMatches = result.matchingPatterns.keywordPatterns.filter(k =>
      allKeywords.includes(k)
    ).length;
    score += keywordMatches * 5;

    const competenceMatches = result.matchingPatterns.competencePatterns.filter(c =>
      allCompetencies.includes(c)
    ).length;
    score += competenceMatches * 8;

    // Bonus for frequency
    result.matchingPatterns.keywordPatterns.forEach(k => {
      if (keywordCounts[k]) {
        score += keywordCounts[k] * 2;
      }
    });
    result.matchingPatterns.competencePatterns.forEach(c => {
      if (competenceCounts[c]) {
        score += competenceCounts[c] * 3;
      }
    });

    return { result, score };
  });

  scoredResults.sort((a, b) => b.score - a.score);
  const topResult = scoredResults[0]?.result || conversationResults[0];

  const enhancedResult: ConversationResult = {
    ...topResult,
    detailedEvaluation: generateDetailedEvaluation(
      topResult,
      history,
      keywordCounts,
      competenceCounts
    ),
  };

  return enhancedResult;
}

/**
 * Generate detailed evaluation based on conversation history
 */
function generateDetailedEvaluation(
  result: ConversationResult,
  history: ConversationHistory[],
  keywordCounts: Record<string, number>,
  competenceCounts: Record<string, number>
): string {
  const parts: string[] = [result.detailedEvaluation];

  // Add specific observations
  const topKeywords = Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k);

  if (topKeywords.length > 0) {
    parts.push(`Throughout our conversation, you mentioned ${topKeywords.join(', ')} multiple times, showing these are important themes for you.`);
  }

  const topCompetencies = Object.entries(competenceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([c]) => c);

  if (topCompetencies.length > 0) {
    parts.push(`Your responses consistently demonstrated ${topCompetencies.join(', ')}, appearing ${topCompetencies.map(c => competenceCounts[c]).join(', ')} times respectively.`);
  }

  // Add conversation flow insights
  if (history.length >= 4) {
    const earlyAnswers = history.slice(0, 2);
    const laterAnswers = history.slice(-2);
    
    const earlyKeywords = earlyAnswers.flatMap(h => h.keywords);
    const laterKeywords = laterAnswers.flatMap(h => h.keywords);
    
    if (laterKeywords.length > earlyKeywords.length) {
      parts.push('As our conversation progressed, you became more specific and detailed in your responses, showing increasing self-awareness and reflection.');
    }
  }

  return parts.join(' ');
}

