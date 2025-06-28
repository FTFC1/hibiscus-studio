import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Car, CheckCircle2, Clock, UserCheck, ShoppingBag, TrendingUp, TrendingDown } from "lucide-react"

export type MetricColor = "blue" | "green" | "amber" | "purple" | "slate"

interface MetricBaseProps {
  title: string
  className?: string
  children: ReactNode
}

export function MetricBase({ title, className, children }: MetricBaseProps) {
  return <div className={cn("rounded-xl border p-4 shadow-sm h-full", className)}>{children}</div>
}

// Icon Background component with proper color mapping
export function IconBackground({
  color,
  children,
}: {
  color: MetricColor
  children: ReactNode
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400",
  }

  return <div className={cn("p-2 rounded-lg inline-flex", colorClasses[color])}>{children}</div>
}

// Percentage Badge component
export function PercentageBadge({
  value,
  isPositive = true,
}: {
  value: number
  isPositive?: boolean
}) {
  return (
    <div
      className={cn(
        "text-xs font-medium inline-flex items-center gap-0.5 px-2 py-1 rounded-full",
        isPositive
          ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40"
          : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/40",
      )}
    >
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {value}%
    </div>
  )
}

// Get icon by metric type
export function getIconByType(type: string) {
  switch (type) {
    case "total":
      return <Car className="h-5 w-5" />
    case "available":
      return <CheckCircle2 className="h-5 w-5" />
    case "transit":
      return <Clock className="h-5 w-5" />
    case "reserved":
      return <UserCheck className="h-5 w-5" />
    case "display":
      return <ShoppingBag className="h-5 w-5" />
    default:
      return <Car className="h-5 w-5" />
  }
}

// Progress bar component for fourth design
export function InventoryProgressBar({
  percentage,
  className,
}: {
  percentage: number
  className?: string
}) {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700", className)}>
      <div className="bg-emerald-500 h-1.5 rounded-full dark:bg-emerald-400" style={{ width: `${percentage}%` }} />
    </div>
  )
}

// Change indicator component
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
