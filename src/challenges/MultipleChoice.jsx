import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Send, X } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { playSound } from '../utils/sound'
import { Feedback, HintBox, HintButton } from './ChallengeParts'

const LETTERS = ['A', 'B', 'C', 'D']

export default function MultipleChoice({ challenge, onSolved, onWrong, alreadySolved }) {
  const muted = useGameStore((state) => state.player.muted)
  const [selected, setSelected] = useState(
    alreadySolved ? challenge.correctIndex : null,
  )
  const [status, setStatus] = useState(alreadySolved ? 'correct' : 'idle')
  const [hintOpen, setHintOpen] = useState(false)
  const solvedRef = useRef(alreadySolved)

  const choose = (index) => {
    if (status === 'correct') return
    setSelected(index)
    if (status === 'wrong') setStatus('idle')
    playSound('click', muted)
  }

  const submit = () => {
    if (selected == null || status === 'correct') return
    if (selected === challenge.correctIndex) {
      setStatus('correct')
      playSound('correct', muted)
      if (!solvedRef.current) {
        solvedRef.current = true
        onSolved?.()
      }
    } else {
      setStatus('wrong')
      playSound('wrong', muted)
      onWrong?.()
    }
  }

  return (
    <div>
      {challenge.code && (
        <pre className="code-font mb-4 overflow-x-auto rounded-xl border border-gold-500/15 bg-ink-950 p-3 text-xs leading-relaxed text-gold-100">
          {challenge.code}
        </pre>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {challenge.options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = index === challenge.correctIndex
          const showCorrect = status === 'correct' && isCorrect
          const showWrong = status === 'wrong' && isSelected

          return (
            <motion.button
              key={option}
              type="button"
              whileHover={status === 'correct' ? undefined : { y: -1 }}
              whileTap={status === 'correct' ? undefined : { scale: 0.99 }}
              onClick={() => choose(index)}
              disabled={status === 'correct'}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition ${
                showCorrect
                  ? 'border-moss-400/70 bg-moss-600/25 shadow-[0_0_18px_rgba(90,143,74,0.25)]'
                  : showWrong
                    ? 'border-crimson-400/70 bg-crimson-500/15'
                    : isSelected
                      ? 'border-gold-400/70 bg-gold-500/15'
                      : 'border-gold-500/15 bg-ink-800/60 hover:border-gold-400/40 hover:bg-ink-700/60'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold ${
                  showCorrect
                    ? 'border-moss-400/60 bg-moss-500/30 text-moss-200'
                    : showWrong
                      ? 'border-crimson-400/60 bg-crimson-500/25 text-crimson-300'
                      : isSelected
                        ? 'border-gold-400/60 bg-gold-500/25 text-gold-200'
                        : 'border-gold-500/20 bg-ink-900 text-parchment/50'
                }`}
              >
                {showCorrect ? (
                  <Check className="h-3.5 w-3.5" />
                ) : showWrong ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  LETTERS[index]
                )}
              </span>
              <span className="code-font text-xs leading-relaxed text-parchment/85">
                {option}
              </span>
            </motion.button>
          )
        })}
      </div>

      <HintBox hint={challenge.hint} open={hintOpen} />
      <Feedback status={status} explanation={challenge.explanation} />

      <div className="mt-4 flex items-center gap-2">
        <HintButton open={hintOpen} onToggle={() => setHintOpen((value) => !value)} />
        <button
          type="button"
          onClick={submit}
          disabled={selected == null || status === 'correct'}
          className="btn-gold ml-auto px-4 py-2 text-sm"
        >
          {status === 'wrong' ? 'Try Again' : 'Submit Answer'}
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
