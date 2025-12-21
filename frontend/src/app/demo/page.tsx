/**
 * Demo Conversation Page
 * Question flow with progress indicator
 */

import { ConversationFlow } from '@/components/ConversationFlow';
import { Navigation } from '@/components/Navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DemoPage() {
  return (
    <main className="h-screen overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Navigation */}
      <Navigation />

      {/* Theme Toggle */}
      <div className="fixed top-24 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Conversation Flow */}
      <div className="pt-16 h-full">
        <ConversationFlow />
      </div>
    </main>
  );
}

