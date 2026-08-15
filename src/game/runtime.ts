import type { TimingQuality } from '../stores/types'

export interface Runtime {
  aimAngle: number
  aimElevation: number
  power: number
  charging: boolean
  timing: number
  timingActive: boolean
  flightStart: number
  liftStart: number
  landed: boolean
  biyoStart: { x: number; y: number; z: number }
  biyoLanding: { x: number; y: number; z: number } | null
  markedDistance: number
  swingAnim: number
  aiBusy: boolean
  struck: boolean
  missed: boolean
  strikeQuality: TimingQuality
  strikeAccuracy: number
  caught: boolean
}

export const runtime: Runtime = {
  aimAngle: 0,
  aimElevation: 0.5,
  power: 0,
  charging: false,
  timing: 0,
  timingActive: false,
  flightStart: 0,
  liftStart: 0,
  landed: false,
  biyoStart: { x: 0, y: 0.12, z: 10 },
  biyoLanding: null,
  markedDistance: 0,
  swingAnim: 0,
  aiBusy: false,
  struck: false,
  missed: false,
  strikeQuality: 'GOOD',
  strikeAccuracy: 1,
  caught: false,
}

export function resetRuntime() {
  runtime.aimAngle = 0
  runtime.aimElevation = 0.5
  runtime.power = 0
  runtime.charging = false
  runtime.timing = 0
  runtime.timingActive = false
  runtime.flightStart = 0
  runtime.liftStart = 0
  runtime.landed = false
  runtime.biyoStart = { x: 0, y: 0.12, z: 10 }
  runtime.biyoLanding = null
  runtime.markedDistance = 0
  runtime.swingAnim = 0
  runtime.aiBusy = false
  runtime.struck = false
  runtime.missed = false
  runtime.strikeQuality = 'GOOD'
  runtime.strikeAccuracy = 1
  runtime.caught = false
}
