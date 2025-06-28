"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/toast-provider"
import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/register-sw"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Register service worker on client side
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
