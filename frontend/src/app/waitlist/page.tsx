/**
 * Waitlist Page
 */

import { WaitlistSection } from '@/components/WaitlistSection';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function WaitlistPage() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-20 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Waitlist Section - fills middle row */}
      <div className="pt-16">
        <WaitlistSection />
      </div>

      {/* Footer - at bottom */}
      <Footer />
    </div>
  );
}

