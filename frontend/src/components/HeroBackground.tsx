'use client';

/**
 * Hero Background Component
 * Displays rotating background images with their meanings
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Preload all images to prevent loading delays
  useEffect(() => {
    images.forEach((img) => {
      const imageElement = new window.Image();
      imageElement.src = img.src;
    });
  }, [images]);

  // Clear previous image after transition completes
  useEffect(() => {
    if (prevIndex !== null) {
      const timer = setTimeout(() => {
        setPrevIndex(null);
      }, 600); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [prevIndex]);

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate || isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        setPrevIndex(prev);
        return next;
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, images.length, isHovered]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      setPrevIndex(prev);
      return (prev - 1 + images.length) % images.length;
    });
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => {
      setPrevIndex(prev);
      return (prev + 1) % images.length;
    });
  };

  const handleDotClick = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      setPrevIndex(prev);
      return index;
    });
  };

  const currentImage = images[currentIndex];
  const previousImage = prevIndex !== null ? images[prevIndex] : null;

  if (!currentImage) return null;

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images - Carousel Mode */}
      <div className="absolute inset-0 overflow-hidden bg-neutral-900">
        {/* Previous image - slides out */}
        {previousImage && (
          <motion.div
            key={`prev-${previousImage.id}`}
            initial={{ x: 0 }}
            animate={{ x: direction > 0 ? '-100%' : '100%' }}
            transition={{
              type: 'tween',
              ease: [0.4, 0, 0.2, 1],
              duration: 0.6,
            }}
            className="absolute inset-0"
            style={{ willChange: 'transform', zIndex: 1 }}
          >
            <Image
              src={previousImage.src}
              alt={previousImage.alt}
              fill
              className="object-cover object-top"
              sizes="100vw"
              style={{ objectPosition: 'center top' }}
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 dark:from-black/60 dark:via-black/50 dark:to-black/70" />
          </motion.div>
        )}
          {/* Current image - slides in */}
          <motion.div
            key={`current-${currentImage.id}`}
            initial={{ x: direction > 0 ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            transition={{
              type: 'tween',
              ease: [0.4, 0, 0.2, 1],
              duration: 0.6,
            }}
            className="absolute inset-0"
            style={{ willChange: 'transform', zIndex: 2 }}
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

