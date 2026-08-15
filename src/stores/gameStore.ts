import { create } from 'zustand'
import type { Difficulty, GameMode, GamePhase, PlayerState, TurnResult } from './types'

export interface GameConfig {
  mode: GameMode
  difficulty: Difficulty
  rounds: number
}

interface RoundEntry {
  round: number
  player: number
  result: TurnResult
}

interface GameStore {
  screen: 'menu' | 'game'
  mode: GameMode
  difficulty: Difficulty
  rounds: number
  currentRound: number
  phase: GamePhase
  players: PlayerState[]
  currentPlayer: number
  lastResult: TurnResult | null
  results: RoundEntry[]
  gameWinner: number | null
  paused: boolean

  openMenu: () => void
  startGame: (config: GameConfig) => void
  setPhase: (phase: GamePhase) => void
  registerResult: (result: TurnResult) => void
  advanceTurn: () => void
  togglePause: () => void
  resume: () => void
  quitToMenu: () => void
  restartGame: () => void
}

function makePlayers(mode: GameMode, difficulty: Difficulty): PlayerState[] {
  if (mode === 'practice') {
    return [{ name: 'YOU', totalScore: 0, bestDistance: 0, perfectHits: 0, wins: 0 }]
  }
  if (mode === 'single') {
    const aiName = difficulty === 'easy' ? 'AI (Easy)' : difficulty === 'medium' ? 'AI (Medium)' : 'AI (Hard)'
    return [
      { name: 'YOU', totalScore: 0, bestDistance: 0, perfectHits: 0, wins: 0 },
      { name: aiName, totalScore: 0, bestDistance: 0, perfectHits: 0, wins: 0 },
    ]
  }
  return [
    { name: 'PLAYER 1', totalScore: 0, bestDistance: 0, perfectHits: 0, wins: 0 },
    { name: 'PLAYER 2', totalScore: 0, bestDistance: 0, perfectHits: 0, wins: 0 },
  ]
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  mode: 'practice',
  difficulty: 'easy',
  rounds: 3,
  currentRound: 1,
  phase: 'SETUP',
  players: makePlayers('practice', 'easy'),
  currentPlayer: 0,
  lastResult: null,
  results: [],
  gameWinner: null,
  paused: false,

  openMenu: () => set({ screen: 'menu' }),

  startGame: (config) => {
    const players = makePlayers(config.mode, config.difficulty)
    set({
      screen: 'game',
      mode: config.mode,
      difficulty: config.difficulty,
      rounds: config.rounds,
      currentRound: 1,
      phase: 'SETUP',
      players,
      currentPlayer: 0,
      lastResult: null,
      results: [],
      gameWinner: null,
      paused: false,
    })
  },

  setPhase: (phase) => set({ phase }),

  registerResult: (result) => {
    const s = get()
    const players = s.players.map((p, i) => {
      if (i !== s.currentPlayer) return p
      return {
        ...p,
        totalScore: p.totalScore + result.score,
        bestDistance: Math.max(p.bestDistance, result.distance),
        perfectHits: p.perfectHits + (result.quality === 'PERFECT' && result.success ? 1 : 0),
      }
    })
    const results = [
      ...s.results,
      { round: s.currentRound, player: s.currentPlayer, result },
    ]
    set({ players, results, lastResult: result })
  },

  advanceTurn: () => {
    const s = get()
    if (s.mode === 'practice') {
      set({ lastResult: null, phase: 'SETUP' })
      return
    }
    const numPlayers = s.players.length
    const next = (s.currentPlayer + 1) % numPlayers
    let currentRound = s.currentRound
    let players = s.players
    let gameWinner: number | null = null

    if (next === 0) {
      const roundResults = s.results.filter((r) => r.round === s.currentRound)
      if (roundResults.length === numPlayers) {
        const best = [...roundResults].sort((a, b) => b.result.score - a.result.score)
        if (best[0].result.score > best[1].result.score) {
          players = players.map((p, i) => (i === best[0].player ? { ...p, wins: p.wins + 1 } : p))
        }
      }
      currentRound += 1
      if (currentRound > s.rounds) {
        const totals = players.map((p) => p.totalScore)
        const max = Math.max(...totals)
        gameWinner = totals[0] === totals[1] ? -1 : totals.indexOf(max)
      }
    }

    set({
      players,
      currentRound,
      currentPlayer: next,
      lastResult: null,
      gameWinner,
      phase: gameWinner !== null ? 'GAME_OVER' : 'SETUP',
    })
  },

  togglePause: () => {
    const s = get()
    if (s.phase === 'PAUSED') set({ paused: false, phase: 'SETUP' })
    else if (s.screen === 'game') set({ paused: true, phase: 'PAUSED' })
  },

  resume: () => set({ paused: false, phase: 'SETUP' }),

  quitToMenu: () => {
    set({
      screen: 'menu',
      phase: 'SETUP',
      paused: false,
      lastResult: null,
    })
  },

  restartGame: () => {
    const s = get()
    s.startGame({ mode: s.mode, difficulty: s.difficulty, rounds: s.rounds })
  },
}))
