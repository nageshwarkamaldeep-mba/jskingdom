import { ACHIEVEMENTS } from '../game/GameConfig'

export function findNewAchievements(state) {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !state.achievements.includes(achievement.id) && achievement.check(state),
  )
}

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Math.max(0, Math.floor(value || 0)))
}

export function getTodayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function getYesterdayKey() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return getTodayKey(yesterday)
}
