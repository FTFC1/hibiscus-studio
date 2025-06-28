import { MetricBase, IconBackground, getIconByType, InventoryProgressBar, type MetricColor } from "./base-components"

interface DesignIteration3Props {
  title: string
  value: number
  type: string
  color: MetricColor
  total: number
  className?: string
}

export function DesignIteration3({ title, value, type, color, total, className }: DesignIteration3Props) {
  // Calculate percentage of total
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <MetricBase title={title} className={className}>
      <div className="flex items-center justify-between mb-2">
        <IconBackground color={color}>{getIconByType(type)}</IconBackground>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>

      <div className="my-3">
        <p className="text-4xl font-bold tabular-nums">{value}</p>
      </div>

      {type === "available" && total > 0 && (
        <div className="space-y-1.5">
          <InventoryProgressBar percentage={percentage} />
          <div className="flex justify-between text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{percentage}%</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">of</span>
              <span className="font-medium">{total}</span>
            </div>
          </div>
        </div>
      )}

      {type !== "available" && type !== "total" && (
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{Math.round((value / total) * 100)}% of inventory</span>
        </div>
      )}
    </MetricBase>
  )
}
