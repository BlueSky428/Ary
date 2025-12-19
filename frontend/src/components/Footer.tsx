'use client';

/**
 * Footer Component
 * Clean, minimal footer
 */

export function Footer() {
  return (
    <footer className="relative border-t border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-neutral-600 dark:text-neutral-300 font-medium mb-1">Ary</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Built with care for professional clarity and growth.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

