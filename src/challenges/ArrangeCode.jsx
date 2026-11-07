import { useRef, useState } from 'react'
import { Reorder, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, GripVertical, Send } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { playSound } from '../utils/sound'
import { Feedback, HintBox, HintButton } from './ChallengeParts'

function shuffleBlocks(blocks, correctOrder) {
  const copy = [...blocks]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  if (copy.length > 1 && copy.map((block) => block.id).join() === correctOrder.join()) {
    ;[copy[0], copy[1]] = [copy[1], copy[0]]
  }
  return copy
}

export default function ArrangeCode({ challenge, onSolved, onWrong, alreadySolved }) {
  const muted = useGameStore((state) => state.player.muted)
  const solvedRef = useRef(alreadySolved)

  const [order, setOrder] = useState(() => {
    if (alreadySolved) {
      return challenge.correctOrder.map((id) =>
        challenge.blocks.find((block) => block.id === id),
      )
    }
    return shuffleBlocks(challenge.blocks, challenge.correctOrder)
  })
  const [status, setStatus] = useState(alreadySolved ? 'correct' : 'idle')
  const [hintOpen, setHintOpen] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const move = (index, direction) => {
    if (status === 'correct') return
    const target = index + direction
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
    if (status === 'wrong') setStatus('idle')
  }

  const submit = () => {
    if (status === 'correct') return
    const current = order.map((block) => block.id).join(',')
    const target = challenge.correctOrder.join(',')
    if (current === target) {
      setStatus('correct')
      playSound('correct', muted)
      if (!solvedRef.current) {
        solvedRef.current = true
        onSolved?.()
      }
    } else {
      setStatus('wrong')
      setShakeKey((value) => value + 1)
      playSound('wrong', muted)
      onWrong?.()
    }
  }

  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-parchment/45">
        Drag the lines into the correct order
      </p>

      <motion.div key={shakeKey} className={status === 'wrong' ? 'animate-shake' : ''}>
        <Reorder.Group
          axis="y"
          values={order}
          onReorder={(next) => {
            if (status === 'correct') return
            setOrder(next)
            if (status === 'wrong') setStatus('idle')
          }}
          className="space-y-2"
        >
          {order.map((block, index) => (
            <Reorder.Item
              key={block.id}
              value={block}
              dragListener={status !== 'correct'}
              whileDrag={{ scale: 1.02, zIndex: 20 }}
              className={`flex cursor-grab items-center gap-2 rounded-xl border px-2.5 py-2 active:cursor-grabbing ${
                status === 'correct'
                  ? 'border-moss-400/60 bg-moss-600/20'
                  : 'border-gold-500/20 bg-ink-800/70 hover:border-gold-400/45'
              }`}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-parchment/30" />
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold-500/20 bg-ink-900 text-[10px] font-bold text-gold-300/70">
                {index + 1}
              </span>
              <code className="code-font flex-1 whitespace-pre-wrap text-[11.5px] leading-relaxed text-parchment/85">
                {block.code}
              </code>
              <div className="flex shrink-0 flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || status === 'correct'}
                  className="rounded border border-gold-500/15 p-0.5 text-parchment/50 transition hover:border-gold-400/40 hover:text-gold-200 disabled:opacity-20"
                  aria-label="Move line up"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1 || status === 'correct'}
                  className="rounded border border-gold-500/15 p-0.5 text-parchment/50 transition hover:border-gold-400/40 hover:text-gold-200 disabled:opacity-20"
                  aria-label="Move line down"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </motion.div>

      <HintBox hint={challenge.hint} open={hintOpen} />
      <Feedback
        status={status}
        explanation={challenge.explanation}
        wrongMessage="Not in the right order yet."
      />

      <div className="mt-4 flex items-center gap-2">
        <HintButton
          open={hintOpen}
          onToggle={() => setHintOpen((value) => !value)}
        />
        <button
          type="button"
          onClick={submit}
          disabled={status === 'correct'}
          className="btn-gold ml-auto px-4 py-2 text-sm"
        >
          {status === 'wrong' ? 'Check Again' : 'Check Order'}
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
