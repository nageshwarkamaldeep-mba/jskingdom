export const SAVE_KEY = 'code-kingdom-save-v1'

export function safeRead(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function safeRemove(key) {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
