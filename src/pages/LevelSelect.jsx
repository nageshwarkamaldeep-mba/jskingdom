import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Coins,
  Crown,
  Lock,
  Sparkles,
  Swords,
  Trophy,
} from 'lucide-react'
import GameHeader from '../components/GameHeader'
import GameBottomBar from '../components/GameBottomBar'
import XPProgress from '../components/XPProgress'
import { useGameStore } from '../store/gameStore'
import { BUILDING_BY_ID } from '../game/GameConfig'
import { LEVELS } from '../levels/levelData'
import { getChallengesForLevel } from '../levels/questions'

export default function LevelSelect() {
  const completedLevels = useGameStore((state) => state.completedLevels)
  const completedChallenges = useGameStore((state) => state.completedChallenges)
  const gold = useGameStore((state) => state.player.gold)

  const completedCount = Object.keys(completedLevels).length
  const solvedCount = Object.keys(completedChallenges).length

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              to="/kingdom"
              className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment/45 transition hover:text-gold-200"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Kingdom
            </Link>
            <h1 className="font-display text-3xl font-bold gold-text sm:text-4xl">
              The Royal Campaign
            </h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-parchment/55">
              Ten missions stand between an empty field and the Royal Castle. Each
              level teaches a JavaScript concept through three interactive trials.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="chip">
              <Swords className="h-3 w-3" /> {completedCount}/10 levels
            </span>
            <span className="chip">
              <CheckCircle2 className="h-3 w-3" /> {solvedCount}/30 trials
            </span>
            <span className="chip">
              <Coins className="h-3 w-3" /> {gold} gold
            </span>
          </div>
        </div>

        <div className="panel mt-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-gold-500/25 bg-ink-900 p-2">
              <Crown className="h-4 w-4 text-gold-300" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-parchment/40">
                Kingdom restoration
              </p>
              <p className="text-sm font-bold text-gold-200">
                {Math.round((completedCount / LEVELS.length) * 100)}% complete
              </p>
            </div>
          </div>
          <div className="flex-1">
            <XPProgress />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((level, index) => {
            const unlocked = level.id === 1 || Boolean(completedLevels[level.id - 1])
            const completed = Boolean(completedLevels[level.id])
            const challenges = getChallengesForLevel(level.id)
            const solved = challenges.filter(
              (challenge) => completedChallenges[challenge.id],
            ).length
            const building = BUILDING_BY_ID[level.buildingId]

            return (
              <motion.article
                key={level.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={unlocked ? { y: -3 } : undefined}
                className={`panel relative flex flex-col overflow-hidden p-4 ${
                  unlocked ? '' : 'opacity-65'
                } ${completed ? 'border-moss-500/35' : ''}`}
              >
                <div className="pointer-events-none absolute -right-4 -top-6 text-8xl opacity-[0.06]">
                  {level.icon}
                </div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border text-2xl ${
                        completed
                          ? 'border-moss-500/40 bg-moss-600/15'
                          : unlocked
                            ? 'border-gold-500/30 bg-ink-900'
                            : 'border-white/10 bg-black/30 grayscale'
                      }`}
                    >
                      {unlocked ? level.icon : <Lock className="h-4 w-4 text-parchment/40" />}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-300/60">
                        Level {level.id}
                      </p>
                      <h2 className="font-display text-sm font-bold text-parchment">
                        {level.title}
                      </h2>
                    </div>
                  </div>
                  {completed && (
                    <span className="flex items-center gap-1 rounded-full border border-moss-500/35 bg-moss-600/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-moss-300">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Done
                    </span>
                  )}
                </div>

                <p className="relative mt-2 text-[11px] leading-relaxed text-parchment/55">
                  {level.description}
                </p>

                <div className="relative mt-3 flex items-center gap-1.5">
                  {challenges.map((challenge) => {
                    const done = completedChallenges[challenge.id]
                    return (
                      <div
                        key={challenge.id}
                        className={`h-1.5 flex-1 rounded-full ${
                          done ? 'bg-moss-500' : 'bg-ink-600'
                        }`}
                      />
                    )
                  })}
                  <span className="ml-1 text-[9px] text-parchment/40">
                    {solved}/3
                  </span>
                </div>

                <div className="relative mt-3 flex items-center gap-2 rounded-lg border border-gold-500/15 bg-ink-900/50 px-2 py-1.5">
                  <span className="text-base">{building.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] uppercase tracking-widest text-parchment/35">
                      Reward building
                    </p>
                    <p className="truncate text-[10px] font-semibold text-parchment/70">
                      {building.name}
                    </p>
                  </div>
                  <Sparkles className="h-3 w-3 text-gold-400/60" />
                </div>

                <div className="relative mt-auto flex gap-2 pt-3">
                  {unlocked ? (
                    <>
                      <Link
                        to={`/mission/${level.id}`}
                        className="btn-gold flex-1 py-2 text-xs"
                      >
                        {completed ? 'Practice Again' : 'Enter Mission'}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                      {completed && (
                        <Link
                          to={`/summary/${level.id}`}
                          className="btn-stone px-3 py-2 text-xs"
                          aria-label={`View level ${level.id} summary`}
                        >
                          <Trophy className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </>
                  ) : (
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 py-2 text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
                      <Lock className="h-3 w-3" />
                      Complete Level {level.id - 1}
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      </main>

      <GameBottomBar />
    </div>
  )
}
