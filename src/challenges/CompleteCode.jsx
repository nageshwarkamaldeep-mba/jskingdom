import { useMemo, useRef, useState } from 'react'
import { CheckCircle2, Loader2, Play, XCircle } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import { useGameStore } from '../store/gameStore'
import { isBlankCorrect, runCodeInSandbox } from '../utils/codeValidator'
import { playSound } from '../utils/sound'
import { Feedback, HintBox, HintButton } from './ChallengeParts'

export default function CompleteCode({ challenge, onSolved, onWrong, alreadySolved }) {
  const muted = useGameStore((state) => state.player.muted)
  const editorMode = Boolean(challenge.starterCode)
  const solvedRef = useRef(alreadySolved)

  const [hintOpen, setHintOpen] = useState(false)
  const [status, setStatus] = useState(alreadySolved ? 'correct' : 'idle')

  const blankCount = challenge.blanks?.length || 0
  const [values, setValues] = useState(() =>
    (challenge.blanks || []).map((blank) =>
      alreadySolved ? blank.answers[0] : '',
    ),
  )
  const [wrongBlanks, setWrongBlanks] = useState([])

  const [code, setCode] = useState(
    alreadySolved ? challenge.solution : challenge.starterCode || '',
  )
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [showSolution, setShowSolution] = useState(alreadySolved)

  const parts = useMemo(
    () => (challenge.template ? challenge.template.split(/(\[\[\d+\]\])/g) : []),
    [challenge.template],
  )

  const markSolved = () => {
    setStatus('correct')
    playSound('correct', muted)
    if (!solvedRef.current) {
      solvedRef.current = true
      onSolved?.()
    }
  }

  const markWrong = () => {
    setStatus('wrong')
    playSound('wrong', muted)
    onWrong?.()
  }

  const submitBlanks = () => {
    if (status === 'correct') return
    const wrong = []
    challenge.blanks.forEach((blank, index) => {
      if (!isBlankCorrect(values[index], blank.answers, blank.ignoreCase)) {
        wrong.push(index)
      }
    })
    setWrongBlanks(wrong)
    if (wrong.length === 0) {
      markSolved()
    } else {
      markWrong()
    }
  }

  const submitEditor = async () => {
    if (status === 'correct' || running) return
    setRunning(true)
    setError(null)
    setResults(null)

    const outcome = await runCodeInSandbox(code, challenge.tests)
    setRunning(false)

    if (outcome.error) {
      setError(outcome.error)
      setAttempts((value) => value + 1)
      markWrong()
      return
    }

    const resultList = Array.isArray(outcome.results) ? outcome.results : []
    setResults(resultList)
    const allPass =
      resultList.length === challenge.tests.length &&
      resultList.every((result) => result.pass)

    if (allPass) {
      markSolved()
    } else {
      setAttempts((value) => value + 1)
      markWrong()
    }
  }

  if (!editorMode) {
    return (
      <div>
        <div className="rounded-xl border border-gold-500/15 bg-ink-950 p-4">
          <div className="code-font whitespace-pre-wrap text-[13px] leading-loose text-gold-100">
            {parts.map((part, index) => {
              const match = part.match(/^\[\[(\d+)\]\]$/)
              if (!match) {
                return <span key={`text-${index}`}>{part}</span>
              }
              const blankIndex = Number(match[1])
              const blank = challenge.blanks[blankIndex]
              const isWrong = wrongBlanks.includes(blankIndex)
              return (
                <input
                  key={`blank-${blankIndex}`}
                  type="text"
                  value={values[blankIndex]}
                  onChange={(event) => {
                    const next = [...values]
                    next[blankIndex] = event.target.value
                    setValues(next)
                    setWrongBlanks((current) =>
                      current.filter((item) => item !== blankIndex),
                    )
                    if (status === 'wrong') setStatus('idle')
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') submitBlanks()
                  }}
                  disabled={status === 'correct'}
                  placeholder={blank.placeholder}
                  aria-label={`Missing value ${blankIndex + 1}`}
                  style={{ width: blank.width || '6ch' }}
                  className={`mx-1 inline-block rounded-md border bg-ink-900 px-1.5 py-0.5 text-center text-[13px] outline-none transition placeholder:text-parchment/25 ${
                    isWrong
                      ? 'border-crimson-400/70 text-crimson-300'
                      : 'border-gold-500/40 text-gold-200 focus:border-gold-300'
                  }`}
                />
              )
            })}
          </div>
        </div>

        <HintBox hint={challenge.hint} open={hintOpen} />
        <Feedback status={status} explanation={challenge.explanation} />

        <div className="mt-4 flex items-center gap-2">
          <HintButton
            open={hintOpen}
            onToggle={() => setHintOpen((value) => !value)}
          />
          <button
            type="button"
            onClick={submitBlanks}
            disabled={status === 'correct' || blankCount === 0}
            className="btn-gold ml-auto px-4 py-2 text-sm"
          >
            {status === 'wrong' ? 'Try Again' : 'Check Code'}
            <Play className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CodeEditor
        value={code}
        onChange={(next) => {
          setCode(next)
          if (status === 'wrong') setStatus('idle')
        }}
        readOnly={status === 'correct'}
        height="200px"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-widest text-parchment/40">
          Runs in a safe sandboxed iframe
        </p>
        {attempts > 0 && status !== 'correct' && !showSolution && (
          <button
            type="button"
            onClick={() => {
              setCode(challenge.solution)
              setShowSolution(true)
            }}
            className="text-[10px] font-semibold uppercase tracking-widest text-gold-300/80 underline-offset-2 hover:underline"
          >
            Reveal solution
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-crimson-500/40 bg-crimson-500/10 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-crimson-400">
            <XCircle className="h-3.5 w-3.5" /> Code error
          </p>
          <pre className="code-font mt-1 overflow-x-auto whitespace-pre-wrap text-[11px] text-crimson-300/90">
            {error}
          </pre>
        </div>
      )}

      {results && (
        <div className="mt-3 space-y-1.5">
          {results.map((result, index) => (
            <div
              key={`${result.expr}-${index}`}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] ${
                result.pass
                  ? 'border-moss-500/35 bg-moss-600/10 text-moss-300'
                  : 'border-crimson-500/35 bg-crimson-500/10 text-crimson-300'
              }`}
            >
              {result.pass ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="code-font">{result.expr}</span>
              {!result.pass && (
                <span className="ml-auto code-font text-parchment/50">
                  expected {JSON.stringify(result.expected)}
                  {result.error
                    ? ` · ${result.error}`
                    : ` · got ${JSON.stringify(result.actual)}`}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {showSolution && status !== 'correct' && (
        <p className="mt-2 rounded-lg border border-gold-500/20 bg-gold-500/5 px-2.5 py-1.5 text-[10px] text-parchment/55">
          Solution revealed. Study it, then run the tests to claim your reward.
        </p>
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
          onClick={submitEditor}
          disabled={status === 'correct' || running}
          className="btn-gold ml-auto px-4 py-2 text-sm"
        >
          {running ? (
            <>
              Running...
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </>
          ) : status === 'wrong' ? (
            <>
              Run Tests Again
              <Play className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Run Tests
              <Play className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
