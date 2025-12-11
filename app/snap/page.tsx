import { getUserFromCookie } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { MobileOnlyWrapper } from "@/components/mobile-only-wrapper"
import { SnapCamera } from "@/components/snap/snap-camera"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default async function SnapPage() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/user")
  }

  return (
    <MobileOnlyWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">Snap Sugar</h1>
            <p className="text-sm text-gray-600">Take a photo of your glucometer</p>
          </div>

          <SnapCamera />
        </div>
        <MobileBottomNav />
      </div>
    </MobileOnlyWrapper>
  )
}
