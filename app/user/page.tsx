import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import Image from "next/image"
import { MobileOnlyWrapper } from "@/components/mobile-only-wrapper"

export default async function UserLoginPage() {
  return (
    <MobileOnlyWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <Image
                src="/images/design-mode/Sugari%20Logo.png"
                alt="Sugari"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-base text-primary font-medium">Easy Diabetes Tracking</p>
          </div>

          <LoginForm isAdmin={false} />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MobileOnlyWrapper>
  )
}
