import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getXpProgress } from '../game/GameConfig'

export default function XPProgress({ compact = false, showLabel = true }) {
  const xp = useGameStore((state) => state.player.xp)
  const progress = getXpProgress(xp)

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-parchment/55">
          <span className="text-gold-300">Level {progress.level}</span>
          <span>
            {progress.current}/{progress.needed} XP
          </span>
        </div>
      )}
      <div className={`hp-bar relative ${compact ? 'h-2' : 'h-3'}`}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200"
          initial={false}
          animate={{ width: `${progress.percent}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        >
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]" />
        </motion.div>
      </div>
    </div>
  )
}
