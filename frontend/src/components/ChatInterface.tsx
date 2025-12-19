'use client';

/**
 * Chat Interface Component
 * Beautiful, calming chat UI with smooth animations
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@ary/shared';
import { Send } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  disabled = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-gradient-to-b from-white to-neutral-50/30 dark:from-neutral-900 dark:to-neutral-950/30">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center max-w-md px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-2 font-medium">
                  Start a conversation to see how Ary works
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Try: &quot;I&apos;m feeling a bit stuck in my career.&quot;
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex flex-col max-w-[75%] ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 shadow-gentle ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200/50 dark:border-neutral-700/50 rounded-bl-md'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5 px-1">
                  {formatRelativeTime(msg.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-neutral-200/50 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
              disabled={disabled}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-400 dark:focus:border-primary-500 disabled:opacity-50 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
            />
          </div>
          <motion.button
            type="submit"
            disabled={disabled || !input.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center justify-center min-w-[60px]"
          >
            <Send className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
