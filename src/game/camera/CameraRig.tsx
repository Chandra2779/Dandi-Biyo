import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { runtime } from '../runtime'
import { biyoApi } from '../biyoApi'
import { damp } from '../../utils/math'
import type { GamePhase } from '../../stores/types'

const REST_POS = new THREE.Vector3(0, 2.6, 14.2)
const REST_LOOK = new THREE.Vector3(0, 0.7, 8.4)
const AIM_POS = new THREE.Vector3(0, 2.9, 13.4)
const AIM_LOOK = new THREE.Vector3(0, 0.9, 7.6)
const TIMING_POS = new THREE.Vector3(0, 3.6, 12.0)
const TIMING_LOOK = new THREE.Vector3(0, 1.6, 7.4)

const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()

export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const lookTarget = useRef(new THREE.Vector3().copy(REST_LOOK))

  useFrame((state, rawDelta) => {
    const s = useGameStore.getState()
    const d = Math.min(rawDelta, 0.05)
    const sens = useSettingsStore.getState().cameraSensitivity
    const lambda = 2.6 * sens
    const lambdaLook = 4.5 * sens

    let desiredPos: THREE.Vector3
    let desiredLook: THREE.Vector3

    if (s.screen === 'menu') {
      const t = state.clock.elapsedTime * 0.06
      desiredPos = new THREE.Vector3(
        Math.sin(t) * 10,
        3.4,
        14 + Math.cos(t) * 4,
      )
      desiredLook = new THREE.Vector3(0, 0.8, 6)
    } else {
      const phase = s.phase as GamePhase
      const biyoPos = biyoApi.body ? biyoApi.position() : new THREE.Vector3(0, 0, 8)
      const isFlight = phase === 'STRIKING' || phase === 'FLIGHT'

      if (phase === 'AIMING' || phase === 'SETUP' || phase === 'NEXT_TURN') {
        desiredPos = AIM_POS.clone()
        desiredLook = AIM_LOOK.clone()
      } else if (phase === 'LIFTING' || phase === 'TIMING') {
        desiredPos = TIMING_POS.clone()
        desiredLook = TIMING_LOOK.clone()
      } else if (isFlight) {
        tmp.copy(biyoPos)
        tmp2.copy(biyoPos).sub(tmp.clone())
        desiredLook = biyoPos.clone()
        const dir = biyoApi.body
          ? tmp2
              .copy(new THREE.Vector3(biyoPos.x, biyoPos.y, biyoPos.z))
              .sub(runtime.biyoStart)
          : tmp2.set(0, 0, -1)
        if (dir.lengthSq() > 0.01) dir.normalize()
        else dir.set(0, 0, -1)
        desiredPos = biyoPos
          .clone()
          .add(dir.multiplyScalar(5.5))
          .add(new THREE.Vector3(0, 2.4, 0))
        if (desiredPos.y < 1.2) desiredPos.y = 1.2
      } else if (phase === 'LANDING' || phase === 'RESULT') {
        const land = runtime.biyoLanding
        const mid = new THREE.Vector3(
          (runtime.biyoStart.x + (land?.x ?? 0)) / 2,
          0,
          (runtime.biyoStart.z + (land?.z ?? 0)) / 2,
        )
        desiredPos = mid.add(new THREE.Vector3(0, 6, 8.5))
        desiredLook = new THREE.Vector3(land?.x ?? 0, 0, land?.z ?? 0)
      } else {
        desiredPos = REST_POS.clone()
        desiredLook = REST_LOOK.clone()
      }
    }

    camera.position.x = damp(camera.position.x, desiredPos.x, lambda, d)
    camera.position.y = damp(camera.position.y, desiredPos.y, lambda, d)
    camera.position.z = damp(camera.position.z, desiredPos.z, lambda, d)

    lookTarget.current.x = damp(lookTarget.current.x, desiredLook.x, lambdaLook, d)
    lookTarget.current.y = damp(lookTarget.current.y, desiredLook.y, lambdaLook, d)
    lookTarget.current.z = damp(lookTarget.current.z, desiredLook.z, lambdaLook, d)
    camera.lookAt(lookTarget.current)
  })

  return null
}
