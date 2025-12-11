export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: "patient" | "healthcare_provider" | "super_admin"
  created_at: string
  updated_at: string
}

export interface GlucoseReading {
  id: string
  user_id: string
  glucose_level: number
  unit: "mg/dL" | "mmol/L"
  image_url?: string
  status: "normal" | "warning" | "danger"
  message: string
  created_at: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
}

export interface PatientWithReadings {
  id: string
  email: string
  created_at: string
  total_readings: number
  latest_reading?: {
    glucose_level: number
    unit: string
    status: string
    created_at: string
  }
  average_glucose: number
}
