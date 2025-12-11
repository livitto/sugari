"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, Loader2 } from "lucide-react"
import { analyzeGlucoseImage, saveGlucoseReading } from "@/app/actions/glucose"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { GlucoseAnalysis } from "@/lib/ada-guidelines"

interface UploadFormProps {
  onSuccess?: () => void
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [manualEntry, setManualEntry] = useState(false)
  const [manualValue, setManualValue] = useState("")
  const [result, setResult] = useState<GlucoseAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_DIMENSION = 512 // 512px max - still readable for OCR, optimized for token usage

  const convertToJpeg = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = (e) => {
        img.src = e.target?.result as string
      }

      img.onload = () => {
        const canvas = document.createElement("canvas")

        let width = img.width
        let height = img.height

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = (height / width) * MAX_DIMENSION
            width = MAX_DIMENSION
          } else {
            width = (width / height) * MAX_DIMENSION
            height = MAX_DIMENSION
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert image"))
              return
            }
            const convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
            })
            resolve(convertedFile)
          },
          "image/jpeg",
          0.6, // Reduced from 0.7 to 0.6 for better compression and lower token usage
        )
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      reader.readAsDataURL(file)
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    console.log("[v0] Image selected, device:", navigator.userAgent, "file:", {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
    })

    setLoading(true)
    setError("")

    try {
      const convertedFile = await convertToJpeg(selectedFile)
      setFile(convertedFile)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setLoading(false)
      }
      reader.readAsDataURL(convertedFile)
      setResult(null)
    } catch (err) {
      console.error("[v0] Image conversion error:", err)
      setError("Unable to process this image. Please try a different photo or format.")
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!image && !manualEntry) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      let glucoseLevel: number
      let imageUrl: string | undefined

      if (manualEntry) {
        glucoseLevel = Number.parseInt(manualValue)
        if (isNaN(glucoseLevel) || glucoseLevel < 20 || glucoseLevel > 600) {
          setError("Please enter a valid glucose level between 20 and 600 mg/dL")
          setLoading(false)
          return
        }
      } else if (file) {
        const analysisResult = await analyzeGlucoseImage(file)

        if (!analysisResult.success) {
          setError(analysisResult.message || "Failed to analyze image")
          setLoading(false)
          return
        }

        glucoseLevel = analysisResult.glucoseLevel!
        imageUrl = analysisResult.imageUrl
      } else {
        setError("Please upload an image or enter a value manually")
        setLoading(false)
        return
      }

      const saveResult = await saveGlucoseReading(glucoseLevel, imageUrl)

      if (!saveResult.success) {
        setError(saveResult.message || "Failed to save reading")
        setLoading(false)
        return
      }

      setResult(saveResult.analysis!)
      setImage(null)
      setFile(null)
      setManualValue("")

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[v0] Upload error:", err)
    }

    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-50 border-green-200 text-green-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "danger":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="px-4 py-4">
        <CardTitle className="text-base">Record Glucose Reading</CardTitle>
        <CardDescription className="text-sm">Upload a photo or enter the value manually</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className={getStatusColor(result.status)}>
            <AlertDescription>
              <div className="font-semibold mb-2">Glucose Level: {result.level} mg/dL</div>
              <div>{result.message}</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant={!manualEntry ? "default" : "outline"}
            onClick={() => setManualEntry(false)}
            className="flex-1 text-sm"
            size="sm"
          >
            <Camera className="mr-1 h-3 w-3" />
            Upload Photo
          </Button>
          <Button
            type="button"
            variant={manualEntry ? "default" : "outline"}
            onClick={() => setManualEntry(true)}
            className="flex-1 text-sm"
            size="sm"
          >
            Manual Entry
          </Button>
        </div>

        {!manualEntry ? (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              {image ? (
                <div className="space-y-3">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Glucometer reading"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                    {loading ? "Processing..." : "Choose Different Image"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <div>
                    <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                      {loading ? "Processing..." : "Choose Image"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">All formats supported (JPEG, PNG, WebP, HEIC)</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,image/*"
                onChange={handleImageChange}
                className="hidden"
                capture="environment"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="glucose" className="text-sm">
              Glucose Level (mg/dL)
            </Label>
            <Input
              id="glucose"
              type="number"
              placeholder="Enter glucose reading"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
              min="20"
              max="600"
              className="text-base"
            />
          </div>
        )}

        <Button onClick={handleAnalyze} disabled={loading || (!image && !manualValue)} className="w-full" size="sm">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze & Save Reading"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
