/**
 * Hero Background Images Configuration
 * 
 * To add your images:
 * 1. Place your image files in frontend/public/images/hero/ directory
 * 2. Update the src paths below to match your image filenames
 * 3. Update the title and meaning for each image
 */

import { BackgroundImage } from '@/components/HeroBackground';

export const heroImages: BackgroundImage[] = [
  {
    id: 1,
    src: '/images/hero/1.png',
    alt: 'Hero image 1',
    title: 'Discover Your Strengths',
    meaning: 'Every conversation reveals patterns of competence you already demonstrate. See yourself clearly.',
  },
  {
    id: 2,
    src: '/images/hero/2.png',
    alt: 'Hero image 2',
    title: 'Reflect, Don\'t Assess',
    meaning: 'No scores, no judgment. Just a calm mirror that shows you what you already know deep down.',
  },
  {
    id: 3,
    src: '/images/hero/3.png',
    alt: 'Hero image 3',
    title: 'Private & Sovereign',
    meaning: 'Your data stays yours. No surveillance, no hidden evaluation. Complete control.',
  },
  {
    id: 4,
    src: '/images/hero/4.png',
    alt: 'Hero image 4',
    title: 'Visual Clarity',
    meaning: 'See your strengths as a living competence tree that grows with your reflection.',
  },
  {
    id: 5,
    src: '/images/hero/5.png',
    alt: 'Hero image 5',
    title: 'Natural Conversation',
    meaning: 'Talk naturally. We listen and reflect back what we hear—simple, meaningful, clear.',
  },
];

