import { useRef, useState } from 'react'
import { Check, Send, Wrench, X } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import { useGameStore } from '../store/gameStore'
import { playSound } from '../utils/sound'
import { Feedback, HintBox, HintButton } from './ChallengeParts'

const LETTERS = ['A', 'B', 'C', 'D']

export default function DebugCode({ challenge, onSolved, onWrong, alreadySolved }) {
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
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-crimson-400/80">
        <Wrench className="h-3 w-3" />
        Buggy code
      </div>
      <CodeEditor value={challenge.buggyCode} readOnly height="170px" />

      <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-parchment/45">
        What is the mistake?
      </p>

      <div className="grid gap-2">
        {challenge.options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = index === challenge.correctIndex
          const showCorrect = status === 'correct' && isCorrect
          const showWrong = status === 'wrong' && isSelected

          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(index)}
              disabled={status === 'correct'}
              className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
                showCorrect
                  ? 'border-moss-400/70 bg-moss-600/25'
                  : showWrong
                    ? 'border-crimson-400/70 bg-crimson-500/15'
                    : isSelected
                      ? 'border-gold-400/70 bg-gold-500/15'
                      : 'border-gold-500/15 bg-ink-800/60 hover:border-gold-400/40 hover:bg-ink-700/60'
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold ${
                  showCorrect
                    ? 'border-moss-400/60 bg-moss-500/30 text-moss-200'
                    : showWrong
                      ? 'border-crimson-400/60 bg-crimson-500/25 text-crimson-300'
                      : 'border-gold-500/20 bg-ink-900 text-parchment/50'
                }`}
              >
                {showCorrect ? (
                  <Check className="h-3 w-3" />
                ) : showWrong ? (
                  <X className="h-3 w-3" />
                ) : (
                  LETTERS[index]
                )}
              </span>
              <span className="text-xs leading-relaxed text-parchment/85">
                {option}
              </span>
            </button>
          )
        })}
      </div>

      {status === 'correct' && challenge.fixedCode && (
        <div className="mt-3">
          <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-moss-300">
            <Check className="h-3 w-3" />
            Repaired code
          </p>
          <CodeEditor value={challenge.fixedCode} readOnly height="160px" />
        </div>
      )}

      <HintBox hint={challenge.hint} open={hintOpen} />
      <Feedback status={status} explanation={challenge.explanation} />

      <div className="mt-4 flex items-center gap-2">
        <HintButton
          open={hintOpen}
          onToggle={() => setHintOpen((value) => !value)}
        />
        <button
          type="button"
          onClick={submit}
          disabled={selected == null || status === 'correct'}
          className="btn-gold ml-auto px-4 py-2 text-sm"
        >
          {status === 'wrong' ? 'Try Again' : 'Repair the Code'}
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
