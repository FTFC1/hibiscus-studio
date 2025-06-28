import { MetricBase, IconBackground, getIconByType, type MetricColor } from "./base-components"

interface DesignIteration2Props {
  title: string
  value: number
  type: string
  color: MetricColor
  total: number
  className?: string
}

export function DesignIteration2({ title, value, type, color, total, className }: DesignIteration2Props) {
  // Calculate percentage of total
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <MetricBase title={title} className={className}>
      <div className="flex items-center mb-3">
        <IconBackground color={color}>{getIconByType(type)}</IconBackground>
        <h3 className="text-sm font-medium ml-2">{title}</h3>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-bold tabular-nums">{value}</p>
        </div>

        {type === "available" && total > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">of total</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold tabular-nums">{total}</span>
              <span className="text-xs font-medium px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded">
                {percentage}%
              </span>
            </div>
          </div>
        )}

        {type !== "available" && type !== "total" && (
          <div className="text-2xl font-medium text-muted-foreground ml-2 mb-1">/{total}</div>
        )}
      </div>
    </MetricBase>
  )
}
