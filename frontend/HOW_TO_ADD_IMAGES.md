# 🖼️ How to Add Your 5 Background Images

## Quick Start

### 1. **Place Your Images**
   Put your 5 images in: `frontend/public/images/hero/`
   
   Example filenames:
   - `image-1.jpg`
   - `image-2.jpg`
   - `image-3.jpg`
   - `image-4.jpg`
   - `image-5.jpg`

### 2. **Update the Configuration**
   Edit: `frontend/src/data/heroImages.ts`
   
   For each image, update:
   - `src`: The path to your image (e.g., `'/images/hero/image-1.jpg'`)
   - `alt`: Description for accessibility
   - `title`: The heading text for this image
   - `meaning`: The sentence/message that explains your site

### 3. **Activate the Background Images**
   Edit: `frontend/src/app/page.tsx`
   
   Change from:
   ```typescript
   import { LandingHero } from '@/components/LandingHero';
   // ... later in component
   <LandingHero />
   ```
   
   To:
   ```typescript
   import { LandingHeroWithBackground } from '@/components/LandingHeroWithBackground';
   // ... later in component
   <LandingHeroWithBackground />
   ```

## ✨ Features You Get

- **Auto-rotation**: Images change every 6 seconds
- **Manual control**: Users can click arrows or dots to navigate
- **Smooth transitions**: Beautiful fade effects between images
- **Pause on hover**: Rotation stops when users hover
- **Responsive**: Works on all screen sizes
- **Dark mode**: Automatically adapts to theme

## 📝 Example Configuration

```typescript
{
  id: 1,
  src: '/images/hero/my-first-image.jpg',
  alt: 'Person reflecting on their strengths',
  title: 'Discover Your Strengths',
  meaning: 'Every conversation reveals patterns of competence you already demonstrate.',
}
```

## 🎯 What Each Image Does

Each image displays:
1. **As a full-screen background** (with overlay for readability)
2. **Its title** (large, prominent heading)
3. **Its meaning** (your explanatory sentence below the title)

## 📁 File Structure

```
frontend/
├── public/
│   └── images/
│       └── hero/          ← Put your images here
│           ├── image-1.jpg
│           ├── image-2.jpg
│           ├── image-3.jpg
│           ├── image-4.jpg
│           └── image-5.jpg
├── src/
│   ├── data/
│   │   └── heroImages.ts  ← Update configuration here
│   └── components/
│       ├── HeroBackground.tsx
│       └── LandingHeroWithBackground.tsx
```

That's it! Once you add the images and update the config, they'll automatically appear on your landing page! 🚀

