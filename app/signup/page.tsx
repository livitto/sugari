import { SignupForm } from "@/components/auth/signup-form"
import { getUserFromCookie } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { MobileOnlyWrapper } from "@/components/mobile-only-wrapper"
import Image from "next/image"

export default async function SignupPage() {
  const user = await getUserFromCookie()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <MobileOnlyWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <Image src="/sugari-logo.png" alt="Sugari" width={120} height={120} className="object-contain" priority />
            </div>
            <p className="text-base text-primary font-medium">Easy Diabetes Tracking</p>
          </div>

          <SignupForm />
        </div>
      </div>
    </MobileOnlyWrapper>
  )
}
