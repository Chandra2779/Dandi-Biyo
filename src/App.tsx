import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useGameStore } from './stores/gameStore'
import { GameScene } from './scenes/GameScene'
import { MenuScene } from './scenes/MenuScene'
import { MenuOverlay } from './components/menu/MenuOverlay'
import { HUD } from './components/hud/HUD'
import { ResultController, ResultBanner } from './components/hud/ResultBanner'
import { GameOverScreen } from './components/game/GameOverScreen'
import { PauseMenu } from './components/game/PauseMenu'
import { initInput } from './game/input/input'
import { audio } from './audio/AudioManager'

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const phase = useGameStore((s) => s.phase)
  const paused = phase === 'PAUSED'
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setWebglOk(supportsWebGL())
  }, [])

  useEffect(() => {
    const cleanup = initInput()
    const unlock = () => {
      audio.unlock()
      audio.startMusic()
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      cleanup()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  if (!webglOk) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0b0e14] p-6">
        <div className="panel max-w-sm p-6 text-center">
          <h1 className="mb-3 text-xl font-bold text-amber-100">WebGL unavailable</h1>
          <p className="text-sm text-white/60">
            This game requires WebGL. Please enable hardware acceleration in your browser or try a different
            browser/device.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b0e14]">
      <Canvas
        camera={{ position: [0, 2.6, 14.2], fov: 50, near: 0.1, far: 1000 }}
        shadows="percentage"
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Physics paused={paused} gravity={[0, -9.81, 0]}>
          {screen === 'menu' ? <MenuScene /> : <GameScene />}
        </Physics>
      </Canvas>

      {screen === 'menu' && <MenuOverlay />}

      {screen === 'game' && (
        <>
          <HUD />
          <ResultController />
          <ResultBanner />
          <GameOverScreen />
          <PauseMenu />
        </>
      )}
    </div>
  )
}
