"use server"

import { createClient } from "@/lib/supabase/server"
import { hashPin, verifyPin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const ADMIN_EMAIL = "admin@sugari.org"
const ADMIN_PIN = "123456"

export async function signUp(email: string, pin: string, firstName: string, lastName: string) {
  const supabase = await createClient()

  // Check if user already exists
  const { data: existingUser } = await supabase.from("users").select("email").eq("email", email).single()

  if (existingUser) {
    return { success: false, message: "Email already registered" }
  }

  // Hash the PIN
  const pinHash = await hashPin(pin)

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email,
      pin_hash: pinHash,
      first_name: firstName,
      last_name: lastName,
    })
    .select()
    .single()

  if (error) {
    return { success: false, message: "Failed to create account" }
  }

  // Create a session cookie
  const cookieStore = await cookies()
  cookieStore.set("user_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, user }
}

export async function signIn(email: string, pin: string) {
  if (email === ADMIN_EMAIL && pin === ADMIN_PIN) {
    console.log("[v0] Admin login detected with hardcoded credentials")

    // Create a session cookie for admin
    const cookieStore = await cookies()
    cookieStore.set("user_id", "admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Set admin role cookie
    cookieStore.set("user_role", "super_admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set("user_email", ADMIN_EMAIL, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
      user: {
        id: "admin",
        email: ADMIN_EMAIL,
        role: "super_admin",
        name: "Super Admin",
      },
    }
  }

  const supabase = await createClient()

  // Find user by email
  const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error || !user) {
    return { success: false, message: "Invalid email or PIN" }
  }

  // Verify PIN
  const isValid = await verifyPin(pin, user.pin_hash)

  if (!isValid) {
    return { success: false, message: "Invalid email or PIN" }
  }

  // Create a session cookie
  const cookieStore = await cookies()
  cookieStore.set("user_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  if (user.role) {
    cookieStore.set("user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  return { success: true, user }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("user_id")
  cookieStore.delete("user_role")
  cookieStore.delete("user_email")
  redirect("/user")
}

export async function getUserFromCookie() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value

  if (!userId) {
    return null
  }

  if (userId === "admin") {
    const userRole = cookieStore.get("user_role")?.value
    const userEmail = cookieStore.get("user_email")?.value

    return {
      id: "admin",
      email: userEmail || ADMIN_EMAIL,
      role: userRole || "super_admin",
      name: "Super Admin",
      pin_hash: "",
      created_at: new Date().toISOString(),
    }
  }

  const supabase = await createClient()
  const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()

  return user
}
