import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Phaser from 'phaser'
import { Crown, SkipForward, Sparkles } from 'lucide-react'
import CastleScene from '../game/CastleScene'
import { useGameStore } from '../store/gameStore'

const INTRO_SECONDS = 5
const INTRO_STEPS = [
  'Surveying the realm',
  'Raising the keep',
  'Lighting the beacons',
  'Welcoming the villagers',
]

const INTRO_KINGDOM = {
  placedBuildings: {
    'slot-1': 'tent',
    'slot-2': 'gate',
    'slot-3': 'mine',
    'slot-4': 'camp',
    'slot-5': 'houses',
    'slot-6': 'watchtower',
    'slot-7': 'warehouse',
    'slot-8': 'bridge',
    'slot-9': 'walls',
    'slot-10': 'castle',
  },
  buildingLevels: {
    tent: 2,
    gate: 3,
    mine: 2,
    camp: 2,
    houses: 3,
    watchtower: 3,
    warehouse: 2,
    bridge: 2,
    walls: 3,
    castle: 3,
  },
  unlockedBuildings: [
    'tent',
    'gate',
    'mine',
    'camp',
    'houses',
    'watchtower',
    'warehouse',
    'bridge',
    'walls',
    'castle',
  ],
  selectedBuilding: null,
}

export default function Intro() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const navTimerRef = useRef(null)
  const finishedRef = useRef(false)
  const [fading, setFading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const playerName = useGameStore((state) => state.player.name)

  const finish = useCallback(
    (delay = 650) => {
      if (finishedRef.current) return
      finishedRef.current = true
      setFading(true)
      navTimerRef.current = window.setTimeout(() => {
        navigate('/kingdom', { replace: true })
      }, delay)
    },
    [navigate],
  )

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), INTRO_SECONDS * 1000 - 700)
    const navTimer = window.setTimeout(() => finish(0), INTRO_SECONDS * 1000)
    const stepTimer = window.setInterval(
      () => setStepIndex((index) => (index + 1) % INTRO_STEPS.length),
      1200,
    )

    const handleKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        finish()
      }
    }

    window.addEventListener('keydown', handleKey)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(navTimer)
      window.clearInterval(stepTimer)
      window.removeEventListener('keydown', handleKey)
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current)
    }
  }, [finish])

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const scene = new CastleScene()
    scene.introKingdom = INTRO_KINGDOM
    scene.introCinematic = true
    scene.introReducedMotion = Boolean(reducedMotion)

    const game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: containerRef.current,
      transparent: true,
      banner: false,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: containerRef.current.clientWidth || window.innerWidth,
        height: containerRef.current.clientHeight || window.innerHeight,
      },
      render: {
        antialias: true,
        roundPixels: false,
        transparent: true,
      },
      audio: { noAudio: true },
      scene: [scene],
    })

    gameRef.current = game

    return () => {
      gameRef.current = null
      game.destroy(true)
    }
  }, [])

  const step = useMemo(() => INTRO_STEPS[stepIndex], [stepIndex])

  return (
    <div className="fixed inset-0 overflow-hidden bg-ink-950">
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ filter: 'brightness(1.5) saturate(1.15)' }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,215,106,0.12),transparent_45%),radial-gradient(circle_at_50%_42%,transparent_32%,rgba(0,0,0,0.32)_100%)]" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_10px_rgba(0,0,0,0.45)]" />

      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[8vh] bg-gradient-to-b from-black via-black/90 to-transparent"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[16vh] bg-gradient-to-t from-black via-black/90 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-x-0 top-[8vh] z-20 px-4 text-center"
      >
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/40 bg-ink-950/70 shadow-[0_0_40px_rgba(227,189,95,0.28)] backdrop-blur">
          <Crown className="h-5 w-5 text-gold-300" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-gold-300/80">
          The realm awakens
        </p>
        <h1 className="mt-2 font-display text-3xl font-black tracking-[0.08em] sm:text-4xl lg:text-5xl">
          <span className="gold-text">CODE KINGDOM</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-parchment/60 sm:text-sm">
          A vision of the kingdom you will build, {playerName || 'Squire'}.
        </p>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[7vh] z-30 px-6">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-200/80">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-gold-300" />
            <span>{step}</span>
          </div>
          <div className="hp-bar mx-auto h-1.5 w-full max-w-sm overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: INTRO_SECONDS, ease: 'linear' }}
              className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-300 to-gold-100 shadow-[0_0_16px_rgba(227,189,95,0.65)]"
            />
          </div>
          <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-parchment/30">
            Preparing your kingdom
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => finish()}
        className="absolute right-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-ink-950/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-parchment/70 backdrop-blur transition hover:border-gold-400/60 hover:text-gold-200 sm:right-6 sm:top-6"
      >
        <SkipForward className="h-3.5 w-3.5" />
        Skip intro
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fading ? 1 : 0 }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 z-50 bg-ink-950"
      />
    </div>
  )
}
