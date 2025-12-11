import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Try NEXT_PUBLIC_ prefixed vars first, fallback to non-prefixed for development
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Supabase URL and Anon Key are required")
  }

  return createBrowserClient(url, key)
}
