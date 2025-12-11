"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { memo } from "react"

export const MobileBottomNav = memo(function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Snap Sugar",
      href: "/snap",
      icon: Camera,
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all rounded-none",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-accent",
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5]")} />
              <span className={cn("text-xs", isActive ? "font-semibold" : "font-medium")}>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
})
