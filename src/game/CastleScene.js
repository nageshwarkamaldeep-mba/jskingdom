import Phaser from 'phaser'
import { SLOTS } from './GameConfig'

const GRID_MIN = -1
const GRID_MAX = 5

const DECOR = [
  { col: 4, row: 0, type: 'tree', scale: 1.05 },
  { col: 5, row: 1, type: 'tree', scale: 1.2 },
  { col: 5, row: 3, type: 'tree', scale: 0.95 },
  { col: 5, row: 5, type: 'tree', scale: 1.15 },
  { col: 4, row: 5, type: 'tree', scale: 1 },
  { col: 2, row: 5, type: 'tree', scale: 0.9 },
  { col: 0, row: 5, type: 'tree', scale: 1.1 },
  { col: -1, row: 5, type: 'tree', scale: 1 },
  { col: -1, row: 4, type: 'tree', scale: 0.85 },
  { col: 3, row: 4, type: 'bush', scale: 1 },
  { col: 1, row: 4, type: 'bush', scale: 0.9 },
  { col: 4, row: 4, type: 'rock', scale: 1 },
  { col: 0, row: 4, type: 'rock', scale: 0.8 },
  { col: 4, row: 1, type: 'tree', scale: 0.8 },
  { col: 3, row: 0, type: 'tree', scale: 0.75 },
  { col: 1, row: 0, type: 'bush', scale: 0.8 },
  { col: 4, row: 3, type: 'bush', scale: 1 },
]

const ROAD_CELLS = [
  [2, 2],
  [2, 3],
  [2, 4],
  [1, 2],
  [3, 2],
  [1, 3],
  [3, 3],
  [0, 2],
  [4, 2],
  [2, 1],
  [0, 3],
]

const RIVER_CELLS = []
for (let row = -1; row <= 5; row++) RIVER_CELLS.push([-1, row])
for (let row = 0; row <= 5; row++) RIVER_CELLS.push([-2, row])

export default class CastleScene extends Phaser.Scene {
  constructor() {
    super('CastleScene')
  }

  create() {
    this.kingdom = this.introKingdom ||
      this.registry.get('kingdom') || {
        placedBuildings: {},
        buildingLevels: {},
        unlockedBuildings: [],
        selectedBuilding: null,
      }
    this.prevPlaced = {}
    this.cinematic = Boolean(this.introCinematic ?? this.registry.get('cinematic'))
    this.reducedMotion = Boolean(
      this.introReducedMotion ?? this.registry.get('reducedMotion'),
    )

    this.makeSparkTexture()
    this.buildWorld()

    if (this.cinematic) this.playCinematic()

    this.onResize = (gameSize) => {
      const width = gameSize?.width || this.scale.width
      const height = gameSize?.height || this.scale.height
      if (
        this.lastBuildSize &&
        Math.abs(this.lastBuildSize.width - width) < 2 &&
        Math.abs(this.lastBuildSize.height - height) < 2
      ) {
        return
      }
      this.buildWorld()
    }
    this.onKingdomUpdate = (data) => {
      const prev = this.kingdom
      this.kingdom = data
      this.buildWorld(prev)
    }

    this.scale.on('resize', this.onResize)
    this.game.events.on('kingdom-update', this.onKingdomUpdate)

    this.events.once('shutdown', () => {
      this.scale.off('resize', this.onResize)
      this.game.events.off('kingdom-update', this.onKingdomUpdate)
      this.tweens.killAll()
    })
  }

  playCinematic() {
    const camera = this.cameras.main
    const focus = this.isoPoint(2, 2)

    camera.fadeIn(this.reducedMotion ? 250 : 900, 0, 0, 0)

    if (this.reducedMotion) return

    camera.setZoom(1.22)
    camera.centerOn(focus.x, focus.y - this.tileW * 0.12)
    camera.zoomTo(1, 5200, 'Sine.easeInOut')
  }

