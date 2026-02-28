'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="max-w-5xl flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div>
            <p className="text-sm font-semibold tracking-[0.14em] text-neutral-900 dark:text-neutral-100 mb-2">
              INLYTH
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 font-light leading-relaxed max-w-xs">
              Structured decision infrastructure for institutional defensibility.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400 dark:text-neutral-500 font-light">
            <Link
              href="https://drive.google.com/file/d/1wEJRnby4ILSFfAt_jmOEv3iWaWuvhUhY/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Doctrine
            </Link>
            <span className="text-neutral-200 dark:text-neutral-700">·</span>
            <Link href="/request-pilot" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Request a Pilot
            </Link>
            <span className="text-neutral-200 dark:text-neutral-700">·</span>
            <a
              href="mailto:hello@inlyth.com"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              hello@inlyth.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
