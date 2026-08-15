import { Environment } from '../game/world/Environment'
import { Ground } from '../game/world/Ground'
import { Biyo } from '../game/biyo/Biyo'
import { Dandi } from '../game/dandi/Dandi'
import { TrajectoryGuide } from '../game/aim/TrajectoryGuide'
import { DistanceMarker } from '../game/distance/DistanceMarker'
import { GameplayController } from '../game/GameplayController'
import { AIController } from '../game/ai/AIController'
import { CameraRig } from '../game/camera/CameraRig'

export function GameScene() {
  return (
    <group>
      <Environment />
      <Ground />
      <TrajectoryGuide />
      <Biyo />
      <Dandi />
      <DistanceMarker />
      <GameplayController />
      <AIController />
      <CameraRig />
    </group>
  )
}
