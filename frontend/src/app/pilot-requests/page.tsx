'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { RefreshCw } from 'lucide-react';

type PilotRequest = {
  id: string;
  name: string;
  organization: string;
  role: string;
  domain: string;
  context: string | null;
  status: string;
  created_at: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const domainColor: Record<string, string> = {
  Procurement:
    'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50',
  Legal:
    'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
  Compliance:
    'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
  Governance:
    'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/50',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PilotRequestsPage() {
  const [requests, setRequests] = useState<PilotRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pilot-request');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch {
      setError('Unable to load pilot requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const total = requests.length;
  const domains = [...new Set(requests.map((r) => r.domain))];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 md:pb-32">
        <div className="max-w-5xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium select-none">
              Pilot Requests
            </p>
            <div className="flex items-start justify-between gap-6 mb-4">
              <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight max-w-2xl">
                Submissions
              </h1>
              <motion.button
                onClick={fetchRequests}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="shrink-0 mt-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <span className="text-sm font-light text-neutral-500 dark:text-neutral-400">
              {loading ? '...' : `${total} request${total !== 1 ? 's' : ''}`}
            </span>
            {!loading && domains.length > 0 && (
              <>
                <span className="text-neutral-300 dark:text-neutral-700 select-none">·</span>
                {domains.map((d) => (
                  <span
                    key={d}
                    className={`inline-block px-2.5 py-0.5 text-xs font-medium border rounded-md ${domainColor[d] || 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700'}`}
                  >
                    {d}
                  </span>
                ))}
              </>
            )}
          </motion.div>

          {/* Divider */}
          <div className="mb-10 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.15 }}
              className="h-px bg-neutral-100 dark:bg-neutral-800 origin-left"
            />
          </div>

          {/* Error state */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 dark:text-red-400 font-light mb-8"
            >
              {error}
            </motion.p>
          )}

          {/* Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/30 animate-pulse"
                />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && !error && requests.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="py-20 text-center"
            >
              <p className="text-lg text-neutral-400 dark:text-neutral-500 font-light mb-1">
                No pilot requests yet.
              </p>
              <p className="text-sm text-neutral-400 dark:text-neutral-600 font-light">
                Submissions will appear here once received.
              </p>
            </motion.div>
          )}

          {/* Requests list */}
          <AnimatePresence mode="wait">
            {!loading && requests.length > 0 && (
              <motion.div
                key="list"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                }}
                className="space-y-3"
              >
                {requests.map((req, i) => (
                  <motion.div
                    key={req.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
                    }}
                    className="group border border-neutral-100 dark:border-neutral-800 rounded-xl p-5 sm:p-6 bg-white dark:bg-neutral-900/40 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors duration-200"
                  >
                    {/* Top row: number, name, org, date */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-4 min-w-0">
                        <span className="text-neutral-300 dark:text-neutral-600 font-light text-sm tabular-nums shrink-0 mt-0.5 select-none">
                          {String(total - i).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-normal text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                            {req.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-500 font-light truncate">
                            {req.organization} &nbsp;·&nbsp; {req.role}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light tabular-nums">
                          {formatDate(req.created_at)}
                        </p>
                        <p className="text-xs text-neutral-300 dark:text-neutral-600 font-light tabular-nums">
                          {formatTime(req.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Domain badge + context */}
                    <div className="flex items-start gap-4 pl-8 sm:pl-10">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-medium border rounded-md shrink-0 ${domainColor[req.domain] || 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700'}`}
                      >
                        {req.domain}
                      </span>
                      {req.context && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-2">
                          {req.context}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <Footer />
    </main>
  );
}
