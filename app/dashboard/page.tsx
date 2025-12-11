import { getUserFromCookie } from "@/app/actions/auth"
import { getRecentReadings, getReadingsStats } from "@/app/actions/readings"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/login")
  }

  const [readingsResult, statsResult] = await Promise.all([getRecentReadings(20), getReadingsStats()])

  const readings = readingsResult.success ? readingsResult.readings : []
  const stats = statsResult.success ? statsResult.stats : { total: 0, average: 0, normal: 0, warning: 0, danger: 0 }

  const userName = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.name

  return <DashboardClient userEmail={user.email} userName={userName} readings={readings} stats={stats} />
}
