import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Coins,
  Crown,
  Heart,
  Lock,
  Swords,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react'
import ChallengeRenderer from '../components/ChallengeRenderer'
import RewardPopup from '../components/RewardPopup'
import AnimatedNumber from '../components/AnimatedNumber'
import { useGameStore } from '../store/gameStore'
import { MAX_HEARTS } from '../game/GameConfig'
import { LEVEL_BY_ID } from '../levels/levelData'
import { getChallengesForLevel } from '../levels/questions'
import { playSound } from '../utils/sound'

const TYPE_LABELS = {
  mcq: 'Multiple Choice',
  complete: 'Complete the Code',
  debug: 'Find the Error',
  arrange: 'Arrange the Code',
}

export default function Mission() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const numericLevel = Number(levelId)
  const level = LEVEL_BY_ID[numericLevel]

  const completedChallenges = useGameStore((state) => state.completedChallenges)
  const completedLevels = useGameStore((state) => state.completedLevels)
  const gold = useGameStore((state) => state.player.gold)
  const hearts = useGameStore((state) => state.player.hearts)
  const muted = useGameStore((state) => state.player.muted)
  const toggleMute = useGameStore((state) => state.toggleMute)
  const healHearts = useGameStore((state) => state.healHearts)

  const challenges = useMemo(
    () => (level ? getChallengesForLevel(level.id) : []),
    [level],
  )

  const [activeIndex, setActiveIndex] = useState(() => {
    const firstUnsolved = challenges.findIndex(
      (challenge) => !completedChallenges[challenge.id],
    )
    return firstUnsolved === -1 ? 0 : firstUnsolved
  })
  const [reward, setReward] = useState(null)
  const [showReward, setShowReward] = useState(false)

  if (!level) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="panel max-w-sm p-6 text-center">
          <Lock className="mx-auto h-8 w-8 text-gold-300" />
          <h1 className="mt-3 font-display text-xl font-bold text-parchment">
            Mission not found
          </h1>
          <p className="mt-1 text-xs text-parchment/55">
            That level does not exist in the royal campaign.
          </p>
          <Link to="/levels" className="btn-gold mt-4 w-full py-2 text-sm">
            Back to Missions
          </Link>
        </div>
      </div>
    )
  }

  const unlocked = level.id === 1 || Boolean(completedLevels[level.id - 1])
  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="panel max-w-sm p-6 text-center">
          <Lock className="mx-auto h-8 w-8 text-gold-300" />
          <h1 className="mt-3 font-display text-xl font-bold text-parchment">
            This gate is sealed
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-parchment/55">
            Complete Level {level.id - 1} to unlock “{level.title}”.
          </p>
          <Link to="/levels" className="btn-gold mt-4 w-full py-2 text-sm">
            View Campaign
          </Link>
        </div>
      </div>
    )
  }

  const challenge = challenges[activeIndex]
  const alreadySolved = Boolean(completedChallenges[challenge.id])
  const solvedCount = challenges.filter((item) => completedChallenges[item.id]).length
  const allSolved = solvedCount === challenges.length
  const levelCompleted = Boolean(completedLevels[level.id])
  const remaining = challenges.length - solvedCount

  const handleSolved = () => {
    const state = useGameStore.getState()
    const result = state.completeChallenge(challenge.id, {
      gold: challenge.gold,
      xp: challenge.xp,
    })
    if (result.awarded) {
      setReward({ gold: result.gold, xp: result.xp })
      setShowReward(true)
    } else {
      state.pushToast({
        type: 'info',
        message: 'Practice complete — this reward was already claimed.',
      })
    }
  }

  const handleWrong = () => {
    const state = useGameStore.getState()
    const remainingHearts = state.loseHeart()
    if (remainingHearts === 0) {
      state.pushToast({
        type: 'info',
        title: 'Rest, ruler',
        message: 'Your hearts are empty. Rest at camp to restore them — no progress is lost.',
      })
    }
  }

  const handleClaimLevel = () => {
    const state = useGameStore.getState()
    if (!state.completedLevels[level.id]) {
      state.completeLevel(level.id)
      playSound('level', state.player.muted)
    }
    navigate(`/summary/${level.id}`)
  }

  const handleContinue = () => {
    const state = useGameStore.getState()
    const nowSolved = challenges.every(
      (item) => state.completedChallenges[item.id],
    )
    if (nowSolved) {
      handleClaimLevel()
      return
    }
    const nextIndex = challenges.findIndex(
      (item) => !state.completedChallenges[item.id],
    )
    if (nextIndex >= 0) setActiveIndex(nextIndex)
  }

  const continueLabel = allSolved
    ? levelCompleted
      ? 'View Level Summary'
      : 'Claim Level Rewards'
    : 'Next Trial'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-gold-500/20 bg-ink-950/90 px-3 py-2.5 backdrop-blur-md sm:px-5">
        <Link
          to="/levels"
          className="rounded-lg border border-gold-500/20 bg-ink-900/60 p-2 text-parchment/60 transition hover:border-gold-400/50 hover:text-gold-200"
          aria-label="Back to mission list"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-500/25 bg-ink-900 text-2xl">
          {level.icon}
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gold-300/70">
            Level {level.id} · {level.topic}
          </p>
          <h1 className="truncate font-display text-sm font-bold text-parchment sm:text-base">
            {level.title}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-gold-500/25 bg-ink-900/70 px-2 py-1.5">
            <Coins className="h-3.5 w-3.5 text-gold-300" />
            <AnimatedNumber
              value={gold}
              className="text-xs font-bold tabular-nums text-gold-200"
            />
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
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-3 py-5 sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Swords className="h-3.5 w-3.5 text-gold-300/70" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-parchment/45">
              Trial {activeIndex + 1} of {challenges.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {challenges.map((item, index) => {
              const done = completedChallenges[item.id]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition ${
                    index === activeIndex
                      ? 'border-gold-400/60 bg-gold-500/15 text-gold-200'
                      : done
                        ? 'border-moss-500/40 bg-moss-600/15 text-moss-300'
                        : 'border-gold-500/15 bg-ink-900/60 text-parchment/40 hover:border-gold-400/40'
                  }`}
                >
                  {done && <Check className="h-2.5 w-2.5" />}
                  Trial {index + 1}
                </button>
              )
            })}
          </div>
        </div>

        <div className="hp-bar mb-4 h-1.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all duration-500"
            style={{ width: `${(solvedCount / challenges.length) * 100}%` }}
          />
        </div>

        {levelCompleted && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-moss-500/30 bg-moss-600/10 px-3 py-2 text-[11px] text-moss-300">
            <Trophy className="h-3.5 w-3.5" />
            Practice mode — this level's rewards are already secured.
          </div>
        )}

        {allSolved && !levelCompleted && (
          <div className="mb-3 flex flex-col items-start gap-2 rounded-xl border border-gold-400/40 bg-gold-500/10 p-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-gold-300" />
              <p className="text-xs font-semibold text-gold-200">
                All trials complete. Claim your level rewards!
              </p>
            </div>
            <button
              type="button"
              onClick={handleClaimLevel}
              className="btn-gold ml-auto px-3 py-1.5 text-xs"
            >
              Claim Rewards
            </button>
          </div>
        )}

        {hearts === 0 && (
          <div className="mb-3 flex flex-col items-start gap-2 rounded-xl border border-crimson-500/30 bg-crimson-500/10 p-3 sm:flex-row sm:items-center">
            <p className="text-xs text-crimson-300">
              Your hearts are empty. Rest at camp to restore them.
            </p>
            <button
              type="button"
              onClick={healHearts}
              className="btn-stone ml-auto px-3 py-1.5 text-xs"
            >
              Rest and Restore
            </button>
          </div>
        )}

        <section className="panel p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="chip">{TYPE_LABELS[challenge.type]}</span>
            <span className="text-[9px] uppercase tracking-widest text-parchment/35">
              +{challenge.gold} gold · +{challenge.xp} XP
            </span>
          </div>

          <div className="mt-3">
            <h2 className="font-display text-lg font-bold text-parchment sm:text-xl">
              {challenge.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-parchment/70">
              {challenge.prompt}
            </p>
          </div>

          <div className="mt-4">
            <ChallengeRenderer
              key={challenge.id}
              challenge={challenge}
              alreadySolved={alreadySolved}
              onSolved={handleSolved}
              onWrong={handleWrong}
            />
          </div>
        </section>

        {alreadySolved && (
          <div className="mt-3 flex flex-col items-start gap-2 rounded-xl border border-moss-500/30 bg-moss-600/10 p-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-moss-300">
              <CheckCircle2 className="h-4 w-4" />
              Trial complete
            </div>
            <p className="text-[11px] text-parchment/50">
              {remaining > 0
                ? `${remaining} trial${remaining === 1 ? '' : 's'} remaining in this level.`
                : 'Every trial in this level is complete.'}
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="btn-gold ml-auto px-4 py-2 text-xs"
            >
              {continueLabel}
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-parchment/30">
          <Link to="/kingdom" className="transition hover:text-gold-200">
            Return to Kingdom
          </Link>
          <span>
            {solvedCount}/{challenges.length} trials · {level.topic}
          </span>
        </div>
      </main>

      <RewardPopup
        show={showReward}
        reward={reward}
        onClose={() => setShowReward(false)}
      />
    </div>
  )
}
