import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react'

export function HintBox({ hint, open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-gold-400/30 bg-gold-500/10 p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/90">
                Hint
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-parchment/75">
                {hint}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Feedback({ status, explanation, wrongMessage }) {
  if (!status || status === 'idle') return null
  const correct = status === 'correct'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 rounded-xl border p-3 ${
        correct
          ? 'border-moss-500/40 bg-moss-600/15'
          : 'border-crimson-500/40 bg-crimson-500/10'
      }`}
    >
      <div className="flex items-center gap-2">
        {correct ? (
          <CheckCircle2 className="h-4 w-4 text-moss-300" />
        ) : (
          <XCircle className="h-4 w-4 text-crimson-400" />
        )}
        <p
          className={`text-xs font-bold uppercase tracking-widest ${
            correct ? 'text-moss-300' : 'text-crimson-400'
          }`}
        >
          {correct ? 'Well done!' : wrongMessage || 'Not quite — try again.'}
        </p>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-parchment/70">
        {explanation}
      </p>
    </motion.div>
  )
}

export function HintButton({ open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
        open
          ? 'border-gold-400/60 bg-gold-500/20 text-gold-200'
          : 'border-gold-500/25 bg-ink-800/60 text-parchment/70 hover:border-gold-400/50 hover:text-gold-200'
      }`}
    >
      <Lightbulb className="h-3.5 w-3.5" />
      {open ? 'Hide Hint' : 'Hint'}
    </button>
  )
}
