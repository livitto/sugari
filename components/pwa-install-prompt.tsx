"use client"

import { useState, useEffect } from "react"
import { X, Download, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    if (dismissed === "true") {
      return
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      return
    }

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isIOSDevice) {
        setShowPrompt(true)
      }
    }, 5000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      clearTimeout(fallbackTimer)
    }
  }, [deferredPrompt])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      // Silent error handling for production
    }
  }

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true")
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500 md:left-auto md:right-4 md:max-w-sm">
      <div
        className="relative overflow-hidden rounded-lg border bg-card shadow-lg"
        role="dialog"
        aria-labelledby="pwa-install-title"
        aria-describedby="pwa-install-description"
      >
        <div className="flex items-start gap-3 p-4">
          <div className="shrink-0">
            <Image src="/sugari-icon.png" alt="Sugari app icon" width={48} height={48} className="rounded-lg" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 id="pwa-install-title" className="font-semibold text-sm">
              Install Sugari
            </h3>
            {isIOS ? (
              <p id="pwa-install-description" className="text-xs text-muted-foreground">
                Tap <Share className="inline h-3 w-3" aria-label="share icon" /> then "Add to Home Screen" for quick
                access
              </p>
            ) : (
              <p id="pwa-install-description" className="text-xs text-muted-foreground">
                Add to your home screen for quick access and offline use
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-6 w-6"
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleDismiss}>
            Not now
          </Button>
          {!isIOS && (
            <Button size="sm" className="flex-1 gap-2" onClick={handleInstall} aria-label="Install Sugari app">
              <Download className="h-4 w-4" aria-hidden="true" />
              Install
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
