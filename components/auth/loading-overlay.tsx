import { Loader2 } from "lucide-react"
import Image from "next/image"

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image src="/sugari-logo.png" alt="Sugari" width={120} height={120} className="animate-pulse" />
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  )
}
