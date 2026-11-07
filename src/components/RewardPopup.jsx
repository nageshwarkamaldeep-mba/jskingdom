import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Coins, Sparkles, Star } from 'lucide-react'
import AnimatedNumber from './AnimatedNumber'

export default function RewardPopup({ show, reward, onClose, title = 'Trial Complete!' }) {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => {
      onClose?.()
    }, 3200)
    return () => clearTimeout(timer)
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
            className="panel-gold-edge relative w-full max-w-sm overflow-hidden rounded-2xl border border-gold-400/40 bg-ink-900 p-6 text-center shadow-[0_0_60px_rgba(227,189,95,0.25)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,230,160,0.18),transparent_60%)]" />

            <motion.div
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/50 bg-gradient-to-b from-gold-400/30 to-ink-800 shadow-[0_0_30px_rgba(227,189,95,0.35)]"
            >
              <Star className="h-8 w-8 fill-gold-300 text-gold-300" />
            </motion.div>

            <h3 className="relative mt-4 font-display text-xl font-bold gold-text">
              {title}
            </h3>
            <p className="relative mt-1 text-xs text-parchment/60">
              The kingdom rewards your knowledge.
            </p>

            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gold-500/25 bg-ink-800/80 p-3">
                <Coins className="mx-auto h-5 w-5 text-gold-300" />
                <p className="mt-1 font-display text-lg font-bold text-gold-200">
                  +<AnimatedNumber value={reward?.gold || 0} />
                </p>
                <p className="text-[9px] uppercase tracking-widest text-parchment/45">
                  Gold
                </p>
              </div>
              <div className="rounded-xl border border-sky-500/25 bg-ink-800/80 p-3">
                <Sparkles className="mx-auto h-5 w-5 text-sky-400" />
                <p className="mt-1 font-display text-lg font-bold text-sky-300">
                  +<AnimatedNumber value={reward?.xp || 0} />
                </p>
                <p className="text-[9px] uppercase tracking-widest text-parchment/45">
                  Experience
                </p>
              </div>
            </div>

            <button type="button" onClick={onClose} className="btn-gold relative mt-5 w-full py-2.5 text-sm">
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
