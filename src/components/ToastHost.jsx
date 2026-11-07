import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Coins,
  Info,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'

const ICONS = {
  info: Info,
  success: CheckCircle2,
  error: XCircle,
  reward: Coins,
  unlock: Sparkles,
  achievement: Trophy,
}

const STYLES = {
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  success: 'border-moss-500/30 bg-moss-600/15 text-moss-300',
  error: 'border-crimson-500/35 bg-crimson-500/10 text-crimson-400',
  reward: 'border-gold-400/35 bg-gold-500/10 text-gold-200',
  unlock: 'border-gold-400/40 bg-gold-500/15 text-gold-200',
  achievement: 'border-purple-400/35 bg-purple-500/10 text-purple-300',
}

function ToastItem({ toast }) {
  const dismissToast = useGameStore((state) => state.dismissToast)
  const Icon = ICONS[toast.type] || Info

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), 4200)
    return () => clearTimeout(timer)
  }, [toast.id, dismissToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      className={`pointer-events-auto flex w-[min(92vw,340px)] items-start gap-2.5 rounded-xl border p-3 shadow-2xl backdrop-blur-md ${
        STYLES[toast.type] || STYLES.info
      }`}
    >
      <div className="mt-0.5 rounded-lg bg-black/25 p-1.5">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className="text-[11px] font-bold uppercase tracking-widest">
            {toast.title}
          </p>
        )}
        <p className="text-xs leading-snug text-parchment/80">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        className="text-parchment/40 transition hover:text-parchment"
        aria-label="Dismiss notification"
      >
        <XCircle className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

export default function ToastHost() {
  const toasts = useGameStore((state) => state.toasts)

  return (
    <div className="pointer-events-none fixed right-3 top-20 z-[70] flex flex-col items-end gap-2 sm:right-5">
      <AnimatePresence mode="popLayout">
        {toasts.slice(-4).map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
