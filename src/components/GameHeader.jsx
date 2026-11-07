import { Link } from 'react-router-dom'
import {
  Coins,
  Crown,
  Flame,
  Heart,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { MAX_HEARTS, getPlayerLevel } from '../game/GameConfig'
import { playSound } from '../utils/sound'
import AnimatedNumber from './AnimatedNumber'
import XPProgress from './XPProgress'

export default function GameHeader() {
  const name = useGameStore((state) => state.player.name)
  const gold = useGameStore((state) => state.player.gold)
  const xp = useGameStore((state) => state.player.xp)
  const hearts = useGameStore((state) => state.player.hearts)
  const streak = useGameStore((state) => state.player.streak)
  const muted = useGameStore((state) => state.player.muted)
  const toggleMute = useGameStore((state) => state.toggleMute)

  const level = getPlayerLevel(xp)
  const initials = (name || 'Squire')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="relative z-20 flex shrink-0 items-center gap-3 border-b border-gold-500/20 bg-ink-950/85 px-3 py-2.5 backdrop-blur-md sm:px-5">
      <Link to="/kingdom" className="flex items-center gap-2.5">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/40 bg-gradient-to-b from-gold-400/25 to-ink-800 shadow-[inset_0_1px_0_rgba(255,235,180,0.15),0_6px_16px_rgba(0,0,0,0.4)]">
          <Crown className="h-6 w-6 text-gold-300" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_10px_2px_rgba(227,189,95,0.7)]" />
        </div>
        <div className="hidden sm:block">
          <p className="font-display text-sm font-bold tracking-[0.2em] gold-text">
            CODE KINGDOM
          </p>
          <p className="text-[9px] uppercase tracking-[0.24em] text-parchment/45">
            Learn · Build · Rule
          </p>
        </div>
      </Link>

      <div className="hidden h-8 w-px bg-gold-500/20 md:block" />

      <div className="hidden items-center gap-2 md:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/30 bg-ink-800 font-display text-xs font-bold text-gold-200">
          {initials}
        </div>
        <div className="leading-tight">
          <p className="max-w-[120px] truncate text-xs font-semibold text-parchment">
            {name}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-gold-300/80">
            Level {level}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        <div className="flex items-center gap-1.5 rounded-lg border border-gold-500/25 bg-ink-900/70 px-2 py-1.5 sm:px-2.5">
          <Coins className="h-4 w-4 text-gold-300" />
          <AnimatedNumber
            value={gold}
            className="text-xs font-bold tabular-nums text-gold-200 sm:text-sm"
          />
        </div>

        <div className="hidden w-28 sm:block lg:w-40">
          <XPProgress compact showLabel={false} />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-crimson-500/25 bg-crimson-500/10 px-2 py-1.5">
          <Heart className="h-3.5 w-3.5 fill-crimson-400 text-crimson-400" />
          <span className="text-xs font-bold tabular-nums text-crimson-400">
            {hearts}
          </span>
          <span className="hidden text-[10px] text-parchment/40 sm:inline">
            /{MAX_HEARTS}
          </span>
        </div>

        <div className="hidden items-center gap-1 rounded-lg border border-orange-400/20 bg-orange-400/10 px-2 py-1.5 sm:flex">
          <Flame className="h-3.5 w-3.5 text-orange-300" />
          <span className="text-xs font-bold tabular-nums text-orange-200">
            {streak}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            toggleMute()
            playSound('click', !muted ? true : false)
          }}
          className="rounded-lg border border-gold-500/20 bg-ink-900/60 p-2 text-parchment/70 transition hover:border-gold-400/50 hover:text-gold-200"
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          title={muted ? 'Unmute sound' : 'Mute sound'}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <Link
          to="/profile"
          className="rounded-lg border border-gold-500/20 bg-ink-900/60 p-2 text-parchment/70 transition hover:border-gold-400/50 hover:text-gold-200"
          aria-label="Settings and profile"
          title="Settings and profile"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </header>
  )
}
