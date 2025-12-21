'use client';

/**
 * Landing Hero Section with Background Images
 * Enhanced version with rotating background images
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 via-accent-400/40 to-primary-400/40 rounded-2xl blur-xl animate-pulse" />
            
            {/* Main logo container */}
            <div className="relative w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl shadow-2xl overflow-hidden">
              {/* Abstract design - representing reflection/growth */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central circle */}
                <div className="absolute w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full blur-sm" />
                
                {/* Rotating rings */}
                <div className="absolute w-10 h-10 md:w-12 md:h-12 border-2 border-white/30 rounded-full" />
                <div className="absolute w-5 h-5 md:w-6 md:h-6 border-2 border-white/40 rounded-full" />
                
                {/* Accent dots */}
                <div className="absolute top-1 left-1 w-1 h-1 md:w-1.5 md:h-1.5 bg-white/60 rounded-full" />
                <div className="absolute top-1 right-1 w-1 h-1 md:w-1.5 md:h-1.5 bg-white/60 rounded-full" />
                <div className="absolute bottom-1 left-1 w-1 h-1 md:w-1.5 md:h-1.5 bg-white/60 rounded-full" />
                <div className="absolute bottom-1 right-1 w-1 h-1 md:w-1.5 md:h-1.5 bg-white/60 rounded-full" />
                
                {/* Central highlight */}
                <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white/50 rounded-full blur-[2px]" />
              </div>
            </div>
          </div>
        </motion.div>
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

