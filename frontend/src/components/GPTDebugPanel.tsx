'use client';

/**
 * GPT Debug Panel Component
 * Shows history of prompts sent to GPT and responses received
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export interface GPTDebugEntry {
  id: string;
  timestamp: Date;
  type: 'question' | 'final' | 'compiler';
  request: {
    messages: Array<{ role: string; content: string }>;
    model: string;
    temperature: number;
    max_tokens: number;
  };
  response: {
    type: 'question' | 'final' | 'compiled';
    content: string | object;
    raw?: string;
  };
  isClarification?: boolean;
}

interface GPTDebugPanelProps {
  entries: GPTDebugEntry[];
  onClear: () => void;
}

export function GPTDebugPanel({ entries, onClear }: GPTDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatJSON = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        title="View GPT Debug History"
      >
        <Terminal className="w-5 h-5" />
        <span className="text-sm font-medium">GPT Debug</span>
        {entries.length > 0 && (
          <span className="bg-purple-800 text-xs px-2 py-0.5 rounded-full">
            {entries.length}
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                GPT Debug History
              </h2>
              {entries.length > 0 && (
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {entries.length > 0 && (
                <button
                  onClick={onClear}
                  className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {entries.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No GPT interactions yet.</p>
                <p className="text-sm mt-2">Start a conversation to see debug history.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, index) => {
                  const isExpanded = expandedIds.has(entry.id);
                  const isCopied = copiedId === entry.id;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                    >
                      {/* Entry Header */}
                      <div
                        className="p-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                        onClick={() => toggleExpand(entry.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              entry.type === 'final' ? 'bg-green-500' : 
                              entry.type === 'compiler' ? 'bg-purple-500' : 
                              'bg-blue-500'
                            }`} />
                            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                              {entry.type === 'final' ? 'Final Synthesis' : 
                               entry.type === 'compiler' ? 'Compiler (Articulation)' : 
                               `Question #${index + 1}`}
                            </span>
                            {entry.isClarification && (
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                                Clarification
                              </span>
                            )}
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {entry.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-neutral-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>
                        {!isExpanded && (
                          <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 truncate">
                            {entry.type === 'compiler' && typeof entry.response.content === 'string'
                              ? `Compiled narrative: ${entry.response.content.substring(0, 100)}...`
                              : entry.type === 'question' && typeof entry.response.content === 'string'
                              ? entry.response.content.substring(0, 100) + '...'
                              : entry.type === 'final'
                              ? 'Final response with summary and competencies'
                              : 'Compiled narrative'}
                          </div>
                        )}
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <div className="p-4 space-y-4">
                              {/* Request Section */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    Request to GPT
                                  </h3>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(formatJSON(entry.request), `${entry.id}-request`);
                                    }}
                                    className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                                  >
                                    {copiedId === `${entry.id}-request` ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                    )}
                                  </button>
                                </div>
                                <div className="bg-neutral-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
                                  <pre className="text-xs text-green-400 font-mono">
                                    {formatJSON(entry.request)}
                                  </pre>
                                </div>
                              </div>

                              {/* Response Section */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    Response from GPT
                                  </h3>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        typeof entry.response.content === 'string'
                                          ? entry.response.content
                                          : formatJSON(entry.response.content),
                                        `${entry.id}-response`
                                      );
                                    }}
                                    className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                                  >
                                    {copiedId === `${entry.id}-response` ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                    )}
                                  </button>
                                </div>
                                <div className="bg-neutral-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
                                  <pre className="text-xs text-blue-400 font-mono">
                                    {typeof entry.response.content === 'string'
                                      ? entry.response.content
                                      : formatJSON(entry.response.content)}
                                  </pre>
                                </div>
                                {entry.response.raw && (
                                  <div className="mt-2">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Raw Response:</p>
                                    <div className="bg-neutral-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
                                      <pre className="text-xs text-neutral-400 font-mono">
                                        {entry.response.raw}
                                      </pre>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
