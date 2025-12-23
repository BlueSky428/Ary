'use client';

/**
 * Conversation Flow Component
 * Clean, simple, user-friendly chat interface with GPT integration
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, MessageCircle, Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  getStartingQuestion,
  getQuestionById,
  type QuestionNode,
  type AnswerOption,
  ResponseCategory,
} from '@/lib/conversationTree';
import {
  analyzeConversationHistory,
  type ConversationHistory,
} from '@/lib/conversationResults';

// Debug: mirror system prompt (keep in sync with /api/chat)
const CLIENT_SYSTEM_PROMPT = `You are Ary, an AI used for professional reflection. Ask short, neutral follow-up questions about work, study, collaboration, tasks, and goals.

Rules:
- Ask a total of five follow-up questions, one at a time.
- Keep each question under 18 words.
- Each question must relate to the user's previous answers and include a tiny contextual hook (1–2 nouns/verbs) from the last answer.
- Vary neutral openers (e.g., "Understood,", "Noted,", "Quick follow-up:", "One thing I'm curious about:") to avoid repetition.
- Avoid emotional or mental-health language; do not ask "How are you?" or anything about feelings or well-being.
- Do not give advice, guidance, or suggestions for improvement.

Conversational Flow:
- Briefly acknowledge then ask; keep it neutral (no praise or judgement).
- Avoid sounding like a questionnaire—make it feel like a natural follow-on.
- Avoid repeating the same topic. Over 5 questions, try to cover different angles: collaboration, communication, tools/process, planning/coordination, feedback/ownership.
- If the user's answer is very short (e.g., under 8 words), ask a quick clarifier ("Could you share a quick example?") then proceed.
- Before the fifth and final question, preface with "One last question:".

Final Turn:
When FINAL_TURN is provided, do not ask more questions. Return only a JSON object with:
- "summary": 3 short sentences reflecting how the user collaborates or works with others, depending on available evidence. Do not invent information.
- "competencies": An array of 4-6 objects, each with:
  - "label": A short competence label related to collaboration (e.g., "Collaboration", "Teamwork", "Empathy", "Interpersonal Skills", "Helpfulness", "Active Listening", "Coordination")
  - "evidence": An optional short evidence phrase (one line max) only if it is directly reflected in the user's wording. If no evidence is clear, omit this field.

Evidence should refer to linguistic cues, not personality traits.

No scores, no percentages, no emotions.

Style for summary: Write in second person ("you") only. Never refer to the user as "the user", "they", or "their". Use neutral, professional tone.`;

// Animation constants
const ANIMATION_DURATION = {
  FAST: 0.3,
  NORMAL: 0.4,
} as const;

const EASING = [0.16, 1, 0.3, 1] as const;

const getAiAnsweredCount = (history: ConversationHistory[]) =>
  Math.max(0, history.length - 2); // subtract 2 fixed Q&As

interface Message {
  questionId: string;
  question: string;
  answerId: string;
  answer: string;
  category?: ResponseCategory;
}

interface GPTResult {
  summary: string;
  competencies: Array<{ label: string; evidence?: string }>;
}

interface GPTDebugLog {
  type: 'question' | 'final';
  request: {
    systemPrompt?: string;
    body: any;
    fullMessages?: Array<{ role: string; content: string }>;
    apiConfig?: {
      model: string;
      temperature: number;
      max_tokens: number;
      response_format?: { type: string };
    };
  };
  response: any;
  timestamp: number;
  historyLength: number;
}

export function ConversationFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [currentNode, setCurrentNode] = useState<QuestionNode | null>(getStartingQuestion());
  
  // AI question state
  const [isAIQuestion, setIsAIQuestion] = useState(false);
  const [aiQuestionCount, setAiQuestionCount] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentAIQuestion, setCurrentAIQuestion] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<GPTDebugLog[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<{ history: ConversationHistory[], result?: GPTResult } | null>(null);
  
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const finalLogRef = useRef<HTMLDivElement>(null);
  const debugScrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages.length, editingIndex, currentNode?.id, currentAIQuestion]);

  // Focus text input when AI question appears
  useEffect(() => {
    if (isAIQuestion && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
    }
  }, [isAIQuestion, currentAIQuestion]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto-open debug when final response arrives and scroll to final log
  useEffect(() => {
    const finalLog = debugLogs.find(log => log.type === 'final');
    if (finalLog && pendingRedirect) {
      setShowDebug(true);
      // Scroll to final log after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (finalLogRef.current && debugScrollContainerRef.current) {
          finalLogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [debugLogs, pendingRedirect]);

  const isComplete = currentNode === null || currentNode.id === 'complete';
  const canShowFinishButton = messages.length >= 7; // 2 fixed + 5 AI follow-ups
  const currentStep = messages.length + (isAIQuestion ? 1 : 0) + 1;
  const totalSteps = 7; // 2 fixed + 5 AI follow-ups
  const progressPercentage = isComplete ? 100 : ((currentStep - 1) / totalSteps) * 100;

  // Helper: Navigate to results page (with optional delay)
  const navigateToResults = useCallback((history: ConversationHistory[], gptResult?: GPTResult, immediate: boolean = false) => {
    let result;
    if (gptResult) {
      // Use GPT-provided competencies as-is, no forced defaults
      const competencies = gptResult.competencies && gptResult.competencies.length > 0
        ? gptResult.competencies
        : [];
      
      // Use GPT-provided result
      result = {
        id: 'gpt-result',
        title: 'Professional Profile',
        summary: gptResult.summary,
        competencies: competencies.map(c => c.label),
        detailedEvaluation: gptResult.summary,
        matchingPatterns: {
          questionIds: history.map(h => h.questionId),
          keywordPatterns: [],
          competencePatterns: competencies.map(c => c.label),
        },
      };
      // Store GPT result separately for evidence extraction
      sessionStorage.setItem('gptResult', JSON.stringify({ ...gptResult, competencies }));
    } else {
      // Fallback to pattern matching
      result = analyzeConversationHistory(history);
    }
    
    // Add a brief lead-in message to chat history for UI (not sent to GPT)
    const leadInMessage: Message = {
      questionId: 'final-leadin',
      question: ' ',
      answerId: 'final-leadin',
      answer: "Thanks. I'll summarize what I heard and show your reflection.",
    };
    setMessages(prev => [...prev, leadInMessage]);

    sessionStorage.setItem('conversationHistory', JSON.stringify(history));
    sessionStorage.setItem('conversationResult', JSON.stringify(result));
    router.push('/competence-tree');
  }, [router]);

  // Helper: Construct full messages array for debug (matches server-side construction)
  const constructMessagesForDebug = (historySnapshot: ConversationHistory[], isFinal: boolean) => {
    const COMPETENCE_OPTIONS = {
      execution: ['Planning', 'Organization', 'Goal-Driven', 'Execution', 'Results-Oriented', 'Initiative', 'Structure', 'Deadline Management', 'Systematic Approach', 'Efficiency', 'Productivity', 'Resilience', 'Persistence', 'Commitment'],
      collaboration: ['Collaboration', 'Teamwork', 'Interpersonal Skills', 'Empathy', 'Communication', 'Active Listening', 'Helpfulness', 'Support', 'Leadership', 'Coordination', 'Client Focus', 'Relationship Building', 'Networking'],
      thinking: ['Strategic Thinking', 'Problem-Solving', 'Analytical', 'Critical Thinking', 'Pattern Recognition', 'Innovation', 'Creativity', 'Ideation', 'Design Thinking', 'Logical Reasoning', 'Complex Thinking'],
      growth: ['Self-Awareness', 'Reflection', 'Learning', 'Growth Mindset', 'Openness', 'Curiosity', 'Adaptability', 'Flexibility', 'Continuous Improvement', 'Self-Development', 'Feedback Seeking'],
      purpose: ['Purpose-Driven', 'Values-Driven', 'Impact-Driven', 'Mission', 'Vision', 'Motivation', 'Passion', 'Intrinsic Drive', 'Ambition', 'Contribution', 'Social Impact'],
    };
    const COMPETENCE_LIST = Object.values(COMPETENCE_OPTIONS).flat().join(', ');

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: CLIENT_SYSTEM_PROMPT },
    ];

    // Add conversation history as pairs: assistant question, user answer
    historySnapshot.forEach((entry) => {
      if (entry.question) {
        messages.push({ role: 'assistant', content: entry.question });
      }
      if (entry.answer) {
        messages.push({ role: 'user', content: entry.answer });
      }
    });

    // For final turn, add special instruction
    if (isFinal) {
      messages.push({
        role: 'user',
        content: `FINAL_TURN: Generate the final summary and competencies based on the conversation above. Select 4-6 competencies from this list that are most evidenced: ${COMPETENCE_LIST}`,
      });
    }

    return messages;
  };

  // Call GPT API for next question or final synthesis
  const callGPT = async (
    isFinal: boolean,
    historySnapshot: ConversationHistory[]
  ): Promise<{ type: 'question' | 'final'; question?: string; result?: GPTResult }> => {
    try {
      const requestBody = {
        conversationHistory: historySnapshot.map(h => ({
          question: h.question,
          answer: h.answer,
        })),
        questionCount: getAiAnsweredCount(historySnapshot),
        isFinalTurn: isFinal,
      };

      // Construct full messages array for debug display
      const fullMessages = constructMessagesForDebug(historySnapshot, isFinal);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Debug log - include full messages array
      setDebugLogs(prev => [
        {
          type: isFinal ? 'final' : 'question',
          request: {
            systemPrompt: CLIENT_SYSTEM_PROMPT,
            body: requestBody,
            fullMessages: fullMessages, // Full messages array sent to OpenAI
            apiConfig: {
              model: 'gpt-4o-mini',
              temperature: isFinal ? 0.7 : 0.8,
              max_tokens: isFinal ? 1200 : 100,
              response_format: isFinal ? { type: 'json_object' } : undefined,
            },
          },
          response: data,
          timestamp: Date.now(),
          historyLength: historySnapshot.length,
        },
        ...prev,
      ]);

      // Fallback: if API mislabels but returns JSON-like final content, coerce to final
      const maybeFinal =
        data &&
        data.question &&
        typeof data.question === 'string' &&
        data.question.includes('"summary"') &&
        data.question.includes('"competencies"');

      if (data.type === 'final') {
        return {
          type: 'final',
          result: {
            summary: data.summary,
            competencies: data.competencies,
          },
        };
      } else if (maybeFinal) {
        // Attempt to parse the JSON-like string
        try {
          const parsed = JSON.parse(data.question);
          return {
            type: 'final',
            result: {
              summary: parsed.summary || '',
              competencies: parsed.competencies || [],
            },
          };
        } catch {
          return {
            type: 'final',
            result: {
              summary: data.question,
              competencies: [],
            },
          };
        }
      } else {
        return {
          type: 'question',
          question: data.question,
        };
      }
    } catch (error) {
      console.error('GPT API error:', error);
      throw error;
    }
  };

  // Handle answer selection for fixed questions (q1, q2)
  const handleAnswerSelect = (option: AnswerOption) => {
    if (!currentNode) return;
    
    if (editingIndex !== null) {
      setSelectedAnswerId(option.id);
      return;
    }

    // Add question and answer to messages
    const newMessage: Message = {
      questionId: currentNode.id,
      question: currentNode.question,
      answerId: option.id,
      answer: option.text,
      category: option.category,
    };

    const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      
    const historyEntry: ConversationHistory = {
      questionId: currentNode.id,
      question: currentNode.question,
      answerId: option.id,
      answer: option.text,
      keywords: option.keywords,
      competencies: option.competencies,
    };
    const updatedHistory = [...conversationHistory, historyEntry];
    setConversationHistory(updatedHistory);

    // Wait for answer animation to complete, then show next question
    timeoutRef.current = setTimeout(() => {
      const nextQuestionId = option.nextQuestionId;
      
      // Check if we're moving to AI questions (after q2, which is messages.length === 1)
      if (messages.length >= 1) {
        // Switch to AI mode after question 2
        setIsAIQuestion(true);
        setCurrentNode(null);
        setAiQuestionCount(0);
        loadNextAIQuestion(updatedHistory);
      } else if (nextQuestionId === 'complete') {
        setCurrentNode(null);
        setTimeout(() => navigateToResults(updatedHistory), 1500);
      } else if (nextQuestionId) {
        const nextNode = getQuestionById(nextQuestionId);
        if (nextNode) {
          setCurrentNode(nextNode);
        } else {
          console.error(`Question not found: ${nextQuestionId}`);
          setCurrentNode(null);
          setTimeout(() => navigateToResults(updatedHistory), 1500);
        }
      } else {
        console.warn('No nextQuestionId in answer option.');
        setCurrentNode(null);
        setTimeout(() => navigateToResults(updatedHistory), 1500);
      }
      setSelectedAnswerId(null);
    }, 800);
  };

  // Load next AI question
  const loadNextAIQuestion = async (history: ConversationHistory[]) => {
    setIsLoadingAI(true);
    try {
      const answeredAI = getAiAnsweredCount(history);
      setAiQuestionCount(answeredAI);
      const isFinal = answeredAI >= 5; // 5 AI follow-ups
      const response = await callGPT(isFinal, history);

      if (response.type === 'final' && response.result) {
        // Final synthesis - set pending redirect and show debug
        setPendingRedirect({ history, result: response.result });
        // Auto-open debug overlay to view final prompt
        setShowDebug(true);
        // No automatic redirect - user must click "Proceed to Results" button
      } else if (response.type === 'question' && response.question) {
        // Show next AI question
        setCurrentAIQuestion(response.question);
        setIsLoadingAI(false);
      }
    } catch (error) {
      console.error('Failed to load AI question:', error);
      setIsLoadingAI(false);
      // Fallback: complete conversation
      setTimeout(() => navigateToResults(history), 1500);
    }
  };

  // Handle text answer submission for AI questions
  const handleTextAnswerSubmit = async () => {
    if (!textAnswer.trim() || !currentAIQuestion || isLoadingAI) return;

    const answerText = textAnswer.trim();

    // Add AI question and answer to messages
    const newMessage: Message = {
      questionId: `ai-q${aiQuestionCount + 1}`,
      question: currentAIQuestion,
      answerId: `ai-a${aiQuestionCount + 1}`,
      answer: answerText,
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    const historyEntry: ConversationHistory = {
      questionId: `ai-q${aiQuestionCount + 1}`,
      question: currentAIQuestion,
      answerId: `ai-a${aiQuestionCount + 1}`,
      answer: answerText,
      keywords: [], // Will be extracted by GPT
      competencies: [], // Will be extracted by GPT
    };

    const updatedHistory = [...conversationHistory, historyEntry];
    setConversationHistory(updatedHistory);
    setTextAnswer('');
    setCurrentAIQuestion(null);

    // Check how many AI answers we have now
    const answeredAI = getAiAnsweredCount(updatedHistory);
    setAiQuestionCount(answeredAI);

    if (answeredAI >= 5) {
      // Final synthesis
      setIsLoadingAI(true);
      try {
        const response = await callGPT(true, updatedHistory);
        if (response.type === 'final' && response.result) {
          // Final synthesis - set pending redirect and show debug
          setPendingRedirect({ history: updatedHistory, result: response.result });
          // Auto-open debug overlay to view final prompt
          setShowDebug(true);
          // No automatic redirect - user must click "Proceed to Results" button
        }
      } catch (error) {
        console.error('Failed to get final synthesis:', error);
        setTimeout(() => navigateToResults(updatedHistory), 1500);
      }
    } else {
      // Load next AI question
      setTimeout(() => {
        loadNextAIQuestion(updatedHistory);
      }, 800);
    }
  };

  const handleFinish = () => {
    if (isAIQuestion && currentAIQuestion) {
      // If there's a pending AI question, submit it first
      handleTextAnswerSubmit();
    } else {
      navigateToResults(conversationHistory);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        <div className="w-full mx-auto h-full flex flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
          
        {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    Ary
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isComplete ? 'Complete' : `Step ${currentStep}/${totalSteps}`}
                  </p>
              </div>
            </div>
              
              {/* Progress Bar */}
              <div className="flex-1 max-w-[200px] ml-6">
                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  />
                </div>
        </div>

              {/* Finish Button */}
              {canShowFinishButton && !isComplete && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFinish}
                  className="ml-4 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                >
                  Finish
                </motion.button>
              )}
            </div>
          </div>

          {/* Messages Container */}
        <div 
            className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-6"
            style={{ 
              willChange: 'scroll-position',
              contain: 'layout style paint'
            }}
        >
            {/* All Messages */}
          {messages.map((msg, index) => (
              <div key={`${msg.questionId}-${index}`} className="space-y-3">
              {/* Question */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3 inline-block max-w-[85%]">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed break-words">
                  {msg.question}
                </p>
                    </div>
                  </div>
              </div>

              {/* Answer */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 min-w-0 flex justify-end">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl rounded-tr-md px-4 py-3 relative group inline-block max-w-[85%]">
                      <p className="text-white text-[15px] leading-relaxed break-words">
                  {msg.answer}
                </p>
              </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-neutral-600 dark:text-neutral-300 text-xs font-semibold">Y</span>
                  </div>
                </div>
              </div>
          ))}

            {/* Current Question - Fixed questions */}
            {currentNode && !isComplete && !isAIQuestion && (!messages.length || messages[messages.length - 1].questionId !== currentNode.id) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3 inline-block max-w-[85%]">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed break-words">
                        {currentNode.question}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Current AI Question */}
            {isAIQuestion && currentAIQuestion && !isLoadingAI && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3 inline-block max-w-[85%]">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed break-words">
                        {currentAIQuestion}
                </p>
                    </div>
                  </div>
                </div>
              </motion.div>
          )}

            {/* Loading AI Question */}
            {isAIQuestion && isLoadingAI && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3 inline-block">
                    <p className="text-neutral-500 dark:text-neutral-400 text-[15px]">
                      Thinking...
                    </p>
                  </div>
                </div>
            </motion.div>
          )}

            {/* Completion Message - Only show when actually navigating to results */}
            {isComplete && !isAIQuestion && !currentAIQuestion && messages.length >= 7 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-primary-50 dark:bg-primary-950/40 rounded-2xl rounded-tl-md px-4 py-3 border-2 border-primary-200 dark:border-primary-800 inline-block max-w-[85%]">
                    <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed break-words">
                      Thank you for sharing. I&apos;ve gathered enough to reflect back what I&apos;m seeing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
        </div>

          {/* Answer Options - Fixed questions */}
          {currentNode && !isComplete && !isAIQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 px-6 pt-4 pb-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentNode.answerOptions.map((option, idx) => (
                <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    onClick={() => handleAnswerSelect(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-xl border-2 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all"
                >
                    <p className="text-[15px] leading-relaxed font-medium text-neutral-700 dark:text-neutral-300">
                      {option.text}
                    </p>
                </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Text Input - AI questions */}
          {isAIQuestion && !isLoadingAI && currentAIQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 px-6 pt-4 pb-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30"
            >
              <div className="flex gap-3">
                <textarea
                  ref={textInputRef}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleTextAnswerSubmit();
                    }
                  }}
                  placeholder="Type your answer..."
                  disabled={isLoadingAI}
                  rows={3}
                  className="flex-1 px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-400 dark:focus:border-primary-500 disabled:opacity-50 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100 text-[15px] resize-none"
                />
              <motion.button
                  onClick={handleTextAnswerSubmit}
                  disabled={!textAnswer.trim() || isLoadingAI}
                  whileHover={{ scale: textAnswer.trim() && !isLoadingAI ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold flex items-center gap-2"
              >
                  {isLoadingAI ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
              </motion.button>
            </div>
            </motion.div>
          )}
        </div>
      </div>
      {/* GPT Debug Trigger */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 max-w-4xl flex justify-end">
        <button
          onClick={() => setShowDebug(true)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Open GPT Debug
        </button>
      </div>

      {/* GPT Debug Overlay */}
      {showDebug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-[90vw] max-w-5xl h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">GPT Debug</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Prompt, request, and response per step</p>
                {pendingRedirect && (
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                    ✓ Conversation complete. Review the final prompt below, then click "Proceed to Results" when ready.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {pendingRedirect && (
                  <button
                    onClick={() => {
                      navigateToResults(pendingRedirect.history, pendingRedirect.result, true);
                      setPendingRedirect(null);
                      setShowDebug(false);
                    }}
                    className="px-4 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                  >
                    Proceed to Results
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDebug(false);
                    // Don't cancel redirect if it's pending
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  {pendingRedirect ? 'Keep Open' : 'Close'}
                </button>
              </div>
            </div>

            <div ref={debugScrollContainerRef} className="flex-1 overflow-auto px-4 py-3 space-y-3 text-xs">
              <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg p-3 whitespace-pre-wrap break-words">
                <p className="font-semibold mb-1 text-neutral-800 dark:text-neutral-100">System Prompt</p>
                <p className="text-neutral-700 dark:text-neutral-300">{CLIENT_SYSTEM_PROMPT}</p>
              </div>

              {debugLogs.length === 0 && (
                <p className="text-neutral-500 dark:text-neutral-400">No GPT calls yet.</p>
              )}

              {debugLogs.map((log, idx) => {
                // Extract components from fullMessages for final step
                const systemPrompt = log.request.fullMessages?.find((m: any) => m.role === 'system')?.content || '';
                const conversationMessages = log.request.fullMessages?.filter((m: any) => m.role !== 'system') || [];
                const finalTurnInstruction = log.type === 'final' 
                  ? conversationMessages[conversationMessages.length - 1]?.content 
                  : null;
                const historyMessages = log.type === 'final' 
                  ? conversationMessages.slice(0, -1) 
                  : conversationMessages;

                return (
                <div 
                  key={idx} 
                  ref={log.type === 'final' ? finalLogRef : null}
                  className={`bg-neutral-50 dark:bg-neutral-800/60 rounded-lg p-3 space-y-3 ${log.type === 'final' ? 'ring-2 ring-primary-400 dark:ring-primary-600' : ''}`}
                >
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                    <span className="font-semibold capitalize">{log.type} call</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()} • history: {log.historyLength}</span>
                  </div>

                  {/* Complete Final Prompt (readable format) */}
                  {log.type === 'final' && log.request.fullMessages && (
                    <div className="space-y-3 border-2 border-primary-300 dark:border-primary-700 rounded-lg p-4 bg-primary-50/30 dark:bg-primary-950/20">
                      <p className="font-bold text-primary-800 dark:text-primary-200 text-sm">Complete Final Prompt (Readable Format)</p>
                      
                      {/* Complete Combined Prompt */}
                      <div className="space-y-2">
                        <p className="font-semibold text-primary-700 dark:text-primary-300 text-xs uppercase tracking-wide">Complete Final Prompt (All Messages Combined)</p>
                        <pre className="bg-white dark:bg-neutral-900 rounded p-4 overflow-auto whitespace-pre-wrap break-words text-xs border-2 border-primary-400 dark:border-primary-600 max-h-96">
{log.request.fullMessages.map((msg: any, msgIdx: number) => {
  const roleLabel = msg.role === 'system' ? 'SYSTEM' : msg.role === 'assistant' ? 'ASSISTANT' : 'USER';
  return `=== ${roleLabel} ===\n${msg.content}\n\n`;
}).join('')}
                        </pre>
                      </div>
                      
                      {/* System Prompt */}
                      <div className="space-y-2">
                        <p className="font-semibold text-neutral-700 dark:text-neutral-200 text-xs uppercase tracking-wide">System Prompt</p>
                        <pre className="bg-white dark:bg-neutral-900 rounded p-3 overflow-auto whitespace-pre-wrap break-words text-xs border border-neutral-200 dark:border-neutral-700 max-h-64">
{systemPrompt}
                        </pre>
                      </div>

                      {/* Conversation History */}
                      {historyMessages.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-semibold text-neutral-700 dark:text-neutral-200 text-xs uppercase tracking-wide">Conversation History</p>
                          <div className="bg-white dark:bg-neutral-900 rounded p-3 overflow-auto max-h-64 border border-neutral-200 dark:border-neutral-700 space-y-3">
                            {historyMessages.map((msg: any, msgIdx: number) => (
                              <div key={msgIdx} className="border-l-4 border-primary-400 dark:border-primary-600 pl-3 pb-2">
                                <div className="font-semibold text-primary-600 dark:text-primary-400 text-xs uppercase mb-1">
                                  {msg.role === 'assistant' ? 'Assistant (Question)' : 'User (Answer)'}
                                </div>
                                <pre className="whitespace-pre-wrap break-words text-xs text-neutral-800 dark:text-neutral-200">{msg.content}</pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Final Turn Instruction */}
                      {finalTurnInstruction && (
                        <div className="space-y-2">
                          <p className="font-semibold text-primary-700 dark:text-primary-300 text-xs uppercase tracking-wide">Final Turn Instruction</p>
                          <pre className="bg-primary-100 dark:bg-primary-900/40 rounded p-3 overflow-auto whitespace-pre-wrap break-words text-xs border border-primary-300 dark:border-primary-700">
{finalTurnInstruction}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* API Configuration */}
                  {log.request.apiConfig && (
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-700 dark:text-neutral-200">API Configuration</p>
                      <pre className="bg-neutral-100 dark:bg-neutral-900 rounded p-2 overflow-auto whitespace-pre-wrap break-words text-xs">
{JSON.stringify(log.request.apiConfig, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Full Messages Array (What's sent to OpenAI) */}
                  {log.request.fullMessages && (
                    <details className="space-y-1">
                      <summary className="cursor-pointer font-semibold text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400">
                        Full Messages Array (Raw JSON)
                      </summary>
                      <pre className="bg-neutral-100 dark:bg-neutral-900 rounded p-2 overflow-auto whitespace-pre-wrap break-words text-xs max-h-96 mt-2">
{JSON.stringify(log.request.fullMessages, null, 2)}
                      </pre>
                    </details>
                  )}

                  {/* Request Body (original) */}
                  <div className="space-y-1">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-200">Request Body (original)</p>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded p-2 overflow-auto whitespace-pre-wrap break-words text-xs">
{JSON.stringify(log.request.body, null, 2)}
                    </pre>
                  </div>

                  {/* Response */}
                  <div className="space-y-1">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-200">Response</p>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded p-2 overflow-auto whitespace-pre-wrap break-words text-xs">
{JSON.stringify(log.response, null, 2)}
                    </pre>
                  </div>
                </div>
              );
              })}
          </div>
      </div>
        </div>
      )}
    </div>
  );
}
