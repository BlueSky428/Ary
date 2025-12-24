'use client';

/**
 * Conversation Flow Component
 * Clean, simple, user-friendly chat interface with GPT integration
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Loader2, Send } from 'lucide-react';
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

export function ConversationFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [currentNode, setCurrentNode] = useState<QuestionNode | null>(getStartingQuestion());
  
  // AI question state
  const [isAIQuestion, setIsAIQuestion] = useState(false);
  const [aiQuestionCount, setAiQuestionCount] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentAIQuestion, setCurrentAIQuestion] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<{ history: ConversationHistory[], result?: GPTResult } | null>(null);
  
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages.length, currentNode?.id, currentAIQuestion]);

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


  // Conversation is complete when we have all 7 messages, final synthesis is done, and we're ready to redirect
  const isComplete = messages.length >= 7 && !isAIQuestion && !currentAIQuestion && pendingRedirect !== null;
  const canShowFinishButton = messages.length >= 7; // 2 fixed + 5 AI follow-ups
  // Current step: messages.length represents answered questions, +1 for the current question being shown
  // Cap at totalSteps to handle edge cases
  const currentStep = Math.min(messages.length + 1, 7);
  const totalSteps = 7; // 2 fixed + 5 AI follow-ups
  const progressPercentage = isComplete ? 100 : (currentStep / totalSteps) * 100;

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

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

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
      // Error handled by caller
      throw error;
    }
  };

  // Handle answer selection for fixed questions (q1, q2)
  const handleAnswerSelect = (option: AnswerOption) => {
    if (!currentNode) return;

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
          setCurrentNode(null);
          setTimeout(() => navigateToResults(updatedHistory), 1500);
        }
      } else {
        setCurrentNode(null);
        setTimeout(() => navigateToResults(updatedHistory), 1500);
      }
    }, 800);
  };

  // Load next AI question
  const loadNextAIQuestion = async (history: ConversationHistory[]) => {
    const answeredAI = getAiAnsweredCount(history);
    
    // Guard: Don't load more questions if we've already answered 5
    if (answeredAI >= 5) {
      return;
    }
    
    setIsLoadingAI(true);
    try {
      setAiQuestionCount(answeredAI);
      // If we've answered 4 questions, the next one will be the 5th (final)
      const isFinal = answeredAI >= 4;
      const response = await callGPT(isFinal, history);

        if (response.type === 'final' && response.result) {
          // Final synthesis - set pending redirect
          setPendingRedirect({ history, result: response.result });
          // Auto-redirect after a short delay
          setTimeout(() => {
            navigateToResults(history, response.result, true);
          }, 2000);
        } else if (response.type === 'question' && response.question) {
        // Only show question if we haven't reached 5 yet
        if (answeredAI < 5) {
          setCurrentAIQuestion(response.question);
          setIsLoadingAI(false);
        } else {
          // Shouldn't happen, but guard against it
          setIsLoadingAI(false);
        }
      }
    } catch (error) {
        // Error loading AI question, fallback to results
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
      // Final synthesis - clear AI question state
      setCurrentAIQuestion(null);
      setIsAIQuestion(false);
      setIsLoadingAI(true);
      try {
        const response = await callGPT(true, updatedHistory);
        if (response.type === 'final' && response.result) {
          // Final synthesis - set pending redirect
          setPendingRedirect({ history: updatedHistory, result: response.result });
          // Auto-redirect after a short delay to show completion message
          setTimeout(() => {
            navigateToResults(updatedHistory, response.result, true);
          }, 2000);
        }
      } catch (error) {
        // Error getting final synthesis, redirect to results
        setTimeout(() => navigateToResults(updatedHistory), 1500);
      } finally {
        setIsLoadingAI(false);
      }
    } else {
      // Load next AI question only if we haven't reached 5 yet
      const nextAnsweredAI = getAiAnsweredCount(updatedHistory);
      if (nextAnsweredAI < 5) {
        setTimeout(() => {
          loadNextAIQuestion(updatedHistory);
        }, 800);
      }
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

            {/* Current AI Question - Only show if we haven't answered 5 questions yet */}
            {isAIQuestion && currentAIQuestion && !isLoadingAI && getAiAnsweredCount(conversationHistory) < 5 && (
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

            {/* Loading AI Question - Only show if we haven't answered 5 questions yet */}
            {isAIQuestion && isLoadingAI && getAiAnsweredCount(conversationHistory) < 5 && (
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

            {/* Completion Message - Show after all questions answered and final synthesis is ready */}
            {pendingRedirect && messages.length >= 7 && !isLoadingAI && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-primary-50 dark:bg-primary-950/40 rounded-2xl rounded-tl-md px-4 py-3 border-2 border-primary-200 dark:border-primary-800 inline-block max-w-[85%]">
                    <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed break-words mb-2">
                      Thank you for sharing. The conversation is now complete.
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 text-[14px] leading-relaxed break-words">
                      I&apos;ve analyzed your responses and prepared a reflection. Next, you&apos;ll see your competence tree, a summary of our conversation, and insights based on what you shared.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading Final Synthesis */}
            {messages.length >= 7 && isLoadingAI && (
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
                      Analyzing your responses...
                    </p>
                  </div>
                </div>
              </motion.div>
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

          {/* Text Input - AI questions - Only show if we haven't answered 5 questions yet */}
          {isAIQuestion && !isLoadingAI && currentAIQuestion && getAiAnsweredCount(conversationHistory) < 5 && (
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
    </div>
  );
}
