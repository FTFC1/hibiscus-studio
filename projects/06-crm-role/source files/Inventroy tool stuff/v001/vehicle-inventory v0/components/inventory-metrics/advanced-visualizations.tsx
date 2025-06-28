"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { useState } from "react"

// Enhanced Total Vehicles visualization with consolidated metrics
export function ConsolidatedTotalVisualization({
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
    <div className={cn("space-y-4", className)}>
      {/* Distribution bar */}
      <div className="space-y-2">
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
      </div>

      {/* Detailed metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span className="text-sm font-medium">Available</span>
            </div>
            <span className="text-sm font-medium">{available}</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full dark:bg-gray-700">
            <div
              className="bg-emerald-500 h-1 rounded-full dark:bg-emerald-400"
              style={{ width: `${availablePercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
              <span className="text-sm font-medium">In Transit</span>
            </div>
            <span className="text-sm font-medium">{inTransit}</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full dark:bg-gray-700">
            <div
              className="bg-amber-500 h-1 rounded-full dark:bg-amber-400"
              style={{ width: `${inTransitPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
              <span className="text-sm font-medium">Reserved</span>
            </div>
            <span className="text-sm font-medium">{reserved}</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full dark:bg-gray-700">
            <div
              className="bg-purple-500 h-1 rounded-full dark:bg-purple-400"
              style={{ width: `${reservedPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400" />
              <span className="text-sm font-medium">Display</span>
            </div>
            <span className="text-sm font-medium">{display}</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full dark:bg-gray-700">
            <div
              className="bg-slate-500 h-1 rounded-full dark:bg-slate-400"
              style={{ width: `${displayPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Average Time to Availability visualization
export function AverageTimeVisualization({ className }: { className?: string }) {
  // Sample data - in a real app, this would come from props
  const averageDays = 12
  const previousAverageDays = 14
  const change = -14.3 // percentage change

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-3xl font-bold">{averageDays}</span>
          <div className="text-sm text-muted-foreground">days average</div>
        </div>

        <div className="flex flex-col items-end">
          <div
            className={cn(
              "flex items-center text-sm font-medium",
              change < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {change < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </div>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Processing Timeline</span>
        </div>

        <div className="relative pt-6 pb-2">
          {/* Timeline */}
          <div className="absolute top-0 left-0 right-0 flex justify-between">
            <div className="text-xs text-muted-foreground">Arrival</div>
            <div className="text-xs text-muted-foreground">Inspection</div>
            <div className="text-xs text-muted-foreground">Preparation</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full w-1/4 bg-blue-500 dark:bg-blue-400"></div>
            <div className="absolute top-0 left-1/4 w-px h-2 bg-gray-400 -translate-x-1/2 translate-y-6"></div>
            <div className="absolute top-0 left-2/4 w-px h-2 bg-gray-400 -translate-x-1/2 translate-y-6"></div>
            <div className="absolute top-0 left-3/4 w-px h-2 bg-gray-400 -translate-x-1/2 translate-y-6"></div>
          </div>

          {/* Markers */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 translate-y-6 w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
          <div className="absolute top-0 left-2/4 -translate-x-1/2 translate-y-6 w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
          <div className="absolute top-0 left-3/4 -translate-x-1/2 translate-y-6 w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <div>2-3 days</div>
          <div>4-5 days</div>
          <div>3-4 days</div>
        </div>
      </div>
    </div>
  )
}

// Upcoming Reservations visualization
export function UpcomingReservationsVisualization({ className }: { className?: string }) {
  // Sample data - in a real app, this would come from props
  const upcomingReservations = 8
  const totalReservations = 12
  const nextWeekReservations = 5
  const twoWeeksReservations = 3

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-3xl font-bold">{upcomingReservations}</span>
          <div className="text-sm text-muted-foreground">upcoming</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">{totalReservations} total</div>
          <div className="text-xs text-muted-foreground">reservations</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Timeline</span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                <span className="text-sm font-medium">Next 7 days</span>
              </div>
              <span className="text-sm font-medium">{nextWeekReservations}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full dark:bg-gray-700">
              <div
                className="bg-purple-500 h-2 rounded-full dark:bg-purple-400"
                style={{ width: `${(nextWeekReservations / upcomingReservations) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-300 dark:text-purple-300" />
                <span className="text-sm font-medium">8-14 days</span>
              </div>
              <span className="text-sm font-medium">{twoWeeksReservations}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full dark:bg-gray-700">
              <div
                className="bg-purple-300 h-2 rounded-full dark:bg-purple-300"
                style={{ width: `${(twoWeeksReservations / upcomingReservations) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Vehicle Availability Trends visualization
export function AvailabilityTrendsVisualization({ className }: { className?: string }) {
  // Sample data - in a real app, this would come from props
  const currentAvailability = 65
  const change = 8.3 // percentage change
  const trendData = [40, 45, 42, 50, 55, 60, 65]
  const maxValue = Math.max(...trendData)

  // Time period options
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("week")

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-3xl font-bold">{currentAvailability}%</span>
          <div className="text-sm text-muted-foreground">availability</div>
        </div>

        <div className="flex flex-col items-end">
          <div
            className={cn(
              "flex items-center text-sm font-medium",
              change > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </div>
          <span className="text-xs text-muted-foreground">vs previous period</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Trend</span>

          <div className="flex items-center space-x-1 text-xs">
            <button
              className={cn(
                "px-2 py-0.5 rounded-md",
                period === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
              onClick={() => setPeriod("week")}
            >
              Week
            </button>
            <button
              className={cn(
                "px-2 py-0.5 rounded-md",
                period === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
              onClick={() => setPeriod("month")}
            >
              Month
            </button>
            <button
              className={cn(
                "px-2 py-0.5 rounded-md",
                period === "quarter" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
              onClick={() => setPeriod("quarter")}
            >
              Quarter
            </button>
          </div>
        </div>

        <div className="h-24 flex items-end space-x-1">
          {trendData.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-emerald-500 dark:bg-emerald-400 rounded-t-sm"
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {period === "week"
                  ? ["M", "T", "W", "T", "F", "S", "S"][index]
                  : period === "month"
                    ? `W${index + 1}`
                    : `M${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Vehicle Type Breakdown visualization
export function VehicleTypeBreakdownVisualization({ className }: { className?: string }) {
  // Sample data - in a real app, this would come from props
  const vehicleTypes = [
    { type: "Sedan", count: 42, color: "bg-blue-500 dark:bg-blue-400" },
    { type: "SUV", count: 28, color: "bg-emerald-500 dark:bg-emerald-400" },
    { type: "Truck", count: 18, color: "bg-amber-500 dark:bg-amber-400" },
    { type: "Van", count: 12, color: "bg-purple-500 dark:bg-purple-400" },
  ]

  const total = vehicleTypes.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-3xl font-bold">{total}</span>
          <div className="text-sm text-muted-foreground">vehicles</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">{vehicleTypes.length} types</div>
          <div className="text-xs text-muted-foreground">in inventory</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Distribution</span>
        </div>

        <div className="w-full h-2 rounded-full overflow-hidden flex">
          {vehicleTypes.map((item, index) => (
            <div
              key={index}
              className={cn("h-full transition-all duration-500 ease-in-out", item.color)}
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {vehicleTypes.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                <span className="text-sm">{item.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{item.count}</span>
                <span className="text-xs text-muted-foreground">({Math.round((item.count / total) * 100)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Display units visualization (kept from previous design)
export function DisplayUnitsVisualizationV8({
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
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-3xl font-bold">{display}</span>
          <div className="text-sm text-muted-foreground">display units</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">{percentage}%</div>
          <div className="text-xs text-muted-foreground">of inventory</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Distribution</span>
        </div>

        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute left-0 h-full bg-slate-500 dark:bg-slate-400 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <div>Showroom: {Math.round(display * 0.7)}</div>
          <div>Outdoor: {Math.round(display * 0.3)}</div>
        </div>
      </div>
    </div>
  )
}
