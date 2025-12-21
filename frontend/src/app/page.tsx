/**
 * Landing Page
 * Matches the workflow design exactly
 */

import { LandingHeroWithBackground } from '@/components/LandingHeroWithBackground';
import { FeatureCards } from '@/components/FeatureCards';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section with Background Images */}
      <LandingHeroWithBackground />

      {/* Feature Cards */}
      <FeatureCards />

      {/* Footer */}
      <Footer />
    </main>
  );
}
