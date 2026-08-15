import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import { useGameStore } from '../../stores/gameStore'
import { runtime } from '../runtime'
import { POWER_CURVE } from '../physics/constants'

const DOT_COUNT = 34

export function TrajectoryGuide() {
  const phase = useGameStore((s) => s.phase)
  const mode = useGameStore((s) => s.mode)
  const dotRefs = useRef<(Mesh | null)[]>([])
  const arrowRef = useRef<Group>(null)

  useFrame(() => {
    const full = mode === 'practice'
    const visible = phase === 'AIMING' || phase === 'SETUP'
    const eff = Math.pow(runtime.power || 0.35, POWER_CURVE)
    const h = 7 + eff * 19
    const angle = runtime.aimAngle
    const elevation = runtime.aimElevation
    const start = runtime.biyoStart

    const vx = Math.sin(angle) * h
    const vz = -Math.cos(angle) * h
    const vy = Math.sin(elevation) * h * 0.55 + 2
    const flightTime = (2 * vy) / 9.81
    const step = flightTime / DOT_COUNT

    for (let i = 0; i < DOT_COUNT; i++) {
      const mesh = dotRefs.current[i]
      if (!mesh) continue
      const t = (i + 1) * step
      const x = start.x + vx * t
      const z = start.z + vz * t
      const y = start.y + vy * t - 0.5 * 9.81 * t * t
      mesh.position.set(x, Math.max(y, 0.04), z)
      const active = visible && (full || i < 14)
      mesh.visible = active && y > 0.03
      if (!mesh.visible) continue
      const mat = mesh.material as THREE.MeshStandardMaterial
      const base = full ? 1 : 0.5
      const fade = 1 - (i / DOT_COUNT) * (full ? 0.45 : 0.8)
      mat.color.setScalar(base * fade * (0.9 + eff * 0.1))
      const scale = 0.05 - (i / DOT_COUNT) * 0.025
      mesh.scale.setScalar(Math.max(scale, 0.02))
    }

    const arrow = arrowRef.current
    if (arrow) {
      const show = phase === 'AIMING'
      arrow.visible = show
      if (show) {
        arrow.position.set(start.x, 0.25, start.z)
        arrow.rotation.y = -angle
        arrow.rotation.x = elevation * 0.5
        arrow.scale.setScalar(0.9 + eff * 0.6)
      }
    }
  })

  return (
    <group>
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            dotRefs.current[i] = m
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial emissive="#ffd27a" emissiveIntensity={0.9} color="#8a5a2b" />
        </mesh>
      ))}
      <group ref={arrowRef} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.5, 8]} />
          <meshStandardMaterial color="#e8a33d" emissive="#ff8a00" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  )
}
