"use client"

import { Button } from "@/components/ui/button"
import { X, LogOut } from "lucide-react"
import { signOut } from "@/app/actions/auth"
import { Label } from "@/components/ui/label"
import { memo } from "react"

interface SettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  userName?: string
}

export const SettingsSidebar = memo(function SettingsSidebar({
  isOpen,
  onClose,
  userEmail,
  userName,
}: SettingsSidebarProps) {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-labelledby="settings-title"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 id="settings-title" className="text-lg font-semibold text-foreground">
              Settings
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Account Info */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Account</Label>
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                {userName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium text-foreground">{userName}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">{userEmail}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="destructive" onClick={handleLogout} className="w-full max-w-xs">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})
