/**
 * Conversation Path System
 * Keyword-based path detection and dynamic question routing
 */

export enum ResponseCategory {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  DETAILED = 'detailed',
  VAGUE = 'vague',
}

export interface ConversationPath {
  id: string;
  name: string;
  detectedKeywords: string[];
  triggeredBranches: string[];
  nextQuestion: string;
  reaction?: string;
}

export interface AnswerOption {
  text: string;
  category: ResponseCategory;
  keywords: string[];
  competencies: string[];
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
  nextQuestions: {
    [ResponseCategory.POSITIVE]: string;
    [ResponseCategory.NEGATIVE]: string;
    [ResponseCategory.DETAILED]: string;
    [ResponseCategory.VAGUE]: string;
  };
  detectedCompetencies: {
    [ResponseCategory.POSITIVE]: string[];
    [ResponseCategory.NEGATIVE]: string[];
    [ResponseCategory.DETAILED]: string[];
    [ResponseCategory.VAGUE]: string[];
  };
}

/**
 * Detect response category based on keywords
 */
export function detectResponseCategory(text: string): ResponseCategory {
  const lowerText = text.toLowerCase().trim();
  
  // Positive keywords
  const positiveKeywords = ['good', 'great', 'well', 'excellent', 'wonderful', 'amazing', 'fantastic', 'happy', 'excited', 'love', 'enjoy', 'yes', 'yeah', 'sure'];
  const hasPositive = positiveKeywords.some(keyword => lowerText.includes(keyword));
  
  // Negative keywords
  const negativeKeywords = ['bad', 'not', "don't", "can't", "won't", 'no', 'never', 'difficult', 'hard', 'struggle', 'tired', 'stressed', 'worried'];
  const hasNegative = negativeKeywords.some(keyword => lowerText.includes(keyword));
  
  // Length-based detection
  const wordCount = lowerText.split(/\s+/).filter(w => w.length > 0).length;
  const isDetailed = wordCount > 15;
  const isVague = wordCount <= 3 && !hasPositive && !hasNegative;
  
  if (hasPositive && !hasNegative) {
    return ResponseCategory.POSITIVE;
  }
  if (hasNegative) {
    return ResponseCategory.NEGATIVE;
  }
  if (isDetailed) {
    return ResponseCategory.DETAILED;
  }
  if (isVague) {
    return ResponseCategory.VAGUE;
  }
  
  // Default to detailed if it's a substantial response
  return wordCount > 8 ? ResponseCategory.DETAILED : ResponseCategory.VAGUE;
}

/**
 * Extract keywords for competence detection
 */
export function extractCompetenceKeywords(text: string): string[] {
  const lowerText = text.toLowerCase();
  const keywords: string[] = [];
  
  // Execution keywords
  const executionKeywords = ['launch', 'organize', 'project', 'accomplish', 'achieve', 'complete', 'finish', 'deliver', 'execute', 'plan', 'structure', 'system'];
  if (executionKeywords.some(k => lowerText.includes(k))) {
    keywords.push('execution', 'initiative', 'structure');
  }
  
  // Interpersonal keywords
  const interpersonalKeywords = ['help', 'peers', 'team', 'collaborate', 'support', 'others', 'together', 'work with', 'connect'];
  if (interpersonalKeywords.some(k => lowerText.includes(k))) {
    keywords.push('collaboration', 'helpfulness', 'empathy');
  }
  
  // Motivation keywords
  const motivationKeywords = ['motivate', 'progress', 'proud', 'accomplish', 'goal', 'drive', 'energize', 'excited', 'purpose'];
  if (motivationKeywords.some(k => lowerText.includes(k))) {
    keywords.push('goal-driven', 'impact-driven', 'motivation');
  }
  
  // Cognitive keywords
  const cognitiveKeywords = ['think', 'analyze', 'strategic', 'pattern', 'recognize', 'understand', 'solve', 'problem', 'detail'];
  if (cognitiveKeywords.some(k => lowerText.includes(k))) {
    keywords.push('strategic-thinking', 'pattern-recognition', 'analytical');
  }
  
  return keywords;
}

