import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../stores/gameStore'
import type { Difficulty } from '../../stores/types'
import { runtime } from '../runtime'
import * as actions from '../actions'
import { damp, randRange, clamp } from '../../utils/math'

interface AIMove {
  angle: number
  elevation: number
  power: number
  timing: number
  reaction: number
}

type AIStage = 'idle' | 'aiming' | 'charging' | 'waiting-strike' | 'done'

interface AIState {
  stage: AIStage
  t: number
}

const DIFFICULTY_PARAMS: Record<Difficulty, { aimErr: number; elevErr: number; power: [number, number]; timingErr: number; reaction: [number, number] }> = {
  easy: { aimErr: 0.35, elevErr: 0.22, power: [0.45, 0.7], timingErr: 0.3, reaction: [0.7, 1.3] },
  medium: { aimErr: 0.16, elevErr: 0.1, power: [0.6, 0.82], timingErr: 0.14, reaction: [0.4, 0.8] },
  hard: { aimErr: 0.05, elevErr: 0.04, power: [0.72, 0.95], timingErr: 0.05, reaction: [0.2, 0.45] },
}

function planMove(difficulty: Difficulty): AIMove {
  const p = DIFFICULTY_PARAMS[difficulty]
  return {
    angle: randRange(-1, 1) * p.aimErr,
    elevation: clamp(0.5 + randRange(-1, 1) * p.elevErr, 0.25, 0.95),
    power: randRange(p.power[0], p.power[1]),
    timing: clamp(0.5 + randRange(-1, 1) * p.timingErr, 0.12, 0.92),
    reaction: randRange(p.reaction[0], p.reaction[1]),
  }
}

export function AIController() {
  const mode = useGameStore((s) => s.mode)
  const currentPlayer = useGameStore((s) => s.currentPlayer)
  const difficulty = useGameStore((s) => s.difficulty)
  const phase = useGameStore((s) => s.phase)
  const stateRef = useRef<AIState>({ stage: 'idle', t: 0 })
  const moveRef = useRef<AIMove>(planMove('medium'))

  const isAiTurn = mode === 'single' && currentPlayer === 1

  useEffect(() => {
    if (isAiTurn && phase === 'SETUP') {
      stateRef.current = { stage: 'idle', t: 0 }
      moveRef.current = planMove(difficulty)
      runtime.aiBusy = true
    }
    if (phase === 'RESULT' || phase === 'GAME_OVER') {
      runtime.aiBusy = false
    }
  }, [isAiTurn, phase, difficulty])

  useFrame((_, rawDelta) => {
    const s = useGameStore.getState()
    if (!isAiTurn || s.phase === 'PAUSED') return
    if (s.phase !== 'SETUP' && s.phase !== 'AIMING' && s.phase !== 'TIMING' && s.phase !== 'LIFTING') return
    const d = Math.min(rawDelta, 0.05)
    const st = stateRef.current
    const move = moveRef.current
    st.t += d

    switch (st.stage) {
      case 'idle': {
        if (st.t >= move.reaction) {
          st.stage = 'aiming'
          st.t = 0
        }
        break
      }
      case 'aiming': {
        runtime.aimAngle = damp(runtime.aimAngle, move.angle, 5, d)
        runtime.aimElevation = damp(runtime.aimElevation, move.elevation, 5, d)
        if (Math.abs(runtime.aimAngle - move.angle) < 0.04 && st.t > 0.25) {
          runtime.power = 0
          actions.startCharge()
          st.stage = 'charging'
        }
        break
      }
      case 'charging': {
        if (s.phase === 'AIMING' && runtime.charging && runtime.power >= move.power) {
          actions.releaseCharge()
          st.stage = 'waiting-strike'
        }
        break
      }
      case 'waiting-strike': {
        if (s.phase === 'TIMING' && runtime.timingActive && runtime.timing >= move.timing) {
          actions.strikePress()
          st.stage = 'done'
        }
        break
      }
      case 'done': {
        break
      }
    }
  })

  return null
}
