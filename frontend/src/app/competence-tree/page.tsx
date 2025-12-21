/**
 * Competence Tree Page
 * Shows the visual competence tree with progress bars
 */

import { CompetenceTreeView } from '@/components/CompetenceTreeView';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function CompetenceTreePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Navigation */}
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-24 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Competence Tree View */}
      <div className="pt-16">
        <CompetenceTreeView />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

