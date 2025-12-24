'use client';

/**
 * Landing Hero Section with Background Images
 * Enhanced version with rotating background images
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { HeroBackground } from './HeroBackground';
import { heroImages } from '@/data/heroImages';

export function LandingHeroWithBackground() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Rotating Display - Shows image titles and meanings */}
      <div className="absolute inset-0">
        <HeroBackground images={heroImages} autoRotate={true} rotationInterval={6000} />
      </div>

      {/* Logo - Top left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-30">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg shadow-sm">
              <MessageCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-xl font-semibold text-white drop-shadow-md group-hover:text-white/90 transition-colors duration-200"
          >
            Ary
          </motion.span>
        </Link>
      </div>

      {/* Content Overlay - Button positioned at middle bottom */}
      <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none">
        <div className="w-full px-6 pb-12 md:pb-16">
          {/* CTA Button - Centered at bottom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center pointer-events-auto"
          >
            <Link
              href="/demo"
              className="group relative inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-3">
                <span>Try a quick demo</span>
                <motion.span
                  className="text-xl"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  →
                </motion.span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

