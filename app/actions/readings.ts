"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserFromCookie } from "./auth"

export async function getRecentReadings(limit = 10) {
  const user = await getUserFromCookie()

  if (!user) {
    return { success: false, message: "Not authenticated" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("glucose_readings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching readings:", error)
    return { success: false, message: "Failed to fetch readings" }
  }

  return { success: true, readings: data }
}

export async function getReadingsStats() {
  const user = await getUserFromCookie()

  if (!user) {
    return { success: false, message: "Not authenticated" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.from("glucose_readings").select("*").eq("user_id", user.id)

  if (error) {
    return { success: false, message: "Failed to fetch stats" }
  }

  const readings = data || []
  const total = readings.length

  if (total === 0) {
    return {
      success: true,
      stats: {
        total: 0,
        average: 0,
        normal: 0,
        warning: 0,
        danger: 0,
      },
    }
  }

  const sum = readings.reduce((acc, r) => acc + r.glucose_level, 0)
  const average = Math.round(sum / total)

  const normal = readings.filter((r) => r.status === "normal").length
  const warning = readings.filter((r) => r.status === "warning").length
  const danger = readings.filter((r) => r.status === "danger").length

  return {
    success: true,
    stats: {
      total,
      average,
      normal,
      warning,
      danger,
    },
  }
}
