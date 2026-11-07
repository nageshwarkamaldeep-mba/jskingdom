import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({ value, className = '', duration = 650 }) {
  const [display, setDisplay] = useState(value || 0)
  const displayRef = useRef(value || 0)
  const frameRef = useRef(null)

  useEffect(() => {
    const from = displayRef.current
    const to = Number(value) || 0
    if (from === to) return

    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = Math.round(from + (to - from) * eased)
      displayRef.current = next
      setDisplay(next)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value, duration])

  return <span className={className}>{new Intl.NumberFormat('en-US').format(display)}</span>
}
