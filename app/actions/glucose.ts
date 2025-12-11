"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserFromCookie } from "./auth"
import { analyzeGlucoseLevel } from "@/lib/ada-guidelines"
import { put } from "@vercel/blob"

export async function analyzeGlucoseImage(imageFile: File) {
  try {
    console.log("[v0] Starting image analysis, file type:", imageFile.type)

    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    // Determine the correct MIME type
    let mimeType = imageFile.type
    if (!mimeType || mimeType === "application/octet-stream") {
      // Fallback to jpeg if type is unknown
      mimeType = "image/jpeg"
    }

    // Create proper data URL format
    const dataUrl = `data:${mimeType};base64,${base64}`

    console.log("[v0] Image converted to base64, MIME type:", mimeType)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Read the glucose value from this glucometer. Return as "VALUE UNIT" (e.g., "120 mg/dL" or "6.7 mmol/L"). If unit not visible, assume mg/dL. Return "ERROR" if unclear.',
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 50,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI API error:", errorData)
      return {
        success: false,
        message: "Failed to analyze image. Please try again.",
      }
    }

    const data = await response.json()
    const extractedText = data.choices[0]?.message?.content?.trim()

    console.log("[v0] OpenAI response:", extractedText)

    if (!extractedText || extractedText === "ERROR") {
      return {
        success: false,
        message: "Could not read glucose level from image. Please try again with a clearer photo.",
      }
    }

    const parts = extractedText.split(" ")
    const glucoseValue = Number.parseFloat(parts[0])
    let unit: "mg/dL" | "mmol/L" = "mg/dL"

    // Detect unit from response
    if (extractedText.toLowerCase().includes("mmol")) {
      unit = "mmol/L"
    }

    // Validate based on unit
    if (isNaN(glucoseValue)) {
      return {
        success: false,
        message: "Invalid glucose reading detected. Please ensure the image shows a clear glucometer reading.",
      }
    }

    // Validate ranges based on unit
    if (unit === "mg/dL" && (glucoseValue < 20 || glucoseValue > 600)) {
      return {
        success: false,
        message: "Invalid glucose reading detected. Please ensure the image shows a clear glucometer reading.",
      }
    }

    if (unit === "mmol/L" && (glucoseValue < 1.1 || glucoseValue > 33.3)) {
      return {
        success: false,
        message: "Invalid glucose reading detected. Please ensure the image shows a clear glucometer reading.",
      }
    }

    const blob = await put(`glucose-readings/${Date.now()}-${imageFile.name}`, imageFile, {
      access: "public",
    })

    console.log("[v0] Image uploaded to blob:", blob.url)

    return { success: true, glucoseLevel: glucoseValue, unit, imageUrl: blob.url }
  } catch (error) {
    console.error("[v0] Error analyzing image:", error)
    return { success: false, message: "Failed to analyze image. Please try again." }
  }
}

export async function saveGlucoseReading(glucoseLevel: number, unit: "mg/dL" | "mmol/L" = "mg/dL", imageUrl?: string) {
  const user = await getUserFromCookie()

  if (!user) {
    return { success: false, message: "Not authenticated" }
  }

  const supabase = await createClient()

  // Analyze the glucose level with unit
  const analysis = analyzeGlucoseLevel(glucoseLevel, unit)

  // Save to database
  const { data, error } = await supabase
    .from("glucose_readings")
    .insert({
      user_id: user.id,
      glucose_level: glucoseLevel,
      unit,
      status: analysis.status,
      message: analysis.message,
      image_url: imageUrl,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error saving reading:", error)
    return { success: false, message: "Failed to save reading" }
  }

  return { success: true, reading: data, analysis }
}
