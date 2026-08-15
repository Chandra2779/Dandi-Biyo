import { useRef } from 'react'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { biyoApi } from '../biyoApi'
import { PHYSICS } from '../physics/constants'

export function Biyo() {
  const bodyRef = useRef<RapierRigidBody>(null)

  return (
    <RigidBody
      ref={(body) => {
        bodyRef.current = body
        biyoApi.set(body)
      }}
      type="dynamic"
      colliders={false}
      position={[PHYSICS.biyoStart.x, PHYSICS.biyoStart.y, PHYSICS.biyoStart.z]}
      linearDamping={0.05}
      angularDamping={0.1}
      friction={0.6}
      restitution={0.35}
    >
      <CapsuleCollider args={[PHYSICS.biyoLength / 2, PHYSICS.biyoRadius]} mass={PHYSICS.biyoMass} rotation={[Math.PI / 2, 0, 0]} />
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.032, PHYSICS.biyoLength, 8]} />
        <meshStandardMaterial color="#a4682f" roughness={0.78} />
      </mesh>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.05, 8]} />
        <meshStandardMaterial color="#7c4a1e" roughness={0.8} />
      </mesh>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, -0.055, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.05, 8]} />
        <meshStandardMaterial color="#7c4a1e" roughness={0.8} />
      </mesh>
    </RigidBody>
  )
}
