"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserFromCookie } from "./auth"

export interface UserWithReadings {
  id: string
  email: string
  first_name?: string
  last_name?: string
  created_at: string
  total_readings: number
  latest_reading: number | null
  latest_reading_date: string | null
  average_glucose: number | null
}

export interface ReadingWithUser {
  id: string
  glucose_level: number
  status: string
  created_at: string
  user_email: string
  user_first_name?: string
  user_last_name?: string
}

export async function getAllUsersWithReadings(): Promise<{
  success: boolean
  users?: UserWithReadings[]
  message?: string
}> {
  try {
    const currentUser = await getUserFromCookie()

    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "healthcare_provider")) {
      console.log("[v0] Unauthorized access attempt to getAllUsersWithReadings")
      return { success: false, message: "Unauthorized" }
    }

    const supabase = await createClient()

    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id,
        email,
        first_name,
        last_name,
        created_at
      `)
      .eq("role", "patient")
      .order("created_at", { ascending: false })

    console.log("[v0] Fetched users:", users?.length || 0)
    if (error) {
      console.log("[v0] Error fetching users:", error.message)
      throw error
    }

    // Get reading statistics for each user
    const usersWithStats = await Promise.all(
      (users || []).map(async (user) => {
        const { data: readings } = await supabase
          .from("glucose_readings")
          .select("glucose_level, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        const total_readings = readings?.length || 0
        const latest_reading = readings?.[0]?.glucose_level || null
        const latest_reading_date = readings?.[0]?.created_at || null
        const average_glucose = readings?.length
          ? Math.round(readings.reduce((sum, r) => sum + r.glucose_level, 0) / readings.length)
          : null

        return {
          ...user,
          total_readings,
          latest_reading,
          latest_reading_date,
          average_glucose,
        }
      }),
    )

    console.log("[v0] Users with stats:", usersWithStats.length)
    return { success: true, users: usersWithStats }
  } catch (error: any) {
    console.error("[v0] Error fetching users:", error.message)
    return { success: false, message: "Failed to fetch users" }
  }
}

export async function getAllReadings(filters?: {
  userId?: string
  startDate?: string
  endDate?: string
}): Promise<{
  success: boolean
  readings?: ReadingWithUser[]
  message?: string
}> {
  try {
    const currentUser = await getUserFromCookie()

    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "healthcare_provider")) {
      console.log("[v0] Unauthorized access attempt to getAllReadings")
      return { success: false, message: "Unauthorized" }
    }

    console.log("[v0] Fetching readings with filters:", filters)

    const supabase = await createClient()

    let query = supabase
      .from("glucose_readings")
      .select(`
        id,
        glucose_level,
        status,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (filters?.userId) {
      query = query.eq("user_id", filters.userId)
    }

    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate)
    }

    const { data: readings, error } = await query

    console.log("[v0] Fetched readings:", readings?.length || 0)
    if (error) {
      console.log("[v0] Error fetching readings:", error.message)
      throw error
    }

    const userIds = [...new Set(readings?.map((r) => r.user_id) || [])]
    const { data: users } = await supabase.from("users").select("id, email, first_name, last_name").in("id", userIds)

    const userMap = new Map(
      users?.map((u) => [u.id, { email: u.email, first_name: u.first_name, last_name: u.last_name }]) || [],
    )

    const processedReadings = (readings || []).map((reading: any) => {
      const user = userMap.get(reading.user_id)
      return {
        id: reading.id,
        glucose_level: reading.glucose_level,
        status: reading.status,
        created_at: reading.created_at,
        user_email: user?.email || "Unknown",
        user_first_name: user?.first_name,
        user_last_name: user?.last_name,
      }
    })

    console.log("[v0] Processed readings:", processedReadings.length)
    return { success: true, readings: processedReadings }
  } catch (error: any) {
    console.error("[v0] Error fetching readings:", error.message)
    return { success: false, message: "Failed to fetch readings" }
  }
}
