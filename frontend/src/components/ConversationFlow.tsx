'use client';

/**
 * Conversation Flow Component
 * Simple, clean question-answer flow
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Edit2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const questions = [
  "How are you feeling coming into this?",
  "Can you think of a recent moment where you felt useful or capable?",
  "What activities or situations energize you?",
  "Tell me about a time when you helped someone or solved a problem.",
  "What kind of challenges do you enjoy tackling?",
  "Describe a situation where you felt most confident in your abilities.",
  "What do others often come to you for help with?",
  "When do you feel most productive or in flow?",
  "What patterns do you notice in how you approach problems?",
  "What strengths do you see in yourself that others might not notice?",
];

interface Message {
  questionIndex: number;
  question: string;
  answer: string;
}

export function ConversationFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, editingIndex]);

  const currentQuestionIndex = messages.length;
  const canShowFinishButton = messages.length >= 5; // Show button after 5 steps
  const hasMoreQuestions = currentQuestionIndex < questions.length;
  const currentQuestion = hasMoreQuestions ? questions[currentQuestionIndex] : null;
  const shouldAutoNavigate = messages.length === questions.length; // Auto-navigate after 10th answer

  const handleSend = () => {
    if (!currentAnswer.trim()) return;

    if (editingIndex !== null) {
      // Update existing answer
      const updated = [...messages];
      updated[editingIndex] = {
        ...updated[editingIndex],
        answer: currentAnswer.trim(),
      };
      setMessages(updated);
      setEditingIndex(null);
    } else {
      // Add new answer - use question from array if available, otherwise use generic
      const questionText = currentQuestion || "Tell me more...";
      const newMessages = [
        ...messages,
        {
          questionIndex: currentQuestionIndex,
          question: questionText,
          answer: currentAnswer.trim(),
        },
      ];
      setMessages(newMessages);
      
      // Auto-navigate after 10th question is answered
      if (newMessages.length === questions.length) {
        setTimeout(() => {
          router.push('/competence-tree');
        }, 1000);
      }
    }
    setCurrentAnswer('');
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentAnswer(messages[index].answer);
    // Scroll to the message being edited
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setCurrentAnswer('');
  };

  const handleFinish = () => {
    router.push('/competence-tree');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-4 md:pt-28 md:pb-4">
      <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 via-accent-400/40 to-primary-400/40 rounded-2xl blur-xl animate-pulse" />
              
              {/* Main logo container */}
              <div className="relative w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl shadow-2xl overflow-hidden">
                {/* Abstract design - representing reflection/growth */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Central circle */}
                  <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full blur-sm" />
                  
                  {/* Rotating rings */}
                  <div className="absolute w-12 h-12 md:w-14 md:h-14 border-2 border-white/30 rounded-full" />
                  <div className="absolute w-6 h-6 md:w-7 md:h-7 border-2 border-white/40 rounded-full" />
                  
                  {/* Accent dots */}
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/60 rounded-full" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/60 rounded-full" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/60 rounded-full" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-white/60 rounded-full" />
                  
                  {/* Central highlight */}
                  <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-white/50 rounded-full blur-[2px]" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            Let&apos;s talk
          </motion.h1>
        </div>

        {/* Demo Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl flex-shrink-0"
        >
          <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
            <span className="font-semibold">Demo Mode:</span> This is a demonstration. No AI is processing your responses. You can edit any answer by clicking the edit icon.
          </p>
        </motion.div>

        {/* Scrollable Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar"
        >
          {/* Past Questions and Answers */}
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Question */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50">
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">
                  Ary:
                </p>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {msg.question}
                </p>
              </div>

              {/* Answer */}
              <div className="bg-primary-50 dark:bg-primary-950/20 rounded-2xl p-4 shadow-soft border border-primary-200/50 dark:border-primary-800/50">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    You:
                  </p>
                  {editingIndex !== index && (
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                      title="Edit answer"
                    >
                      <Edit2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </button>
                  )}
                </div>
                <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                  {msg.answer}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Current Question (if available) */}
          {currentQuestion && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50"
              >
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  Ary:
                </p>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {currentQuestion}
                </p>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Editing Indicator */}
          {editingIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3"
            >
              <p className="text-xs text-amber-800 dark:text-amber-300 text-center">
                <span className="font-semibold">Editing your answer</span>
              </p>
            </motion.div>
          )}
        </div>

        {/* Input Area - Fixed at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 flex-shrink-0"
        >
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={editingIndex !== null ? "Edit your answer..." : "Share whatever comes to mind..."}
            className="w-full min-h-[100px] max-h-[150px] p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100 resize-none"
          />

          <div className="flex items-center justify-between mt-3">
            <div>
              {editingIndex !== null ? (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Cancel editing
                </button>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Press Enter to send • Shift + Enter for new line
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {canShowFinishButton && (
                <motion.button
                  onClick={handleFinish}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md font-medium text-sm"
                >
                  View Results
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              )}

              <motion.button
                onClick={handleSend}
                disabled={!currentAnswer.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium text-sm"
              >
                {editingIndex !== null ? 'Update' : 'Send'}
                <Send className="w-4 h-4" strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
