import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Coins,
  Crown,
  Footprints,
  GraduationCap,
  Hammer,
  Landmark,
  Lock,
  Trophy,
} from 'lucide-react'
import GameHeader from '../components/GameHeader'
import { useGameStore } from '../store/gameStore'
import { ACHIEVEMENTS, getPlayerLevel } from '../game/GameConfig'
import { TOTAL_CHALLENGES } from '../levels/questions'

const ICONS = {
  Footprints,
  BookOpen,
  Hammer,
  GraduationCap,
  Coins,
  Landmark,
  Crown,
}

export default function Achievements() {
  const unlocked = useGameStore((state) => state.achievements)
  const player = useGameStore((state) => state.player)
  const completedLevels = useGameStore((state) => state.completedLevels)
  const completedChallenges = useGameStore((state) => state.completedChallenges)
  const placedBuildings = useGameStore((state) => state.placedBuildings)

  const percent = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)

  const stats = [
    { label: 'Level', value: getPlayerLevel(player.xp) },
    { label: 'Gold', value: player.gold },
    { label: 'Streak', value: `${player.streak}d` },
    { label: 'Levels', value: `${Object.keys(completedLevels).length}/10` },
    {
      label: 'Trials',
      value: `${Object.keys(completedChallenges).length}/${TOTAL_CHALLENGES}`,
    },
    { label: 'Buildings', value: Object.keys(placedBuildings).length },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Link
          to="/kingdom"
          className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment/45 transition hover:text-gold-200"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Kingdom
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">
              <Trophy className="h-3 w-3" />
              Hall of Honors
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold gold-text sm:text-4xl">
              Achievements
            </h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-parchment/55">
              Every honor tells a chapter of your reign. Complete missions, build
              your kingdom and master JavaScript to claim them all.
            </p>
          </div>
          <div className="min-w-[180px]">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-parchment/45">
              <span>Unlocked</span>
              <span>
                {unlocked.length}/{ACHIEVEMENTS.length}
              </span>
            </div>
            <div className="hp-bar h-2.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gold-500/15 bg-ink-800/50 p-2.5 text-center"
            >
              <p className="font-display text-base font-bold text-gold-200">
                {stat.value}
              </p>
              <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = unlocked.includes(achievement.id)
            const Icon = ICONS[achievement.icon] || Trophy
            return (
              <motion.article
                key={achievement.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`panel relative flex items-start gap-3 overflow-hidden p-4 ${
                  isUnlocked ? 'border-gold-400/35' : ''
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                    isUnlocked
                      ? 'border-gold-400/50 bg-gradient-to-b from-gold-400/25 to-ink-800 shadow-[0_0_20px_rgba(227,189,95,0.18)]'
                      : 'border-white/10 bg-black/25'
                  }`}
                >
                  {isUnlocked ? (
                    <Icon className="h-6 w-6 text-gold-300" />
                  ) : (
                    <Lock className="h-5 w-5 text-parchment/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2
                      className={`font-display text-sm font-bold ${
                        isUnlocked ? 'text-gold-100' : 'text-parchment/55'
                      }`}
                    >
                      {achievement.name}
                    </h2>
                    {isUnlocked && (
                      <span className="rounded-full border border-moss-500/40 bg-moss-600/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-moss-300">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-parchment/50">
                    {achievement.description}
                  </p>
                </div>
                {isUnlocked && (
                  <div className="pointer-events-none absolute -right-4 -top-4 text-6xl opacity-[0.06]">
                    ✦
                  </div>
                )}
              </motion.article>
            )
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/kingdom" className="btn-gold px-6 py-2.5 text-sm">
            <Crown className="h-4 w-4" />
            Return to Your Kingdom
          </Link>
        </div>
      </main>
    </div>
  )
}
