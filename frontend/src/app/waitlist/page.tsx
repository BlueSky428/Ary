/**
 * Waitlist Page
 */

import { WaitlistSection } from '@/components/WaitlistSection';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Navigation */}
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-24 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Waitlist Section */}
      <div className="pt-16">
        <WaitlistSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

