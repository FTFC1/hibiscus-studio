"use client"

import { Button } from "@/components/ui/button"
import { Edit, Plus, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface VehicleModelCardProps {
  brand: string
  model: string
  category: string
  fuelType: string
  driveType: string
  transmission: string
  totalStock: number
  available: number
  display?: number
  onViewInventory?: () => void
  onEditModel?: () => void
  highlight?: boolean
}

export function VehicleModelCard({
  brand,
  model,
  category,
  fuelType,
  driveType,
  transmission,
  totalStock,
  available,
  display,
  onViewInventory,
  onEditModel,
  highlight = false,
}: VehicleModelCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-3 sm:p-4", highlight ? "ring-2 ring-primary/20" : "")}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs sm:text-sm text-muted-foreground truncate">{brand}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={onEditModel}>
          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="sr-only">Edit Model</span>
        </Button>
      </div>

      <h3
        className={cn(
          "text-lg sm:text-xl font-bold mb-2 truncate",
          highlight ? "bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded inline-block" : "",
        )}
      >
        {model}
      </h3>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
        <span className="text-muted-foreground truncate">{category}</span>
        <span className="text-muted-foreground">•</span>
        <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md truncate text-slate-800 dark:text-slate-200">
          {fuelType}
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="flex items-center gap-1 truncate">
          <ChevronRight className="h-3 w-3" />
          <span className="truncate">{driveType}</span>
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="flex items-center gap-1 truncate">
          <span className="h-1.5 w-1.5 rounded-full border" />
          <span className="truncate">{transmission}</span>
        </span>
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm text-muted-foreground">Total Stock</div>
        <div className="text-2xl sm:text-3xl font-bold">{totalStock}</div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
        <span className="text-xs sm:text-sm font-medium">Available</span>
        <span className="text-xs sm:text-sm px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-md font-medium">
          {available}
        </span>
        {display !== undefined && display > 0 && (
          <>
            <span className="text-xs sm:text-sm font-medium ml-2 sm:ml-4">Display</span>
            <span className="text-xs sm:text-sm px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium">
              {display}
            </span>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 gap-1 text-xs sm:text-sm py-1.5 h-auto">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">Add Units</span>
        </Button>
        <Button variant="outline" className="flex-1 gap-1 text-xs sm:text-sm py-3.5 h-auto" onClick={onViewInventory}>
          <span className="truncate">View Inventory</span>
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}
