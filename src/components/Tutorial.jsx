import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Compass, Sparkles } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

const STEPS = [
  {
    icon: '👑',
    title: 'Welcome, Ruler',
    text: 'Your kingdom is empty. Every JavaScript trial you conquer raises a new building and brings your castle to life.',
  },
  {
    icon: '⚔️',
    title: 'Enter Missions',
    text: 'Each of the 10 levels teaches a real JavaScript topic through three interactive trials. Read the hints whenever you need them.',
  },
  {
    icon: '🏗️',
    title: 'Build Your Kingdom',
    text: 'Completing a level unlocks a building. Select it from the inventory, then tap a glowing slot on the map to place it.',
  },
  {
    icon: '⛏️',
    title: 'Grow and Rule',
    text: 'Spend gold to upgrade buildings, keep your daily streak alive, and unlock achievements on your way to the Royal Castle.',
  },
]

export default function Tutorial() {
  const tutorialSeen = useGameStore((state) => state.tutorialSeen)
  const markTutorialSeen = useGameStore((state) => state.markTutorialSeen)
  const [step, setStep] = useState(0)

  const close = () => markTutorialSeen()
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <AnimatePresence>
      {!tutorialSeen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="panel-gold-edge relative w-full max-w-md overflow-hidden rounded-2xl border border-gold-400/40 bg-ink-900 p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,230,160,0.15),transparent_55%)]" />

            <div className="relative flex items-center justify-between">
              <span className="chip">
                <Compass className="h-3 w-3" />
                Royal Tutorial
              </span>
              <button
                type="button"
                onClick={close}
                className="text-[10px] uppercase tracking-widest text-parchment/40 transition hover:text-parchment"
              >
                Skip
              </button>
            </div>

            <div className="relative mt-5 flex flex-col items-center text-center">
              <motion.div
                key={current.icon}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gold-500/30 bg-gradient-to-b from-ink-700 to-ink-900 text-4xl shadow-[inset_0_1px_0_rgba(255,235,180,0.1)]"
              >
                {current.icon}
              </motion.div>
              <h3 className="mt-4 font-display text-lg font-bold text-gold-100">
                {current.title}
              </h3>
              <p className="mt-2 min-h-[60px] text-xs leading-relaxed text-parchment/65">
                {current.text}
              </p>
            </div>

            <div className="relative mt-3 flex items-center justify-center gap-1.5">
              {STEPS.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setStep(index)}
                  aria-label={`Tutorial step ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === step ? 'w-6 bg-gold-300' : 'w-1.5 bg-gold-600/50'
                  }`}
                />
              ))}
            </div>

            <div className="relative mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                disabled={step === 0}
                className="btn-stone flex-1 py-2 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => (isLast ? close() : setStep((value) => value + 1))}
                className="btn-gold flex-[1.4] py-2 text-xs"
              >
                {isLast ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Begin Ruling
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
