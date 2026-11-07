import { useEffect, useMemo, useRef, useState } from 'react'
import Phaser from 'phaser'
import { AnimatePresence, motion } from 'framer-motion'
import { Hammer, Lock, Sparkles, Star, X } from 'lucide-react'
import CastleScene from '../game/CastleScene'
import {
  BUILDING_BY_ID,
  MAX_BUILDING_LEVEL,
  getUpgradeCost,
} from '../game/GameConfig'
import { useGameStore } from '../store/gameStore'
import { playSound } from '../utils/sound'

export default function CastleMap() {
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const [inspectSlot, setInspectSlot] = useState(null)

  const placedBuildings = useGameStore((state) => state.placedBuildings)
  const buildingLevels = useGameStore((state) => state.buildingLevels)
  const unlockedBuildings = useGameStore((state) => state.unlockedBuildings)
  const selectedBuilding = useGameStore((state) => state.selectedBuilding)
  const gold = useGameStore((state) => state.player.gold)
  const playerName = useGameStore((state) => state.player.name)

  const kingdomData = useMemo(
    () => ({
      placedBuildings,
      buildingLevels,
      unlockedBuildings,
      selectedBuilding,
    }),
    [placedBuildings, buildingLevels, unlockedBuildings, selectedBuilding],
  )

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      transparent: true,
      banner: false,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: containerRef.current.clientWidth || 800,
        height: containerRef.current.clientHeight || 520,
      },
      render: {
        antialias: true,
        roundPixels: false,
        transparent: true,
      },
      audio: { noAudio: true },
      scene: [CastleScene],
    })

    gameRef.current = game

    return () => {
      gameRef.current = null
      game.destroy(true)
    }
  }, [])

  useEffect(() => {
    const game = gameRef.current
    if (!game) return
    if (game.registry) game.registry.set('kingdom', kingdomData)
    game.events.emit('kingdom-update', kingdomData)
  }, [kingdomData])

  useEffect(() => {
    const game = gameRef.current
    if (!game) return

    const handleSlotClick = (slotId) => {
      const state = useGameStore.getState()
      const occupied = state.placedBuildings[slotId]

      if (occupied) {
        setInspectSlot(slotId)
        playSound('click', state.player.muted)
        return
      }

      if (!state.selectedBuilding) {
        state.pushToast({
          type: 'info',
          message: 'Choose a building from your inventory, then tap a glowing slot.',
        })
        return
      }

      const result = state.placeBuilding(slotId)
      if (result.ok) {
        setInspectSlot(slotId)
        playSound('unlock', state.player.muted)
      } else {
        state.pushToast({ type: 'error', message: result.reason })
        playSound('wrong', state.player.muted)
      }
    }

    game.events.on('slot-click', handleSlotClick)
    return () => {
      game.events.off('slot-click', handleSlotClick)
    }
  }, [])

  const inspectedBuildingId = inspectSlot ? placedBuildings[inspectSlot] : null
  const inspectedBuilding = inspectedBuildingId
    ? BUILDING_BY_ID[inspectedBuildingId]
    : null
  const inspectedLevel = inspectedBuildingId
    ? buildingLevels[inspectedBuildingId] || 1
    : 1
  const upgradeCost = getUpgradeCost(inspectedLevel)
  const canUpgrade =
    inspectedLevel < MAX_BUILDING_LEVEL && gold >= (upgradeCost || Infinity)

  const selected = selectedBuilding ? BUILDING_BY_ID[selectedBuilding] : null

  const handleUpgrade = () => {
    if (!inspectedBuildingId) return
    const state = useGameStore.getState()
    const result = state.upgradeBuilding(inspectedBuildingId)
    if (result.ok) {
      playSound('coin', state.player.muted)
    } else {
      state.pushToast({ type: 'error', message: result.reason })
      playSound('wrong', state.player.muted)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gold-500/20 bg-ink-950">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,230,160,0.06),transparent_55%)]" />

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-gold-500/25 bg-ink-950/70 px-3 py-1.5 backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-gold-300" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-200/90">
          {playerName}'s Kingdom
        </span>
      </div>

      {Object.keys(placedBuildings).length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4">
          <div className="rounded-xl border border-gold-500/20 bg-ink-950/75 px-4 py-2 text-center text-xs text-parchment/70 backdrop-blur">
            Complete missions to unlock buildings, then place them on the glowing slots.
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-gold-400/40 bg-ink-900/90 px-3 py-2 shadow-xl backdrop-blur"
          >
            <span className="text-lg">{selected.emoji}</span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-gold-300/80">
                Placing
              </p>
              <p className="truncate text-sm font-semibold text-parchment">
                {selected.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => useGameStore.getState().clearSelectedBuilding()}
              className="rounded-lg border border-gold-500/20 p-1.5 text-parchment/70 transition hover:border-gold-400/60 hover:text-gold-200"
              aria-label="Cancel placement"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {inspectedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="absolute bottom-4 left-4 w-[min(92%,320px)] overflow-hidden rounded-xl border border-gold-500/30 bg-ink-900/95 shadow-2xl backdrop-blur"
          >
            <div className="flex items-start gap-3 border-b border-gold-500/15 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold-500/25 bg-ink-800 text-2xl">
                {inspectedBuilding.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold text-gold-200">
                  {inspectedBuilding.name}
                </p>
                <div className="mt-0.5 flex items-center gap-1 text-gold-300">
                  {Array.from({ length: MAX_BUILDING_LEVEL }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-3 w-3 ${
                        index < inspectedLevel
                          ? 'fill-gold-300 text-gold-300'
                          : 'text-gold-600/50'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[10px] uppercase tracking-widest text-parchment/50">
                    Level {inspectedLevel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectSlot(null)}
                className="rounded-lg p-1 text-parchment/60 transition hover:bg-ink-700 hover:text-parchment"
                aria-label="Close building info"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-3">
              <p className="text-xs leading-relaxed text-parchment/70">
                {inspectedBuilding.description}
              </p>
              {inspectedLevel < MAX_BUILDING_LEVEL ? (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={!canUpgrade}
                  className="btn-gold w-full py-2 text-sm"
                >
                  <Hammer className="h-4 w-4" />
                  Upgrade — {upgradeCost} gold
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-gold-500/25 bg-gold-500/10 py-2 text-xs font-semibold uppercase tracking-widest text-gold-200">
                  <Star className="h-3.5 w-3.5 fill-gold-300" />
                  Fully upgraded
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-4 right-4 hidden items-center gap-2 rounded-lg border border-gold-500/15 bg-ink-950/60 px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-parchment/50 backdrop-blur sm:flex">
        <Lock className="h-3 w-3" />
        Click buildings to inspect
      </div>
    </div>
  )
}
