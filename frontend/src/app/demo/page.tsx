/**
 * Demo Conversation Page
 * Question flow with progress indicator
 */

import { ConversationFlow } from '@/components/ConversationFlow';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <ConversationFlow />
    </main>
  );
}

