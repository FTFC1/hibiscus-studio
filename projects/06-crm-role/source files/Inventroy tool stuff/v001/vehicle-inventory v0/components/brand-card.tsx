"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandCardProps {
  id: number
  name: string
  totalUnits: number
  availableUnits: number
  modelCount: number
  isExpanded: boolean
  onToggle: () => void
  highlight?: boolean
}

export function BrandCard({
  id,
  name,
  totalUnits,
  availableUnits,
  modelCount,
  isExpanded,
  onToggle,
  highlight = false,
}: BrandCardProps) {
  return (
    <div className="rounded-lg border bg-card/80 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`brand-${id}-content`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 min-w-0">
          <h2
            className={cn(
              "text-xl font-bold truncate",
              highlight ? "bg-yellow-100 dark:bg-yellow-900/50 px-2 py-0.5 rounded-md" : "",
            )}
          >
            {name}
          </h2>
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-6 text-muted-foreground text-sm">
            <div className="flex items-center">
              <span className="whitespace-nowrap font-medium">{totalUnits} units</span>
            </div>
            <div className="flex items-center">
              <span className="whitespace-nowrap px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-md font-medium">
                {availableUnits} Available
              </span>
            </div>
            {!isExpanded && (
              <div className="flex items-center col-span-2 sm:col-span-1">
                <span className="hidden sm:inline mr-2">•</span>
                <span className="whitespace-nowrap">{modelCount} Models</span>
              </div>
            )}
          </div>
        </div>
        <div className="transition-transform duration-200 ml-2 flex-shrink-0">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </button>
    </div>
  )
}
