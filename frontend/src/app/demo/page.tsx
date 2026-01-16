/**
 * Demo Conversation Page
 * Question flow with progress indicator
 * Protected by access code authentication via middleware
 */

import { ConversationFlow } from '@/components/ConversationFlow';
import { Navigation } from '@/components/Navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DemoPage() {
  // Authentication is handled by middleware - if we reach here, user is authenticated
  return (
    <main className="h-screen overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative">
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

      {/* Conversation Flow */}
      <div className="pt-16 h-full">
        <ConversationFlow />
      </div>
    </main>
  );
}

