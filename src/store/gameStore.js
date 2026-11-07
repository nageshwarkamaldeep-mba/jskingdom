import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  BUILDING_BY_ID,
  CHALLENGE_REWARD,
  DAILY_BONUS,
  LEVEL_BONUS,
  MAX_HEARTS,
  MAX_BUILDING_LEVEL,
  getPlayerLevel,
  getUpgradeCost,
} from '../game/GameConfig'
import { LEVEL_BY_ID } from '../levels/levelData'
import { findNewAchievements } from '../utils/rewardSystem'
import { getTodayKey, getYesterdayKey } from '../utils/rewardSystem'
import { SAVE_KEY } from '../utils/storage'

let toastCounter = 0

const initialPlayer = {
  name: 'Squire',
  xp: 0,
  gold: 0,
  hearts: MAX_HEARTS,
  streak: 0,
  lastActiveDay: null,
  muted: false,
}

export function createInitialState() {
  return {
    player: { ...initialPlayer },
    completedChallenges: {},
    completedLevels: {},
    unlockedBuildings: [],
    placedBuildings: {},
    buildingLevels: {},
    achievements: [],
    tutorialSeen: false,
    selectedBuilding: null,
    toasts: [],
  }
}

function withAchievements(state, toasts) {
  const baseToasts = toasts ?? state.toasts
  const newAchievements = findNewAchievements(state)
  if (newAchievements.length === 0) return { ...state, toasts: baseToasts }
  const achievementToasts = newAchievements.map((achievement) => ({
    id: `toast-${++toastCounter}`,
    type: 'achievement',
    title: 'Achievement unlocked!',
    message: achievement.name,
  }))
  return {
    ...state,
    achievements: [...state.achievements, ...newAchievements.map((a) => a.id)],
    toasts: [...baseToasts, ...achievementToasts],
  }
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...createInitialState(),

      checkDailyStreak: () => {
        const state = get()
        const today = getTodayKey()
        if (state.player.lastActiveDay === today) return false
        const isYesterday = state.player.lastActiveDay === getYesterdayKey()
        const streak = isYesterday ? state.player.streak + 1 : 1
        const toast = {
          id: `toast-${++toastCounter}`,
          type: 'reward',
          title: 'Daily learning streak',
          message: `Day ${streak} — +${DAILY_BONUS.gold} gold and +${DAILY_BONUS.xp} XP.`,
        }
        set((current) => {
          const next = {
            ...current,
            player: {
              ...current.player,
              streak,
              lastActiveDay: today,
              gold: current.player.gold + DAILY_BONUS.gold,
              xp: current.player.xp + DAILY_BONUS.xp,
            },
            toasts: [...current.toasts, toast],
          }
          return withAchievements(next, next.toasts)
        })
        return true
      },

      completeChallenge: (challengeId, reward = CHALLENGE_REWARD) => {
        const state = get()
        if (!challengeId || state.completedChallenges[challengeId]) {
          return { awarded: false, gold: 0, xp: 0, leveledUp: false }
        }

        const gold = reward?.gold ?? CHALLENGE_REWARD.gold
        const xp = reward?.xp ?? CHALLENGE_REWARD.xp
        const beforeLevel = getPlayerLevel(state.player.xp)
        const afterLevel = getPlayerLevel(state.player.xp + xp)

        set((current) => {
          const next = {
            ...current,
            player: {
              ...current.player,
              gold: current.player.gold + gold,
              xp: current.player.xp + xp,
            },
            completedChallenges: {
              ...current.completedChallenges,
              [challengeId]: true,
            },
          }
          return withAchievements(next, current.toasts)
        })

        return {
          awarded: true,
          gold,
          xp,
          leveledUp: afterLevel > beforeLevel,
        }
      },

      loseHeart: () => {
        set((state) => ({
          player: {
            ...state.player,
            hearts: Math.max(0, state.player.hearts - 1),
          },
        }))
        return get().player.hearts
      },

      healHearts: () => {
        set((state) => ({
          player: { ...state.player, hearts: MAX_HEARTS },
        }))
      },

      completeLevel: (levelId) => {
        const state = get()
        const level = LEVEL_BY_ID[levelId]
        if (!level || state.completedLevels[levelId]) {
          return { awarded: false, buildingId: null }
        }

        set((current) => {
          const next = {
            ...current,
            player: {
              ...current.player,
              gold: current.player.gold + LEVEL_BONUS.gold,
              xp: current.player.xp + LEVEL_BONUS.xp,
            },
            completedLevels: {
              ...current.completedLevels,
              [levelId]: true,
            },
            unlockedBuildings: current.unlockedBuildings.includes(level.buildingId)
              ? current.unlockedBuildings
              : [...current.unlockedBuildings, level.buildingId],
          }
          const withToast = {
            ...next,
            toasts: [
              ...current.toasts,
              {
                id: `toast-${++toastCounter}`,
                type: 'unlock',
                title: 'Building unlocked!',
                message: `${BUILDING_BY_ID[level.buildingId]?.name || level.title} is ready to build.`,
              },
            ],
          }
          return withAchievements(withToast)
        })

        return { awarded: true, buildingId: level.buildingId, bonus: LEVEL_BONUS }
      },

      selectBuilding: (buildingId) => {
        set({ selectedBuilding: buildingId })
      },

      clearSelectedBuilding: () => set({ selectedBuilding: null }),

      placeBuilding: (slotId) => {
        const state = get()
        const buildingId = state.selectedBuilding
        if (!buildingId) return { ok: false, reason: 'Select a building first.' }
        if (!state.unlockedBuildings.includes(buildingId)) {
          return { ok: false, reason: 'That building is still locked.' }
        }
        if (state.placedBuildings[slotId]) {
          return { ok: false, reason: 'That building slot is already occupied.' }
        }
        const alreadyPlaced = Object.values(state.placedBuildings).includes(buildingId)
        if (alreadyPlaced) {
          return { ok: false, reason: 'You have already placed this building.' }
        }

        set((current) => {
          const next = {
            ...current,
            placedBuildings: {
              ...current.placedBuildings,
              [slotId]: buildingId,
            },
            buildingLevels: {
              ...current.buildingLevels,
              [buildingId]: current.buildingLevels[buildingId] || 1,
            },
            selectedBuilding: null,
            toasts: [
              ...current.toasts,
              {
                id: `toast-${++toastCounter}`,
                type: 'unlock',
                title: 'Construction complete!',
                message: 'Your kingdom grows stronger.',
              },
            ],
          }
          return withAchievements(next)
        })

        return { ok: true, buildingId }
      },

      upgradeBuilding: (buildingId) => {
        const state = get()
        const currentLevel = state.buildingLevels[buildingId] || 1
        if (currentLevel >= MAX_BUILDING_LEVEL) {
          return { ok: false, reason: 'This building is already at maximum level.' }
        }
        const cost = getUpgradeCost(currentLevel)
        if (state.player.gold < cost) {
          return { ok: false, reason: `You need ${cost} gold to upgrade.` }
        }

        set((current) => {
          const next = {
            ...current,
            player: { ...current.player, gold: current.player.gold - cost },
            buildingLevels: {
              ...current.buildingLevels,
              [buildingId]: currentLevel + 1,
            },
            toasts: [
              ...current.toasts,
              {
                id: `toast-${++toastCounter}`,
                type: 'reward',
                title: 'Building upgraded!',
                message: `Now level ${currentLevel + 1}.`,
              },
            ],
          }
          return withAchievements(next)
        })

        return { ok: true, newLevel: currentLevel + 1, cost }
      },

      setPlayerName: (name) => {
        const cleaned = String(name || '').trim().slice(0, 20) || 'Squire'
        set((state) => ({ player: { ...state.player, name: cleaned } }))
      },

      toggleMute: () => {
        set((state) => ({
          player: { ...state.player, muted: !state.player.muted },
        }))
      },

      markTutorialSeen: () => set({ tutorialSeen: true }),

      reopenTutorial: () => set({ tutorialSeen: false }),

      pushToast: (toast) => {
        const id = `toast-${++toastCounter}`
        set((state) => ({
          toasts: [...state.toasts, { id, type: 'info', ...toast }],
        }))
        return id
      },

      dismissToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
      },

      resetProgress: () => {
        const name = get().player.name
        const fresh = createInitialState()
        fresh.player.name = name
        set(fresh)
      },
    }),
    {
      name: SAVE_KEY,
      version: 1,
      partialize: (state) => ({
        player: state.player,
        completedChallenges: state.completedChallenges,
        completedLevels: state.completedLevels,
        unlockedBuildings: state.unlockedBuildings,
        placedBuildings: state.placedBuildings,
        buildingLevels: state.buildingLevels,
        achievements: state.achievements,
        tutorialSeen: state.tutorialSeen,
      }),
    },
  ),
)
