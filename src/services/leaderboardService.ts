import { getSupabase } from '../lib/supabase'

export interface LeaderboardEntry {
  id: string
  username: string | null
  display_name: string | null
  score: number
  distance: number
  created_at: string
}

export const leaderboardService = {
  async getTopScores(limit = 50): Promise<LeaderboardEntry[]> {
    const sb = getSupabase()
    if (!sb) return []
    const { data } = await sb
      .from('game_results')
      .select('id, score, distance, created_at, profiles(username, display_name)')
      .order('score', { ascending: false })
      .limit(limit)
    return (data as unknown as LeaderboardEntry[]) ?? []
  },
}
