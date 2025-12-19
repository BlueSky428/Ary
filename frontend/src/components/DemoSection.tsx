'use client';

/**
 * Interactive Demo Section
 * Beautiful demo interface with animations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@ary/shared';
import { ChatInterface } from './ChatInterface';
import { CompetencePreview } from './CompetencePreview';
import { demoApi } from '@/lib/api';
import { Sparkles } from 'lucide-react';

export function DemoSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [signals, setSignals] = useState<any[]>([]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      sessionId: 'demo',
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simple demo response (no AI)
    setTimeout(() => {
      const aryResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'ary',
        content: getDemoResponse(content),
        timestamp: new Date(),
        sessionId: 'demo',
      };
      setMessages((prev) => [...prev, aryResponse]);
    }, 500);
  };

  const handleAnalyze = async () => {
    if (messages.length === 0) return;

    setIsAnalyzing(true);
    try {
      // Demo mode: Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In demo mode, use local inference
      const conversationText = messages
        .filter((msg) => msg.role === 'user')
        .map((msg) => msg.content)
        .join(' ');
      
      // Use demo inference engine
      const result = await demoApi.analyze(messages);
      if (result.success && result.data) {
        setSignals(result.data.signals || []);
      } else {
        // Fallback: generate demo signals from keywords
        const demoSignals = generateDemoSignals(conversationText);
        setSignals(demoSignals);
      }
    } catch (error) {
      // In demo mode, still show results even if API fails
      console.error('Analysis error:', error);
      const conversationText = messages
        .filter((msg) => msg.role === 'user')
        .map((msg) => msg.content)
        .join(' ');
      const demoSignals = generateDemoSignals(conversationText);
      setSignals(demoSignals);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Section header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <Sparkles className="w-5 h-5 text-primary-500 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Try It Yourself
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-neutral-100 mb-4"
        >
          Experience Ary
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto"
        >
          Have a conversation and see how Ary helps you discover your strengths through natural dialogue.
        </motion.p>
      </div>

      {/* Demo card */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-accent-400 dark:from-primary-500 dark:to-accent-500 rounded-2xl blur opacity-20 dark:opacity-10" />
        
        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            disabled={isAnalyzing}
          />

          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50"
            >
              <div className="flex justify-center">
                <motion.button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>See what I see</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {signals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <CompetencePreview signals={signals} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function getDemoResponse(userInput: string): string {
  const lower = userInput.toLowerCase();
  
  if (lower.includes('stuck') || lower.includes('unsure')) {
    return "That's completely understandable. Was there a recent moment where you felt useful or capable?";
  }
  
  if (lower.includes('help') || lower.includes('helped')) {
    return "Sounds like you helped someone find clarity. That's not easy and really valuable. What did that feel like for you?";
  }
  
  return "Tell me more about that experience. What stands out to you?";
}

function generateDemoSignals(text: string): any[] {
  const lower = text.toLowerCase();
  const signals: any[] = [];
  
  // Simple keyword-based signal generation for demo
  if (lower.includes('help') || lower.includes('support') || lower.includes('listen')) {
    signals.push({
      branch: 'interpersonal',
      trait: 'creates calm and trust',
    });
  }
  if (lower.includes('think') || lower.includes('analyze') || lower.includes('solve')) {
    signals.push({
      branch: 'cognitive',
      trait: 'organizes complexity',
    });
  }
  if (lower.includes('excited') || lower.includes('energized') || lower.includes('passionate')) {
    signals.push({
      branch: 'motivation',
      trait: 'energized by meaningful work',
    });
  }
  if (lower.includes('complete') || lower.includes('finish') || lower.includes('deliver')) {
    signals.push({
      branch: 'execution',
      trait: 'delivers on commitments',
    });
  }
  
  return signals;
}
