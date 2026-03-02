'use client';

import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { CheckCircle2 } from 'lucide-react';

type Domain = 'Procurement' | 'Legal' | 'Compliance' | 'Governance';

const ease = [0.22, 1, 0.36, 1] as const;

const inputClass =
  'w-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 rounded-md transition-colors duration-150 font-light';

const labelClass =
  'block text-xs tracking-[0.12em] uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-2';

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease, delay: i * 0.07 },
  }),
};

export default function RequestPilotPage() {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [contact, setContact] = useState('');
  const [domain, setDomain] = useState<Domain>('Procurement');
  const [context, setContext] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/pilot-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          organization: organization.trim(),
          role: role.trim(),
          contact: contact.trim(),
          domain,
          context: context.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setIsError(true);
        setMessage(data?.error || 'Unable to submit right now.');
        return;
      }

      setSubmitted(true);
      setName('');
      setOrganization('');
      setRole('');
      setContact('');
      setDomain('Procurement');
      setContext('');
    } catch {
      setIsError(true);
      setMessage('Unable to submit right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: Context */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
            className="lg:pt-1"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-5 font-medium select-none">
              Request a Pilot
            </p>
            <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight mb-7 leading-snug max-w-sm">
              If your institution makes high-stakes decisions, structured context is not optional.
            </h1>
            <div className="space-y-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-10">
              <p>
                Ary captures the structured reasoning context behind defined strategy options at the
                moment of decision.
              </p>
              <p>
                A pilot is the structured way to evaluate whether Ary fits your institution&apos;s
                decision environment.
              </p>
            </div>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
              }}
              className="space-y-2"
            >
              {['Procurement', 'Legal Strategy', 'Compliance', 'Executive Governance'].map((item) => (
                <motion.div
                  key={item}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-neutral-300 dark:text-neutral-600 text-sm select-none">—</span>
                  <span className="text-base text-neutral-600 dark:text-neutral-400 font-light">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="border border-neutral-100 dark:border-neutral-800 rounded-xl p-8 bg-white dark:bg-neutral-900/60"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                    className="mb-5"
                  >
                    <CheckCircle2 className="w-8 h-8 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
                  </motion.div>
                  <p className="text-lg text-neutral-900 dark:text-neutral-100 font-light mb-2">
                    Request received.
                  </p>
                  <p className="text-base text-neutral-500 dark:text-neutral-500 font-light">
                    We&apos;ll be in touch at hello@inlyth.com.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  className="space-y-5"
                  initial="hidden"
                  animate="show"
                >
                  {[
                    { id: 'name', label: 'Name', value: name, setter: setName, type: 'text', required: true, placeholder: '' },
                    { id: 'organization', label: 'Organization', value: organization, setter: setOrganization, type: 'text', required: true, placeholder: '' },
                    { id: 'role', label: 'Role', value: role, setter: setRole, type: 'text', required: true, placeholder: '' },
                    { id: 'contact', label: 'Contact Info', value: contact, setter: setContact, type: 'text', required: true, placeholder: 'Email or phone number' },
                  ].map((field, i) => (
                    <motion.div key={field.id} custom={i} variants={fieldVariants}>
                      <label htmlFor={field.id} className={labelClass}>
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </motion.div>
                  ))}

                  <motion.div custom={4} variants={fieldVariants}>
                    <label htmlFor="domain" className={labelClass}>
                      Domain
                    </label>
                    <select
                      id="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as Domain)}
                      className={inputClass}
                    >
                      <option>Procurement</option>
                      <option>Legal</option>
                      <option>Compliance</option>
                      <option>Governance</option>
                    </select>
                  </motion.div>

                  <motion.div custom={5} variants={fieldVariants}>
                    <label htmlFor="context" className={labelClass}>
                      Brief context{' '}
                      <span className="normal-case font-light text-neutral-400 dark:text-neutral-600 tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                  </motion.div>

                  {message && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm font-light ${
                        isError ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {message}
                    </motion.p>
                  )}

                  <motion.div custom={6} variants={fieldVariants}>
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-3.5 text-base font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-50 transition-colors duration-200 rounded-md"
                    >
                      {submitting ? 'Submitting…' : 'Submit'}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
