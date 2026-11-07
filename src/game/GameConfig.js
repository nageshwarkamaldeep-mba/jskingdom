export const MAX_HEARTS = 5
export const MAX_BUILDING_LEVEL = 3
export const XP_PER_PLAYER_LEVEL = 100

export const CHALLENGE_REWARD = { gold: 10, xp: 20 }
export const LEVEL_BONUS = { gold: 50, xp: 100 }
export const DAILY_BONUS = { gold: 25, xp: 10 }

export const UPGRADE_COSTS = { 1: 100, 2: 200 }

export function getUpgradeCost(currentLevel) {
  return UPGRADE_COSTS[currentLevel] || null
}

export function getPlayerLevel(xp) {
  return Math.floor(xp / XP_PER_PLAYER_LEVEL) + 1
}

export function getXpProgress(xp) {
  const level = getPlayerLevel(xp)
  const floor = (level - 1) * XP_PER_PLAYER_LEVEL
  const current = xp - floor
  return {
    level,
    current,
    needed: XP_PER_PLAYER_LEVEL,
    percent: Math.min(100, Math.round((current / XP_PER_PLAYER_LEVEL) * 100)),
  }
}

export const SLOTS = [
  { id: 'slot-1', col: 1, row: 1 },
  { id: 'slot-2', col: 2, row: 4 },
  { id: 'slot-3', col: 0, row: 1 },
  { id: 'slot-4', col: 3, row: 1 },
  { id: 'slot-5', col: 1, row: 3 },
  { id: 'slot-6', col: 3, row: 3 },
  { id: 'slot-7', col: 0, row: 0 },
  { id: 'slot-8', col: 0, row: 3 },
  { id: 'slot-9', col: 4, row: 2 },
  { id: 'slot-10', col: 2, row: 2 },
]

export const BUILDINGS = [
  {
    id: 'tent',
    name: 'Scout Tent',
    emoji: '⛺',
    levelId: 1,
    description: 'A humble camp where every hero begins.',
    flavor: 'Warm fire, sharp minds, and the first line of JavaScript.',
  },
  {
    id: 'gate',
    name: 'Castle Gate',
    emoji: '🚪',
    levelId: 2,
    description: 'The great gate that welcomes travelers to your kingdom.',
    flavor: 'Its hinges creak a greeting to every new coder.',
  },
  {
    id: 'mine',
    name: 'Gold Mine',
    emoji: '⛏️',
    levelId: 3,
    description: 'A rich mine that turns operators into gold.',
    flavor: 'Every calculation strikes a new vein.',
  },
  {
    id: 'camp',
    name: 'Training Camp',
    emoji: '⚔️',
    levelId: 4,
    description: 'Soldiers train here to master conditions and choices.',
    flavor: 'If the enemy attacks, else we defend.',
  },
  {
    id: 'houses',
    name: 'Village Houses',
    emoji: '🏘️',
    levelId: 5,
    description: 'Cozy homes for the villagers who joined your cause.',
    flavor: 'The village grows one loop at a time.',
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    emoji: '🗼',
    levelId: 6,
    description: 'A tall tower that calls functions across the land.',
    flavor: 'From here, every reusable spell can be seen.',
  },
  {
    id: 'warehouse',
    name: 'Royal Warehouse',
    emoji: '📦',
    levelId: 7,
    description: 'An ordered storehouse for arrays of supplies.',
    flavor: 'First item at index zero. Always.',
  },
  {
    id: 'bridge',
    name: 'Stone Bridge',
    emoji: '🌉',
    levelId: 8,
    description: 'A bridge built from objects, linking both banks.',
    flavor: 'Sturdy, structured, and full of properties.',
  },
  {
    id: 'walls',
    name: 'Defensive Walls',
    emoji: '🛡️',
    levelId: 9,
    description: 'Strong walls and archers that guard against bugs.',
    flavor: 'Good debugging keeps the kingdom standing.',
  },
  {
    id: 'castle',
    name: 'Royal Castle',
    emoji: '🏰',
    levelId: 10,
    description: 'The crown jewel of Code Kingdom.',
    flavor: 'You are the King of JavaScript. Long may you code.',
  },
]

export const BUILDING_BY_ID = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]))

export const ACHIEVEMENTS = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete Level 1 — The First Camp.',
    icon: 'Footprints',
    check: (s) => Boolean(s.completedLevels[1]),
  },
  {
    id: 'apprentice',
    name: 'Code Apprentice',
    description: 'Complete 5 levels of your training.',
    icon: 'BookOpen',
    check: (s) => Object.keys(s.completedLevels).length >= 5,
  },
  {
    id: 'builder',
    name: 'Castle Builder',
    description: 'Place 3 buildings in your kingdom.',
    icon: 'Hammer',
    check: (s) => Object.keys(s.placedBuildings).length >= 3,
  },
  {
    id: 'scholar',
    name: 'Studious Scholar',
    description: 'Solve 10 JavaScript challenges.',
    icon: 'GraduationCap',
    check: (s) => Object.keys(s.completedChallenges).length >= 10,
  },
  {
    id: 'treasurer',
    name: 'Royal Treasurer',
    description: 'Hold 200 gold at once.',
    icon: 'Coins',
    check: (s) => s.player.gold >= 200,
  },
  {
    id: 'architect',
    name: 'Master Architect',
    description: 'Upgrade a building to level 3.',
    icon: 'Landmark',
    check: (s) => Object.values(s.buildingLevels).some((lv) => lv >= 3),
  },
  {
    id: 'king',
    name: 'Become the King',
    description: 'Complete all 10 levels and raise the Royal Castle.',
    icon: 'Crown',
    check: (s) => Object.keys(s.completedLevels).length >= 10,
  },
]
