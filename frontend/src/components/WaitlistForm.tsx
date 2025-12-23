'use client';

/**
 * Waitlist Form Component
 * Beautiful form with commitment question, segmentation, and email capture
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, Loader2 } from 'lucide-react';

type CommitmentAnswer = 'yes' | 'no' | null;
type UseCase = 'cv-update' | 'cover-letter' | 'job-applications' | 'interview-prep' | 'exploring' | null;

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [commitment, setCommitment] = useState<CommitmentAnswer>(null);
  const [useCase, setUseCase] = useState<UseCase>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!commitment) {
      setError('Please answer the commitment question');
      return;
    }

    if (!useCase) {
      setError('Please select how you will use Ary');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Demo mode: Simulate API call with delay
    try {
      // Simulate network delay for realistic demo experience
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In demo mode, always succeed (no actual API call)
      // In production, uncomment this:
      // const result = await waitlistApi.joinWaitlist({ email, commitment, useCase });
      // if (result.success) {
      
      setSubmitted(true);
      setEmail('');
      setCommitment(null);
      setUseCase(null);
      
      // } else {
      //   setError(result.error || 'Something went wrong. Please try again.');
      // }
    } catch (err) {
      // This shouldn't happen in demo mode, but handle it gracefully
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg shadow-green-500/25"
          >
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2"
          >
            Thank you for joining!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-neutral-600 dark:text-neutral-300"
          >
            We&apos;ll notify you when Ary is ready.
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-accent-400 dark:from-primary-500 dark:to-accent-500 rounded-2xl blur opacity-20 dark:opacity-10" />
          
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 p-6 md:p-8 space-y-6">
            {/* Commitment Question */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Will you return to articulate your strengths for a specific job application?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCommitment('yes')}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    commitment === 'yes'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setCommitment('no')}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    commitment === 'no'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Segmentation Question */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                What will you use Ary for first?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'cv-update' as UseCase, label: 'CV update' },
                  { id: 'cover-letter' as UseCase, label: 'Cover letter' },
                  { id: 'job-applications' as UseCase, label: 'Job applications' },
                  { id: 'interview-prep' as UseCase, label: 'Interview prep' },
                  { id: 'exploring' as UseCase, label: 'Just exploring' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setUseCase(option.id)}
                    className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      useCase === option.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Capture */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Get early access when Ary goes live — enter your email:
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500 pointer-events-none z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-400 dark:focus:border-primary-500 disabled:opacity-50 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100 text-[15px]"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !commitment || !useCase || !email}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 md:px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2 text-[15px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join Waitlist</span>
                  <Mail className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-600 dark:text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
