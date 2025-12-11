"use server"

import { createClient } from "@/lib/supabase/server"
import { hashPin } from "@/lib/auth"

export async function initializeAdminUser() {
  const supabase = await createClient()

  // Check if admin user already exists
  const { data: existingAdmin } = await supabase.from("users").select("email").eq("email", "admin@sugari.org").single()

  if (existingAdmin) {
    console.log("[v0] Admin user already exists")
    return { success: true, message: "Admin user already exists" }
  }

  // Create admin user with PIN: 123456
  const pinHash = await hashPin("123456")

  const { data: admin, error } = await supabase
    .from("users")
    .insert({
      email: "admin@sugari.org",
      pin_hash: pinHash,
      role: "super_admin",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Failed to create admin user:", error)
    return { success: false, message: "Failed to create admin user" }
  }

  console.log("[v0] Admin user created successfully")
  return { success: true, message: "Admin user created successfully", admin }
}
