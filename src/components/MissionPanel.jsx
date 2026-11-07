import { Link } from 'react-router-dom'
import {
  BookOpen,
  Coins,
  Crown,
  Gift,
  Package,
  Sparkles,
  Swords,
  Target,
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import {
  BUILDINGS,
  BUILDING_BY_ID,
  CHALLENGE_REWARD,
  LEVEL_BONUS,
} from '../game/GameConfig'
import { LEVELS } from '../levels/levelData'
import BuildingCard from './BuildingCard'

export default function MissionPanel() {
  const completedLevels = useGameStore((state) => state.completedLevels)
  const completedChallenges = useGameStore((state) => state.completedChallenges)
  const unlockedBuildings = useGameStore((state) => state.unlockedBuildings)
  const selectedBuilding = useGameStore((state) => state.selectedBuilding)

  const nextLevel = LEVELS.find((level) => !completedLevels[level.id])
  const building = nextLevel ? BUILDING_BY_ID[nextLevel.buildingId] : null
  const solvedInLevel = nextLevel
    ? nextLevel.challengeIds.filter((id) => completedChallenges[id]).length
    : 0

  const unlocked = BUILDINGS.filter((item) => unlockedBuildings.includes(item.id))
  const lockedCount = BUILDINGS.length - unlocked.length

  return (
    <aside className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gold-500/15 px-3 py-2.5">
        <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300/90">
          <Swords className="h-3.5 w-3.5" />
          Current Mission
        </h2>
        {nextLevel && (
          <span className="chip py-0.5 text-[9px]">Level {nextLevel.id}</span>
        )}
      </div>

      <div className="scroll-thin min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {nextLevel ? (
          <>
            <div className="relative overflow-hidden rounded-xl border border-gold-500/25 bg-gradient-to-br from-ink-700/90 via-ink-800/90 to-ink-900 p-3">
              <div className="pointer-events-none absolute -right-6 -top-8 text-7xl opacity-10">
                {nextLevel.icon}
              </div>
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{nextLevel.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-gold-100">
                      {nextLevel.title}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gold-300/70">
                      {nextLevel.topic}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-parchment/65">
                  {nextLevel.description}
                </p>

                <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-gold-500/15 bg-ink-950/40 p-2">
                  <Target className="mt-0.5 h-3 w-3 shrink-0 text-gold-300" />
                  <p className="text-[10px] leading-relaxed text-parchment/55">
                    {nextLevel.objective}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  {nextLevel.challengeIds.map((id, index) => {
                    const done = completedChallenges[id]
                    return (
                      <div
                        key={id}
                        className={`flex h-6 flex-1 items-center justify-center rounded-md border text-[9px] font-bold uppercase tracking-widest ${
                          done
                            ? 'border-moss-500/40 bg-moss-600/25 text-moss-300'
                            : 'border-gold-500/15 bg-ink-900/60 text-parchment/35'
                        }`}
                      >
                        {done ? '✓' : `Trial ${index + 1}`}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-parchment/50">
                  <span>{solvedInLevel}/3 trials complete</span>
                  <span className="text-gold-300/80">
                    {nextLevel.challengeIds.length - solvedInLevel} remaining
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gold-500/15 bg-ink-800/40 p-2.5">
              <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/80">
                <Gift className="h-3 w-3" />
                Available Rewards
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1.5 rounded-lg bg-ink-900/60 px-2 py-1.5">
                  <Coins className="h-3.5 w-3.5 text-gold-300" />
                  <div>
                    <p className="text-[10px] font-bold text-gold-200">
                      +{CHALLENGE_REWARD.gold}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                      per trial
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-ink-900/60 px-2 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  <div>
                    <p className="text-[10px] font-bold text-sky-300">
                      +{CHALLENGE_REWARD.xp}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                      XP per trial
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-ink-900/60 px-2 py-1.5">
                  <Crown className="h-3.5 w-3.5 text-gold-300" />
                  <div>
                    <p className="text-[10px] font-bold text-gold-200">
                      +{LEVEL_BONUS.gold}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                      level bonus
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-ink-900/60 px-2 py-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-moss-300" />
                  <div>
                    <p className="text-[10px] font-bold text-moss-300">
                      +{LEVEL_BONUS.xp}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest text-parchment/40">
                      XP bonus
                    </p>
                  </div>
                </div>
              </div>
              {building && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-gold-500/20 bg-gold-500/5 px-2 py-1.5">
                  <span className="text-lg">{building.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-widest text-gold-300/70">
                      Unlocks building
                    </p>
                    <p className="truncate text-[11px] font-semibold text-parchment">
                      {building.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Link
              to={`/mission/${nextLevel.id}`}
              className="btn-gold w-full py-2.5 text-sm"
            >
              <Swords className="h-4 w-4" />
              Start Mission
            </Link>
          </>
        ) : (
          <div className="rounded-xl border border-gold-500/30 bg-gradient-to-b from-gold-500/15 to-transparent p-4 text-center">
            <Crown className="mx-auto h-8 w-8 text-gold-300" />
            <p className="mt-2 font-display text-sm font-bold text-gold-100">
              The Kingdom is Complete
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-parchment/55">
              Every mission has been conquered. The Royal Castle flies your banner.
            </p>
            <Link to="/levels" className="btn-stone mt-3 w-full py-2 text-xs">
              Review Missions
            </Link>
          </div>
        )}

        <div className="gold-rule" />

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/80">
              <Package className="h-3 w-3" />
              Building Inventory
            </h3>
            <span className="text-[9px] text-parchment/40">
              {unlocked.length}/{BUILDINGS.length}
            </span>
          </div>

          {selectedBuilding && (
            <p className="mb-2 rounded-lg border border-gold-400/30 bg-gold-500/10 px-2 py-1.5 text-[10px] text-gold-200">
              Placement mode: tap a glowing slot on the castle map.
            </p>
          )}

          <div className="space-y-1.5">
            {unlocked.length === 0 && (
              <p className="rounded-lg border border-dashed border-gold-500/20 p-3 text-center text-[10px] text-parchment/40">
                Complete Level 1 to earn your first building.
              </p>
            )}
            {unlocked.map((item) => (
              <BuildingCard key={item.id} buildingId={item.id} compact />
            ))}
            {lockedCount > 0 && (
              <p className="pt-1 text-center text-[9px] uppercase tracking-widest text-parchment/30">
                {lockedCount} buildings still locked
              </p>
            )}
          </div>
        </section>
      </div>
    </aside>
  )
}
