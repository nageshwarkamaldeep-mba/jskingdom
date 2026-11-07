import { Link, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Castle,
  Flame,
  Map,
  Swords,
  Trophy,
  User,
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { ACHIEVEMENTS, BUILDING_BY_ID } from '../game/GameConfig'
import { LEVELS } from '../levels/levelData'
import { TOTAL_CHALLENGES } from '../levels/questions'
import XPProgress from './XPProgress'

const NAV = [
  { to: '/kingdom', label: 'Kingdom', icon: Map },
  { to: '/levels', label: 'Missions', icon: Swords },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const location = useLocation()
  const completedLevels = useGameStore((state) => state.completedLevels)
  const completedChallenges = useGameStore((state) => state.completedChallenges)
  const achievements = useGameStore((state) => state.achievements)
  const streak = useGameStore((state) => state.player.streak)

  const completedCount = Object.keys(completedLevels).length
  const solvedCount = Object.keys(completedChallenges).length
  const nextLevel = LEVELS.find((level) => !completedLevels[level.id])
  const rewardBuilding = nextLevel ? BUILDING_BY_ID[nextLevel.buildingId] : null

  return (
    <aside className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <nav className="space-y-1 p-3">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'border border-gold-400/40 bg-gradient-to-r from-gold-500/20 to-transparent text-gold-100 shadow-[inset_0_1px_0_rgba(255,235,180,0.08)]'
                  : 'border border-transparent text-parchment/65 hover:border-gold-500/20 hover:bg-ink-800/60 hover:text-parchment'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${active ? 'text-gold-300' : 'text-parchment/45'}`}
              />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-300 shadow-[0_0_8px_2px_rgba(227,189,95,0.6)]" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="gold-rule mx-3" />

      <div className="scroll-thin min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300/80">
              Kingdom Progress
            </h3>
            <span className="text-[10px] font-semibold text-parchment/50">
              {completedCount}/10
            </span>
          </div>
          <XPProgress />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-gold-500/15 bg-ink-800/50 p-2 text-center">
              <p className="font-display text-lg font-bold text-gold-200">
                {solvedCount}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-parchment/45">
                / {TOTAL_CHALLENGES} Trials
              </p>
            </div>
            <div className="rounded-lg border border-gold-500/15 bg-ink-800/50 p-2 text-center">
              <p className="font-display text-lg font-bold text-gold-200">
                {achievements.length}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-parchment/45">
                / {ACHIEVEMENTS.length} Honors
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gold-500/20 bg-gradient-to-b from-ink-800/80 to-ink-900/80 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-300" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200/80">
              Daily Streak
            </h3>
          </div>
          <p className="font-display text-2xl font-bold text-gold-200">
            {streak} <span className="text-sm font-normal text-parchment/50">days</span>
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-parchment/45">
            Return each day to earn bonus gold and XP.
          </p>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300/80">
            <BookOpen className="h-3 w-3" />
            Next Mission
          </h3>
          {nextLevel ? (
            <div className="rounded-xl border border-gold-500/20 bg-ink-800/60 p-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{nextLevel.icon}</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-parchment">
                    {nextLevel.title}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gold-300/70">
                    Level {nextLevel.id} · {nextLevel.topic}
                  </p>
                </div>
              </div>
              {rewardBuilding && (
                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-parchment/50">
                  <Castle className="h-3 w-3 text-gold-400/70" />
                  Unlocks {rewardBuilding.name}
                </p>
              )}
              <Link
                to={`/mission/${nextLevel.id}`}
                className="btn-gold mt-3 w-full py-2 text-xs"
              >
                Enter Mission
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-gold-500/25 bg-gold-500/10 p-3 text-center">
              <Castle className="mx-auto h-6 w-6 text-gold-300" />
              <p className="mt-1 text-xs font-semibold text-gold-200">
                All missions complete
              </p>
              <p className="text-[10px] text-parchment/50">
                Your kingdom stands eternal.
              </p>
            </div>
          )}
        </section>
      </div>
    </aside>
  )
}
