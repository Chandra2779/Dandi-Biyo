import * as THREE from 'three'
import { useGameStore } from '../stores/gameStore'
import type { TimingQuality, TurnResult } from '../stores/types'
import { biyoApi } from './biyoApi'
import { audio } from '../audio/AudioManager'
import { runtime } from './runtime'
import { computeScore } from './scoring/scoring'
import { horizontalDistance } from '../utils/math'
import { TIMING_CENTER, TIMING_ZONES, CATCH_THRESHOLD } from './physics/constants'

export function canInteract(): boolean {
  const s = useGameStore.getState()
  if (s.paused || s.screen !== 'game') return false
  return true
}

export function startCharge() {
  const s = useGameStore.getState()
  if (s.phase !== 'AIMING') return
  runtime.charging = true
}

export function releaseCharge() {
  const s = useGameStore.getState()
  if (s.phase !== 'AIMING' || !runtime.charging) return
  runtime.charging = false
  const power = runtime.power
  biyoApi.lift({ power, angle: runtime.aimAngle, elevation: runtime.aimElevation })
  runtime.liftStart = performance.now()
  runtime.flightStart = performance.now()
  runtime.timing = 0
  runtime.timingActive = true
  audio.play('swing')
  s.setPhase('TIMING')
}

export function strikePress() {
  const s = useGameStore.getState()
  if (s.phase !== 'TIMING' || !runtime.timingActive) return
  const t = runtime.timing
  const quality = timingQualityFor(t)
  const accuracy = accuracyFor(t)
  runtime.timingActive = false
  runtime.struck = true
  runtime.missed = false
  runtime.strikeQuality = quality
  runtime.strikeAccuracy = accuracy
  runtime.swingAnim = 1
  const power = runtime.power
  const lin = biyoApi.body?.linvel()
  const fallSpeed = lin ? lin.y : 0
  biyoApi.strike({
    power,
    angle: runtime.aimAngle,
    elevation: runtime.aimElevation,
    quality,
    fallSpeed,
  })
  if (quality === 'PERFECT') audio.play('perfect')
  else audio.play('biyo-hit')
  s.setPhase('STRIKING')
  window.setTimeout(() => {
    if (useGameStore.getState().phase === 'STRIKING') useGameStore.getState().setPhase('FLIGHT')
  }, 260)
}

function timingQualityFor(t: number): TimingQuality {
  const d = Math.abs(t - TIMING_CENTER)
  if (d <= TIMING_ZONES.perfect) return 'PERFECT'
  if (d <= TIMING_ZONES.great) return 'GREAT'
  return 'GOOD'
}

function accuracyFor(t: number): number {
  const d = Math.abs(t - TIMING_CENTER)
  if (d <= TIMING_ZONES.perfect) return 1
  if (d <= TIMING_ZONES.great) return 0.92
  if (d <= TIMING_ZONES.good) return 0.82
  return 0.62
}

export function onTimingExpired() {
  const s = useGameStore.getState()
  if (s.phase !== 'TIMING' || !runtime.timingActive) return
  runtime.timingActive = false
  runtime.missed = true
  audio.play('miss')
  s.setPhase('FLIGHT')
}

export function attemptCatch() {
  const s = useGameStore.getState()
  if (s.mode !== 'single') return
  const pos = biyoApi.position()
  const start = new THREE.Vector3(runtime.biyoStart.x, 0, runtime.biyoStart.z)
  const dist = horizontalDistance(start, new THREE.Vector3(pos.x, 0, pos.z))
  if (dist < CATCH_THRESHOLD) return false
  const accuracy = aiCatchAccuracy()
  if (Math.random() < accuracy) {
    runtime.caught = true
    return true
  }
  return false
}

function aiCatchAccuracy(): number {
  const difficulty = useGameStore.getState().difficulty
  if (difficulty === 'easy') return 0.08
  if (difficulty === 'medium') return 0.22
  return 0.42
}

export function onLand() {
  const s = useGameStore.getState()
  if (s.phase !== 'FLIGHT' && s.phase !== 'TIMING' && s.phase !== 'STRIKING') return
  runtime.landed = true
  const pos = biyoApi.position()
  runtime.biyoLanding = { x: pos.x, y: pos.y, z: pos.z }
  audio.play('ground-hit')
  const start = new THREE.Vector3(runtime.biyoStart.x, 0, runtime.biyoStart.z)
  const end = new THREE.Vector3(pos.x, 0, pos.z)
  const rawDistance = horizontalDistance(start, end)

  let distance = rawDistance
  let quality: TimingQuality = runtime.missed ? 'MISS' : runtime.strikeQuality

  if (runtime.caught) {
    distance = 0
    quality = 'MISS'
  } else if (!runtime.struck) {
    quality = 'MISS'
  }

  const breakdown = computeScore(distance, quality)
  const caught = runtime.caught
  const result: TurnResult = {
    distance: breakdown.distance,
    score: breakdown.score,
    quality,
    success: breakdown.score > 0 && quality !== 'MISS',
    caught,
    playerName: s.players[s.currentPlayer]?.name ?? 'PLAYER',
  }
  runtime.markedDistance = breakdown.distance
  s.registerResult(result)
  s.setPhase('RESULT')
  if (breakdown.score > 0 && quality !== 'MISS') audio.play('success')
}

export function detectMissFall(now: number): boolean {
  if (!runtime.timingActive || now - runtime.liftStart < 450) return false
  const pos = biyoApi.position()
  if (pos.y < 0.08 && now - runtime.liftStart > 650) {
    onTimingExpired()
    return true
  }
  return false
}

export function shouldLand(): boolean {
  const s = useGameStore.getState()
  if (s.phase !== 'FLIGHT' && s.phase !== 'TIMING' && s.phase !== 'STRIKING') return false
  if (now() - runtime.flightStart < 350) return false
  const pos = biyoApi.position()
  return pos.y <= 0.1
}

function now(): number {
  return performance.now()
}
