import { getSupabase } from '../lib/supabase'

export const achievementService = {
  async getAchievements(userId: string) {
    const sb = getSupabase()
    if (!sb) return []
    const { data } = await sb
      .from('user_achievements')
      .select('achievements(name, description, icon)')
      .eq('user_id', userId)
    return data ?? []
  },

  async unlock(userId: string, achievementName: string) {
    const sb = getSupabase()
    if (!sb) return
    const { data: achievement } = await sb
      .from('achievements')
      .select('id')
      .eq('name', achievementName)
      .maybeSingle()
    if (!achievement) return
    await sb
      .from('user_achievements')
      .upsert({ user_id: userId, achievement_id: achievement.id }, { onConflict: 'user_id,achievement_id' })
  },
}
