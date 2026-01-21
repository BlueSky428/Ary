/**
 * Competence Tree Page
 * Shows the visual competence tree with progress bars
 */

import { CompetenceTreeView } from '@/components/CompetenceTreeView';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function CompetenceTreePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Competence Tree View */}
      <div className="pt-16">
        <CompetenceTreeView />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

