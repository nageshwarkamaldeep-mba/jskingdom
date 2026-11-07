import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Castle,
  Code2,
  Coins,
  Crown,
  Flame,
  Play,
  Sparkles,
  Swords,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { getPlayerLevel } from '../game/GameConfig'
import { playSound } from '../utils/sound'
import CastleIllustration from '../components/CastleIllustration'

const FEATURES = [
  {
    icon: Swords,
    title: '10 Story Levels',
    text: 'From your first camp to the Royal Castle, each mission teaches a real JavaScript concept.',
  },
  {
    icon: Code2,
    title: '30 Hands-on Trials',
    text: 'Multiple choice, code completion, bug hunting and line arranging keep every lesson active.',
  },
  {
    icon: Castle,
    title: 'A Living Kingdom',
    text: 'Every solved challenge earns gold and XP. Every level raises a new building on your map.',
  },
]

export default function Welcome() {
  const navigate = useNavigate()
  const playerName = useGameStore((state) => state.player.name)
  const setPlayerName = useGameStore((state) => state.setPlayerName)
  const gold = useGameStore((state) => state.player.gold)
  const xp = useGameStore((state) => state.player.xp)
  const streak = useGameStore((state) => state.player.streak)
  const muted = useGameStore((state) => state.player.muted)
  const toggleMute = useGameStore((state) => state.toggleMute)
  const reopenTutorial = useGameStore((state) => state.reopenTutorial)
  const completedLevels = useGameStore((state) => state.completedLevels)
  const completedChallenges = useGameStore((state) => state.completedChallenges)

  const [rulerName, setRulerName] = useState(playerName || '')
  const hasProgress =
    Object.keys(completedLevels).length > 0 ||
    Object.keys(completedChallenges).length > 0
  const level = getPlayerLevel(xp)

  const start = () => {
    setPlayerName(rulerName)
    playSound('unlock', muted)
    navigate('/intro')
  }

  const howToPlay = () => {
    setPlayerName(rulerName)
    reopenTutorial()
    navigate('/intro')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_0%,rgba(227,189,95,0.12),transparent_60%),radial-gradient(700px_500px_at_0%_100%,rgba(90,143,74,0.15),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/40 bg-gradient-to-b from-gold-400/25 to-ink-800">
              <Crown className="h-5 w-5 text-gold-300" />
            </div>
            <div>
              <p className="font-display text-xs font-bold tracking-[0.22em] gold-text">
                CODE KINGDOM
              </p>
              <p className="text-[9px] uppercase tracking-[0.24em] text-parchment/40">
                JavaScript Adventure
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleMute()
              playSound('click', !muted)
            }}
            className="rounded-lg border border-gold-500/20 bg-ink-900/60 p-2 text-parchment/60 transition hover:border-gold-400/50 hover:text-gold-200"
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </header>

        <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <span className="chip">
              <Sparkles className="h-3 w-3" />
              Build a kingdom with JavaScript
            </span>

            <h1 className="mt-4 font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gold-text">CODE</span>
              <br />
              <span className="shimmer-text">KINGDOM</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-parchment/65 sm:text-base">
              A dark age has fallen over the realm of code. Learn JavaScript one
              trial at a time, earn gold and XP, and raise a living castle from an
              empty field.
            </p>

            {hasProgress && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="chip">
                  <Crown className="h-3 w-3" /> Level {level}
                </span>
                <span className="chip">
                  <Coins className="h-3 w-3" /> {gold} gold
                </span>
                <span className="chip">
                  <Flame className="h-3 w-3" /> {streak} day streak
                </span>
                <span className="chip">
                  <Swords className="h-3 w-3" /> {Object.keys(completedLevels).length}/10 levels
                </span>
              </div>
            )}

            <div className="mt-6 max-w-md">
              <label
                htmlFor="ruler-name"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300/80"
              >
                Name your ruler
              </label>
              <input
                id="ruler-name"
                type="text"
                value={rulerName}
                maxLength={20}
                onChange={(event) => setRulerName(event.target.value)}
                placeholder="Squire"
                className="w-full rounded-xl border border-gold-500/25 bg-ink-900/80 px-4 py-3 font-display text-base text-parchment outline-none transition placeholder:text-parchment/25 focus:border-gold-400/70 focus:shadow-[0_0_20px_rgba(227,189,95,0.15)]"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" onClick={start} className="btn-gold px-6 py-3 text-base">
                <Play className="h-4 w-4" />
                {hasProgress ? 'Continue Your Reign' : 'Begin Your Quest'}
              </button>
              <button type="button" onClick={howToPlay} className="btn-stone px-5 py-3 text-sm">
                <BookOpen className="h-4 w-4" />
                How to Play
              </button>
            </div>

            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-parchment/30">
              No account needed · Progress saves in your browser
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-gold-500/25 bg-ink-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <CastleIllustration />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-2 top-8 rounded-xl border border-gold-400/35 bg-ink-900/95 px-3 py-2 shadow-xl backdrop-blur sm:-left-6"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gold-500/15 p-1.5">
                  <Coins className="h-4 w-4 text-gold-300" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-parchment/40">
                    Reward
                  </p>
                  <p className="text-sm font-bold text-gold-200">+150 Gold</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-2 bottom-16 rounded-xl border border-sky-500/30 bg-ink-900/95 px-3 py-2 shadow-xl backdrop-blur sm:-right-5"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-sky-500/15 p-1.5">
                  <Sparkles className="h-4 w-4 text-sky-300" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-parchment/40">
                    Experience
                  </p>
                  <p className="text-sm font-bold text-sky-300">+20 XP</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-3 left-8 flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-ink-900/95 px-3 py-1.5 shadow-xl backdrop-blur"
            >
              <Crown className="h-3.5 w-3.5 text-gold-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-200">
                Royal Castle awaits
              </span>
            </motion.div>
          </motion.section>
        </main>

        <footer className="grid gap-3 pb-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="panel-soft flex items-start gap-3 p-3.5"
            >
              <div className="rounded-lg border border-gold-500/20 bg-ink-900/70 p-2">
                <Icon className="h-4 w-4 text-gold-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-parchment">{title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-parchment/50">
                  {text}
                </p>
              </div>
            </motion.div>
          ))}
        </footer>
      </div>
    </div>
  )
}
