'use client';

/**
 * Prompt Edit Panel Component
 * Allows editing GPT prompts in debug mode
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Save, RotateCcw } from 'lucide-react';

interface PromptEditPanelProps {
  questionPrompt: string;
  finalPrompt: string;
  compilerPrompt: string;
  onSave: (questionPrompt: string, finalPrompt: string, compilerPrompt: string) => void;
  onReset: () => void;
}

export function PromptEditPanel({ questionPrompt, finalPrompt, compilerPrompt, onSave, onReset }: PromptEditPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localQuestionPrompt, setLocalQuestionPrompt] = useState(questionPrompt);
  const [localFinalPrompt, setLocalFinalPrompt] = useState(finalPrompt);
  const [localCompilerPrompt, setLocalCompilerPrompt] = useState(compilerPrompt);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalQuestionPrompt(questionPrompt);
    setLocalFinalPrompt(finalPrompt);
    setLocalCompilerPrompt(compilerPrompt);
    setIsDirty(false);
  }, [questionPrompt, finalPrompt, compilerPrompt]);

  const handleSave = () => {
    onSave(localQuestionPrompt, localFinalPrompt, localCompilerPrompt);
    setIsDirty(false);
  };

  const handleReset = () => {
    setLocalQuestionPrompt(questionPrompt);
    setLocalFinalPrompt(finalPrompt);
    setLocalCompilerPrompt(compilerPrompt);
    setIsDirty(false);
    onReset();
  };

  // Update dirty state when prompts change
  useEffect(() => {
    setIsDirty(
      localQuestionPrompt !== questionPrompt || 
      localFinalPrompt !== finalPrompt ||
      localCompilerPrompt !== compilerPrompt
    );
  }, [localQuestionPrompt, localFinalPrompt, localCompilerPrompt, questionPrompt, finalPrompt, compilerPrompt]);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        title="Edit Prompts"
      >
        <Settings className="w-5 h-5" />
        <span className="text-sm font-medium">Edit Prompts</span>
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
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Edit GPT Prompts
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Question Prompt */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Question Prompt (QUESTION_PROMPT)
              </label>
              <textarea
                value={localQuestionPrompt}
                onChange={(e) => setLocalQuestionPrompt(e.target.value)}
                className="w-full h-64 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono text-sm text-neutral-900 dark:text-neutral-100 resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                placeholder="Enter question prompt..."
              />
            </div>

            {/* Compiler Prompt */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Compiler Prompt (COMPILER_PROMPT) - Articulation Pre-Processor
              </label>
              <textarea
                value={localCompilerPrompt}
                onChange={(e) => setLocalCompilerPrompt(e.target.value)}
                className="w-full h-48 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono text-sm text-neutral-900 dark:text-neutral-100 resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                placeholder="Enter compiler prompt..."
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Transforms raw conversation transcript to clean, neutral narrative
              </p>
            </div>

            {/* Final Prompt */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Final Turn Prompt (FINAL_TURN_PROMPT) - Articulation Extractor
              </label>
              <textarea
                value={localFinalPrompt}
                onChange={(e) => setLocalFinalPrompt(e.target.value)}
                className="w-full h-48 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono text-sm text-neutral-900 dark:text-neutral-100 resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                placeholder="Enter final turn prompt..."
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Extracts competencies from compiled narrative
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
