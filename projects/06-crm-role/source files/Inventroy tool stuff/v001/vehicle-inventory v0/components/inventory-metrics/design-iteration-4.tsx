import { MetricBase, IconBackground, getIconByType, ChangeIndicator, type MetricColor } from "./base-components"
import { cn } from "@/lib/utils"

interface DesignIteration4Props {
  title: string
  value: number
  type: string
  color: MetricColor
  total: number
  weeklyChange?: number
  className?: string
}

export function DesignIteration4({ title, value, type, color, total, weeklyChange, className }: DesignIteration4Props) {
  // Calculate percentage of total
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <MetricBase title={title} className={className}>
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <IconBackground color={color}>{getIconByType(type)}</IconBackground>
            <h3 className="text-sm font-medium">{title}</h3>
          </div>

          <div className="flex items-baseline gap-2">
            <p
              className={cn(
                "text-4xl font-bold tabular-nums",
                type === "available" ? "text-emerald-600 dark:text-emerald-400" : "",
              )}
            >
              {value}
            </p>

            {type === "available" && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">of total</span>
                <span className="text-sm font-medium">{total}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          {weeklyChange !== undefined && (
            <div className="mb-auto pb-1">
              <ChangeIndicator change={weeklyChange} />
              <div className="text-xs text-muted-foreground">vs last week</div>
            </div>
          )}

          {type === "available" && (
            <div className="mt-auto pt-1 text-right">
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{percentage}%</div>
              <div className="text-xs text-muted-foreground">of inventory</div>
            </div>
          )}
        </div>
      </div>
    </MetricBase>
  )
}
