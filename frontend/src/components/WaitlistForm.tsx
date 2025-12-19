'use client';

/**
 * Waitlist Form Component
 * Beautiful form with smooth animations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, Loader2 } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      // const result = await waitlistApi.joinWaitlist(email);
      // if (result.success) {
      
      setSubmitted(true);
      setEmail('');
      
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
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-accent-400 dark:from-primary-500 dark:to-accent-500 rounded-2xl blur opacity-20 dark:opacity-10" />
          
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 p-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-400 dark:focus:border-primary-500 disabled:opacity-50 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2 min-w-[140px]"
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
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-600 text-sm mt-4 text-center"
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