/**
 * Conversation question tree
 */
export const conversationTree: QuestionNode[] = [
  {
    id: 'greeting',
    question: "Hi there. How are you feeling today?",
    answerOptions: [
      {
        text: "Good!",
        category: ResponseCategory.POSITIVE,
        keywords: ['good', 'positive', 'well'],
        competencies: ['optimism', 'motivation'],
      },
      {
        text: "Not great, to be honest.",
        category: ResponseCategory.NEGATIVE,
        keywords: ['not', 'struggle', 'difficult'],
        competencies: ['resilience', 'self-awareness'],
      },
      {
        text: "I'm feeling thoughtful about some things.",
        category: ResponseCategory.DETAILED,
        keywords: ['thoughtful', 'reflection', 'considering'],
        competencies: ['reflection', 'self-awareness'],
      },
      {
        text: "Okay.",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's wonderful to hear.",
      [ResponseCategory.NEGATIVE]: "I appreciate you sharing that with me.",
      [ResponseCategory.DETAILED]: "Thank you for sharing that.",
      [ResponseCategory.VAGUE]: "I see.",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "When you're feeling good, what usually motivates you most?",
      [ResponseCategory.NEGATIVE]: "What helps you feel a bit better when things are challenging?",
      [ResponseCategory.DETAILED]: "That sounds meaningful. What stands out to you most from what you shared?",
      [ResponseCategory.VAGUE]: "What's on your mind today?",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['optimism', 'motivation'],
      [ResponseCategory.NEGATIVE]: ['resilience', 'self-awareness'],
      [ResponseCategory.DETAILED]: ['reflection', 'self-awareness'],
      [ResponseCategory.VAGUE]: [],
    },
  },
  {
    id: 'motivation',
    question: "When you're feeling good, what usually motivates you most?",
    answerOptions: [
      {
        text: "Progress - seeing things move forward",
        category: ResponseCategory.POSITIVE,
        keywords: ['progress', 'move forward', 'momentum', 'achieve'],
        competencies: ['goal-driven', 'execution-style', 'impact-driven'],
      },
      {
        text: "Connection - working with others",
        category: ResponseCategory.POSITIVE,
        keywords: ['connection', 'others', 'team', 'collaborate'],
        competencies: ['collaboration', 'interpersonal', 'empathy'],
      },
      {
        text: "New ideas - exploring possibilities",
        category: ResponseCategory.POSITIVE,
        keywords: ['ideas', 'explore', 'possibilities', 'creative'],
        competencies: ['strategic-thinking', 'innovation', 'analytical'],
      },
      {
        text: "I'm not sure what motivates me",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's powerful.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That's insightful.",
      [ResponseCategory.VAGUE]: "Interesting.",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "Can you describe a time you felt really proud of what you accomplished?",
      [ResponseCategory.NEGATIVE]: "What would help you feel more motivated?",
      [ResponseCategory.DETAILED]: "Tell me more about a specific moment that illustrates this.",
      [ResponseCategory.VAGUE]: "Can you give me an example?",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['goal-driven', 'execution-style'],
      [ResponseCategory.NEGATIVE]: [],
      [ResponseCategory.DETAILED]: ['goal-driven', 'execution-style', 'self-awareness'],
      [ResponseCategory.VAGUE]: [],
    },
  },
  {
    id: 'accomplishment',
    question: "Can you describe a time you felt really proud of what you accomplished?",
    answerOptions: [
      {
        text: "I launched a project that helped others organize their work",
        category: ResponseCategory.DETAILED,
        keywords: ['launch', 'project', 'help', 'organize', 'others'],
        competencies: ['organization', 'leadership', 'initiative', 'helpfulness', 'execution'],
      },
      {
        text: "I solved a complex problem that had been blocking progress",
        category: ResponseCategory.DETAILED,
        keywords: ['solve', 'problem', 'complex', 'progress', 'strategic'],
        competencies: ['strategic-thinking', 'problem-solving', 'analytical', 'execution'],
      },
      {
        text: "I helped a team member succeed when they were struggling",
        category: ResponseCategory.POSITIVE,
        keywords: ['help', 'team', 'succeed', 'support'],
        competencies: ['collaboration', 'empathy', 'helpfulness', 'interpersonal'],
      },
      {
        text: "I'm not sure, I don't think about accomplishments much",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's inspiring.",
      [ResponseCategory.NEGATIVE]: "I appreciate you sharing that.",
      [ResponseCategory.DETAILED]: "That's a powerful example.",
      [ResponseCategory.VAGUE]: "Can you tell me more about that?",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "What strengths do you think helped you in that situation?",
      [ResponseCategory.NEGATIVE]: "What did you learn from that experience?",
      [ResponseCategory.DETAILED]: "What patterns do you notice in how you approach challenges like that?",
      [ResponseCategory.VAGUE]: "What made that moment special for you?",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['initiative', 'execution', 'impact-driven'],
      [ResponseCategory.NEGATIVE]: ['resilience', 'learning'],
      [ResponseCategory.DETAILED]: ['organization', 'leadership', 'initiative', 'helpfulness', 'execution'],
      [ResponseCategory.VAGUE]: [],
    },
  },
  {
    id: 'strengths',
    question: "What strengths do you think helped you in that situation?",
    answerOptions: [
      {
        text: "My ability to organize and plan things out",
        category: ResponseCategory.DETAILED,
        keywords: ['organize', 'plan', 'structure', 'system'],
        competencies: ['structure', 'planning', 'execution'],
      },
      {
        text: "My willingness to take initiative",
        category: ResponseCategory.POSITIVE,
        keywords: ['initiative', 'take action', 'start'],
        competencies: ['initiative', 'execution', 'leadership'],
      },
      {
        text: "My ability to work well with others",
        category: ResponseCategory.POSITIVE,
        keywords: ['work with others', 'team', 'collaborate'],
        competencies: ['collaboration', 'interpersonal', 'teamwork'],
      },
      {
        text: "I'm not really sure",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's great self-awareness.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of yourself.",
      [ResponseCategory.VAGUE]: "That's interesting.",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "When do you feel most in your element?",
      [ResponseCategory.NEGATIVE]: "What would help you feel more confident?",
      [ResponseCategory.DETAILED]: "How do you see these strengths showing up in other areas of your life?",
      [ResponseCategory.VAGUE]: "Can you give me an example?",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['self-awareness', 'confidence'],
      [ResponseCategory.NEGATIVE]: [],
      [ResponseCategory.DETAILED]: ['self-awareness', 'pattern-recognition'],
      [ResponseCategory.VAGUE]: [],
    },
  },
  {
    id: 'element',
    question: "When do you feel most in your element?",
    answerOptions: [
      {
        text: "When I'm making progress on meaningful goals",
        category: ResponseCategory.POSITIVE,
        keywords: ['progress', 'goals', 'meaningful'],
        competencies: ['goal-driven', 'motivation', 'impact-driven'],
      },
      {
        text: "When I'm collaborating with a team",
        category: ResponseCategory.POSITIVE,
        keywords: ['collaborate', 'team', 'together'],
        competencies: ['collaboration', 'interpersonal', 'teamwork'],
      },
      {
        text: "When I'm solving complex problems",
        category: ResponseCategory.DETAILED,
        keywords: ['solve', 'complex', 'problems', 'think'],
        competencies: ['strategic-thinking', 'analytical', 'problem-solving'],
      },
      {
        text: "I'm not sure when I feel in my element",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That sounds energizing.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "That's a rich description.",
      [ResponseCategory.VAGUE]: "I see.",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "What patterns do you notice in situations where you thrive?",
      [ResponseCategory.NEGATIVE]: "What would help you feel more in your element?",
      [ResponseCategory.DETAILED]: "What connects all these moments together for you?",
      [ResponseCategory.VAGUE]: "Can you describe a specific example?",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['motivation', 'flow-state'],
      [ResponseCategory.NEGATIVE]: [],
      [ResponseCategory.DETAILED]: ['pattern-recognition', 'self-awareness'],
      [ResponseCategory.VAGUE]: [],
    },
  },
  {
    id: 'patterns',
    question: "What patterns do you notice in situations where you thrive?",
    answerOptions: [
      {
        text: "I see clear goals and can track progress",
        category: ResponseCategory.DETAILED,
        keywords: ['goals', 'progress', 'track', 'clear'],
        competencies: ['goal-driven', 'pattern-recognition', 'strategic-thinking'],
      },
      {
        text: "I'm working with supportive people",
        category: ResponseCategory.POSITIVE,
        keywords: ['supportive', 'people', 'team'],
        competencies: ['collaboration', 'interpersonal'],
      },
      {
        text: "I have autonomy to figure things out",
        category: ResponseCategory.DETAILED,
        keywords: ['autonomy', 'figure out', 'independence'],
        competencies: ['independence', 'problem-solving', 'initiative'],
      },
      {
        text: "I haven't really noticed patterns",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's insightful.",
      [ResponseCategory.NEGATIVE]: "I appreciate you sharing that.",
      [ResponseCategory.DETAILED]: "You have a clear understanding of yourself.",
      [ResponseCategory.VAGUE]: "That's interesting.",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "How do you want to use these insights moving forward?",
      [ResponseCategory.NEGATIVE]: "What would help you create more of those situations?",
      [ResponseCategory.DETAILED]: "What does this reflection show you about yourself?",
      [ResponseCategory.VAGUE]: "Can you think of a specific example?",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['strategic-thinking', 'pattern-recognition'],
      [ResponseCategory.NEGATIVE]: [],
      [ResponseCategory.DETAILED]: ['analytical', 'pattern-recognition', 'strategic-thinking'],
      [ResponseCategory.VAGUE]: [],
    },
  },
  {
    id: 'forward',
    question: "How do you want to use these insights moving forward?",
    answerOptions: [
      {
        text: "I want to seek out more opportunities that match these patterns",
        category: ResponseCategory.DETAILED,
        keywords: ['seek', 'opportunities', 'match', 'patterns'],
        competencies: ['planning', 'goal-driven', 'strategic-thinking'],
      },
      {
        text: "I want to be more intentional about my choices",
        category: ResponseCategory.POSITIVE,
        keywords: ['intentional', 'choices', 'plan'],
        competencies: ['planning', 'self-awareness', 'goal-driven'],
      },
      {
        text: "I want to understand myself better",
        category: ResponseCategory.DETAILED,
        keywords: ['understand', 'self', 'reflection'],
        competencies: ['self-awareness', 'reflection'],
      },
      {
        text: "I'm not sure yet",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's a powerful vision.",
      [ResponseCategory.NEGATIVE]: "I appreciate your honesty.",
      [ResponseCategory.DETAILED]: "You have a clear sense of direction.",
      [ResponseCategory.VAGUE]: "I see.",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "What support would be most helpful for you?",
      [ResponseCategory.NEGATIVE]: "What would help you feel more optimistic?",
      [ResponseCategory.DETAILED]: "What's the first step you'd like to take?",
      [ResponseCategory.VAGUE]: "What comes to mind?",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['planning', 'goal-driven'],
      [ResponseCategory.NEGATIVE]: [],
      [ResponseCategory.DETAILED]: ['planning', 'execution', 'goal-driven'],
      [ResponseCategory.VAGUE]: [],
    },
  },
  {
    id: 'support',
    question: "What support would be most helpful for you?",
    answerOptions: [
      {
        text: "Having a space to reflect and understand myself better",
        category: ResponseCategory.DETAILED,
        keywords: ['reflect', 'understand', 'self'],
        competencies: ['self-awareness', 'reflection'],
      },
      {
        text: "Connecting with others who share similar values",
        category: ResponseCategory.POSITIVE,
        keywords: ['connect', 'others', 'values', 'share'],
        competencies: ['collaboration', 'interpersonal'],
      },
      {
        text: "Tools to help me track and plan my growth",
        category: ResponseCategory.DETAILED,
        keywords: ['track', 'plan', 'growth', 'tools'],
        competencies: ['planning', 'goal-driven', 'execution'],
      },
      {
        text: "I'm not sure what support I need",
        category: ResponseCategory.VAGUE,
        keywords: [],
        competencies: [],
      },
    ],
    reactionTemplates: {
      [ResponseCategory.POSITIVE]: "That's great clarity.",
      [ResponseCategory.NEGATIVE]: "I understand.",
      [ResponseCategory.DETAILED]: "You know what you need.",
      [ResponseCategory.VAGUE]: "That's okay.",
    },
    nextQuestions: {
      [ResponseCategory.POSITIVE]: "Thank you for sharing. I've gathered enough to reflect back what I'm seeing.",
      [ResponseCategory.NEGATIVE]: "Thank you for sharing. I've gathered enough to reflect back what I'm seeing.",
      [ResponseCategory.DETAILED]: "Thank you for sharing. I've gathered enough to reflect back what I'm seeing.",
      [ResponseCategory.VAGUE]: "Thank you for sharing. I've gathered enough to reflect back what I'm seeing.",
    },
    detectedCompetencies: {
      [ResponseCategory.POSITIVE]: ['self-awareness', 'help-seeking'],
      [ResponseCategory.NEGATIVE]: [],
      [ResponseCategory.DETAILED]: ['self-awareness', 'collaboration'],
      [ResponseCategory.VAGUE]: [],
    },
  },
];

/**
 * Find next question node based on question text
 */
export function findQuestionByText(questionText: string): QuestionNode | null {
  return conversationTree.find(node => node.question === questionText) || null;
}

/**
 * Get next question node based on answer category
 */
export function getNextQuestionNode(
  currentNode: QuestionNode,
  category: ResponseCategory
): QuestionNode | null {
  const nextQuestionText = currentNode.nextQuestions[category];
  if (!nextQuestionText) return null;
  
  // Check if this is the completion message
  if (nextQuestionText.includes("Thank you for sharing") || nextQuestionText.includes("gathered enough")) {
    return null; // Conversation complete
  }
  
  // Find the node with matching question
  return findQuestionByText(nextQuestionText);
}

/**
 * Comprehensive evaluation based on full conversation history
 */
export function generateCompetenceSummary(
  conversationPath: ConversationPath[],
  allAnswers: string[]
): {
  summary: string;
  competencies: string[];
  detailedEvaluation: string;
} {
  const allKeywords = conversationPath.flatMap(p => p.detectedKeywords);
  const allCompetencies = conversationPath.flatMap(p => p.triggeredBranches);
  const allAnswersText = allAnswers.join(' ').toLowerCase();
  
  // Count occurrences of each competence
  const competenceCounts: Record<string, number> = {};
  allCompetencies.forEach(comp => {
    competenceCounts[comp] = (competenceCounts[comp] || 0) + 1;
  });
  
  // Count keyword occurrences
  const keywordCounts: Record<string, number> = {};
  allKeywords.forEach(keyword => {
    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
  });
  
  // Build comprehensive evaluation
  const summaryParts: string[] = [];
  const competencies: string[] = [];
  const evaluationParts: string[] = [];
  
  // Analyze goal-driven patterns
  const goalKeywords = ['progress', 'accomplish', 'goal', 'achieve', 'momentum', 'results'];
  const goalCount = goalKeywords.reduce((sum, k) => sum + (keywordCounts[k] || 0), 0);
  if (goalCount > 0) {
    summaryParts.push("You appear to thrive on momentum and results.");
    competencies.push('Goal-driven', 'Impact-driven');
    evaluationParts.push(`Your responses consistently show a focus on progress and achievement (mentioned ${goalCount} times).`);
  }
  
  // Analyze execution patterns
  const executionKeywords = ['launch', 'organize', 'project', 'execute', 'structure', 'plan', 'system'];
  const executionCount = executionKeywords.reduce((sum, k) => sum + (keywordCounts[k] || 0), 0);
  if (executionCount > 0) {
    summaryParts.push("You combine goal orientation, initiative, and a structured thinking style.");
    competencies.push('Initiative', 'Structure', 'Execution Style');
    evaluationParts.push(`You demonstrate strong execution capabilities, with ${executionCount} references to organizing, planning, and delivering results.`);
  }
  
  // Analyze collaboration patterns
  const collaborationKeywords = ['help', 'peers', 'team', 'collaborate', 'others', 'together', 'support'];
  const collaborationCount = collaborationKeywords.reduce((sum, k) => sum + (keywordCounts[k] || 0), 0);
  if (collaborationCount > 0) {
    summaryParts.push("You also show a collaborative spirit and ability to turn motivation into execution.");
    competencies.push('Collaboration', 'Helpfulness', 'Interpersonal');
    evaluationParts.push(`Your answers reveal a strong collaborative orientation, mentioning teamwork and helping others ${collaborationCount} times.`);
  }
  
  // Analyze cognitive patterns
  const cognitiveKeywords = ['think', 'analyze', 'strategic', 'pattern', 'recognize', 'solve', 'problem'];
  const cognitiveCount = cognitiveKeywords.reduce((sum, k) => sum + (keywordCounts[k] || 0), 0);
  if (cognitiveCount > 0) {
    summaryParts.push("You demonstrate strategic thinking and pattern recognition.");
    competencies.push('Strategic Thinking', 'Pattern Recognition', 'Analytical');
    evaluationParts.push(`You show analytical thinking patterns, with ${cognitiveCount} instances of strategic, problem-solving, or pattern-recognition language.`);
  }
  
  // Analyze self-awareness
  const selfAwarenessCount = competenceCounts['self-awareness'] || 0;
  if (selfAwarenessCount > 0) {
    competencies.push('Self-awareness', 'Reflection');
    evaluationParts.push(`Your responses demonstrate self-awareness and reflection, appearing ${selfAwarenessCount} times in the conversation.`);
  }
  
  // Analyze motivation patterns
  const motivationKeywords = ['motivate', 'energize', 'excited', 'purpose', 'meaningful', 'drive'];
  const motivationCount = motivationKeywords.reduce((sum, k) => sum + (keywordCounts[k] || 0), 0);
  if (motivationCount > 0) {
    competencies.push('Motivation', 'Purpose-driven');
    evaluationParts.push(`You show strong intrinsic motivation, with ${motivationCount} references to what energizes and drives you.`);
  }
  
  // Analyze independence
  const independenceKeywords = ['autonomy', 'independence', 'figure out', 'own'];
  const independenceCount = independenceKeywords.reduce((sum, k) => sum + (keywordCounts[k] || 0), 0);
  if (independenceCount > 0) {
    competencies.push('Independence', 'Autonomy');
    evaluationParts.push(`You value autonomy and independence, mentioned ${independenceCount} times in your responses.`);
  }
  
  // Default summary if nothing specific detected
  if (summaryParts.length === 0) {
    summaryParts.push("You demonstrate thoughtful reflection and self-awareness.");
    competencies.push('Self-awareness', 'Reflection');
    evaluationParts.push("Your responses show a thoughtful, reflective approach to understanding yourself.");
  }
  
  // Build detailed evaluation
  const detailedEvaluation = evaluationParts.length > 0 
    ? evaluationParts.join(' ') 
    : "Based on your conversation, you show a thoughtful and reflective approach to understanding your strengths and patterns.";
  
  // Add overall assessment
  const totalCompetencies = Object.keys(competenceCounts).length;
  const totalKeywords = allKeywords.length;
  
  if (totalCompetencies > 0) {
    const topCompetencies = Object.entries(competenceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([comp]) => comp);
    
    evaluationParts.push(`Overall, you've demonstrated ${totalCompetencies} distinct competence areas, with particular strength in ${topCompetencies.join(', ')}.`);
  }
  
  return {
    summary: summaryParts.join(' '),
    competencies: [...new Set(competencies)], // Remove duplicates
    detailedEvaluation: evaluationParts.join(' '),
  };
}

