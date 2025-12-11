"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Loader2, CheckCircle2, ImageIcon } from "lucide-react"
import { analyzeGlucoseImage, saveGlucoseReading } from "@/app/actions/glucose"
import type { GlucoseAnalysis } from "@/lib/ada-guidelines"
import { useRouter } from "next/navigation"

export function SnapCamera() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<GlucoseAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_DIMENSION = 512 // 512px max - optimal for OCR

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
          0.6, // Optimized compression for smaller file size
        )
      }

      img.onerror = () => {
        reject(new Error("Failed to load image. Your browser may not support this image format."))
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      reader.readAsDataURL(file)
    })
  }

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        `File size too large (${(selectedFile.size / 1024 / 1024).toFixed(1)}MB). Please use a smaller image (max 5MB).`,
      )
      return
    }

    setLoading(true)
    setError("")

    try {
      const convertedFile = await convertToJpeg(selectedFile)

      if (convertedFile.size > MAX_FILE_SIZE) {
        setError(
          `Processed image is too large (${(convertedFile.size / 1024 / 1024).toFixed(1)}MB). Please try a different photo.`,
        )
        setLoading(false)
        return
      }

      setFile(convertedFile)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setLoading(false)
      }
      reader.readAsDataURL(convertedFile)
      setResult(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to process this image. Please try a different photo or format.",
      )
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const analysisResult = await analyzeGlucoseImage(file)

      if (!analysisResult.success) {
        setError(analysisResult.message || "Failed to analyze image")
        setLoading(false)
        return
      }

      const glucoseLevel = analysisResult.glucoseLevel!
      const unit = analysisResult.unit || "mg/dL"
      const imageUrl = analysisResult.imageUrl

      const saveResult = await saveGlucoseReading(glucoseLevel, unit, imageUrl)

      if (!saveResult.success) {
        setError(saveResult.message || "Failed to save reading")
        setLoading(false)
        return
      }

      setResult(saveResult.analysis!)

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An unexpected error occurred: " + (err instanceof Error ? err.message : "Unknown error"))
    }

    setLoading(false)
  }

  const handleRetake = () => {
    setImage(null)
    setFile(null)
    setError("")
    setResult(null)
    fileInputRef.current?.click()
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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert className={getStatusColor(result.status)}>
          <AlertDescription>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Reading Saved!</span>
            </div>
            <div className="font-semibold mb-1">
              Glucose Level: {result.level} {result.unit}
            </div>
            <div className="text-sm">{result.message}</div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-4">
          {!image ? (
            <div className="space-y-4">
              <div
                className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => !loading && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    !loading && fileInputRef.current?.click()
                  }
                }}
                aria-label="Open camera to capture glucometer reading"
              >
                <div className="text-center">
                  <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" aria-hidden="true" />
                  <p className="text-gray-600 mb-4 text-sm text-center mt-1 ml-1 mr-1">
                    Take a photo of your glucometer which shows your glucose reading{" "}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full h-14 text-base"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  aria-label="Open camera"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />
                      Open Camera
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-base bg-transparent"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,image/*"
                    input.onchange = (e) => handleImageCapture(e as any)
                    input.click()
                  }}
                  disabled={loading}
                  aria-label="Choose image from gallery"
                >
                  <ImageIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Choose from Gallery
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
                aria-label="Camera input"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Captured glucometer reading showing glucose level"
                  className="w-full h-full object-cover"
                />
              </div>

              {!result && (
                <div className="space-y-2">
                  <Button
                    size="lg"
                    className="w-full h-14 text-base"
                    onClick={handleAnalyze}
                    disabled={loading}
                    aria-label="Analyze and save glucose reading"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />
                        Analyze & Save
                      </>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 text-base bg-transparent"
                    onClick={handleRetake}
                    disabled={loading}
                    aria-label="Retake photo"
                  >
                    <Camera className="mr-2 h-5 w-5" aria-hidden="true" />
                    Retake Photo
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
