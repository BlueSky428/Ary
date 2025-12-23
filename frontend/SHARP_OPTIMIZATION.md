# Sharp Module for Perfect Image Animations

## What is Sharp?

**Sharp** is a high-performance Node.js image processing library that Next.js uses automatically when installed. It optimizes images on the server-side to ensure:

- ✅ Faster loading times
- ✅ Optimal image formats (WebP, AVIF when supported)
- ✅ Proper image sizing
- ✅ Better compression
- ✅ Smoother animations (because images load faster)

## How Sharp Works with Next.js Image Component

When you use Next.js `<Image>` component with `sharp` installed:

1. **Automatic Format Conversion**: Sharp converts images to modern formats (WebP/AVIF) when the browser supports them
2. **Responsive Sizing**: Sharp generates multiple image sizes based on the `sizes` prop
3. **Quality Optimization**: The `quality` prop controls compression (default: 75, range: 1-100)
4. **Lazy Loading**: Images are loaded only when needed (except with `priority` prop)

## Current Implementation

In `HeroBackground.tsx`, we're using:

```tsx
<Image
  src={currentImage.src}
  alt={currentImage.alt}
  fill
  priority={currentIndex === 0 || currentIndex === 1}  // Load first 2 images immediately
  sizes="100vw"  // Full viewport width
  quality={85}   // High quality for hero images
/>
```

## Best Practices for Smooth Animations

### 1. Preload Images
We preload all images to ensure they're ready before animation:

```tsx
useEffect(() => {
  const preloadImages = async () => {
    for (const img of images) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    }
  };
  preloadImages();
}, [images]);
```

### 2. Use Priority Loading
Mark critical images with `priority` prop to load them immediately:

```tsx
priority={currentIndex === 0 || currentIndex === 1}
```

### 3. Set Appropriate Quality
- **Hero images**: 85-90 (high quality)
- **Thumbnails**: 60-75 (medium quality)
- **Icons**: 50-60 (lower quality)

### 4. Use CSS `will-change` for Animations
Tell the browser which properties will change for optimization:

```tsx
style={{ 
  willChange: 'opacity, transform'
}}
```

### 5. Configure Next.js for Image Domains (if using external images)

If using external image sources, add to `next.config.js`:

```js
const nextConfig = {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

## How to Verify Sharp is Working

1. **Check Build Output**: Sharp will be used automatically if installed
2. **Network Tab**: Check that images are served as WebP/AVIF (in supported browsers)
3. **Image URLs**: Next.js Image component URLs will show optimization parameters

## Troubleshooting

If images aren't optimized:
1. Ensure `sharp` is installed: `npm list sharp`
2. Restart dev server after installing sharp
3. Check Next.js version (requires 10.0.0+)
4. Verify images are in `public/` directory or configured domain

## Performance Tips

1. **Optimize Source Images**: Start with reasonably sized images (not too large)
2. **Use Appropriate Formats**: PNG for graphics, JPG for photos
3. **Set Correct `sizes` Prop**: Helps generate right-sized variants
4. **Preload Critical Images**: Use `priority` and preload for above-the-fold images

