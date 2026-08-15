export const PHYSICS = {
  gravity: -9.81,
  groundY: 0,
  biyoRadius: 0.03,
  biyoLength: 0.16,
  biyoMass: 0.12,
  dandiLength: 0.9,
  dandiRadius: 0.015,
  biyoStart: { x: 0, y: 0.12, z: 10 },
  strikeOrigin: { x: 0, y: 0.3, z: 12 },
}

export const CHARGE_SPEED = 0.75
export const TIMING_WINDOW = 2.0
export const TIMING_CENTER = 0.5

export const TIMING_ZONES = {
  perfect: 0.06,
  great: 0.15,
  good: 0.34,
} as const

export const QUALITY_MULTIPLIER = {
  PERFECT: 1.2,
  GREAT: 1.1,
  GOOD: 1.0,
  MISS: 0,
} as const

export const POWER_CURVE = 1.35

export const CATCH_THRESHOLD = 25
