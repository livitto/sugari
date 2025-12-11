"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone } from "lucide-react"

export function MobileOnlyWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      // Check if device is mobile based on screen width and user agent
      const isMobileWidth = window.innerWidth <= 768
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileWidth || isMobileUA)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Mobile Only</CardTitle>
            <CardDescription className="text-base">
              This application is designed for mobile devices only
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please access this application from your smartphone or tablet to track your glucose readings.
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">For administrative access, please use the admin login.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
