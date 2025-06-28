"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Database } from "lucide-react"

interface AdminNotificationBarProps {
  onSeedData: () => Promise<void>
  isSubmitting?: boolean
}

export function AdminNotificationBar({ onSeedData, isSubmitting = false }: AdminNotificationBarProps) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b mb-6 py-2">
      <div className="container mx-auto flex justify-end items-center gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="text-xs font-medium flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Admin Dashboard
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSeedData}
          className="text-xs font-medium flex items-center gap-1.5"
          disabled={isSubmitting}
        >
          <Database className="h-3.5 w-3.5" />
          {isSubmitting ? "Seeding..." : "Seed Data"}
        </Button>
      </div>
    </div>
  )
}
