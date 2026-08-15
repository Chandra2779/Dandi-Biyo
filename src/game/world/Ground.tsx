import { RigidBody } from '@react-three/rapier'

export function Ground() {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, -25]}>
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[140, 1, 160]} />
          <meshStandardMaterial color="#5d8a44" roughness={1} />
        </mesh>
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 9]} receiveShadow>
        <circleGeometry args={[6.5, 32]} />
        <meshStandardMaterial color="#8a724a" roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 10]} receiveShadow>
        <circleGeometry args={[0.7, 24]} />
        <meshStandardMaterial color="#6e6044" roughness={1} />
      </mesh>

      <mesh position={[0, 0.08, 10]} receiveShadow castShadow>
        <cylinderGeometry args={[0.42, 0.55, 0.16, 20]} />
        <meshStandardMaterial color="#8f8a7c" roughness={0.9} />
      </mesh>

      {[
        [24, -38],
        [-24, -38],
        [24, 46],
        [-24, 46],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]} receiveShadow>
          <boxGeometry args={[0.5, 0.3, 90]} />
          <meshStandardMaterial color="#75705f" roughness={0.95} />
        </mesh>
      ))}
      {[
        [-26, -12],
        [-26, 20],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]} receiveShadow>
          <boxGeometry args={[0.5, 0.3, 34]} />
          <meshStandardMaterial color="#75705f" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}
