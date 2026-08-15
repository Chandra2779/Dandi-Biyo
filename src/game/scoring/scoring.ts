import * as THREE from 'three'
import type { TimingQuality } from '../../stores/types'
import { horizontalDistance } from '../../utils/math'
import { QUALITY_MULTIPLIER } from '../physics/constants'

export interface ScoreBreakdown {
  distance: number
  score: number
  multiplier: number
  quality: TimingQuality
}

export function distanceBetween(start: THREE.Vector3, end: THREE.Vector3): number {
  return horizontalDistance(start, end)
}

export function computeScore(distance: number, quality: TimingQuality): ScoreBreakdown {
  const multiplier = QUALITY_MULTIPLIER[quality] || 1
  const score = Math.round(distance * multiplier * 10) / 10
  return { distance, score, multiplier, quality }
}

export function formatDistance(meters: number): string {
  return `${meters.toFixed(1)}`
}

export function formatScore(score: number): string {
  return score.toFixed(1)
}
