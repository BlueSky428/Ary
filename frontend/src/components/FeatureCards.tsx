'use client';

/**
 * Feature Cards Section
 * Three cards: Reflective, Private, Visual
 */

import { motion } from 'framer-motion';
import { MessageCircle, Lock, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const features: FeatureConfig[] = [
  {
    icon: MessageCircle,
    title: 'Reflective',
    description: 'Natural conversation that helps you see patterns of competence you already demonstrate',
    color: 'green',
  },
  {
    icon: Lock,
    title: 'Private',
    description: 'Your data stays yours. No surveillance, no scoring, no hidden evaluation',
    color: 'orange',
  },
  {
    icon: Eye,
    title: 'Visual',
    description: 'See your strengths as a living competence tree that grows with your reflection',
    color: 'green',
  },
];

export function FeatureCards() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    feature.color === 'green' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      feature.color === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

