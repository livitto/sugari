"use server"

import { createClient } from "@/lib/supabase/server"
import type { PatientWithReadings, GlucoseReading } from "@/lib/types"

export async function getAllPatients(): Promise<{
  success: boolean
  patients?: PatientWithReadings[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Get all patients (users with role 'patient')
    const { data: patients, error: patientsError } = await supabase
      .from("users")
      .select("id, email, created_at")
      .eq("role", "patient")
      .order("created_at", { ascending: false })

    if (patientsError) {
      console.error("[v0] Error fetching patients:", patientsError)
      return { success: false, error: "Failed to fetch patients" }
    }

    // For each patient, get their reading statistics
    const patientsWithReadings = await Promise.all(
      patients.map(async (patient) => {
        // Get all readings for this patient
        const { data: readings, error: readingsError } = await supabase
          .from("glucose_readings")
          .select("glucose_level, status, created_at")
          .eq("user_id", patient.id)
          .order("created_at", { ascending: false })

        if (readingsError) {
          console.error("[v0] Error fetching readings for patient:", readingsError)
          return {
            ...patient,
            total_readings: 0,
            average_glucose: 0,
          }
        }

        const totalReadings = readings.length
        const averageGlucose =
          totalReadings > 0 ? Math.round(readings.reduce((sum, r) => sum + r.glucose_level, 0) / totalReadings) : 0

        return {
          ...patient,
          total_readings: totalReadings,
          latest_reading: readings[0] || undefined,
          average_glucose: averageGlucose,
        }
      }),
    )

    return { success: true, patients: patientsWithReadings }
  } catch (error) {
    console.error("[v0] Error in getAllPatients:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getPatientReadings(patientId: string): Promise<{
  success: boolean
  readings?: GlucoseReading[]
  patient?: { email: string }
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Get patient info
    const { data: patient, error: patientError } = await supabase
      .from("users")
      .select("email")
      .eq("id", patientId)
      .eq("role", "patient")
      .single()

    if (patientError || !patient) {
      return { success: false, error: "Patient not found" }
    }

    // Get all readings for this patient
    const { data: readings, error: readingsError } = await supabase
      .from("glucose_readings")
      .select("*")
      .eq("user_id", patientId)
      .order("created_at", { ascending: false })

    if (readingsError) {
      console.error("[v0] Error fetching readings:", readingsError)
      return { success: false, error: "Failed to fetch readings" }
    }

    return { success: true, readings, patient }
  } catch (error) {
    console.error("[v0] Error in getPatientReadings:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
