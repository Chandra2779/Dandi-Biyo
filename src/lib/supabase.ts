import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null
let warned = false

if (url && anonKey) {
  client = createClient(url, anonKey)
} else if (import.meta.env.DEV && !warned) {
  warned = true
  console.warn(
    '[Dandi Biyo] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Running in guest/offline mode — the game remains fully playable.',
  )
}

export function getSupabase(): SupabaseClient | null {
  return client
}

export function isSupabaseConfigured(): boolean {
  return client !== null
}

export function supabaseError(): string | null {
  if (client) return null
  return 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
}
