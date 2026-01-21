'use client';

/**
 * Navigation Component
 * Header with logo that links to home page
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/infrastructure', label: 'Infrastructure' },
    { href: '/legitimacy', label: 'Legitimacy' },
    { href: '/team', label: 'Team' },
    { href: '/demo-access', label: 'Demo' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 sm:h-16 gap-3 sm:gap-4">
          <Link href="/" className="inline-flex items-center group shrink-0">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="text-lg sm:text-xl font-semibold tracking-wide text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-200"
            >
              INLYTH
            </motion.span>
          </Link>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-center gap-4 sm:gap-6 min-w-max px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    pathname === link.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <div className="scale-90 sm:scale-100">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

