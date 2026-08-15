import { getSupabase } from '../lib/supabase'

export interface StatisticsUpdate {
  games_played?: number
  games_won?: number
  games_lost?: number
  total_strikes?: number
  successful_hits?: number
  perfect_hits?: number
  longest_distance?: number
  highest_score?: number
}

export const statisticsService = {
  async get(userId: string) {
    const sb = getSupabase()
    if (!sb) return null
    const { data } = await sb.from('player_statistics').select('*').eq('user_id', userId).maybeSingle()
    return data ?? null
  },

  async update(userId: string, update: StatisticsUpdate) {
    const sb = getSupabase()
    if (!sb) return
    await sb
      .from('player_statistics')
      .upsert({ user_id: userId, ...update }, { onConflict: 'user_id' })
  },
}
