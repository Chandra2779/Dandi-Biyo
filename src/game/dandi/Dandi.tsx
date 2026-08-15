import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useGameStore } from '../../stores/gameStore'
import { runtime } from '../runtime'

export function Dandi() {
  const group = useRef<Group>(null)
  const phase = useGameStore((s) => s.phase)

  useFrame(() => {
    const g = group.current
    if (!g) return
    const isStriking = phase === 'STRIKING' || runtime.swingAnim > 0
    if (isStriking) {
      const swing = runtime.swingAnim
      g.rotation.x = -2.1 * swing - 0.25 * (1 - swing) * 0.4
      g.rotation.z = -0.25 * swing
    } else {
      g.rotation.x = 0
      g.rotation.z = 0
    }
  })

  return (
    <group position={[0, 0.05, 12.3]}>
      <group ref={group}>
        <group position={[0, 0, 0.45]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.014, 0.017, 0.9, 8]} />
            <meshStandardMaterial color="#8a5a2b" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0.01, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.014, 0.004, 6, 10]} />
            <meshStandardMaterial color="#6b4520" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.01, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.014, 0.004, 6, 10]} />
            <meshStandardMaterial color="#6b4520" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
