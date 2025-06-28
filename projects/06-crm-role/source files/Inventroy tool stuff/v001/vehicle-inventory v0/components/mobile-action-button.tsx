"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface MobileActionButtonProps {
  onClick: () => void
}

export function MobileActionButton({ onClick }: MobileActionButtonProps) {
  return (
    <div className="fixed right-4 bottom-20 z-50 md:hidden">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg"
        onClick={onClick}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Vehicle</span>
      </Button>
    </div>
  )
}
