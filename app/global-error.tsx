"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Never expose error details to prevent security issues
  console.error("[v0] Global error occurred:", error.message)

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 pb-6 px-6 text-center">
              <div className="flex justify-center mb-4">
                <Image src="/sugari-logo.png" alt="Sugari" width={120} height={80} className="object-contain" />
              </div>

              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>

              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-sm text-gray-600 mb-6">We encountered an unexpected error. Please try again.</p>

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
      </body>
    </html>
  )
}
