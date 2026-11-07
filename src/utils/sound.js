let audioContext = null

function getContext() {
  if (typeof window === 'undefined') return null
  const AudioCtor = window.AudioContext || window.webkitAudioContext
  if (!AudioCtor) return null
  if (!audioContext) audioContext = new AudioCtor()
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {})
  return audioContext
}

function tone(ctx, frequency, start, duration, type = 'sine', volume = 0.08) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start)
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start)
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(ctx.currentTime + start)
  oscillator.stop(ctx.currentTime + start + duration + 0.02)
}

const SOUNDS = {
  click: (ctx) => tone(ctx, 520, 0, 0.06, 'triangle', 0.04),
  correct: (ctx) => {
    tone(ctx, 660, 0, 0.14, 'sine', 0.07)
    tone(ctx, 880, 0.1, 0.2, 'sine', 0.07)
  },
  wrong: (ctx) => {
    tone(ctx, 220, 0, 0.16, 'sawtooth', 0.05)
    tone(ctx, 160, 0.12, 0.22, 'sawtooth', 0.05)
  },
  coin: (ctx) => {
    tone(ctx, 1046, 0, 0.08, 'square', 0.035)
    tone(ctx, 1318, 0.07, 0.12, 'square', 0.035)
  },
  unlock: (ctx) => {
    tone(ctx, 523, 0, 0.16, 'triangle', 0.06)
    tone(ctx, 659, 0.12, 0.16, 'triangle', 0.06)
    tone(ctx, 784, 0.24, 0.3, 'triangle', 0.06)
  },
  level: (ctx) => {
    tone(ctx, 523, 0, 0.16, 'sine', 0.07)
    tone(ctx, 659, 0.14, 0.16, 'sine', 0.07)
    tone(ctx, 784, 0.28, 0.16, 'sine', 0.07)
    tone(ctx, 1046, 0.42, 0.36, 'sine', 0.07)
  },
}

export function playSound(name, muted) {
  if (muted) return
  const ctx = getContext()
  if (!ctx) return
  const sound = SOUNDS[name]
  if (!sound) return
  try {
    sound(ctx)
  } catch {
    // Audio is optional; ignore playback errors.
  }
}
