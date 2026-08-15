import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { useGameStore } from '../../stores/gameStore'
import { runtime } from '../runtime'

export function DistanceMarker() {
  const phase = useGameStore((s) => s.phase)
  const lineRef = useRef<Group>(null)
  const barRef = useRef<Mesh>(null)

  useFrame(() => {
    const show = phase === 'RESULT' || phase === 'LANDING' || phase === 'NEXT_TURN'
    const line = lineRef.current
    const bar = barRef.current
    if (!line || !bar) return
    line.visible = show
    bar.visible = show
    if (!show || !runtime.biyoLanding) return

    const sx = runtime.biyoStart.x
    const sz = runtime.biyoStart.z
    const lx = runtime.biyoLanding.x
    const lz = runtime.biyoLanding.z
    const dist = Math.hypot(lx - sx, lz - sz)

    const midX = (sx + lx) / 2
    const midZ = (sz + lz) / 2
    const dx = lx - sx
    const dz = lz - sz
    const len = Math.hypot(dx, dz) || 0.01

    line.position.set(midX, 0.02, midZ)
    line.rotation.y = Math.atan2(dx, dz)
    line.scale.set(1, 1, len / 0.4)

    bar.position.set(lx, 0.5, lz)
    bar.scale.y = Math.min(1.5, Math.max(0.3, dist * 0.04))
  })

  return (
    <group>
      <group ref={lineRef} visible={false}>
        <mesh>
          <boxGeometry args={[0.03, 0.015, 0.4]} />
          <meshStandardMaterial color="#ffd27a" emissive="#ff9a3d" emissiveIntensity={0.4} transparent opacity={0.75} />
        </mesh>
      </group>
      <mesh ref={barRef} position={[0, 0.5, 0]} visible={false}>
        <cylinderGeometry args={[0.06, 0.06, 1, 10]} />
        <meshStandardMaterial color="#e8a33d" emissive="#ff8a00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
