'use client';

/**
 * Conversation Flow Component
 * Clean, simple, user-friendly chat interface
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, MessageCircle } from 'lucide-react';
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

// Animation constants
const ANIMATION_DURATION = {
  FAST: 0.3,
  NORMAL: 0.4,
} as const;

const EASING = [0.16, 1, 0.3, 1] as const;

interface Message {
  questionId: string;
  question: string;
  answerId: string;
  answer: string;
  category?: ResponseCategory;
}

export function ConversationFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [currentNode, setCurrentNode] = useState<QuestionNode | null>(getStartingQuestion());
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages.length, editingIndex, currentNode?.id]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isComplete = currentNode === null || currentNode.id === 'complete';
  const canShowFinishButton = messages.length >= 5;
  const currentStep = messages.length + 1;
  const totalSteps = 10;
  const progressPercentage = isComplete ? 100 : ((currentStep - 1) / totalSteps) * 100;

  // Helper: Navigate to results page
  const navigateToResults = useCallback((history: ConversationHistory[]) => {
    const result = analyzeConversationHistory(history);
    sessionStorage.setItem('conversationHistory', JSON.stringify(history));
    sessionStorage.setItem('conversationResult', JSON.stringify(result));
    router.push('/competence-tree');
  }, [router]);

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
      
      if (nextQuestionId === 'complete') {
        setCurrentNode(null);
        setTimeout(() => navigateToResults(updatedHistory), 1500);
      } else if (nextQuestionId) {
        const nextNode = getQuestionById(nextQuestionId);
        if (nextNode) {
          setCurrentNode(nextNode);
        } else {
          console.error(`Question not found: ${nextQuestionId}. Current step: ${currentStep}`);
          setCurrentNode(null);
          setTimeout(() => navigateToResults(updatedHistory), 1500);
        }
      } else {
        console.warn('No nextQuestionId in answer option. Completing conversation.');
        setCurrentNode(null);
        setTimeout(() => navigateToResults(updatedHistory), 1500);
      }
      setSelectedAnswerId(null);
    }, 800);
  };

  const handleUpdateEdit = () => {
    if (!selectedAnswerId || !currentNode || editingIndex === null) return;

    const selectedOption = currentNode.answerOptions.find(opt => opt.id === selectedAnswerId);
    if (!selectedOption) return;

    const editedMessage = messages[editingIndex];
    const questionNode = getQuestionById(editedMessage.questionId);
    if (!questionNode) {
      setEditingIndex(null);
      setSelectedAnswerId(null);
      return;
    }

    const updated = [...messages];
    updated[editingIndex] = {
      ...editedMessage,
      answerId: selectedOption.id,
      answer: selectedOption.text,
      category: selectedOption.category,
    };
    setMessages(updated);

    const updatedHistory = [...conversationHistory];
    updatedHistory[editingIndex] = {
      questionId: editedMessage.questionId,
      question: editedMessage.question,
      answerId: selectedOption.id,
      answer: selectedOption.text,
      keywords: selectedOption.keywords,
      competencies: selectedOption.competencies,
    };

    const trimmedMessages = updated.slice(0, editingIndex + 1);
    const trimmedHistory = updatedHistory.slice(0, editingIndex + 1);
    
    setMessages(trimmedMessages);
    setConversationHistory(trimmedHistory);

    const nextQuestionId = selectedOption.nextQuestionId;
    if (nextQuestionId === 'complete') {
      setCurrentNode(null);
    } else if (nextQuestionId) {
      const nextNode = getQuestionById(nextQuestionId);
      if (nextNode) {
        setCurrentNode(nextNode);
      } else {
        console.error(`Question not found: ${nextQuestionId} during edit.`);
      }
    }

    setEditingIndex(null);
    setSelectedAnswerId(null);
  };

  const handleEdit = (index: number) => {
    const messageToEdit = messages[index];
    const questionNode = getQuestionById(messageToEdit.questionId);
    
    if (questionNode) {
      setEditingIndex(index);
      setSelectedAnswerId(messageToEdit.answerId);
      setCurrentNode(questionNode);
    }
  };

  const handleCancelEdit = () => {
    if (editingIndex !== null && messages.length > editingIndex) {
      const lastMessage = messages[editingIndex];
      const originalOption = currentNode?.answerOptions.find(opt => opt.id === lastMessage.answerId);
      if (originalOption && originalOption.nextQuestionId !== 'complete') {
        const nextNode = getQuestionById(originalOption.nextQuestionId);
        if (nextNode) setCurrentNode(nextNode);
      }
    }
    setEditingIndex(null);
    setSelectedAnswerId(null);
  };

  const handleFinish = () => {
    navigateToResults(conversationHistory);
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
            className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
            style={{ 
              willChange: 'scroll-position',
              contain: 'layout style paint'
            }}
          >
            {/* All Messages - Simple, clean list */}
            {messages.map((msg, index) => (
              <div key={`${msg.questionId}-${index}`} className="space-y-3">
                {/* Question */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1 max-w-[80%]">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed">
                        {msg.question}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Answer */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 max-w-[80%]">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl rounded-tr-md px-4 py-3 relative group">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-white text-[15px] leading-relaxed">
                          {msg.answer}
                        </p>
                        {editingIndex !== index && (
                          <button
                            onClick={() => handleEdit(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded-lg"
                            title="Edit answer"
                          >
                            <Edit2 className="w-4 h-4 text-white/90" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-neutral-600 dark:text-neutral-300 text-xs font-semibold">Y</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Current Question - Only show if it's not already in the messages list */}
            {currentNode && !isComplete && (!messages.length || messages[messages.length - 1].questionId !== currentNode.id) && (
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
                  <div className="flex-1 max-w-[80%]">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed">
                        {currentNode.question}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Completion Message */}
            {isComplete && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="bg-primary-50 dark:bg-primary-950/40 rounded-2xl rounded-tl-md px-4 py-3 border-2 border-primary-200 dark:border-primary-800">
                    <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed">
                      Thank you for sharing. I&apos;ve gathered enough to reflect back what I&apos;m seeing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Editing Indicator */}
            {editingIndex !== null && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-800 dark:text-amber-300 text-center font-medium">
                  <span className="font-semibold">Editing answer</span> — This will update the conversation
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Answer Options */}
          {currentNode && !isComplete && (
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
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      editingIndex !== null && selectedAnswerId === option.id
                        ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-500 shadow-lg'
                        : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-[15px] leading-relaxed font-medium ${
                        editingIndex !== null && selectedAnswerId === option.id
                          ? 'text-primary-900 dark:text-primary-100'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}>
                        {option.text}
                      </p>
                      {editingIndex !== null && selectedAnswerId === option.id && (
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Edit Mode Actions */}
          {editingIndex !== null && (
            <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
              <button
                onClick={handleCancelEdit}
                className="px-5 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleUpdateEdit}
                disabled={!selectedAnswerId}
                whileHover={{ scale: selectedAnswerId ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold text-sm flex items-center gap-2"
              >
                Update Answer
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
