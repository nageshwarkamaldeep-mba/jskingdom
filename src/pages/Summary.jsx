import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Castle,
  Check,
  Coins,
  Crown,
  Sparkles,
  Swords,
  Trophy,
} from 'lucide-react'
import GameHeader from '../components/GameHeader'
import AnimatedNumber from '../components/AnimatedNumber'
import { useGameStore } from '../store/gameStore'
import {
  BUILDING_BY_ID,
  CHALLENGE_REWARD,
  LEVEL_BONUS,
} from '../game/GameConfig'
import { LEVEL_BY_ID } from '../levels/levelData'

export default function Summary() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const numericLevel = Number(levelId)
  const level = LEVEL_BY_ID[numericLevel]

  const completedLevels = useGameStore((state) => state.completedLevels)
  const placedBuildings = useGameStore((state) => state.placedBuildings)
  const selectBuilding = useGameStore((state) => state.selectBuilding)
  const pushToast = useGameStore((state) => state.pushToast)

  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!level) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="panel max-w-sm p-6 text-center">
          <Trophy className="mx-auto h-8 w-8 text-gold-300" />
          <h1 className="mt-3 font-display text-xl font-bold text-parchment">
            Summary not found
          </h1>
          <Link to="/levels" className="btn-gold mt-4 w-full py-2 text-sm">
            Back to Missions
          </Link>
        </div>
      </div>
    )
  }

  const completed = Boolean(completedLevels[level.id])
  if (!completed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="panel max-w-sm p-6 text-center">
          <Swords className="mx-auto h-8 w-8 text-gold-300" />
          <h1 className="mt-3 font-display text-xl font-bold text-parchment">
            This level is not complete
          </h1>
          <p className="mt-1 text-xs text-parchment/55">
            Finish all three trials of “{level.title}” to see your summary.
          </p>
          <Link to={`/mission/${level.id}`} className="btn-gold mt-4 w-full py-2 text-sm">
            Continue Mission
          </Link>
        </div>
      </div>
    )
  }

  const building = BUILDING_BY_ID[level.buildingId]
  const placed = Object.values(placedBuildings).includes(level.buildingId)
  const totalGold =
    level.challengeIds.length * CHALLENGE_REWARD.gold + LEVEL_BONUS.gold
  const totalXp = level.challengeIds.length * CHALLENGE_REWARD.xp + LEVEL_BONUS.xp
  const nextLevel = LEVEL_BY_ID[level.id + 1]
  const isFinal = level.id === 10

  const handlePlace = () => {
    if (!placed) {
      selectBuilding(level.buildingId)
      pushToast({
        type: 'info',
        message: `Tap a glowing slot to place the ${building.name}.`,
      })
    }
    navigate('/kingdom')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader />

      {completed && (
        <Confetti
          width={size.width}
          height={size.height}
          numberOfPieces={260}
          recycle={false}
          gravity={0.16}
          opacity={0.9}
          colors={['#e3bd5f', '#f6e6b4', '#b6423a', '#7fb069', '#5aa7c4', '#cfa03c']}
          style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}
        />
      )}

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-7">
        <Link
          to="/levels"
          className="mb-4 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment/45 transition hover:text-gold-200"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Campaign
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel-gold-edge relative overflow-hidden rounded-2xl border border-gold-400/35 bg-gradient-to-b from-ink-700/90 to-ink-900 p-6 text-center"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,230,160,0.18),transparent_60%)]" />

          <motion.div
            initial={{ scale: 0.6, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold-300/50 bg-gradient-to-b from-gold-400/30 to-ink-800 shadow-[0_0_40px_rgba(227,189,95,0.35)]"
          >
            {isFinal ? (
              <Crown className="h-10 w-10 fill-gold-300 text-gold-300" />
            ) : (
              <Trophy className="h-10 w-10 text-gold-300" />
            )}
          </motion.div>

          <p className="relative mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-gold-300/80">
            Level {level.id} Complete
          </p>
          <h1 className="relative mt-1 font-display text-3xl font-bold gold-text">
            {isFinal ? 'You Are the King!' : level.title}
          </h1>
          <p className="relative mx-auto mt-2 max-w-md text-xs leading-relaxed text-parchment/60">
            {isFinal
              ? 'The Royal Castle rises above Code Kingdom. You have mastered variables, types, operators, conditions, loops, functions, arrays, objects and debugging.'
              : level.tagline}
          </p>

          <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-gold-500/25 bg-ink-800/80 p-3">
              <Coins className="mx-auto h-4 w-4 text-gold-300" />
              <p className="mt-1 font-display text-lg font-bold text-gold-200">
                +<AnimatedNumber value={totalGold} />
              </p>
              <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                Gold earned
              </p>
            </div>
            <div className="rounded-xl border border-sky-500/25 bg-ink-800/80 p-3">
              <Sparkles className="mx-auto h-4 w-4 text-sky-400" />
              <p className="mt-1 font-display text-lg font-bold text-sky-300">
                +<AnimatedNumber value={totalXp} />
              </p>
              <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                XP earned
              </p>
            </div>
            <div className="rounded-xl border border-moss-500/25 bg-ink-800/80 p-3">
              <Check className="mx-auto h-4 w-4 text-moss-300" />
              <p className="mt-1 font-display text-lg font-bold text-moss-300">
                {level.challengeIds.length}
              </p>
              <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                Trials solved
              </p>
            </div>
            <div className="rounded-xl border border-gold-500/25 bg-ink-800/80 p-3">
              <Castle className="mx-auto h-4 w-4 text-gold-300" />
              <p className="mt-1 font-display text-lg font-bold text-gold-200">
                {building.emoji}
              </p>
              <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                Unlocked
              </p>
            </div>
          </div>
        </motion.section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="panel p-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-ink-900 text-2xl">
                {building.emoji}
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-gold-300/70">
                  New building unlocked
                </p>
                <h2 className="font-display text-sm font-bold text-parchment">
                  {building.name}
                </h2>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-parchment/55">
              {building.description}
            </p>
            <p className="mt-1 text-[10px] italic leading-relaxed text-gold-300/50">
              “{building.flavor}”
            </p>
            <button type="button" onClick={handlePlace} className="btn-gold mt-3 w-full py-2 text-xs">
              <Castle className="h-3.5 w-3.5" />
              {placed ? 'View It in the Kingdom' : 'Place in Kingdom'}
            </button>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="panel p-4"
          >
            <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/80">
              <BookOpen className="h-3.5 w-3.5" />
              Learning Summary
            </h2>
            <ul className="mt-2 space-y-1.5">
              {level.summary.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-parchment/65">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-moss-300" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {nextLevel ? (
            <Link to={`/mission/${nextLevel.id}`} className="btn-gold flex-1 py-2.5 text-sm">
              <Swords className="h-4 w-4" />
              Next: {nextLevel.title}
            </Link>
          ) : (
            <Link to="/achievements" className="btn-gold flex-1 py-2.5 text-sm">
              <Trophy className="h-4 w-4" />
              View Your Honors
            </Link>
          )}
          <Link to="/kingdom" className="btn-stone flex-1 py-2.5 text-sm">
            <Castle className="h-4 w-4" />
            Return to Kingdom
          </Link>
          <Link
            to={`/mission/${level.id}`}
            className="btn-stone px-4 py-2.5 text-sm"
          >
            Review Trials
          </Link>
        </div>
      </main>
    </div>
  )
}