  makeSparkTexture() {
    if (this.textures.exists('ck-spark')) return
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0xffe9a8, 1)
    graphics.fillCircle(5, 5, 5)
    graphics.generateTexture('ck-spark', 10, 10)
    graphics.destroy()
  }

  isoPoint(col, row) {
    return {
      x: this.originX + ((col - row) * this.tileW) / 2,
      y: this.originY + ((col + row) * this.tileH) / 2,
    }
  }

  diamond(x, y, width, height) {
    return [
      { x, y: y - height / 2 },
      { x: x + width / 2, y },
      { x, y: y + height / 2 },
      { x: x - width / 2, y },
    ]
  }

  buildWorld(prev = null) {
    this.tweens.killAll()

    if (this.worldLayer) this.worldLayer.destroy(true)
    if (this.ambientLayer) this.ambientLayer.destroy(true)

    const width = this.scale.width || 800
    const height = this.scale.height || 520
    this.lastBuildSize = { width, height }
    this.tileW = Phaser.Math.Clamp(width / 8.2, 74, 132)
    this.tileH = this.tileW / 2
    this.originX = width / 2
    this.originY = Math.max(96, height * 0.2)

    this.worldLayer = this.add.container(0, 0)
    this.ambientLayer = this.add.container(0, 0)

    this.drawBackground(width, height)
    this.drawGrid()
    this.drawRiver()
    this.drawRoads()
    this.drawDecor()
    this.drawSlots()
    this.drawBuildings(prev)
    this.drawAmbient(width, height)
  }

  drawBackground(width, height) {
    const g = this.add.graphics()
    this.worldLayer.add(g)

    g.fillStyle(this.cinematic ? 0x244a32 : 0x16281c, 1)
    g.fillRect(0, 0, width, height)

    g.fillGradientStyle(
      this.cinematic ? 0x3a6346 : 0x2b4a33,
      this.cinematic ? 0x3a6346 : 0x2b4a33,
      this.cinematic ? 0x16301f : 0x0c1710,
      this.cinematic ? 0x16301f : 0x0c1710,
      1,
    )
    g.fillRect(0, 0, width, height)

    if (this.cinematic) {
      g.fillStyle(0xffe6a0, 0.1)
      g.fillCircle(width * 0.5, height * 0.52, Math.min(width, height) * 0.42)
    }

    g.fillStyle(0xffe6a0, 0.06)
    g.fillCircle(width * 0.82, height * 0.1, Math.min(width, height) * 0.22)

    const hillColor = 0x16291c
    g.fillStyle(hillColor, 1)
    g.fillPoints(
      [
        { x: 0, y: height * 0.24 },
        { x: width * 0.14, y: height * 0.1 },
        { x: width * 0.26, y: height * 0.21 },
        { x: width * 0.4, y: height * 0.07 },
        { x: width * 0.55, y: height * 0.22 },
        { x: width * 0.7, y: height * 0.11 },
        { x: width * 0.86, y: height * 0.2 },
        { x: width, y: height * 0.09 },
        { x: width, y: height * 0.34 },
        { x: 0, y: height * 0.34 },
      ],
      true,
    )

    g.fillStyle(0x1d3524, 1)
    g.fillPoints(
      [
        { x: 0, y: height * 0.3 },
        { x: width * 0.18, y: height * 0.18 },
        { x: width * 0.33, y: height * 0.28 },
        { x: width * 0.5, y: height * 0.16 },
        { x: width * 0.68, y: height * 0.29 },
        { x: width * 0.84, y: height * 0.19 },
        { x: width, y: height * 0.28 },
        { x: width, y: height * 0.4 },
        { x: 0, y: height * 0.4 },
      ],
      true,
    )

    g.fillStyle(0x000000, this.cinematic ? 0.02 : 0.18)
    g.fillRect(0, 0, width, height)
  }

  drawGrid() {
    const g = this.add.graphics()
    this.worldLayer.add(g)

    for (let col = GRID_MIN; col <= GRID_MAX; col++) {
      for (let row = GRID_MIN; row <= GRID_MAX; row++) {
        const p = this.isoPoint(col, row)
        const shade = this.cinematic
          ? (col + row) % 2 === 0
            ? 0x4f8256
            : 0x47794d
          : (col + row) % 2 === 0
            ? 0x35603c
            : 0x2f5836
        const pts = this.diamond(p.x, p.y, this.tileW - 1, this.tileH - 1)
        g.fillStyle(shade, 1)
        g.fillPoints(pts, true)
        g.lineStyle(1, 0x000000, 0.045)
        g.strokePoints(pts, true)
      }
    }
  }

  drawRiver() {
    const g = this.add.graphics()
    this.worldLayer.add(g)

    RIVER_CELLS.forEach(([col, row]) => {
      const p = this.isoPoint(col, row)
      const pts = this.diamond(p.x, p.y, this.tileW - 1, this.tileH - 1)
      g.fillStyle(col === -1 ? 0x2f6f7d : 0x27616d, 0.95)
      g.fillPoints(pts, true)
    })

    const waves = this.add.graphics()
    this.worldLayer.add(waves)
    RIVER_CELLS.forEach(([col, row], index) => {
      if (index % 2 !== 0) return
      const p = this.isoPoint(col, row)
      waves.lineStyle(2, 0x9adcec, 0.35)
      waves.beginPath()
      waves.moveTo(p.x - this.tileW * 0.16, p.y - 2)
      waves.lineTo(p.x + this.tileW * 0.12, p.y - 2)
      waves.strokePath()
    })
    this.tweens.add({
      targets: waves,
      alpha: { from: 0.35, to: 0.9 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  drawRoads() {
    const g = this.add.graphics()
    this.worldLayer.add(g)
    ROAD_CELLS.forEach(([col, row]) => {
      const p = this.isoPoint(col, row)
      const pts = this.diamond(p.x, p.y, this.tileW * 0.44, this.tileH * 0.44)
      g.fillStyle(0xb9a273, 0.4)
      g.fillPoints(pts, true)
      g.fillStyle(0xe3cf9c, 0.16)
      g.fillPoints(this.diamond(p.x, p.y, this.tileW * 0.28, this.tileH * 0.28), true)
    })
  }

  drawDecor() {
    const g = this.add.graphics()
    this.worldLayer.add(g)
    DECOR.forEach((item) => {
      const p = this.isoPoint(item.col, item.row)
      if (item.type === 'tree') this.drawTree(g, p.x, p.y, item.scale)
      if (item.type === 'bush') this.drawBush(g, p.x, p.y, item.scale)
      if (item.type === 'rock') this.drawRock(g, p.x, p.y, item.scale)
    })
  }

  drawTree(g, x, y, scale) {
    const s = scale * (this.tileW / 110)
    g.fillStyle(0x000000, 0.22)
    g.fillEllipse(x, y + 2, 30 * s, 12 * s)
    g.fillStyle(0x5a3c22, 1)
    g.fillRect(x - 2.5 * s, y - 16 * s, 5 * s, 16 * s)
    g.fillStyle(0x2e5b30, 1)
    g.fillTriangle(x, y - 54 * s, x - 20 * s, y - 20 * s, x + 20 * s, y - 20 * s)
    g.fillStyle(0x3a6f3a, 1)
    g.fillTriangle(x, y - 64 * s, x - 16 * s, y - 34 * s, x + 16 * s, y - 34 * s)
    g.fillStyle(0x4f8a45, 0.9)
    g.fillTriangle(x, y - 72 * s, x - 11 * s, y - 48 * s, x + 11 * s, y - 48 * s)
  }

  drawBush(g, x, y, scale) {
    const s = scale * (this.tileW / 110)
    g.fillStyle(0x000000, 0.18)
    g.fillEllipse(x, y + 1, 22 * s, 8 * s)
    g.fillStyle(0x3d7138, 1)
    g.fillCircle(x - 6 * s, y - 5 * s, 7 * s)
    g.fillCircle(x + 6 * s, y - 5 * s, 8 * s)
    g.fillCircle(x, y - 11 * s, 8 * s)
    g.fillStyle(0x548f46, 0.9)
    g.fillCircle(x - 3 * s, y - 12 * s, 4 * s)
  }

  drawRock(g, x, y, scale) {
    const s = scale * (this.tileW / 110)
    g.fillStyle(0x000000, 0.2)
    g.fillEllipse(x, y + 1, 24 * s, 9 * s)
    g.fillStyle(0x6f675a, 1)
    g.fillPoints(
      [
        { x: x - 11 * s, y },
        { x: x - 7 * s, y: y - 12 * s },
        { x: x + 4 * s, y: y - 15 * s },
        { x: x + 12 * s, y: y - 4 * s },
        { x: x + 9 * s, y },
      ],
      true,
    )
    g.fillStyle(0x8b8273, 0.8)
    g.fillTriangle(x - 5 * s, y - 11 * s, x + 2 * s, y - 14 * s, x + 3 * s, y - 5 * s)
  }

  drawSlots() {
    const selected = this.kingdom.selectedBuilding
    const emptySlots = SLOTS.filter((slot) => !this.kingdom.placedBuildings[slot.id])

    emptySlots.forEach((slot) => {
      const p = this.isoPoint(slot.col, slot.row)
      const g = this.add.graphics()
      this.worldLayer.add(g)
      const pts = this.diamond(p.x, p.y, this.tileW * 0.78, this.tileH * 0.78)
      g.fillStyle(selected ? 0x5d4a24 : 0x3a3327, 0.75)
      g.fillPoints(pts, true)
      g.lineStyle(2, selected ? 0xe3bd5f : 0x8a7a58, selected ? 0.9 : 0.5)
      g.strokePoints(pts, true)

      g.lineStyle(3, 0xe3bd5f, selected ? 0.95 : 0.5)
      g.beginPath()
      g.moveTo(p.x - this.tileW * 0.08, p.y)
      g.lineTo(p.x + this.tileW * 0.08, p.y)
      g.moveTo(p.x, p.y - this.tileH * 0.16)
      g.lineTo(p.x, p.y + this.tileH * 0.16)
      g.strokePath()

      if (selected) {
        const pulse = this.add.graphics()
        this.worldLayer.add(pulse)
        pulse.lineStyle(2, 0xffe9a8, 0.8)
        pulse.strokePoints(
          this.diamond(p.x, p.y, this.tileW * 0.92, this.tileH * 0.92),
          true,
        )
        this.tweens.add({
          targets: pulse,
          alpha: { from: 0.2, to: 0.95 },
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      }
    })

    SLOTS.forEach((slot) => {
      const p = this.isoPoint(slot.col, slot.row)
      const occupied = Boolean(this.kingdom.placedBuildings[slot.id])
      const highlight = this.add.graphics()
      this.worldLayer.add(highlight)
      highlight.lineStyle(3, 0xffe9a8, 1)
      highlight.strokePoints(
        this.diamond(p.x, p.y, this.tileW * 0.9, this.tileH * 0.9),
        true,
      )
      highlight.setAlpha(0)

      const hitWidth = this.tileW * 0.9
      const hitHeight = this.tileH * 0.9
      const hitArea = new Phaser.Geom.Polygon([
        hitWidth / 2,
        0,
        hitWidth,
        hitHeight / 2,
        hitWidth / 2,
        hitHeight,
        0,
        hitHeight / 2,
      ])
      const zone = this.add
        .zone(p.x, p.y, hitWidth, hitHeight)
        .setInteractive({
          hitArea,
          hitAreaCallback: Phaser.Geom.Polygon.Contains,
          useHandCursor: true,
        })
      this.worldLayer.add(zone)

      zone.on('pointerover', () => {
        highlight.setAlpha(occupied ? 0.45 : 0.85)
        this.input.setDefaultCursor('pointer')
      })
      zone.on('pointerout', () => {
        highlight.setAlpha(0)
        this.input.setDefaultCursor('default')
      })
      zone.on('pointerdown', () => {
        this.game.events.emit('slot-click', slot.id)
      })
    })
  }

  drawBuildings(prev) {
    const entries = SLOTS.filter((slot) => this.kingdom.placedBuildings[slot.id]).map(
      (slot) => {
        const buildingId = this.kingdom.placedBuildings[slot.id]
        return { slot, buildingId, point: this.isoPoint(slot.col, slot.row) }
      },
    )

    entries.sort((a, b) => a.point.y - b.point.y)

    entries.forEach(({ slot, buildingId, point }, index) => {
      const level = this.kingdom.buildingLevels[buildingId] || 1
      const container = this.add.container(point.x, point.y)
      this.worldLayer.add(container)

      const shadow = this.add.graphics()
      shadow.fillStyle(0x000000, 0.28)
      shadow.fillEllipse(0, 3, this.tileW * 0.62, this.tileH * 0.44)
      container.add(shadow)

      const glow = this.add.graphics()
      glow.fillStyle(0xffd76a, 0.08 + level * 0.02)
      glow.fillCircle(0, -this.tileW * 0.22, this.tileW * 0.4)
      container.add(glow)

      const g = this.add.graphics()
      container.add(g)

      const draw = this.BUILDING_DRAWERS[buildingId] || this.drawTent
      const topHeight = draw.call(this, g, level, container)

      const stars = this.add
        .text(0, -topHeight - 16, '★'.repeat(level), {
          fontFamily: 'Cinzel, Georgia, serif',
          fontSize: '12px',
          color: '#f6e6b4',
        })
        .setOrigin(0.5)
      stars.setShadow(0, 1, '#000000', 2)
      container.add(stars)

      const scale = 1 + (level - 1) * 0.1
      const wasPlaced = prev && prev.placedBuildings && prev.placedBuildings[slot.id]

      if (!wasPlaced) {
        const delay = this.cinematic ? 80 + index * 100 : 0

        container.setScale(this.cinematic ? 0.3 : 0.05)
        if (this.cinematic) container.setAlpha(0)

        this.tweens.add({
          targets: container,
          scale,
          alpha: 1,
          duration: this.cinematic ? 650 : 620,
          delay,
          ease: 'Back.easeOut',
          onStart: () => {
            if (this.cinematic) this.spawnSparkles(point.x, point.y - 30, 10)
          },
        })

        if (!this.cinematic) this.spawnSparkles(point.x, point.y - 30, 14)
      } else {
        container.setScale(scale)
      }
    })
  }

  addFlag(container, x, y, color = 0xb6423a) {
    const flag = this.add.graphics()
    flag.fillStyle(0x3a2a18, 1)
    flag.fillRect(0, 0, 2, 18)
    flag.fillStyle(color, 1)
    flag.fillTriangle(2, 0, 16, 4, 2, 9)
    flag.setPosition(x, y)
    container.add(flag)
    this.tweens.add({
      targets: flag,
      scaleX: { from: 1, to: 0.55 },
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
    return flag
  }

  isoBox(g, cx, cy, w, h, d, top, left, right, alpha = 1) {
    const t = { x: cx, y: cy - h - d / 2 }
    const r = { x: cx + w / 2, y: cy - h }
    const b = { x: cx, y: cy - h + d / 2 }
    const l = { x: cx - w / 2, y: cy - h }
    const rb = { x: cx + w / 2, y: cy }
    const bb = { x: cx, y: cy + d / 2 }
    const lb = { x: cx - w / 2, y: cy }

    g.fillStyle(left, alpha)
    g.fillPoints([l, b, bb, lb], true)
    g.fillStyle(right, alpha)
    g.fillPoints([b, r, rb, bb], true)
    g.fillStyle(top, alpha)
    g.fillPoints([t, r, b, l], true)

    g.lineStyle(1, 0x000000, 0.16)
    g.strokePoints([t, r, b, l], true)
  }

  pyramidRoof(g, cx, cy, w, d, roofHeight, front, side, back) {
    const apex = { x: cx, y: cy - roofHeight }
    const t = { x: cx, y: cy - d / 2 }
    const r = { x: cx + w / 2, y: cy }
    const b = { x: cx, y: cy + d / 2 }
    const l = { x: cx - w / 2, y: cy }

    g.fillStyle(back, 1)
    g.fillPoints([r, t, apex], true)
    g.fillStyle(side, 1)
    g.fillPoints([b, r, apex], true)
    g.fillStyle(front, 1)
    g.fillPoints([l, b, apex], true)
    g.fillStyle(side, 1)
    g.fillPoints([t, l, apex], true)
  }

  drawTent(g, level) {
    const w = 52 + level * 5
    const h = 44 + level * 5
    g.fillStyle(0xd8bd8a, 1)
    g.fillTriangle(-w / 2, 0, w / 2, 0, 0, -h)
    g.fillStyle(0xb99a66, 1)
    g.fillTriangle(0, -h, w / 2, 0, w / 2 - 8, 2)
    g.fillStyle(0x4a3320, 1)
    g.fillTriangle(-w * 0.16, 0, w * 0.16, 0, 0, -h * 0.62)
    g.fillStyle(0xe8d3a5, 0.7)
    g.fillTriangle(-w / 2, 0, 0, -h, -w * 0.18, 0)
    g.lineStyle(2, 0x6b4c2a, 1)
    g.beginPath()
    g.moveTo(0, -h)
    g.lineTo(0, -h - 20)
    g.strokePath()
    return h + 22
  }

  drawGate(g, level, container) {
    const towerW = 34 + level * 2
    const towerH = 62 + level * 6
    const gap = 44
    this.isoBox(g, -gap / 2, 0, towerW, towerH, 22, 0x9a8f7a, 0x6f6656, 0x807764)
    this.isoBox(g, gap / 2, 0, towerW, towerH, 22, 0x9a8f7a, 0x6f6656, 0x807764)

    g.fillStyle(0x5a5245, 1)
    g.fillRect(-gap / 2, -towerH * 0.72, gap, towerH * 0.72)
    g.fillStyle(0x2c251b, 1)
    g.fillRoundedRect(-13, -towerH * 0.56, 26, towerH * 0.56, { tl: 13, tr: 13, bl: 0, br: 0 })
    g.fillStyle(0xd8b75f, 0.9)
    for (let i = 0; i < 3; i++) {
      g.fillCircle(-gap / 2 - 8 + i * 8, -towerH - 4, 2)
      g.fillCircle(gap / 2 - 8 + i * 8, -towerH - 4, 2)
    }
    this.addFlag(container, gap / 2, -towerH - 18, 0xb6423a)
    return towerH + 20
  }

  drawMine(g, level, container) {
    const w = 66 + level * 4
    const h = 48 + level * 4
    g.fillStyle(0x6f665a, 1)
    g.fillPoints(
      [
        { x: -w / 2, y: 0 },
        { x: -w * 0.28, y: -h },
        { x: w * 0.1, y: -h * 0.86 },
        { x: w / 2, y: 0 },
      ],
      true,
    )
    g.fillStyle(0x8b8273, 1)
    g.fillPoints(
      [
        { x: -w * 0.28, y: -h },
        { x: w * 0.1, y: -h * 0.86 },
        { x: w * 0.02, y: -h * 0.42 },
        { x: -w * 0.2, y: -h * 0.5 },
      ],
      true,
    )
    g.fillStyle(0x241c12, 1)
    g.fillRoundedRect(-15, -h * 0.5, 30, h * 0.5, { tl: 15, tr: 15, bl: 0, br: 0 })
    g.fillStyle(0x5a3c22, 1)
    g.fillRect(-20, -h * 0.52, 5, h * 0.52)
    g.fillRect(15, -h * 0.52, 5, h * 0.52)
    g.fillStyle(0xffd76a, 1)
    g.fillCircle(-24, -10, 4)
    g.fillCircle(25, -18, 3)
    g.fillCircle(18, -6, 2.5)
    this.addFlag(container, w * 0.22, -h * 0.86, 0xe3bd5f)
    return h + 16
  }

  drawCamp(g, level, container) {
    const h = 34 + level * 4
    g.fillStyle(0xc9ad78, 1)
    g.fillTriangle(-42, 0, -6, 0, -24, -h)
    g.fillStyle(0xa98c5c, 1)
    g.fillTriangle(-6, 0, 8, 0, -4, -h * 0.78)
    g.fillStyle(0x4a3320, 1)
    g.fillTriangle(-32, 0, -18, 0, -24, -h * 0.55)
    g.fillStyle(0xd8bd8a, 1)
    g.fillTriangle(14, 0, 48, 0, 31, -h * 0.9)
    g.fillStyle(0x4a3320, 1)
    g.fillTriangle(24, 0, 38, 0, 31, -h * 0.5)
    g.fillStyle(0x8a6a3c, 1)
    g.fillCircle(0, -6, 5)
    g.fillStyle(0xff9a3c, 0.9)
    g.fillCircle(0, -8, 3)
    g.fillStyle(0xffd76a, 0.5)
    g.fillCircle(0, -12, 6)
    this.addFlag(container, 31, -h * 0.9 - 16, 0x3f6f36)
    return h + 18
  }

  drawHouses(g, level, container) {
    const scale = 1 + (level - 1) * 0.06
    this.isoBox(g, -18 * scale, 0, 38 * scale, 30 * scale, 20 * scale, 0xd9cbaa, 0x9c8c6a, 0xb3a37f)
    this.pyramidRoof(g, -18 * scale, -30 * scale, 44 * scale, 24 * scale, 20 * scale, 0xa65c34, 0x7d4225, 0x6d3a20)
    this.isoBox(g, 20 * scale, 0, 32 * scale, 24 * scale, 18 * scale, 0xd9cbaa, 0x9c8c6a, 0xb3a37f)
    this.pyramidRoof(g, 20 * scale, -24 * scale, 38 * scale, 22 * scale, 18 * scale, 0xa65c34, 0x7d4225, 0x6d3a20)
    g.fillStyle(0x3a2a18, 1)
    g.fillRect(-23 * scale, -20 * scale, 9 * scale, 12 * scale)
    g.fillRect(15 * scale, -16 * scale, 8 * scale, 11 * scale)
    g.fillStyle(0xffd76a, 0.8)
    g.fillRect(-10 * scale, -24 * scale, 5 * scale, 5 * scale)
    g.fillRect(25 * scale, -19 * scale, 4 * scale, 4 * scale)
    this.addFlag(container, -18 * scale, -56 * scale, 0xb6423a)
    return 78 * scale
  }

  drawWatchtower(g, level, container) {
    const h = 64 + level * 8
    this.isoBox(g, 0, 0, 34, h, 22, 0x9a8f7a, 0x6f6656, 0x807764)
    this.isoBox(g, 0, -h, 42, 12, 26, 0xa99d86, 0x7a7060, 0x8b8170)
    this.pyramidRoof(g, 0, -h - 12, 46, 28, 26, 0x8a4b2a, 0x6d3a20, 0x5a301a)
    g.fillStyle(0x2c251b, 1)
    g.fillRect(-5, -h * 0.72, 10, 14)
    g.fillStyle(0xffd76a, 0.8)
    g.fillRect(-4, -h * 0.72 + 3, 8, 4)
    g.fillStyle(0x000000, 0.25)
    g.fillRect(-17, -h * 0.4, 34, 3)
    this.addFlag(container, 0, -h - 36, 0xe3bd5f)
    return h + 38
  }

  drawWarehouse(g, level, container) {
    const w = 62 + level * 3
    this.isoBox(g, 0, 0, w, 32, 30, 0xc9ad78, 0x8f7448, 0xa98c5c)
    this.pyramidRoof(g, 0, -32, w + 8, 36, 24, 0x8a4b2a, 0x6d3a20, 0x5a301a)
    g.fillStyle(0x3a2a18, 1)
    g.fillRect(-11, -24, 22, 24)
    g.fillStyle(0x5a3c22, 1)
    g.fillRect(-13, -26, 26, 3)
    g.fillStyle(0x9c6b3f, 1)
    g.fillRect(-30, -12, 12, 12)
    g.fillRect(19, -10, 11, 10)
    g.lineStyle(1, 0x5a3c22, 0.8)
    g.strokeRect(-30, -12, 12, 12)
    g.strokeRect(19, -10, 11, 10)
    this.addFlag(container, 0, -58, 0xb6423a)
    return 70
  }

  drawBridge(g, level) {
    const w = 78 + level * 4
    g.fillStyle(0x7a6a4f, 0.85)
    g.fillPoints(this.diamond(0, 0, w, w * 0.5), true)
    g.fillStyle(0x9c8c6a, 1)
    for (let i = -3; i <= 3; i++) {
      g.fillRect(i * 10 - 4, -8, 8, 5)
    }
    g.fillStyle(0x6f6656, 1)
    g.fillRect(-w / 2, -18, w, 4)
    g.fillRect(-w / 2, 8, w, 4)
    g.fillStyle(0x8b8273, 1)
    for (let i = -3; i <= 3; i += 2) {
      g.fillRect(i * 10, -18, 3, 26)
    }
    g.lineStyle(2, 0xe3bd5f, 0.5)
    g.strokePoints(this.diamond(0, 0, w, w * 0.5), true)
    return 28
  }

  drawWalls(g, level, container) {
    const h = 40 + level * 5
    for (let i = -1; i <= 1; i++) {
      const x = i * 34
      this.isoBox(g, x, 0, 34, h, 18, 0x9a8f7a, 0x6f6656, 0x807764)
      g.fillStyle(0x9a8f7a, 1)
      g.fillRect(x - 14, -h - 7, 7, 7)
      g.fillRect(x - 3, -h - 7, 7, 7)
      g.fillRect(x + 8, -h - 7, 7, 7)
    }
    g.fillStyle(0x2c251b, 1)
    g.fillRect(-8, -h * 0.6, 16, h * 0.6)
    g.fillStyle(0xb6423a, 0.9)
    g.fillRect(-30, -h - 24, 16, 20)
    g.fillStyle(0xe3bd5f, 1)
    g.fillCircle(-22, -14, 3)
    this.addFlag(container, 34, -h - 20, 0xb6423a)
    return h + 28
  }

  drawCastle(g, level, container) {
    const boost = 1 + (level - 1) * 0.08
    const keepW = 54 * boost
    const keepH = 74 * boost

    g.fillStyle(0xffd76a, 0.1)
    g.fillCircle(0, -70 * boost, 96 * boost)

    this.isoBox(g, 0, 0, keepW, keepH, 34, 0xa99d86, 0x7a7060, 0x8b8170)
    this.isoBox(g, -44 * boost, 0, 30 * boost, 54 * boost, 24, 0x9a8f7a, 0x6f6656, 0x807764)
    this.isoBox(g, 44 * boost, 0, 30 * boost, 54 * boost, 24, 0x9a8f7a, 0x6f6656, 0x807764)

    this.pyramidRoof(g, -44 * boost, -54 * boost, 36 * boost, 28, 24, 0x8a4b2a, 0x6d3a20, 0x5a301a)
    this.pyramidRoof(g, 44 * boost, -54 * boost, 36 * boost, 28, 24, 0x8a4b2a, 0x6d3a20, 0x5a301a)
    this.pyramidRoof(g, 0, -keepH, 62 * boost, 38, 34 * boost, 0x8a4b2a, 0x6d3a20, 0x5a301a)

    g.fillStyle(0x2c251b, 1)
    g.fillRoundedRect(-13, -keepH * 0.58, 26, keepH * 0.58, { tl: 13, tr: 13, bl: 0, br: 0 })
    g.fillStyle(0x5a3c22, 1)
    g.fillRect(-15, -keepH * 0.62, 30, 4)

    g.fillStyle(0xffd76a, 0.9)
    g.fillRect(-20, -keepH * 0.78, 7, 9)
    g.fillRect(13, -keepH * 0.78, 7, 9)
    g.fillStyle(0x2c251b, 1)
    g.fillRect(-18, -keepH * 0.78, 3, 9)
    g.fillRect(15, -keepH * 0.78, 3, 9)

    this.addFlag(container, 0, -keepH - 66 * boost, 0xe3bd5f)
    this.addFlag(container, -44 * boost, -54 * boost - 24, 0xb6423a)
    this.addFlag(container, 44 * boost, -54 * boost - 24, 0xb6423a)

    return keepH + 70 * boost
  }

  get BUILDING_DRAWERS() {
    return {
      tent: this.drawTent,
      gate: this.drawGate,
      mine: this.drawMine,
      camp: this.drawCamp,
      houses: this.drawHouses,
      watchtower: this.drawWatchtower,
      warehouse: this.drawWarehouse,
      bridge: this.drawBridge,
      walls: this.drawWalls,
      castle: this.drawCastle,
    }
  }

  spawnSparkles(x, y, quantity = 12) {
    try {
      const emitter = this.add.particles(x, y, 'ck-spark', {
        speed: { min: 30, max: 130 },
        angle: { min: 0, max: 360 },
        lifespan: { min: 420, max: 780 },
        scale: { start: 0.7, end: 0 },
        alpha: { start: 0.95, end: 0 },
        blendMode: 'ADD',
        quantity,
        emitting: false,
      })
      emitter.explode(quantity)
      this.time.delayedCall(1200, () => emitter.destroy())
    } catch {
      // particles are decorative only
    }
  }

  drawAmbient(width, height) {
    const cloudColor = 0xdff0ff
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.graphics()
      cloud.fillStyle(cloudColor, 0.055)
      const cx = (width / 4) * i + 40
      const cy = 42 + (i % 2) * 26
      cloud.fillEllipse(cx, cy, 90, 28)
      cloud.fillEllipse(cx + 32, cy - 8, 64, 24)
      cloud.fillEllipse(cx - 26, cy + 4, 58, 20)
      this.ambientLayer.add(cloud)
      this.tweens.add({
        targets: cloud,
        x: { from: -20, to: 30 },
        alpha: { from: 0.6, to: 1 },
        duration: 9000 + i * 1400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    }

    for (let i = 0; i < 16; i++) {
      const angle = i * 2.399
      const radius = 90 + ((i * 53) % 260)
      const x = width / 2 + Math.cos(angle) * radius
      const y = height * 0.5 + Math.sin(angle) * radius * 0.42
      const firefly = this.add.circle(x, y, 1.8 + (i % 3) * 0.6, 0xffe9a8, 0.7)
      this.ambientLayer.add(firefly)
      this.tweens.add({
        targets: firefly,
        y: y - 16 - (i % 5) * 5,
        alpha: { from: 0.15, to: 0.85 },
        duration: 1700 + (i % 6) * 320,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 90,
      })
    }
  }
}
