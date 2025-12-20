'use client';

/**
 * Hero Background Component
 * Displays rotating background images with their meanings
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export function HeroBackground({ 
  images, 
  autoRotate = true, 
  rotationInterval = 5000 
}: HeroBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Preload all images to prevent loading delays
  useEffect(() => {
    images.forEach((img) => {
      const imageElement = new window.Image();
      imageElement.src = img.src;
    });
  }, [images]);

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate || isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, images.length, isHovered]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images - Carousel Mode */}
      <div className="absolute inset-0 overflow-hidden bg-neutral-900">
        <AnimatePresence initial={false}>
          {/* Current image with smooth fade transition */}
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              priority={currentIndex === 0}
              className="object-cover object-top"
              sizes="100vw"
              style={{ objectPosition: 'center top' }}
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

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all z-30 pointer-events-auto"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all z-30 pointer-events-auto"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}

