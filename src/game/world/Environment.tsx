import { useMemo } from 'react'
import { Sky } from '@react-three/drei'

type Vec3 = [number, number, number]

interface DecorItem {
  position: Vec3
  scale: number
  rotation?: number
  variant?: number
}

interface Mountain {
  position: Vec3
  scale: number
  peak: number
}

interface FlagPole {
  position: Vec3
  rotation?: number
  colors: string[]
}

function seededItems(count: number, radiusMin: number, radiusMax: number, angleStart: number, angleEnd: number): DecorItem[] {
  const items: DecorItem[] = []
  let seed = 12345
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  for (let i = 0; i < count; i++) {
    const angle = angleStart + rnd() * (angleEnd - angleStart)
    const radius = radiusMin + rnd() * (radiusMax - radiusMin)
    items.push({
      position: [Math.cos(angle) * radius, 0, -Math.sin(angle) * radius],
      scale: 0.8 + rnd() * 0.7,
      rotation: rnd() * Math.PI * 2,
      variant: Math.floor(rnd() * 3),
    })
  }
  return items
}

export function Environment() {
  const trees = useMemo(
    () => seededItems(26, 9, 42, Math.PI * 0.15, Math.PI * 1.85),
    [],
  )
  const rocks = useMemo(() => seededItems(14, 4, 30, 0, Math.PI * 2), [])
  const houses = useMemo<{ position: Vec3; rotation: number; scale: number }[]>(
    () => [
      { position: [-14, 0, 0], rotation: 0.4, scale: 1.15 },
      { position: [-19.5, 0, 4.5], rotation: -0.2, scale: 0.95 },
      { position: [-10, 0, -7], rotation: 0.8, scale: 0.8 },
      { position: [-16, 0, -11], rotation: 1.3, scale: 1 },
    ],
    [],
  )
  const mountains = useMemo<Mountain[]>(
    () => [
      { position: [0, 0, -120], scale: 1, peak: 0 },
      { position: [-38, 0, -132], scale: 0.85, peak: 1 },
      { position: [34, 0, -128], scale: 0.9, peak: 2 },
      { position: [62, 0, -112], scale: 0.7, peak: 0 },
      { position: [-70, 0, -115], scale: 0.75, peak: 1 },
    ],
    [],
  )
  const flags: FlagPole[] = useMemo(
    () => [
      {
        position: [3.2, 0, 2.5],
        colors: ['#d94f4f', '#3d8b5f', '#4a6fd9', '#e8c15a', '#8a5cc4'],
      },
      {
        position: [3.2, 0, 5.8],
        rotation: 0.2,
        colors: ['#4a6fd9', '#d94f4f', '#e8c15a', '#3d8b5f', '#8a5cc4'],
      },
      {
        position: [3.2, 0, 9.1],
        colors: ['#e8c15a', '#3d8b5f', '#8a5cc4', '#d94f4f', '#4a6fd9'],
      },
      {
        position: [-3.2, 0, 2.5],
        rotation: -0.15,
        colors: ['#d94f4f', '#3d8b5f', '#4a6fd9', '#e8c15a', '#8a5cc4'],
      },
      {
        position: [-3.2, 0, 5.8],
        colors: ['#4a6fd9', '#d94f4f', '#e8c15a', '#3d8b5f', '#8a5cc4'],
      },
      {
        position: [-3.2, 0, 9.1],
        rotation: 0.1,
        colors: ['#e8c15a', '#3d8b5f', '#8a5cc4', '#d94f4f', '#4a6fd9'],
      },
    ],
    [],
  )

  return (
    <group>
      <Sky distance={450000} sunPosition={[80, 60, -60]} turbidity={4} rayleigh={2.2} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <fog attach="fog" args={['#cfdbe0', 55, 170]} />

      <hemisphereLight args={['#cfe6ff', '#5a6b45', 0.7]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[30, 45, -20]}
        intensity={1.9}
        color="#fff3da"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-camera-far={120}
        shadow-bias={-0.0005}
      />

      {mountains.map((m, i) => (
        <group key={i} position={m.position} scale={m.scale}>
          <mesh position={[0, 16, 0]} castShadow>
            <coneGeometry args={[26, 44, 12]} />
            <meshStandardMaterial color={m.peak === 1 ? '#7b8aa0' : '#6d7f96'} roughness={0.95} flatShading />
          </mesh>
          <mesh position={[0, 30, 0]}>
            <coneGeometry args={[9, 15, 10]} />
            <meshStandardMaterial color="#eef4f8" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}

      {trees.map((t, i) => (
        <group key={i} position={t.position} scale={t.scale} rotation={[0, t.rotation ?? 0, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 1.6, 6]} />
            <meshStandardMaterial color="#5d4026" roughness={0.95} />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <coneGeometry args={[t.variant === 1 ? 0.9 : 1.15, 3, 8]} />
            <meshStandardMaterial color={t.variant === 2 ? '#3f6b3c' : '#4a7a42'} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}

      {rocks.map((r, i) => (
        <mesh
          key={i}
          position={[r.position[0], 0.18, r.position[1]]}
          scale={[r.scale, r.scale * 0.6, r.scale]}
          rotation={[0, r.rotation ?? 0, 0]}
          castShadow
        >
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#7c746a" roughness={0.95} flatShading />
        </mesh>
      ))}

      {houses.map((h, i) => (
        <group key={i} position={h.position} rotation={[0, h.rotation, 0]} scale={h.scale}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[2.6, 2.2, 2.2]} />
            <meshStandardMaterial color="#b99a6f" roughness={0.92} />
          </mesh>
          <mesh position={[0, 2.9, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[2.15, 1.5, 4]} />
            <meshStandardMaterial color="#7c5233" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, 1.1, 1.12]}>
            <boxGeometry args={[0.6, 0.7, 0.05]} />
            <meshStandardMaterial color="#3a2c1c" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {flags.map((f, i) => (
        <group key={i} position={f.position} rotation={[0, f.rotation ?? 0, 0]}>
          <mesh position={[0, 1.7, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 3.4, 6]} />
            <meshStandardMaterial color="#3f3324" roughness={0.9} />
          </mesh>
          {f.colors.map((c, j) => (
            <mesh key={j} position={[0.55 + j * 0.05, 2.9 - j * 0.62, 0]} rotation={[0, 0, 0.16]}>
              <boxGeometry args={[0.5, 0.32, 0.01]} />
              <meshStandardMaterial color={c} roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}

      <group position={[-6, 0, 3]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[i * 1.15, 0.35, i % 2 === 0 ? 0 : 0.25]} castShadow>
            <boxGeometry args={[1.1, 0.7, 0.55]} />
            <meshStandardMaterial color="#8d8578" roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
