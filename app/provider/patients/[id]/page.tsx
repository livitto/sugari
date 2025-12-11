import { redirect } from "next/navigation"
import { getUserFromCookie } from "@/lib/auth"
import { getPatientReadings } from "@/app/actions/provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Droplet } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "healthcare_provider" && user.role !== "super_admin") {
    redirect("/dashboard")
  }

  const { success, readings, patient, error } = await getPatientReadings(id)

  if (!success || !readings || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading patient data: {error}</p>
            <Link href="/provider" className="text-blue-600 hover:underline mt-4 inline-block">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
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

  const avgGlucose =
    readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.glucose_level, 0) / readings.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/provider" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
          <p className="text-gray-600 mt-1">{patient.email}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Glucose</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgGlucose} mg/dL</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reading History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {reading.image_url && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={reading.image_url || "/placeholder.svg"}
                        alt="Glucose meter reading"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="h-5 w-5 text-blue-600" />
                      <span className="text-2xl font-bold">{reading.glucose_level} mg/dL</span>
                      <Badge className={`${getStatusColor(reading.status)} text-white ml-auto`}>{reading.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{reading.message}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(reading.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {readings.length === 0 && (
                <div className="text-center py-12 text-gray-500">No readings recorded yet for this patient.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
