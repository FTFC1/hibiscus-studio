import { cn } from "@/lib/utils"
import { TrendingUp, Package, BarChart } from "lucide-react"
import { DonutChart } from "@/components/ui/donut-chart"

// Total Vehicles visualization with consolidated metrics and recently added models
export function TotalVehiclesVisualization({
  total,
  available,
  inTransit,
  reserved,
  display,
  recentlyAdded = [],
  className,
}: {
  total: number
  available: number
  inTransit: number
  reserved: number
  display: number
  recentlyAdded?: Array<{ model: string; count: number }>
  className?: string
}) {
  // Calculate percentages
  const availablePercentage = total > 0 ? Math.round((available / total) * 100) : 0
  const inTransitPercentage = total > 0 ? Math.round((inTransit / total) * 100) : 0
  const reservedPercentage = total > 0 ? Math.round((reserved / total) * 100) : 0
  const displayPercentage = total > 0 ? Math.round((display / total) * 100) : 0

  return (
    <div className={cn("space-y-5 px-1", className)}>
      {/* Distribution bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Distribution</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{total} total</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-500 ease-in-out"
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
      </div>

      {/* Detailed metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
              <span className="text-sm font-medium">Available</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-semibold">{available}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({availablePercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full dark:bg-gray-700">
            <div
              className="bg-blue-500 h-1.5 rounded-full dark:bg-blue-400"
              style={{ width: `${availablePercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 dark:bg-amber-400 flex-shrink-0" />
              <span className="text-sm font-medium">In Transit</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-semibold">{inTransit}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({inTransitPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full dark:bg-gray-700">
            <div
              className="bg-amber-500 h-1.5 rounded-full dark:bg-amber-400"
              style={{ width: `${inTransitPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-purple-500 dark:bg-purple-400 flex-shrink-0" />
              <span className="text-sm font-medium">Reserved</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-semibold">{reserved}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({reservedPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full dark:bg-gray-700">
            <div
              className="bg-purple-500 h-1.5 rounded-full dark:bg-purple-400"
              style={{ width: `${reservedPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-500 dark:bg-slate-400 flex-shrink-0" />
              <span className="text-sm font-medium">Display</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-semibold">{display}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({displayPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full dark:bg-gray-700">
            <div
              className="bg-slate-500 h-1.5 rounded-full dark:bg-slate-400"
              style={{ width: `${displayPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recently Added Models */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium mb-3">Recently Added</h4>
        {recentlyAdded.length > 0 ? (
          <div className="space-y-2.5">
            {recentlyAdded.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.model}</span>
                <span className="text-base font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">No recent additions</div>
        )}
      </div>
    </div>
  )
}

// Vehicle Type Breakdown visualization with donut chart
export function VehicleTypeDonutVisualization({
  vehicleTypes = [],
  className,
}: { vehicleTypes?: Array<{ name: string; value: number; color: string }>; className?: string }) {
  // Use provided data or fallback to sample data
  const data =
    vehicleTypes.length > 0
      ? vehicleTypes
      : [
          { name: "Sedan", value: 42, color: "#3b82f6" }, // blue
          { name: "SUV", value: 28, color: "#10b981" }, // green
          { name: "Truck", value: 18, color: "#f59e0b" }, // amber
          { name: "Van", value: 12, color: "#8b5cf6" }, // purple
        ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={cn("flex flex-col items-center justify-center w-full px-2", className)}>
      <DonutChart
        data={data}
        size={170}
        thickness={35}
        innerLabel={
          <div className="text-center text-white">
            <div className="text-4xl font-bold">{total}</div>
            <div className="text-xs text-gray-300 mt-1">vehicles</div>
          </div>
        }
        legendPosition="bottom"
        className="mx-auto"
      />
    </div>
  )
}

// Inventory Highlights visualization
export function InventoryHighlightsVisualization({
  newArrivals = { count: 0, trend: 0, breakdown: [] },
  topModels = [],
  className,
}: {
  newArrivals?: {
    count: number
    trend: number
    breakdown: Array<{ type: string; count: number }>
  }
  topModels?: Array<{ name: string; count: number }>
  className?: string
}) {
  return (
    <div className={cn("space-y-5", className)}>
      {/* New Arrivals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="font-medium">New Arrivals</span>
            </div>
            <div className="text-sm text-muted-foreground">Last 7 days</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold">{newArrivals.count}</span>
            {newArrivals.trend > 0 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {newArrivals.breakdown.map((item, index) => (
            <div key={index} className="text-center p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <div className="text-xs font-medium">{item.type}</div>
              <div className="text-sm">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Models Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart className="h-4 w-4 text-emerald-500" />
          <span className="font-medium">Top Models</span>
        </div>

        <div className="space-y-2">
          {topModels.length > 0 ? (
            topModels.map((model, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{model.name}</span>
                <span className="text-sm font-medium">{model.count}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No data available</div>
          )}
        </div>
      </div>
    </div>
  )
}
