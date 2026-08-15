export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'practice' | 'single' | 'local'
export type GraphicsQuality = 'low' | 'medium' | 'high'
export type TimingQuality = 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS'

export type GamePhase =
  | 'SETUP'
  | 'AIMING'
  | 'LIFTING'
  | 'TIMING'
  | 'STRIKING'
  | 'FLIGHT'
  | 'LANDING'
  | 'RESULT'
  | 'NEXT_TURN'
  | 'GAME_OVER'
  | 'PAUSED'

export interface TurnResult {
  distance: number
  score: number
  quality: TimingQuality
  success: boolean
  caught: boolean
  playerName: string
}

export interface PlayerState {
  name: string
  totalScore: number
  bestDistance: number
  perfectHits: number
  wins: number
}
