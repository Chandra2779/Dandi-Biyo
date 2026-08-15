import { getSupabase } from '../lib/supabase'

export interface AuthUser {
  id: string
  email: string | null
}

export const authService = {
  async getSession(): Promise<AuthUser | null> {
    const sb = getSupabase()
    if (!sb) return null
    const { data } = await sb.auth.getSession()
    const user = data.session?.user
    if (!user) return null
    return { id: user.id, email: user.email ?? null }
  },

  async signUp(email: string, password: string) {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase not configured' }
    return sb.auth.signUp({ email, password })
  },

  async signIn(email: string, password: string) {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase not configured' }
    return sb.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    const sb = getSupabase()
    if (!sb) return null
    return sb.auth.signOut()
  },

  async resetPassword(email: string) {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase not configured' }
    return sb.auth.resetPasswordForEmail(email)
  },
}
