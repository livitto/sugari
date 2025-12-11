"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isRedirectError =
    error.message === "NEXT_REDIRECT" ||
    error.message?.includes("NEXT_REDIRECT") ||
    error.digest?.startsWith("NEXT_REDIRECT") ||
    error.digest?.includes("NEXT_REDIRECT") ||
    error.name === "NEXT_REDIRECT"

  useEffect(() => {
    // Only log non-redirect errors, never expose error details to user
    if (!isRedirectError) {
      console.error("[v0] Error occurred:", error.message)
      // Never log full error object to prevent exposing file paths
    }
  }, [error, isRedirectError])

  if (isRedirectError) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-6 px-6 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/sugari-logo.png" alt="Sugari" width={120} height={80} className="object-contain" />
          </div>

          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We encountered an error while processing your request. Please try again.
          </p>

          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              Try Again
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/user">Go to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
