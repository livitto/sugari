import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value
  const userRole = request.cookies.get("user_role")?.value
  const { pathname } = request.nextUrl

  if ((userId === "admin" || userRole === "super_admin") && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  if (
    !userId &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/snap") || pathname.startsWith("/provider"))
  ) {
    return NextResponse.redirect(new URL("/user", request.url))
  }

  if (userId && (pathname === "/user" || pathname === "/signup" || pathname === "/admin/login")) {
    if (userId === "admin" || userRole === "super_admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    if (userRole === "healthcare_provider") {
      return NextResponse.redirect(new URL("/provider", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    userId !== "admin" &&
    userRole !== "super_admin"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (pathname.startsWith("/provider") && userRole !== "healthcare_provider" && userRole !== "super_admin") {
    return NextResponse.redirect(new URL("/user", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/snap/:path*", "/provider/:path*", "/user", "/signup"],
}
