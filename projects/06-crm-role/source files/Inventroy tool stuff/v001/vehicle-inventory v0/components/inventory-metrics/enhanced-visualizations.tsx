import { cn } from "@/lib/utils"
import { Clock, TrendingUp, TrendingDown, UserCheck } from "lucide-react"

// Progress bar with label for Available metrics
export function AvailabilityProgressBar({
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
    <div className={cn("space-y-1.5", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className="bg-emerald-500 h-2 rounded-full dark:bg-emerald-400 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="font-medium text-emerald-600 dark:text-emerald-400">{percentage}%</span>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">of</span>
          <span className="font-medium">{total}</span>
        </div>
      </div>
    </div>
  )
}

// Timeline visualization for In Transit metrics
export function TransitTimeline({
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
      <div className="flex items-center gap-2">
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
        <span className="text-xs font-medium tabular-nums">{inTransit}</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <Clock className="h-3 w-3" />
          <span className="font-medium">Arriving</span>
        </div>
        {percentage > 0 && <span className="text-muted-foreground">{percentage}% of inventory</span>}
      </div>
    </div>
  )
}

// Reservation gauge for Reserved metrics
export function ReservationGauge({
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
      <div className="flex items-center gap-2">
        <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Segmented gauge to show reservations */}
          <div
            className="absolute left-0 h-full bg-purple-500 dark:bg-purple-400 rounded-r-lg transition-all duration-500 ease-in-out flex items-center justify-end pr-1"
            style={{ width: `${percentage}%` }}
          >
            {percentage >= 15 && <span className="text-xs font-medium text-white">{reserved}</span>}
          </div>
          {percentage < 15 && reserved > 0 && (
            <div className="absolute inset-0 flex items-center px-2">
              <span className="text-xs font-medium">{reserved}</span>
            </div>
          )}

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

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
          <UserCheck className="h-3 w-3" />
          <span className="font-medium">Reserved</span>
        </div>
        {percentage > 0 && <span className="text-muted-foreground">{percentage}% of inventory</span>}
      </div>
    </div>
  )
}

// Change indicator component (reused from previous designs)
export function ChangeIndicator({
  change,
  className,
}: {
  change: number
  className?: string
}) {
  const isPositive = change >= 0

  return (
    <div
      className={cn(
        "flex items-center text-xs font-medium",
        isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
        className,
      )}
    >
      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
      {isPositive ? "+" : ""}
      {change}%
    </div>
  )
}
