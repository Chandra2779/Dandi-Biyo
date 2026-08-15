import { getSupabase } from '../lib/supabase'
import type { TimingQuality } from '../stores/types'

export interface GameResultPayload {
  user_id?: string
  game_mode: string
  difficulty: string
  score: number
  distance: number
  round: number
  perfect_hits: number
  successful_hits: number
}

const QUEUE_KEY = 'dandi-biyo-pending-results'

export const gameService = {
  async saveResult(payload: GameResultPayload): Promise<boolean> {
    const sb = getSupabase()
    if (!sb) return false
    const { error } = await sb.from('game_results').insert(payload)
    if (error) {
      queueLocally(payload)
      return false
    }
    return true
  },

  async flushQueue(): Promise<number> {
    const sb = getSupabase()
    if (!sb) return 0
    const queue = readQueue()
    if (queue.length === 0) return 0
    const { error } = await sb.from('game_results').insert(queue)
    if (!error) {
      localStorage.removeItem(QUEUE_KEY)
      return queue.length
    }
    return 0
  },
}

function readQueue(): GameResultPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? (JSON.parse(raw) as GameResultPayload[]) : []
  } catch {
    return []
  }
}

function queueLocally(payload: GameResultPayload) {
  try {
    const queue = readQueue()
    queue.push(payload)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-50)))
  } catch {
    // storage unavailable — drop silently
  }
}

export function qualityToPayload(quality: TimingQuality): number {
  if (quality === 'PERFECT') return 1
  if (quality === 'GREAT') return 1
  return 0
}
