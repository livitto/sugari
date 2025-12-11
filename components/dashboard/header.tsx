"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { SettingsSidebar } from "@/components/settings-sidebar"

interface DashboardHeaderProps {
  userEmail: string
  userName?: string
}

export function DashboardHeader({ userEmail, userName }: DashboardHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Image
            src="/sugari-icon.png"
            alt="Sugari"
            width={40}
            height={40}
            className="object-contain shrink-0 rounded-sm"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-foreground mb-0.5 mr-0 text-left text-base">
              {getGreeting()}
              {userName ? `, ${userName.split(" ")[0]}!` : "!"}
            </h1>
          </div>
        </div>
        <Button variant="default" size="icon" onClick={() => setIsSettingsOpen(true)} className="shrink-0">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>

      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userEmail={userEmail}
        userName={userName}
      />
    </>
  )
}
