import { getUserFromCookie } from "@/app/actions/auth"
import { initializeAdminUser } from "@/app/actions/setup"
import { ReadingsTable } from "@/components/admin/readings-table"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "@/app/actions/auth"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  await initializeAdminUser()

  const user = await getUserFromCookie()

  if (!user || (user.role !== "super_admin" && user.role !== "healthcare_provider" && user.id !== "admin")) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/sugari-icon.png" alt="Sugari" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sugari Admin</h1>
              <p className="text-sm text-gray-600">Welcome, {user.email}</p>
            </div>
          </div>
          <form action={signOut}>
            <Button variant="outline" type="submit" size="sm" className="sm:size-default bg-transparent">
              <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <ReadingsTable />
      </main>
    </div>
  )
}
