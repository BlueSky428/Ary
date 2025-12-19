'use client';

/**
 * Waitlist Section
 * Beautiful waitlist signup with animations
 */

import { motion } from 'framer-motion';
import { WaitlistForm } from './WaitlistForm';
import { Mail } from 'lucide-react';

export function WaitlistSection() {
  return (
    <section className="relative pt-24 pb-20 md:pt-28 md:pb-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/10 dark:bg-accent-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-lg shadow-primary-500/25"
            >
              <Mail className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-neutral-100 mb-4"
            >
              Join the waitlist
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg text-neutral-600 dark:text-neutral-300"
            >
              Be among the first to experience Ary when we launch.
            </motion.p>
          </div>

          {/* Form */}
          <WaitlistForm />
        </motion.div>
      </div>
    </section>
  );
}

