import { createClient } from "./supabase/server"
import bcrypt from "bcryptjs"

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10)
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  return user
}

export const getUserFromCookie = getCurrentUser
