import { Environment } from '../game/world/Environment'
import { CameraRig } from '../game/camera/CameraRig'

export function MenuScene() {
  return (
    <group>
      <Environment />
      <CameraRig />
    </group>
  )
}
