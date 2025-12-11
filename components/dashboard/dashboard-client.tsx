"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ReadingsList } from "@/components/dashboard/readings-list"
import { ADAGuidelines } from "@/components/dashboard/ada-guidelines"
import { MobileOnlyWrapper } from "@/components/mobile-only-wrapper"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import type { GlucoseReading } from "@/lib/types"
import { useRef, useState } from "react"

interface DashboardClientProps {
  userEmail: string
  userName?: string
  readings: GlucoseReading[]
  stats: {
    total: number
    average: number
    normal: number
    warning: number
    danger: number
  }
}

export type StatusFilter = "all" | "normal" | "alert"

export function DashboardClient({ userEmail, userName, readings, stats }: DashboardClientProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const readingsRef = useRef<HTMLDivElement>(null)

  const handleCardClick = (filter: StatusFilter) => {
    setStatusFilter(filter)
    // Scroll to readings table
    setTimeout(() => {
      readingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  return (
    <MobileOnlyWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pb-20">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <DashboardHeader userEmail={userEmail} userName={userName} />

          <StatsCards stats={stats} onCardClick={handleCardClick} />

          <div ref={readingsRef}>
            <ReadingsList
              readings={readings}
              statusFilter={statusFilter}
              onClearStatusFilter={() => setStatusFilter("all")}
            />
          </div>

          <ADAGuidelines />
        </div>
      </div>
      <MobileBottomNav />
    </MobileOnlyWrapper>
  )
}
