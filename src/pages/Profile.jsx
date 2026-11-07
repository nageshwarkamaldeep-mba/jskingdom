import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Castle,
  Coins,
  Crown,
  Flame,
  Heart,
  RotateCcw,
  Save,
  Settings,
  ShieldAlert,
  Sparkles,
  Trophy,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react'
import GameHeader from '../components/GameHeader'
import { useGameStore } from '../store/gameStore'
import { MAX_HEARTS, getPlayerLevel } from '../game/GameConfig'
import { TOTAL_CHALLENGES } from '../levels/questions'
import { playSound } from '../utils/sound'

export default function Profile() {
  const navigate = useNavigate()
  const player = useGameStore((state) => state.player)
  const setPlayerName = useGameStore((state) => state.setPlayerName)
  const toggleMute = useGameStore((state) => state.toggleMute)
  const reopenTutorial = useGameStore((state) => state.reopenTutorial)
  const resetProgress = useGameStore((state) => state.resetProgress)
  const pushToast = useGameStore((state) => state.pushToast)
  const completedLevels = useGameStore((state) => state.completedLevels)
  const completedChallenges = useGameStore((state) => state.completedChallenges)
  const achievements = useGameStore((state) => state.achievements)
  const placedBuildings = useGameStore((state) => state.placedBuildings)

  const [name, setName] = useState(player.name)
  const [confirmReset, setConfirmReset] = useState(false)

  const level = getPlayerLevel(player.xp)
  const initials = (player.name || 'Squire')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const saveName = () => {
    setPlayerName(name)
    playSound('coin', player.muted)
    pushToast({
      type: 'success',
      title: 'Name saved',
      message: `Your ruler is now known as ${name.trim() || 'Squire'}.`,
    })
  }

  const handleReset = () => {
    resetProgress()
    setConfirmReset(false)
    navigate('/welcome')
  }

  const stats = [
    { icon: Crown, label: 'Ruler level', value: level, color: 'text-gold-300' },
    { icon: Sparkles, label: 'Total XP', value: player.xp, color: 'text-sky-300' },
    { icon: Coins, label: 'Gold', value: player.gold, color: 'text-gold-300' },
    {
      icon: Heart,
      label: 'Hearts',
      value: `${player.hearts}/${MAX_HEARTS}`,
      color: 'text-crimson-400',
    },
    { icon: Flame, label: 'Streak', value: `${player.streak}d`, color: 'text-orange-300' },
    {
      icon: Castle,
      label: 'Levels',
      value: `${Object.keys(completedLevels).length}/10`,
      color: 'text-moss-300',
    },
    {
      icon: BookOpen,
      label: 'Trials',
      value: `${Object.keys(completedChallenges).length}/${TOTAL_CHALLENGES}`,
      color: 'text-gold-300',
    },
    {
      icon: Trophy,
      label: 'Honors',
      value: achievements.length,
      color: 'text-purple-300',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
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
              <User className="h-3 w-3" />
              Royal Profile
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold gold-text sm:text-4xl">
              {player.name}
            </h1>
            <p className="mt-1 text-xs text-parchment/55">
              Level {level} ruler · {Object.keys(placedBuildings).length} buildings
              raised
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/40 bg-gradient-to-b from-gold-400/25 to-ink-800 font-display text-xl font-bold text-gold-200 shadow-[0_0_30px_rgba(227,189,95,0.18)]">
            {initials}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <section className="panel p-4">
            <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/80">
              <Crown className="h-3.5 w-3.5" />
              Ruler Identity
            </h2>
            <label
              htmlFor="profile-name"
              className="mt-3 block text-[10px] uppercase tracking-widest text-parchment/40"
            >
              Display name
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="profile-name"
                type="text"
                value={name}
                maxLength={20}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') saveName()
                }}
                className="min-w-0 flex-1 rounded-xl border border-gold-500/25 bg-ink-900/80 px-3 py-2.5 font-display text-sm text-parchment outline-none transition focus:border-gold-400/70"
              />
              <button type="button" onClick={saveName} className="btn-gold px-4 py-2.5 text-xs">
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-parchment/35">
              Your progress is stored locally in this browser. Clearing browser data
              will remove the save.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {stats.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-gold-500/15 bg-ink-800/50 px-2.5 py-2"
                >
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                  <div>
                    <p className="text-xs font-bold text-parchment/85">{value}</p>
                    <p className="text-[8px] uppercase tracking-widest text-parchment/35">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="panel p-4">
              <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/80">
                <Settings className="h-3.5 w-3.5" />
                Settings
              </h2>

              <button
                type="button"
                onClick={() => {
                  toggleMute()
                  playSound('click', !player.muted)
                }}
                className="mt-3 flex w-full items-center gap-2.5 rounded-xl border border-gold-500/20 bg-ink-800/50 px-3 py-2.5 text-left transition hover:border-gold-400/45"
              >
                <div className="rounded-lg bg-ink-900 p-1.5">
                  {player.muted ? (
                    <VolumeX className="h-4 w-4 text-parchment/50" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-gold-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-parchment">Sound effects</p>
                  <p className="text-[10px] text-parchment/40">
                    {player.muted ? 'Muted' : 'Enabled'}
                  </p>
                </div>
                <span
                  className={`h-5 w-9 rounded-full border p-0.5 transition ${
                    player.muted
                      ? 'border-white/10 bg-ink-900'
                      : 'border-gold-400/50 bg-gold-500/30'
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full transition ${
                      player.muted ? 'translate-x-0 bg-parchment/40' : 'translate-x-4 bg-gold-300'
                    }`}
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  reopenTutorial()
                  navigate('/kingdom')
                }}
                className="mt-2 flex w-full items-center gap-2.5 rounded-xl border border-gold-500/20 bg-ink-800/50 px-3 py-2.5 text-left transition hover:border-gold-400/45"
              >
                <div className="rounded-lg bg-ink-900 p-1.5">
                  <BookOpen className="h-4 w-4 text-gold-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-parchment">Replay tutorial</p>
                  <p className="text-[10px] text-parchment/40">
                    Review how the kingdom works
                  </p>
                </div>
              </button>
            </div>

            <div className="panel border-crimson-500/25 p-4">
              <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-crimson-400/90">
                <ShieldAlert className="h-3.5 w-3.5" />
                Danger Zone
              </h2>
              <p className="mt-2 text-[10px] leading-relaxed text-parchment/45">
                Reset every level, building, reward and achievement. Your ruler name
                is kept. This cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-crimson-500/35 bg-crimson-500/10 px-3 py-2 text-xs font-semibold text-crimson-400 transition hover:bg-crimson-500/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset all progress
              </button>
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {confirmReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setConfirmReset(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="panel w-full max-w-sm p-5 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-crimson-500/40 bg-crimson-500/15">
                <ShieldAlert className="h-6 w-6 text-crimson-400" />
              </div>
              <h2 className="mt-3 font-display text-lg font-bold text-parchment">
                Reset your kingdom?
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-parchment/55">
                All levels, trials, gold, buildings and achievements will be erased.
                This action cannot be undone.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="btn-stone flex-1 py-2 text-xs"
                >
                  Keep Progress
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded-xl border border-crimson-500/50 bg-crimson-500/20 px-3 py-2 text-xs font-bold text-crimson-300 transition hover:bg-crimson-500/30"
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
