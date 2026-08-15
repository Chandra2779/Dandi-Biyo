import * as THREE from 'three'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function damp(current: number, target: number, lambda: number, delta: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * delta))
}

export function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function horizontalDistance(a: THREE.Vector3, b: THREE.Vector3): number {
  return Math.hypot(a.x - b.x, a.z - b.z)
}
