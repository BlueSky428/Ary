/**
 * Team Page
 * Clean layout showcasing the team members
 */

'use client';

import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Minus } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
};

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'Collins Mbeutcha',
      role: 'Founder',
      description: 'Oxford-trained mathematician. Ex–World Bank. Focused on accountability, governance, and decision systems under scrutiny.',
    },
    {
      name: 'Yamate Sasaki',
      role: 'Founding Engineer',
      description: 'Award-winning full-stack engineer. Built and deployed production systems end-to-end, including the Ary compiler and demo infrastructure. Focused on correctness-first architectures and deterministic systems.',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <Navigation />

      {/* Theme Toggle - Fixed position */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-20 right-6 z-50"
      >
        <ThemeToggle />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 relative">
        {/* Page Title */}
        <motion.section
          {...fadeInUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mb-40 md:mb-56 relative"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-neutral-900 dark:text-neutral-50 leading-[1.08] mb-12 tracking-tight"
          >
            The Team
          </motion.h1>
        </motion.section>

        {/* Team Members */}
        <div className="max-w-5xl space-y-24 md:space-y-32">
          {teamMembers.map((member, index) => (
            <motion.section
              key={index}
              {...fadeInUp}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.2 }}
              className="relative"
            >
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-4">
                  <motion.h2
                    {...fadeInUp}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-neutral-50"
                  >
                    {member.name}
                  </motion.h2>
                  <motion.span
                    {...fadeInUp}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="text-lg md:text-xl lg:text-2xl text-neutral-500 dark:text-neutral-400 font-light"
                  >
                    — {member.role}
                  </motion.span>
                </div>
                
                <motion.p
                  {...fadeInUp}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="text-lg md:text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-[1.7] font-extralight max-w-4xl"
                >
                  {member.description}
                </motion.p>
              </div>
              
              {index < teamMembers.length - 1 && (
                <div className="mt-16 md:mt-24">
                  <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
                </div>
              )}
            </motion.section>
          ))}
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
