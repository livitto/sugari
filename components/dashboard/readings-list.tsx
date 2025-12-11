"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GlucoseReading } from "@/lib/types"
import type { StatusFilter } from "./dashboard-client"
import { format, subDays } from "date-fns"
import { useState, useMemo } from "react"
import { X } from "lucide-react"

interface ReadingsListProps {
  readings: GlucoseReading[]
  statusFilter?: StatusFilter
  onClearStatusFilter?: () => void
}

type TimeFilter = "last5" | "week" | "month" | "all"

export function ReadingsList({ readings, statusFilter = "all", onClearStatusFilter }: ReadingsListProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("last5")

  const filteredReadings = useMemo(() => {
    const now = new Date()
    let filtered = readings

    // Apply time filter
    switch (timeFilter) {
      case "last5":
        filtered = readings.slice(0, 5)
        break
      case "week":
        const weekAgo = subDays(now, 7)
        filtered = readings.filter((r) => new Date(r.created_at) >= weekAgo)
        break
      case "month":
        const monthAgo = subDays(now, 30)
        filtered = readings.filter((r) => new Date(r.created_at) >= monthAgo)
        break
      case "all":
      default:
        filtered = readings
    }

    // Apply status filter
    if (statusFilter === "normal") {
      filtered = filtered.filter((r) => r.status === "normal")
    } else if (statusFilter === "alert") {
      filtered = filtered.filter((r) => r.status === "warning" || r.status === "danger")
    }

    return filtered
  }, [readings, timeFilter, statusFilter])

  const shouldScroll = filteredReadings.length > 5

  const getStatusChip = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-success text-success-foreground hover:bg-success text-sm px-2 py-0.5">Normal</Badge>
      case "warning":
        return (
          <Badge className="bg-warning text-warning-foreground hover:bg-warning text-sm px-2 py-0.5">Warning</Badge>
        )
      case "danger":
        return (
          <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive text-sm px-2 py-0.5">
            Danger
          </Badge>
        )
      default:
        return null
    }
  }

  const getGlucoseColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-success"
      case "warning":
        return "text-warning"
      case "danger":
        return "text-destructive"
      default:
        return "text-foreground"
    }
  }

  if (readings.length === 0) {
    return (
      <Card>
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-base">Recent Readings</CardTitle>
          <CardDescription className="text-base">Your glucose readings will appear here</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-center text-base text-muted-foreground py-6">
            No readings yet. Upload your first glucometer reading!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <CardTitle className="text-base">Glucose Readings</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
              <SelectTrigger className="w-[100px] sm:w-[110px] h-8 text-sm" aria-label="Filter readings by time period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last5">Last 5</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            {statusFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 bg-transparent"
                onClick={onClearStatusFilter}
                aria-label="Clear status filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative -mx-3 sm:-mx-4">
          <div className={shouldScroll ? "max-h-[300px] sm:max-h-[350px] md:max-h-[400px] overflow-y-auto" : ""}>
            <table className="w-full text-base" aria-label="Glucose readings table">
              <caption className="sr-only">
                List of glucose readings showing date, time, glucose level, and status
              </caption>
              <thead className="sticky top-0 z-30 bg-background border-b-2 shadow-sm">
                <tr>
                  <th
                    scope="col"
                    className="text-left py-2 sm:py-3 px-3 sm:px-4 font-medium text-muted-foreground bg-background w-1/2"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="text-left py-2 sm:py-3 px-3 sm:px-4 font-medium text-muted-foreground bg-background w-1/2"
                  >
                    Glucose Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background">
                {filteredReadings.map((reading) => (
                  <tr key={reading.id} className="border-b last:border-0">
                    <td className="py-2 sm:py-3 px-3 sm:px-4 w-1/2">
                      <div className="space-y-0.5">
                        <div className="font-medium text-sm">
                          {format(new Date(reading.created_at), "MMM dd, yyyy")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(reading.created_at), "hh:mm a")}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 w-1/2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-baseline gap-1">
                          <div className={`font-bold text-lg sm:text-xl ${getGlucoseColor(reading.status)}`}>
                            {reading.glucose_level}
                          </div>
                          <div className="text-sm text-muted-foreground">{reading.unit || "mg/dL"}</div>
                        </div>
                        {getStatusChip(reading.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredReadings.length > 0 && (
          <div className="sm:mt-3 text-sm text-muted-foreground text-center mt-4" role="status" aria-live="polite">
            Showing {filteredReadings.length} {filteredReadings.length === 1 ? "reading" : "readings"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
