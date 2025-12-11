import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Image
              src="/images/design-mode/Sugari%20Logo.png"
              alt="Sugari Admin"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-base text-muted-foreground">Sign in to access the admin dashboard</p>
        </div>

        <LoginForm isAdmin={true} />
      </div>
    </div>
  )
}
