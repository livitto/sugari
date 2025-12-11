import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sugari - Easy Diabetes Tracking",
  description: "Track your glucose levels easily with AI-powered photo analysis",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sugari",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/sugari-icon.png",
    apple: "/sugari-icon.png",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="sugari-theme">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
            <PWAInstallPrompt />
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
