import { MetricBase, IconBackground, PercentageBadge, getIconByType, type MetricColor } from "./base-components"

interface DesignIteration1Props {
  title: string
  value: number
  type: string
  color: MetricColor
  total: number
  change?: number
  className?: string
}

export function DesignIteration1({ title, value, type, color, total, change, className }: DesignIteration1Props) {
  // Calculate percentage of total
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <MetricBase title={title} className={className}>
      <div className="flex justify-between items-start mb-4">
        <IconBackground color={color}>{getIconByType(type)}</IconBackground>

        {change !== undefined && <PercentageBadge value={Math.abs(change)} isPositive={change >= 0} />}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-4xl font-bold tabular-nums">{value}</p>

        {type === "available" && total > 0 && (
          <p className="text-xs text-muted-foreground">{percentage}% of total inventory</p>
        )}
      </div>
    </MetricBase>
  )
}
