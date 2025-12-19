# Hero Background Images Setup Guide

## 📸 How to Add Your 5 Images

### Step 1: Add Your Images

1. Create the directory (if it doesn't exist):
   ```
   frontend/public/images/hero/
   ```

2. Place your 5 images in that directory with descriptive names, for example:
   - `hero-1.jpg`
   - `hero-2.jpg`
   - `hero-3.jpg`
   - `hero-4.jpg`
   - `hero-5.jpg`

### Step 2: Update the Configuration

Open `frontend/src/data/heroImages.ts` and update each image entry:

```typescript
{
  id: 1,
  src: '/images/hero/hero-1.jpg',  // ← Update this to match your filename
  alt: 'Description of image 1',   // ← Update alt text for accessibility
  title: 'Your Title Here',        // ← Update with your title
  meaning: 'Your sentence/meaning here', // ← Update with your text
}
```

### Step 3: Choose How to Use the Images

**Option A: Full Background Hero (Recommended)**
- Use `LandingHeroWithBackground` component
- Images rotate automatically as full-screen backgrounds
- Text and meanings are displayed prominently

**Option B: Keep Current Simple Design**
- Continue using `LandingHero` component
- Images can be used elsewhere (feature sections, etc.)

To switch between them, update `frontend/src/app/page.tsx`:

```typescript
// For background images:
import { LandingHeroWithBackground } from '@/components/LandingHeroWithBackground';
// Then use: <LandingHeroWithBackground />

// For simple design:
import { LandingHero } from '@/components/LandingHero';
// Then use: <LandingHero />
```

## 🎨 Image Recommendations

- **Format**: JPG, PNG, or WebP
- **Resolution**: 1920x1080px or higher (16:9 aspect ratio works best)
- **File Size**: Optimize to under 500KB each for fast loading
- **Content**: Images should work well with text overlay (not too busy)
- **Quality**: High quality but web-optimized

## 📝 What Each Image Needs

Each of your 5 images should have:
1. **Title**: A short, impactful title (e.g., "Discover Your Strengths")
2. **Meaning**: The sentence/message that explains what your site does (shown below the title)
3. **Alt Text**: Descriptive text for screen readers

## ✨ Features Included

- ✅ Automatic rotation (every 6 seconds)
- ✅ Manual navigation with arrows and dots
- ✅ Smooth fade transitions
- ✅ Pause on hover
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Accessibility features

## 🚀 After Setup

Once you've added your images and updated the configuration:
1. The images will automatically rotate in the hero section
2. Each image displays its title and meaning
3. Users can navigate manually with arrows or dots
4. The rotation pauses when users hover over the section

Need help? Check the example configuration in `frontend/src/data/heroImages.ts`!

