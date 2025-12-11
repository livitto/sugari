"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter } from "lucide-react"
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns"
import {
  getAllUsersWithReadings,
  getAllReadings,
  type UserWithReadings,
  type ReadingWithUser,
} from "@/app/actions/admin"

export function ReadingsTable() {
  const [users, setUsers] = useState<UserWithReadings[]>([])
  const [readings, setReadings] = useState<ReadingWithUser[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [customDate, setCustomDate] = useState<Date>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [selectedUser, dateFilter, customDate])

  const loadData = async () => {
    setLoading(true)
    const [usersResult, readingsResult] = await Promise.all([getAllUsersWithReadings(), getAllReadings()])

    if (usersResult.success && usersResult.users) {
      setUsers(usersResult.users)
    }

    if (readingsResult.success && readingsResult.readings) {
      setReadings(readingsResult.readings)
    }

    setLoading(false)
  }

  const applyFilters = async () => {
    let startDate: string | undefined
    let endDate: string | undefined

    if (dateFilter === "today" && customDate) {
      startDate = startOfDay(customDate).toISOString()
      endDate = endOfDay(customDate).toISOString()
    } else if (dateFilter === "week" && customDate) {
      startDate = startOfWeek(customDate).toISOString()
      endDate = endOfWeek(customDate).toISOString()
    }

    const result = await getAllReadings({
      userId: selectedUser === "all" ? undefined : selectedUser,
      startDate,
      endDate,
    })

    if (result.success && result.readings) {
      setReadings(result.readings)
    }
  }

  const getGlucoseStatus = (level: number): { status: string; label: string } => {
    if (level < 70) {
      return { status: "danger", label: "Low" }
    } else if (level >= 70 && level <= 130) {
      return { status: "normal", label: "Normal" }
    } else if (level > 130 && level <= 180) {
      return { status: "warning", label: "Elevated" }
    } else {
      return { status: "danger", label: "High" }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "danger":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getGlucoseColor = (level: number) => {
    if (level < 70) {
      return "text-red-600"
    } else if (level >= 70 && level <= 130) {
      return "text-green-600"
    } else if (level > 130 && level <= 180) {
      return "text-yellow-600"
    } else {
      return "text-red-600"
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">User Glucose Readings</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Monitor all user glucose readings with timestamps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="w-full">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name} (${user.email})`
                      : user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Specific Day</SelectItem>
                <SelectItem value="week">Specific Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(dateFilter === "today" || dateFilter === "week") && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDate ? format(customDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={customDate} onSelect={setCustomDate} initialFocus />
              </PopoverContent>
            </Popover>
          )}

          <Button variant="outline" onClick={loadData} className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">User Name / Email</TableHead>
                <TableHead className="min-w-[180px]">Glucose Level</TableHead>
                <TableHead className="min-w-[180px]">Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No readings found
                  </TableCell>
                </TableRow>
              ) : (
                readings.map((reading) => {
                  const { status, label } = getGlucoseStatus(reading.glucose_level)

                  return (
                    <TableRow key={reading.id}>
                      <TableCell>
                        {reading.user_first_name && reading.user_last_name ? (
                          <div>
                            <div className="font-medium">
                              {reading.user_first_name} {reading.user_last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">{reading.user_email}</div>
                          </div>
                        ) : (
                          <div className="font-medium">{reading.user_email}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-base sm:text-lg ${getGlucoseColor(reading.glucose_level)}`}>
                            {reading.glucose_level}
                          </span>
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{format(new Date(reading.created_at), "PPp")}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {readings.length > 0 && (
          <div className="text-sm text-muted-foreground text-center sm:text-right">
            Showing {readings.length} reading{readings.length !== 1 ? "s" : ""}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
