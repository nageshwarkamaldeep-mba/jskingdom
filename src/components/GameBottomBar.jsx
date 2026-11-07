import { Link, useLocation } from 'react-router-dom'
import { Map, Swords, Trophy, User, Coins, ChevronRight } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { LEVELS } from '../levels/levelData'
import { BUILDING_BY_ID } from '../game/GameConfig'

const NAV = [
  { to: '/kingdom', label: 'Kingdom', icon: Map },
  { to: '/levels', label: 'Levels', icon: Swords },
  { to: '/achievements', label: 'Honors', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function GameBottomBar() {
  const location = useLocation()
  const completedLevels = useGameStore((state) => state.completedLevels)
  const gold = useGameStore((state) => state.player.gold)

  const completedCount = Object.keys(completedLevels).length
  const nextLevel = LEVELS.find((level) => !completedLevels[level.id])
  const percent = Math.round((completedCount / LEVELS.length) * 100)
  const building = nextLevel ? BUILDING_BY_ID[nextLevel.buildingId] : null

  return (
    <div className="relative z-20 flex shrink-0 items-center gap-3 border-t border-gold-500/20 bg-ink-950/90 px-3 py-2.5 backdrop-blur-md sm:px-5">
      <nav className="flex items-center gap-1 lg:hidden">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={`rounded-lg p-2 transition ${
                active
                  ? 'bg-gold-500/15 text-gold-200'
                  : 'text-parchment/45 hover:text-parchment'
              }`}
            >
              <Icon className="h-4 w-4" />
            </Link>
          )
        })}
      </nav>

      <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
        <div className="flex items-center gap-1.5 rounded-lg border border-gold-500/20 bg-ink-900/60 px-2.5 py-1.5">
          <Coins className="h-3.5 w-3.5 text-gold-300" />
          <span className="text-xs font-bold tabular-nums text-gold-200">{gold}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-parchment/45">
            <span>Kingdom Restoration</span>
            <span>{percent}%</span>
          </div>
          <div className="hp-bar h-1.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        {building && nextLevel && (
          <div className="hidden items-center gap-1.5 text-[10px] text-parchment/50 xl:flex">
            <span className="text-base">{building.emoji}</span>
            Next: {building.name}
          </div>
        )}
      </div>

      {nextLevel ? (
        <Link
          to={`/mission/${nextLevel.id}`}
          className="btn-gold ml-auto px-3 py-2 text-xs sm:px-5 sm:text-sm"
        >
          <Swords className="h-4 w-4" />
          <span className="hidden sm:inline">Start Mission {nextLevel.id}</span>
          <span className="sm:hidden">Mission {nextLevel.id}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <Link
          to="/levels"
          className="btn-gold ml-auto px-4 py-2 text-xs sm:text-sm"
        >
          <Trophy className="h-4 w-4" />
          Review Kingdom
        </Link>
      )}
    </div>
  )
}
