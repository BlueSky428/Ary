'use client';

/**
 * Conversation Flow Component
 * Polished, professional chat interface with refined design and animations
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, MessageCircle, Sparkles } from 'lucide-react';
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

interface Message {
  questionId: string;
  question: string;
  answerId: string;
  answer: string;
  category?: ResponseCategory;
  reaction?: string;
}

export function ConversationFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [currentNode, setCurrentNode] = useState<QuestionNode | null>(getStartingQuestion());
  const [showReaction, setShowReaction] = useState(false);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, editingIndex, currentNode, showReaction]);

  const currentQuestion = currentNode?.question || null;
  const isComplete = currentNode === null || currentNode.id === 'complete';
  const canShowFinishButton = messages.length >= 5;
  const currentStep = messages.length + 1;
  const totalSteps = 10;
  const progressPercentage = isComplete ? 100 : ((currentStep - 1) / totalSteps) * 100;

  const handleAnswerSelect = (option: AnswerOption) => {
    if (!currentNode) return;
    
    if (editingIndex !== null) {
      setSelectedAnswerId(option.id);
      return;
    }

    // New answer - send immediately
    const category = option.category;
    const reaction = currentNode.reactionTemplates[category];

    const newMessage: Message = {
      questionId: currentNode.id,
      question: currentNode.question,
      answerId: option.id,
      answer: option.text,
      category,
      reaction,
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

    setShowReaction(true);
    setTimeout(() => {
      setShowReaction(false);
      
      const nextQuestionId = option.nextQuestionId;
      
      if (nextQuestionId === 'complete') {
        setCurrentNode(null);
        setTimeout(() => {
          const result = analyzeConversationHistory(updatedHistory);
          sessionStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
          sessionStorage.setItem('conversationResult', JSON.stringify(result));
          router.push('/competence-tree');
        }, 1500);
      } else if (nextQuestionId) {
        const nextNode = getQuestionById(nextQuestionId);
        if (nextNode) {
          setCurrentNode(nextNode);
        } else {
          // Question not found - log error and allow user to finish early
          console.error(`Question not found: ${nextQuestionId}. Current step: ${currentStep}. Conversation path may be incomplete.`);
          // Set to null so conversation appears complete and user can finish
          // This prevents infinite loops with same question
          setCurrentNode(null);
          // Still allow them to see results with what we have
          setTimeout(() => {
            const result = analyzeConversationHistory(updatedHistory);
            sessionStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
            sessionStorage.setItem('conversationResult', JSON.stringify(result));
            router.push('/competence-tree');
          }, 1500);
        }
      } else {
        // No nextQuestionId - handle gracefully by completing
        console.warn('No nextQuestionId in answer option. Completing conversation.');
        setCurrentNode(null);
        setTimeout(() => {
          const result = analyzeConversationHistory(updatedHistory);
          sessionStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
          sessionStorage.setItem('conversationResult', JSON.stringify(result));
          router.push('/competence-tree');
        }, 1500);
      }
      setSelectedAnswerId(null);
    }, 2200);
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

    const category = selectedOption.category;
    const reaction = questionNode.reactionTemplates[category];

    const updated = [...messages];
    updated[editingIndex] = {
      ...editedMessage,
      answerId: selectedOption.id,
      answer: selectedOption.text,
      category,
      reaction,
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
        // Question not found during edit - log error but don't end conversation
        console.error(`Question not found: ${nextQuestionId} during edit. Conversation path may be incomplete.`);
        // Don't automatically end - let user continue or finish early
      }
    } else {
      console.warn('No nextQuestionId in answer option during edit. This may indicate a configuration issue.');
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
    const result = analyzeConversationHistory(conversationHistory);
    sessionStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    sessionStorage.setItem('conversationResult', JSON.stringify(result));
    router.push('/competence-tree');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 max-w-5xl">
        <div className="w-full mx-auto h-[calc(100vh-3rem)] flex flex-col bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
          
          {/* Elegant Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-gradient-to-r from-white/50 to-neutral-50/50 dark:from-neutral-900/50 dark:to-neutral-950/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-accent-400/30 rounded-xl blur-lg" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Ary
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {isComplete ? 'Conversation complete' : `Step ${currentStep} of ${totalSteps}`}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar with Glow */}
              <div className="flex-1 max-w-[200px] ml-6 mr-4">
                <div className="relative">
                  <div className="w-full h-2 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-full shadow-lg shadow-primary-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Finish Button */}
              {canShowFinishButton && !isComplete && !showReaction && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFinish}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
                >
                  Finish Early
                </motion.button>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar"
          >
            {/* Past Messages */}
            <AnimatePresence mode="popLayout">
              {messages.map((msg, index) => (
                <motion.div
                  key={`${msg.questionId}-${index}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="space-y-3"
                >
                  {/* Question */}
                  <div className="flex items-start gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                    >
                      <span className="text-white text-xs font-bold">A</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex-1 max-w-[75%]"
                    >
                      <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 backdrop-blur-sm">
                        <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed font-medium">
                          {msg.question}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Answer */}
                  <div className="flex items-start gap-3 justify-end">
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-1 max-w-[75%]"
                    >
                      <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl rounded-tr-md px-5 py-3.5 shadow-lg shadow-primary-500/20 relative group">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-white text-[15px] leading-relaxed font-medium">
                            {msg.answer}
                          </p>
                          {editingIndex !== index && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ opacity: 1, scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/20 rounded-lg"
                              title="Edit answer"
                            >
                              <Edit2 className="w-4 h-4 text-white/90" strokeWidth={2} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.25, type: 'spring' }}
                      className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 shadow-md"
                    >
                      <span className="text-neutral-600 dark:text-neutral-300 text-xs font-semibold">Y</span>
                    </motion.div>
                  </div>

                  {/* Reaction - Hide if it's the last message and showReaction is true (to avoid duplicate) */}
                  {msg.reaction && !(index === messages.length - 1 && showReaction) && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8" />
                      <div className="flex-1 max-w-[75%]">
                        <div className="bg-neutral-100/80 dark:bg-neutral-800/50 rounded-2xl rounded-tl-md px-4 py-2.5 backdrop-blur-sm">
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm italic font-medium">
                            {msg.reaction}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Current Question */}
            <AnimatePresence mode="wait">
              {currentQuestion && !isComplete && !showReaction && (
                <motion.div
                  key="current-question"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1 max-w-[75%]">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 backdrop-blur-sm">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed font-medium">
                        {currentQuestion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reaction Animation */}
            <AnimatePresence>
              {showReaction && messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 max-w-[75%]">
                    <div className="bg-neutral-100/80 dark:bg-neutral-800/50 rounded-2xl rounded-tl-md px-4 py-2.5 backdrop-blur-sm">
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm italic font-medium">
                        {messages[messages.length - 1]?.reaction}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completion Message */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1 max-w-[75%]">
                    <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/40 dark:to-accent-950/40 rounded-2xl rounded-tl-md px-5 py-3.5 border-2 border-primary-200/60 dark:border-primary-800/60 shadow-sm">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed font-medium">
                        Thank you for sharing. I&apos;ve gathered enough to reflect back what I&apos;m seeing.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Editing Indicator */}
            <AnimatePresence>
              {editingIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 rounded-xl px-4 py-3 backdrop-blur-sm"
                >
                  <p className="text-xs text-amber-800 dark:text-amber-300 text-center font-medium">
                    <span className="font-semibold">Editing answer</span> — This will update the conversation path
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Answer Options */}
          <AnimatePresence mode="wait">
            {currentNode && !isComplete && !showReaction && (
              <motion.div
                key="answer-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 px-6 pt-4 pb-5 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-gradient-to-b from-transparent to-neutral-50/30 dark:to-neutral-950/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentNode.answerOptions.map((option, idx) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleAnswerSelect(option)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        editingIndex !== null && selectedAnswerId === option.id
                          ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-500 dark:border-primary-500 shadow-lg shadow-primary-500/20'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 hover:shadow-md'
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
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                          >
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Mode Actions */}
          <AnimatePresence>
            {editingIndex !== null && !showReaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/30"
              >
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
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 font-semibold text-sm flex items-center gap-2"
                >
                  Update Answer
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
