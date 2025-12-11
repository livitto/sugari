import { redirect } from "next/navigation"
import { getUserFromCookie } from "@/lib/auth"
import { getAllPatients } from "@/app/actions/provider"
import { PatientsList } from "@/components/provider/patients-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, TrendingUp } from "lucide-react"

export default async function ProviderDashboard() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/user")
  }

  if (user.role !== "healthcare_provider" && user.role !== "super_admin") {
    redirect("/dashboard")
  }

  const { success, patients, error } = await getAllPatients()

  if (!success || !patients) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading patients: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  const totalPatients = patients.length
  const totalReadings = patients.reduce((sum, p) => sum + p.total_readings, 0)
  const avgGlucoseAllPatients =
    totalPatients > 0 ? Math.round(patients.reduce((sum, p) => sum + p.average_glucose, 0) / totalPatients) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Healthcare Provider Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your patients' glucose levels</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{user.email}</p>
            <form action="/api/auth/logout" method="POST">
              <button className="text-sm text-blue-600 hover:underline">Logout</button>
            </form>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReadings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Glucose (All)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgGlucoseAllPatients} mg/dL</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientsList patients={patients} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
