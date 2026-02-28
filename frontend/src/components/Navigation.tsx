'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/applications', label: 'Applications' },
  { href: '/ledger', label: 'Ledger' },
  { href: '/design', label: 'Design' },
  { href: '/team', label: 'Team' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-100 dark:border-neutral-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-[72px]">
          <Link href="/" className="shrink-0 mr-10 sm:mr-14">
            <motion.span
              whileHover={{ opacity: 0.65 }}
              transition={{ duration: 0.15 }}
              className="text-base font-semibold tracking-[0.14em] text-neutral-900 dark:text-neutral-100 block"
            >
              INLYTH
            </motion.span>
          </Link>

          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-6 sm:gap-8 min-w-max">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[15px] whitespace-nowrap transition-colors pb-px ${
                      isActive
                        ? 'text-neutral-900 dark:text-neutral-50 font-medium'
                        : 'text-neutral-500 dark:text-neutral-400 font-light hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute inset-x-0 bottom-0 h-px bg-neutral-800 dark:bg-neutral-100"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
