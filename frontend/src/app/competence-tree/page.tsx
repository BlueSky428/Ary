/**
 * Competence Tree Page
 * Shows the visual competence tree with progress bars
 */

import { CompetenceTreeView } from '@/components/CompetenceTreeView';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function CompetenceTreePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <CompetenceTreeView />
    </main>
  );
}

