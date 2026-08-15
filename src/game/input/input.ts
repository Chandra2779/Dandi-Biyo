import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { runtime } from '../runtime'
import * as actions from '../actions'
import { clamp } from '../../utils/math'

export const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
}

const AIM_LIMIT = 0.9
const ELEV_MIN = 0.15
const ELEV_MAX = 1.25

function inGame(): boolean {
  return useGameStore.getState().screen === 'game'
}

function isAiTurn(): boolean {
  const s = useGameStore.getState()
  return s.mode === 'single' && s.currentPlayer === 1
}

function isUiTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('button, input, select, textarea, [data-ui]') !== null
}

function isInteractivePhase(phase: string): boolean {
  return phase === 'AIMING' || phase === 'TIMING'
}

export function initInput(): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    const s = useGameStore.getState()
    const key = e.key.toLowerCase()

    if (s.phase === 'PAUSED') {
      if (key === 'escape' || key === 'p') {
        e.preventDefault()
        s.resume()
      }
      return
    }

    if (!inGame()) return

    switch (key) {
      case 'w':
      case 'arrowup':
        input.up = true
        break
      case 's':
      case 'arrowdown':
        input.down = true
        break
      case 'a':
      case 'arrowleft':
        input.left = true
        break
      case 'd':
      case 'arrowright':
        input.right = true
        break
      case ' ':
        if (e.repeat) break
        e.preventDefault()
        input.space = true
        if (isAiTurn()) break
        if (s.phase === 'AIMING') actions.startCharge()
        else if (s.phase === 'TIMING') actions.strikePress()
        break
      case 'escape':
      case 'p':
        e.preventDefault()
        if (isInteractivePhase(s.phase)) s.togglePause()
        break
      case 'r': {
        const p = useGameStore.getState().phase
        if (p === 'GAME_OVER' || p === 'RESULT' || p === 'PAUSED') s.restartGame()
        break
      }
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    if (key === 'w' || key === 'arrowup') input.up = false
    if (key === 's' || key === 'arrowdown') input.down = false
    if (key === 'a' || key === 'arrowleft') input.left = false
    if (key === 'd' || key === 'arrowright') input.right = false
    if (key === ' ') {
      input.space = false
      actions.releaseCharge()
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!inGame() || isAiTurn()) return
    const s = useGameStore.getState()
    if (s.phase !== 'AIMING') return
    const sens = 0.006 * useSettingsStore.getState().controlSensitivity
    runtime.aimAngle = clamp(runtime.aimAngle + e.movementX * sens, -AIM_LIMIT, AIM_LIMIT)
    runtime.aimElevation = clamp(runtime.aimElevation - e.movementY * sens * 0.55, ELEV_MIN, ELEV_MAX)
  }

  const onMouseDown = (e: MouseEvent) => {
    if (!inGame() || isUiTarget(e.target)) return
    if (e.button !== 0) return
    if (isAiTurn()) return
    const s = useGameStore.getState()
    if (s.phase === 'AIMING') actions.startCharge()
    else if (s.phase === 'TIMING') actions.strikePress()
  }

  const onMouseUp = (e: MouseEvent) => {
    if (e.button !== 0) return
    actions.releaseCharge()
  }

  const onTouchStart = (e: TouchEvent) => {
    if (!inGame() || isUiTarget(e.target)) return
    if (isAiTurn()) return
    const s = useGameStore.getState()
    if (s.phase === 'AIMING') actions.startCharge()
    else if (s.phase === 'TIMING') actions.strikePress()
  }

  const onTouchEnd = (e: TouchEvent) => {
    void e
    actions.releaseCharge()
  }

  const onBlur = () => {
    input.up = input.down = input.left = input.right = input.space = false
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('blur', onBlur)

  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('blur', onBlur)
  }
}
