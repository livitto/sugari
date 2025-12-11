"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityIcon, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react"
import type { StatusFilter } from "./dashboard-client"

interface StatsCardsProps {
  stats: {
    total: number
    average: number
    normal: number
    warning: number
    danger: number
  }
  onCardClick?: (filter: StatusFilter) => void
}

export const StatsCards = memo(function StatsCards({ stats, onCardClick }: StatsCardsProps) {
  const getAverageStatus = (avg: number) => {
    if (avg >= 70 && avg <= 130) return { color: "text-success", label: "Normal", barColor: "bg-success" }
    if (avg > 130 && avg <= 180) return { color: "text-warning", label: "Elevated", barColor: "bg-warning" }
    return { color: "text-destructive", label: "High", barColor: "bg-destructive" }
  }

  const avgStatus = getAverageStatus(stats.average)

  return (
    <div className="grid grid-cols-2 gap-2" role="region" aria-label="Glucose statistics">
      <Card
        className="relative overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-95"
        onClick={() => onCardClick?.("all")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onCardClick?.("all")
          }
        }}
        aria-label="View all readings"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" aria-hidden="true" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 px-3 pt-2">
          <CardTitle className="text-sm font-bold text-foreground">Total Readings</CardTitle>
          <ActivityIcon className="h-4 w-4 text-primary" aria-hidden="true" />
        </CardHeader>
        <CardContent className="px-3 pb-2">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <p className="text-sm text-muted-foreground mt-0.5">All time</p>
        </CardContent>
      </Card>

      <Card
        className="relative overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-95"
        onClick={() => onCardClick?.("average")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onCardClick?.("average")
          }
        }}
        aria-label={`Average glucose level: ${stats.average} mg/dL, ${avgStatus.label}`}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${avgStatus.barColor}`} aria-hidden="true" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 px-3 pt-2">
          <CardTitle className="text-sm font-bold text-foreground">Average</CardTitle>
          <TrendingUp className={`h-4 w-4 ${avgStatus.color}`} aria-hidden="true" />
        </CardHeader>
        <CardContent className="px-3 pb-2">
          <div className={`text-2xl font-bold ${avgStatus.color}`}>{stats.average}</div>
          <p className="text-sm text-muted-foreground mt-0.5">{avgStatus.label}</p>
        </CardContent>
      </Card>

      <Card
        className="relative overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-95"
        onClick={() => onCardClick?.("normal")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onCardClick?.("normal")
          }
        }}
        aria-label={`In range readings: ${stats.normal}`}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-success" aria-hidden="true" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 px-3 pt-2">
          <CardTitle className="text-sm font-bold text-foreground">In Range</CardTitle>
          <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
        </CardHeader>
        <CardContent className="px-3 pb-2">
          <div className="text-2xl font-bold text-success">{stats.normal}</div>
          <p className="text-sm text-muted-foreground mt-0.5">Normal readings</p>
        </CardContent>
      </Card>

      <Card
        className="relative overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-95"
        onClick={() => onCardClick?.("alert")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onCardClick?.("alert")
          }
        }}
        aria-label={`Alert readings: ${stats.warning + stats.danger}`}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive" aria-hidden="true" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 px-3 pt-2">
          <CardTitle className="text-sm font-bold text-foreground">Alert</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
        </CardHeader>
        <CardContent className="px-3 pb-2">
          <div className="text-2xl font-bold text-destructive">{stats.warning + stats.danger}</div>
          <p className="text-sm text-muted-foreground mt-0.5">Needs attention</p>
        </CardContent>
      </Card>
    </div>
  )
})
