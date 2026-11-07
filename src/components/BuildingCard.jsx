import { Check, Lock, MapPin, Star } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { BUILDING_BY_ID, MAX_BUILDING_LEVEL } from '../game/GameConfig'
import { LEVEL_BY_ID } from '../levels/levelData'
import { playSound } from '../utils/sound'

export default function BuildingCard({ buildingId, compact = false }) {
  const building = BUILDING_BY_ID[buildingId]
  const unlockedBuildings = useGameStore((state) => state.unlockedBuildings)
  const placedBuildings = useGameStore((state) => state.placedBuildings)
  const buildingLevels = useGameStore((state) => state.buildingLevels)
  const selectedBuilding = useGameStore((state) => state.selectedBuilding)
  const selectBuilding = useGameStore((state) => state.selectBuilding)
  const muted = useGameStore((state) => state.player.muted)
  const pushToast = useGameStore((state) => state.pushToast)

  if (!building) return null

  const unlocked = unlockedBuildings.includes(buildingId)
  const placed = Object.values(placedBuildings).includes(buildingId)
  const level = buildingLevels[buildingId] || 0
  const selected = selectedBuilding === buildingId
  const requiredLevel = LEVEL_BY_ID[building.levelId]

  const handleSelect = () => {
    if (!unlocked || placed) return
    selectBuilding(buildingId)
    playSound('click', muted)
    pushToast({
      type: 'info',
      message: `Tap a glowing slot on the map to place the ${building.name}.`,
    })
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-2.5 transition ${
        unlocked
          ? selected
            ? 'border-gold-300/70 bg-gold-500/15 shadow-[0_0_20px_rgba(227,189,95,0.2)]'
            : 'border-gold-500/20 bg-ink-800/60 hover:border-gold-400/50 hover:bg-ink-700/60'
          : 'border-white/5 bg-ink-900/60 opacity-70'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xl ${
            unlocked
              ? 'border-gold-500/25 bg-ink-900'
              : 'border-white/10 bg-black/30 grayscale'
          }`}
        >
          {unlocked ? building.emoji : <Lock className="h-4 w-4 text-parchment/40" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-parchment">
            {building.name}
          </p>
          {unlocked ? (
            <div className="mt-0.5 flex items-center gap-1">
              {placed ? (
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-moss-300">
                  <MapPin className="h-2.5 w-2.5" /> Placed
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-gold-300/80">
                  <Check className="h-2.5 w-2.5" /> Ready to build
                </span>
              )}
              <span className="ml-auto flex items-center gap-0.5">
                {Array.from({ length: MAX_BUILDING_LEVEL }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-2.5 w-2.5 ${
                      index < level
                        ? 'fill-gold-300 text-gold-300'
                        : 'text-gold-600/50'
                    }`}
                  />
                ))}
              </span>
            </div>
          ) : (
            <p className="mt-0.5 text-[9px] uppercase tracking-widest text-parchment/40">
              Complete Level {building.levelId} — {requiredLevel?.title}
            </p>
          )}
        </div>
      </div>

      {!compact && unlocked && !placed && (
        <button
          type="button"
          onClick={handleSelect}
          className="mt-2 w-full rounded-lg border border-gold-500/25 bg-gold-500/10 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-200 transition hover:border-gold-400/60 hover:bg-gold-500/20"
        >
          {selected ? 'Selected — tap a slot' : 'Select to place'}
        </button>
      )}
    </div>
  )
}
