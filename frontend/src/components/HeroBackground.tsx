'use client';

/**
 * Hero Background Component
 * Displays rotating background images with their meanings
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface BackgroundImage {
  id: number;
  src: string; // Path relative to /public, e.g., '/images/hero-1.jpg'
  alt: string;
  title: string;
  meaning: string; // The sentence/meaning associated with this image
}

interface HeroBackgroundProps {
  images: BackgroundImage[];
  autoRotate?: boolean;
  rotationInterval?: number; // in milliseconds
  transitionDuration?: number; // in seconds, default 0.8
  transitionEasing?: number[]; // cubic bezier easing, default smooth
}

export function HeroBackground({ 
  images, 
  autoRotate = true, 
  rotationInterval = 5000,
  transitionDuration = 0.8,
  transitionEasing = [0.25, 0.46, 0.45, 0.94] // smooth ease-out (ease-out-quad)
}: HeroBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Preload all images using Next.js Image optimization
  // This ensures images are loaded and decoded before animation
  useEffect(() => {
    const preloadImages = async () => {
      for (const img of images) {
        // Create link element for preloading
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
        
        // Also use native Image preloading for browser cache
        const imageElement = new window.Image();
        imageElement.src = img.src;
      }
    };
    
    preloadImages();
  }, [images]);

  // Mark initial mount as complete after a short delay to allow first image to render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialMount(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        setPrevIndex(prev);
        return (prev + 1) % images.length;
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, images.length]);

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(index);
    setIsInitialMount(false);
  };

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <div className="relative w-full h-full">
      {/* Background Images - Carousel Mode with Crossfade */}
      <div className="absolute inset-0 overflow-hidden bg-neutral-900">
        {/* Render previous image behind current for smooth crossfade */}
        {prevIndex !== null && prevIndex !== currentIndex && (
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <Image
              src={images[prevIndex].src}
              alt={images[prevIndex].alt}
              fill
              className="object-cover object-top"
              sizes="100vw"
              quality={85}
              style={{ objectPosition: 'center top' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 dark:from-black/60 dark:via-black/50 dark:to-black/70" />
          </div>
        )}
        
        {/* Current image with fade transition */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImage.id}
            initial={isInitialMount ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isInitialMount ? 0 : transitionDuration,
              ease: transitionEasing,
            }}
            className="absolute inset-0"
            style={{ zIndex: 1 }}
            onAnimationComplete={() => {
              // Clear previous index after transition completes to allow next transition
              if (prevIndex !== null) {
                setPrevIndex(null);
              }
            }}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              priority={currentIndex === 0 || currentIndex === 1}
              className="object-cover object-top"
              sizes="100vw"
              quality={85}
              style={{ 
                objectPosition: 'center top',
                willChange: 'opacity'
              }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 dark:from-black/60 dark:via-black/50 dark:to-black/70" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
}

