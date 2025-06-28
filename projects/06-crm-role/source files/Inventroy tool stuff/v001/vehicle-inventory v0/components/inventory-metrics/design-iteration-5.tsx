import { MetricBase, IconBackground, getIconByType, type MetricColor } from "./base-components"
import { AvailabilityProgressBar, TransitTimeline, ReservationGauge } from "./enhanced-visualizations"
import { cn } from "@/lib/utils"

interface DesignIteration5Props {
  title: string
  value: number
  type: string
  color: MetricColor
  total: number
  className?: string
}

export function DesignIteration5({ title, value, type, color, total, className }: DesignIteration5Props) {
  // Calculate percentage of total
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <MetricBase title={title} className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconBackground color={color}>{getIconByType(type)}</IconBackground>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>

        {/* Show value prominently */}
        <p
          className={cn(
            "text-xl font-bold tabular-nums",
            type === "available" ? "text-emerald-600 dark:text-emerald-400" : "",
            type === "transit" ? "text-amber-600 dark:text-amber-400" : "",
            type === "reserved" ? "text-purple-600 dark:text-purple-400" : "",
          )}
        >
          {value}
        </p>
      </div>

      <div className="mt-4">
        {/* Different visualization based on metric type */}
        {type === "available" && <AvailabilityProgressBar percentage={percentage} total={total} available={value} />}

        {type === "transit" && <TransitTimeline inTransit={value} total={total} />}

        {type === "reserved" && <ReservationGauge reserved={value} total={total} />}

        {/* For other types, show simple percentage */}
        {type !== "available" && type !== "transit" && type !== "reserved" && type !== "total" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{percentage}% of inventory</span>
          </div>
        )}
      </div>
    </MetricBase>
  )
}
