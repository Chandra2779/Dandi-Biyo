import { getSupabase } from '../lib/supabase'

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  preferred_language: string | null
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const sb = getSupabase()
    if (!sb) return null
    const { data } = await sb.from('profiles').select('*').eq('id', userId).maybeSingle()
    return (data as Profile | null) ?? null
  },

  async upsertProfile(profile: Partial<Profile> & { id: string }) {
    const sb = getSupabase()
    if (!sb) return null
    return sb.from('profiles').upsert(profile)
  },
}
