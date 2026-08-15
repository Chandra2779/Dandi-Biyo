import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'
import { runtime } from './runtime'
import * as actions from './actions'
import { biyoApi } from './biyoApi'
import { input } from './input/input'
import { CHARGE_SPEED, TIMING_WINDOW } from './physics/constants'
import { clamp } from '../utils/math'

const AIM_LIMIT = 0.9
const ELEV_MIN = 0.15
const ELEV_MAX = 1.25

export function GameplayController() {
  const phase = useGameStore((s) => s.phase)
  const catchRolled = useRef(false)
  const setupStart = useRef(0)

  useEffect(() => {
    if (phase === 'SETUP') {
      catchRolled.current = false
      setupStart.current = performance.now()
      runtime.aimAngle = 0
      runtime.aimElevation = 0.5
      runtime.power = 0
      runtime.charging = false
      runtime.timing = 0
      runtime.timingActive = false
      runtime.swingAnim = 0
      runtime.struck = false
      runtime.missed = false
      runtime.caught = false
      biyoApi.reset(runtime.biyoStart)
    }
  }, [phase])

  useFrame((_, rawDelta) => {
    const s = useGameStore.getState()
    if (s.screen !== 'game' || s.phase === 'PAUSED') return
    const d = Math.min(rawDelta, 0.05)
    const sens = useSettingsStore.getState().controlSensitivity
    const aimSpeed = 0.9 * sens

    if (input.left) runtime.aimAngle = clamp(runtime.aimAngle + aimSpeed * d, -AIM_LIMIT, AIM_LIMIT)
    if (input.right) runtime.aimAngle = clamp(runtime.aimAngle - aimSpeed * d, -AIM_LIMIT, AIM_LIMIT)
    if (input.up) runtime.aimElevation = clamp(runtime.aimElevation + aimSpeed * 0.8 * d, ELEV_MIN, ELEV_MAX)
    if (input.down) runtime.aimElevation = clamp(runtime.aimElevation - aimSpeed * 0.8 * d, ELEV_MIN, ELEV_MAX)

    switch (s.phase) {
      case 'SETUP': {
        if (performance.now() - setupStart.current > 400) {
          s.setPhase('AIMING')
        }
        break
      }
      case 'AIMING': {
        if (runtime.charging) {
          runtime.power = (runtime.power + CHARGE_SPEED * d) % 1
        }
        break
      }
      case 'TIMING': {
        if (runtime.timingActive) {
          runtime.timing += d / TIMING_WINDOW
          if (runtime.timing >= 1) {
            runtime.timing = 1
            actions.onTimingExpired()
          }
        }
        actions.detectMissFall(performance.now())
        break
      }
      case 'STRIKING':
      case 'FLIGHT': {
        if (actions.shouldLand()) {
          actions.onLand()
          break
        }
        if (
          s.mode === 'single' &&
          s.currentPlayer === 0 &&
          !runtime.caught &&
          !catchRolled.current &&
          performance.now() - runtime.flightStart > 900
        ) {
          catchRolled.current = true
          actions.attemptCatch()
        }
        break
      }
      case 'RESULT': {
        if (runtime.swingAnim > 0) runtime.swingAnim = Math.max(0, runtime.swingAnim - d * 3)
        break
      }
    }

    if (runtime.swingAnim > 0 && s.phase !== 'RESULT') {
      runtime.swingAnim = Math.max(0, runtime.swingAnim - d * 3)
    }
  })

  return null
}
