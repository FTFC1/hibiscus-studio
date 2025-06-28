import { cn } from "@/lib/utils"
import { Clock, UserCheck, BarChart3 } from "lucide-react"

// Progress bar with label and context for Available metrics
export function AvailabilityProgressBarV2({
  percentage,
  total,
  available,
  className,
}: {
  percentage: number
  total: number
  available: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {available} of {total}
        </span>
        <span className="font-medium text-emerald-600 dark:text-emerald-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className="bg-emerald-500 h-2 rounded-full dark:bg-emerald-400 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Timeline visualization for In Transit metrics (without "Arriving" text)
export function TransitTimelineV2({
  inTransit,
  total,
  className,
}: {
  inTransit: number
  total: number
  className?: string
}) {
  // Calculate percentage for visual representation
  const percentage = total > 0 ? Math.round((inTransit / total) * 100) : 0

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <Clock className="h-3 w-3" />
          <span className="font-medium">
            {inTransit} of {total}
          </span>
        </div>
        <span className="font-medium text-amber-600 dark:text-amber-400">{percentage}%</span>
      </div>
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Animated dots to represent movement */}
        <div
          className="absolute left-0 h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 0 && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 opacity-50 animate-pulse">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-300 to-transparent animate-transit-flow" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reservation gauge for Reserved metrics (without redundant number)
export function ReservationGaugeV2({
  reserved,
  total,
  className,
}: {
  reserved: number
  total: number
  className?: string
}) {
  // Calculate percentage for visual representation
  const percentage = total > 0 ? Math.round((reserved / total) * 100) : 0

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
          <UserCheck className="h-3 w-3" />
          <span className="font-medium">
            {reserved} of {total}
          </span>
        </div>
        <span className="font-medium text-purple-600 dark:text-purple-400">{percentage}%</span>
      </div>
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {/* Segmented gauge to show reservations (without redundant number) */}
        <div
          className="absolute left-0 h-full bg-purple-500 dark:bg-purple-400 rounded-r-lg transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />

        {/* Gauge markers */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-full w-px bg-gray-300 dark:bg-gray-600"
              style={{ opacity: i === 0 || i === 4 ? 0 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Display units visualization
export function DisplayUnitsVisualization({
  display,
  total,
  className,
}: {
  display: number
  total: number
  className?: string
}) {
  // Calculate percentage for visual representation
  const percentage = total > 0 ? Math.round((display / total) * 100) : 0

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <BarChart3 className="h-3 w-3" />
          <span className="font-medium">
            {display} of {total}
          </span>
        </div>
        <span className="font-medium text-slate-600 dark:text-slate-400">{percentage}%</span>
      </div>
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute left-0 h-full bg-slate-500 dark:bg-slate-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Total vehicles visualization with additional context
export function TotalVehiclesVisualization({
  total,
  available,
  inTransit,
  reserved,
  display,
  className,
}: {
  total: number
  available: number
  inTransit: number
  reserved: number
  display: number
  className?: string
}) {
  // Calculate percentages
  const availablePercentage = total > 0 ? Math.round((available / total) * 100) : 0
  const inTransitPercentage = total > 0 ? Math.round((inTransit / total) * 100) : 0
  const reservedPercentage = total > 0 ? Math.round((reserved / total) * 100) : 0
  const displayPercentage = total > 0 ? Math.round((display / total) * 100) : 0

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">Distribution</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500 ease-in-out"
          style={{ width: `${availablePercentage}%` }}
        />
        <div
          className="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-500 ease-in-out"
          style={{ width: `${inTransitPercentage}%` }}
        />
        <div
          className="h-full bg-purple-500 dark:bg-purple-400 transition-all duration-500 ease-in-out"
          style={{ width: `${reservedPercentage}%` }}
        />
        <div
          className="h-full bg-slate-500 dark:bg-slate-400 transition-all duration-500 ease-in-out"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span className="text-muted-foreground">Available: {availablePercentage}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
          <span className="text-muted-foreground">In Transit: {inTransitPercentage}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
          <span className="text-muted-foreground">Reserved: {reservedPercentage}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400" />
          <span className="text-muted-foreground">Display: {displayPercentage}%</span>
        </div>
      </div>
    </div>
  )
}
