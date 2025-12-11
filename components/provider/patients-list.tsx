"use client"

import { useState } from "react"
import type { PatientWithReadings } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"

interface PatientsListProps {
  patients: PatientWithReadings[]
}

export function PatientsList({ patients }: PatientsListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter((patient) => patient.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                {patient.email}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Total Readings</p>
                    <p className="font-semibold">{patient.total_readings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Avg Glucose</p>
                    <p className="font-semibold">{patient.average_glucose} mg/dL</p>
                  </div>
                </div>
              </div>

              {patient.latest_reading && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Latest Reading</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{patient.latest_reading.glucose_level} mg/dL</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(patient.latest_reading.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(patient.latest_reading.status)} text-white`}>
                      {patient.latest_reading.status}
                    </Badge>
                  </div>
                </div>
              )}

              <Link href={`/provider/patients/${patient.id}`}>
                <Button className="w-full bg-transparent" variant="outline">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No patients found matching your search.</div>
      )}
    </div>
  )
}
