# Hero Background Images

## How to Add Your Images

1. **Place your 5 images here** in this directory (`frontend/public/images/hero/`)

2. **Name your images** (recommended naming):
   - `hero-1.jpg` (or `.png`, `.webp`)
   - `hero-2.jpg`
   - `hero-3.jpg`
   - `hero-4.jpg`
   - `hero-5.jpg`

   Or use any descriptive names you prefer!

3. **Update the configuration file**:
   - Open `frontend/src/data/heroImages.ts`
   - Update the `src` paths to match your actual image filenames
   - Update the `title` and `meaning` for each image with your own text

## Image Specifications

**Recommended:**
- **Format**: JPG, PNG, or WebP
- **Size**: 1920x1080px (or similar wide aspect ratio)
- **File size**: Under 500KB each (optimized for web)
- **Quality**: High quality, but compressed for web

## Example

If your images are named:
- `discover-strengths.jpg`
- `reflect.jpg`
- `private.jpg`
- `visual.jpg`
- `conversation.jpg`

Then in `heroImages.ts`, update the `src` values like:
```typescript
src: '/images/hero/discover-strengths.jpg',
```

