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
    src: '/images/hero/1.jpg',
    alt: 'Hero image 1',
    title: 'Ary',
    meaning: 'Conversational clarity for your professional goals',
  },
  {
    id: 2,
    src: '/images/hero/2.jpg',
    alt: 'Hero image 2',
    title: 'Structured reflection through natural conversation',
    meaning: '',
  },
  {
    id: 3,
    src: '/images/hero/3.jpg',
    alt: 'Hero image 3',
    title: 'Your data stays in your control',
    meaning: 'Secure and private',
  },
  {
    id: 4,
    src: '/images/hero/4.jpg',
    alt: 'Hero image 4',
    title: 'Responsible AI',
    meaning: 'Transparent and aligned with professional use',
  },
];

