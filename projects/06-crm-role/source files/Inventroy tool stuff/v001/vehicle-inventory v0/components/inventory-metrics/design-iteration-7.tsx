import { MetricBase, IconBackground, getIconByType, type MetricColor } from "./base-components"
import {
  AvailabilityProgressBarV7,
  TransitTimelineV7,
  ReservationGaugeV7,
  DisplayUnitsVisualizationV7,
  TotalVehiclesVisualizationV7,
} from "./enhanced-visualizations-v7"
import { cn } from "@/lib/utils"

interface DesignIteration7Props {
  title: string
  value: number
  type: string
  color: MetricColor
  total: number
  available?: number
  inTransit?: number
  reserved?: number
  display?: number
  className?: string
}

export function DesignIteration7({
  title,
  value,
  type,
  color,
  total,
  available = 0,
  inTransit = 0,
  reserved = 0,
  display = 0,
  className,
}: DesignIteration7Props) {
  return (
    <MetricBase title={title} className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconBackground color={color}>{getIconByType(type)}</IconBackground>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>

        {/* Show value prominently */}
        <p
          className={cn(
            "text-2xl font-bold tabular-nums",
            type === "available" ? "text-emerald-600 dark:text-emerald-400" : "",
            type === "transit" ? "text-amber-600 dark:text-amber-400" : "",
            type === "reserved" ? "text-purple-600 dark:text-purple-400" : "",
            type === "display" ? "text-slate-600 dark:text-slate-400" : "",
          )}
        >
          {value}
        </p>
      </div>

      <div className="mt-2">
        {/* Different visualization based on metric type */}
        {type === "total" && (
          <TotalVehiclesVisualizationV7
            total={total}
            available={available}
            inTransit={inTransit}
            reserved={reserved}
            display={display}
          />
        )}

        {type === "available" && (
          <AvailabilityProgressBarV7 percentage={Math.round((value / total) * 100)} total={total} available={value} />
        )}

        {type === "transit" && <TransitTimelineV7 inTransit={value} total={total} />}

        {type === "reserved" && <ReservationGaugeV7 reserved={value} total={total} />}

        {type === "display" && <DisplayUnitsVisualizationV7 display={value} total={total} />}
      </div>
    </MetricBase>
  )
}
