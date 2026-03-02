'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import {
  RefreshCw,
  Search,
  X,
  ChevronDown,
  Trash2,
  Clock,
  CheckCircle2,
  Archive,
  MessageCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

type PilotRequest = {
  id: string;
  name: string;
  organization: string;
  role: string;
  contact: string | null;
  domain: string;
  context: string | null;
  status: string;
  created_at: string;
};

type Counts = {
  total: number;
  new: number;
  contacted: number;
  in_progress: number;
  completed: number;
  archived: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', icon: AlertCircle, color: 'text-blue-500 dark:text-blue-400' },
  { value: 'contacted', label: 'Contacted', icon: MessageCircle, color: 'text-amber-500 dark:text-amber-400' },
  { value: 'in_progress', label: 'In Progress', icon: Loader2, color: 'text-orange-500 dark:text-orange-400' },
  { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400' },
  { value: 'archived', label: 'Archived', icon: Archive, color: 'text-neutral-400 dark:text-neutral-500' },
] as const;

const DOMAIN_OPTIONS = ['Procurement', 'Legal', 'Compliance', 'Governance'] as const;

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

const statusBadge: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50',
  contacted: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
  in_progress: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/50',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
  archived: 'bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800/40 dark:text-neutral-400 dark:border-neutral-700/50',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

function statusLabel(s: string) {
  return STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
}

// ─── Status dropdown ────────────────────────────────────────────────────────

function StatusDropdown({
  current,
  onChange,
  disabled,
}: {
  current: string;
  onChange: (s: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const opt = STATUS_OPTIONS.find((o) => o.value === current);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-md transition-colors ${statusBadge[current] || 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
      >
        {opt && <opt.icon className="w-3 h-3" />}
        {statusLabel(current)}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease }}
            className="absolute left-0 top-full mt-1.5 z-30 min-w-[160px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden"
          >
            {STATUS_OPTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = s.value === current;
              return (
                <button
                  key={s.value}
                  onClick={() => {
                    onChange(s.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                  {s.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Delete confirm ──────────────────────────────────────────────────────────

function DeleteButton({ onConfirm, disabled }: { onConfirm: () => void; disabled: boolean }) {
  const [confirming, setConfirming] = useState(false);

  return confirming ? (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => {
          onConfirm();
          setConfirming(false);
        }}
        disabled={disabled}
        className="text-xs text-red-500 dark:text-red-400 font-medium hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
      >
        Delete
      </button>
      <span className="text-neutral-300 dark:text-neutral-600 select-none">/</span>
      <button
        onClick={() => setConfirming(false)}
        className="text-xs text-neutral-400 dark:text-neutral-500 font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      onClick={() => setConfirming(true)}
      disabled={disabled}
      className="p-1.5 rounded-md text-neutral-300 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 transition-colors"
      aria-label="Delete"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

// ─── Detail panel ────────────────────────────────────────────────────────────

function DetailPanel({
  req,
  onClose,
  onStatusChange,
  onDelete,
  busy,
}: {
  req: PilotRequest;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease }}
      className="border border-neutral-100 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900/60 p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs tracking-[0.16em] uppercase text-neutral-400 dark:text-neutral-500 font-medium mb-2 select-none">
            Request Detail
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight">
            {req.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 mb-8">
        <Field label="Organization" value={req.organization} />
        <Field label="Role" value={req.role} />
        <Field label="Contact" value={req.contact || '—'} />
        <Field label="Domain">
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-medium border rounded-md ${domainColor[req.domain] || ''}`}
          >
            {req.domain}
          </span>
        </Field>
        <Field label="Status">
          <StatusDropdown
            current={req.status}
            onChange={(s) => onStatusChange(req.id, s)}
            disabled={busy}
          />
        </Field>
        <Field label="Submitted" value={`${formatDate(req.created_at)} at ${formatTime(req.created_at)}`} />
        <Field label="ID" value={`#${req.id}`} />
      </div>

      {req.context && (
        <div className="mb-8">
          <p className="text-xs tracking-[0.12em] uppercase text-neutral-400 dark:text-neutral-500 font-medium mb-2 select-none">
            Context
          </p>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed bg-neutral-50 dark:bg-neutral-800/30 rounded-lg p-4 border border-neutral-100 dark:border-neutral-800">
            {req.context}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <p className="text-xs text-neutral-400 dark:text-neutral-600 font-light">
          {formatRelative(req.created_at)}
        </p>
        <DeleteButton onConfirm={() => onDelete(req.id)} disabled={busy} />
      </div>
    </motion.div>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs tracking-[0.12em] uppercase text-neutral-400 dark:text-neutral-500 font-medium mb-1 select-none">
        {label}
      </p>
      {children ?? (
        <p className="text-sm sm:text-base text-neutral-800 dark:text-neutral-200 font-light">
          {value}
        </p>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PilotRequestsPage() {
  const [requests, setRequests] = useState<PilotRequest[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, new: 0, contacted: 0, in_progress: 0, completed: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [selected, setSelected] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchRequests = useCallback(
    async (s?: string, st?: string, d?: string) => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (s) params.set('search', s);
        if (st) params.set('status', st);
        if (d) params.set('domain', d);
        const qs = params.toString();
        const res = await fetch(`/api/pilot-request${qs ? `?${qs}` : ''}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRequests(data.requests ?? []);
        if (data.counts) setCounts(data.counts);
      } catch {
        setError('Unable to load pilot requests.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  function reload() {
    fetchRequests(search, filterStatus, filterDomain);
  }

  function onSearchChange(val: string) {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRequests(val, filterStatus, filterDomain);
    }, 350);
  }

  function onStatusFilter(val: string) {
    const next = val === filterStatus ? '' : val;
    setFilterStatus(next);
    fetchRequests(search, next, filterDomain);
  }

  function onDomainFilter(val: string) {
    const next = val === filterDomain ? '' : val;
    setFilterDomain(next);
    fetchRequests(search, filterStatus, next);
  }

  function clearFilters() {
    setSearch('');
    setFilterStatus('');
    setFilterDomain('');
    fetchRequests('', '', '');
  }

  async function updateStatus(id: string, status: string) {
    setBusy(true);
    try {
      const res = await fetch('/api/pilot-request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      reload();
    } catch {
      setError('Failed to update status.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteRequest(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/pilot-request?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selected === id) setSelected(null);
      reload();
    } catch {
      setError('Failed to delete request.');
    } finally {
      setBusy(false);
    }
  }

  const selectedReq = requests.find((r) => r.id === selected);
  const hasFilters = search || filterStatus || filterDomain;

  const statusTabs = [
    { key: '', label: 'All', count: counts.total },
    { key: 'new', label: 'New', count: counts.new },
    { key: 'contacted', label: 'Contacted', count: counts.contacted },
    { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'archived', label: 'Archived', count: counts.archived },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 md:pb-32">
        <div className="max-w-6xl">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium select-none">
              Admin
            </p>
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-2">
                  Pilot Requests
                </h1>
                <p className="text-base text-neutral-500 dark:text-neutral-400 font-light">
                  {counts.total} total &nbsp;·&nbsp; {counts.new} new
                </p>
              </div>
              <motion.button
                onClick={reload}
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

          {/* ── Status tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
            className="flex flex-wrap gap-1.5 mb-6"
          >
            {statusTabs.map((tab) => {
              const active = filterStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onStatusFilter(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ${
                    active
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                      : 'bg-white dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`tabular-nums ${
                      active
                        ? 'text-white/70 dark:text-neutral-900/60'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* ── Search + domain filter ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or organization..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-light text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 rounded-lg placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {DOMAIN_OPTIONS.map((d) => {
                const active = filterDomain === d;
                return (
                  <button
                    key={d}
                    onClick={() => onDomainFilter(d)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all duration-150 ${
                      active
                        ? domainColor[d]
                        : 'bg-white dark:bg-neutral-900/40 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 font-medium transition-colors whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </motion.div>

          {/* ── Divider ── */}
          <div className="mb-8 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.15 }}
              className="h-px bg-neutral-100 dark:bg-neutral-800 origin-left"
            />
          </div>

          {/* ── Error ── */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm text-red-500 dark:text-red-400 font-light mb-6"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Content area ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left: List */}
            <div className={selectedReq ? 'lg:col-span-3' : 'lg:col-span-5'}>

              {/* Loading */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/30 animate-pulse" />
                  ))}
                </motion.div>
              )}

              {/* Empty */}
              {!loading && !error && requests.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="py-16 text-center"
                >
                  <p className="text-lg text-neutral-400 dark:text-neutral-500 font-light mb-1">
                    {hasFilters ? 'No matching requests.' : 'No pilot requests yet.'}
                  </p>
                  <p className="text-sm text-neutral-400 dark:text-neutral-600 font-light">
                    {hasFilters ? 'Try adjusting your filters.' : 'Submissions will appear here.'}
                  </p>
                </motion.div>
              )}

              {/* List */}
              <AnimatePresence mode="wait">
                {!loading && requests.length > 0 && (
                  <motion.div
                    key="list"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                    }}
                    className="space-y-2"
                  >
                    {requests.map((req) => {
                      const isSelected = selected === req.id;
                      return (
                        <motion.div
                          key={req.id}
                          layoutId={`card-${req.id}`}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
                          }}
                          onClick={() => setSelected(isSelected ? null : req.id)}
                          className={`group relative border rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-neutral-300 dark:border-neutral-600 bg-neutral-50/80 dark:bg-neutral-800/40 shadow-sm'
                              : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:border-neutral-200 dark:hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2.5 mb-1">
                                <h3 className="text-base font-normal text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                                  {req.name}
                                </h3>
                                <span
                                  className={`shrink-0 inline-block px-2 py-px text-[10px] font-medium border rounded ${statusBadge[req.status] || ''}`}
                                >
                                  {statusLabel(req.status)}
                                </span>
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-500 font-light truncate">
                                {req.organization} &nbsp;·&nbsp; {req.role}
                              </p>
                            </div>

                            <div className="shrink-0 flex items-center gap-3">
                              <span
                                className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium border rounded ${domainColor[req.domain] || ''}`}
                              >
                                {req.domain}
                              </span>
                              <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs font-light tabular-nums whitespace-nowrap">
                                  {formatRelative(req.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {req.context && !selectedReq && (
                            <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500 font-light leading-relaxed line-clamp-1 pl-0">
                              {req.context}
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Detail panel */}
            <AnimatePresence mode="wait">
              {selectedReq && (
                <div className="lg:col-span-2">
                  <div className="lg:sticky lg:top-28">
                    <DetailPanel
                      key={selectedReq.id}
                      req={selectedReq}
                      onClose={() => setSelected(null)}
                      onStatusChange={updateStatus}
                      onDelete={deleteRequest}
                      busy={busy}
                    />
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
