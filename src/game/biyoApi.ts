import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { POWER_CURVE, QUALITY_MULTIPLIER } from './physics/constants'
import type { TimingQuality } from '../stores/types'

export interface BiyoHandle {
  body: RapierRigidBody | null
  set: (body: RapierRigidBody | null) => void
  position: () => THREE.Vector3
  reset: (start: { x: number; y: number; z: number }) => void
  lift: (opts: { power: number; angle: number; elevation: number }) => void
  strike: (opts: {
    power: number
    angle: number
    elevation: number
    quality: TimingQuality
    fallSpeed: number
  }) => void
}

export const biyoApi: BiyoHandle = {
  body: null,
  set(body) {
    this.body = body
  },
  position() {
    const t = this.body?.translation()
    return t ? new THREE.Vector3(t.x, t.y, t.z) : new THREE.Vector3(0, 0, 0)
  },
  reset(start) {
    const b = this.body
    if (!b) return
    b.setEnabled(true)
    b.setTranslation({ x: start.x, y: start.y, z: start.z }, true)
    b.setLinvel({ x: 0, y: 0, z: 0 }, true)
    b.setAngvel({ x: 0, y: 0, z: 0 }, true)
    b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
  },
  lift({ power, angle, elevation }) {
    const b = this.body
    if (!b) return
    const effPower = Math.pow(power, POWER_CURVE)
    const up = 4.5 + effPower * 7.5
    const forward = 0.4 + effPower * 1.6
    b.setLinvel(
      {
        x: Math.sin(angle) * forward,
        y: up,
        z: -Math.cos(angle) * forward,
      },
      true,
    )
    const spin = (0.5 + effPower) * 14
    b.setAngvel({ x: spin, y: 0, z: spin * 0.3 }, true)
    void elevation
  },
  strike({ power, angle, elevation, quality, fallSpeed }) {
    const b = this.body
    if (!b) return
    const multiplier = QUALITY_MULTIPLIER[quality]
    const effPower = Math.pow(power, POWER_CURVE)
    const horizontal = (7 + effPower * 19) * multiplier
    const directionX = Math.sin(angle)
    const directionZ = -Math.cos(angle)
    const upComponent = Math.max(1.5, fallSpeed * 0.45 + 2.0)
    b.setLinvel(
      {
        x: directionX * horizontal,
        y: upComponent + Math.sin(elevation) * horizontal * 0.55,
        z: directionZ * horizontal,
      },
      true,
    )
    const spin = (1 + effPower) * (6 + multiplier * 6)
    b.setAngvel(
      {
        x: -directionZ * spin * 0.4,
        y: 0,
        z: directionX * spin * 0.4,
      },
      true,
    )
  },
}
