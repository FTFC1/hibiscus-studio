"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DonutChart } from "@/components/ui/donut-chart"
import { MapPin, Package, BarChart3, Car } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardMetricsProps {
  totalVehicles: number
  availableVehicles: number
  inTransitVehicles: number
  reservedVehicles: number
  displayVehicles: number
  totalBrands?: number
  totalModels?: number
  isLoading?: boolean
}

export function DashboardMetrics({
  totalVehicles,
  availableVehicles,
  inTransitVehicles,
  reservedVehicles,
  displayVehicles,
  totalBrands,
  totalModels,
  isLoading = false,
}: DashboardMetricsProps) {
  // State for vehicle types and locations
  const [vehicleTypes, setVehicleTypes] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [topModels, setTopModels] = useState<Array<{ name: string; count: number }>>([])
  const [locationData, setLocationData] = useState<Array<{ location: string; count: number }>>([])
  const [recentlyAdded, setRecentlyAdded] = useState<Array<{ model: string; count: number }>>([])

  // Fetch data from database
  useEffect(() => {
    // This would be replaced with actual database queries
    // Sample vehicle types - ensuring total matches totalVehicles
    setVehicleTypes([
      { name: "Sedan", value: Math.round(totalVehicles * 0.42), color: "#3b82f6" }, // blue
      { name: "SUV", value: Math.round(totalVehicles * 0.28), color: "#10b981" }, // green
      { name: "Truck", value: Math.round(totalVehicles * 0.18), color: "#f59e0b" }, // amber
      { name: "Van", value: Math.round(totalVehicles * 0.12), color: "#8b5cf6" }, // purple
    ])

    // Sample top models based on actual inventory
    setTopModels([
      { name: "Toyota Camry", count: 12 },
      { name: "Honda Accord", count: 9 },
      { name: "Ford F-150", count: 7 },
    ])

    // Sample location data
    setLocationData([
      { location: "Main Warehouse", count: Math.round(totalVehicles * 0.45) },
      { location: "North Lot", count: Math.round(totalVehicles * 0.3) },
      { location: "Service Center", count: Math.round(totalVehicles * 0.25) },
    ])

    // Sample recently added models
    setRecentlyAdded([
      { model: "Toyota Camry", count: 3 },
      { model: "Honda Accord", count: 2 },
    ])
  }, [totalVehicles])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[350px] rounded-xl border bg-white dark:bg-slate-800/60 animate-pulse" />
        ))}
      </div>
    )
  }

  // Calculate percentages
  const availablePercentage = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0
  const inTransitPercentage = totalVehicles > 0 ? Math.round((inTransitVehicles / totalVehicles) * 100) : 0
  const reservedPercentage = totalVehicles > 0 ? Math.round((reservedVehicles / totalVehicles) * 100) : 0
  const displayPercentage = totalVehicles > 0 ? Math.round((displayVehicles / totalVehicles) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Inventory Status */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/60 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Total Vehicles</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Distribution bar */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Distribution</span>
              <span className="text-muted-foreground">{totalVehicles} total</span>
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

          {/* Status breakdown */}
          <div className="grid grid-cols-1 gap-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold">{availableVehicles}</span>
                <span className="text-xs text-muted-foreground">({availablePercentage}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400" />
                <span className="text-sm">In Transit</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold">{inTransitVehicles}</span>
                <span className="text-xs text-muted-foreground">({inTransitPercentage}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 dark:bg-purple-400" />
                <span className="text-sm">Reserved</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold">{reservedVehicles}</span>
                <span className="text-xs text-muted-foreground">({reservedPercentage}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500 dark:bg-slate-400" />
                <span className="text-sm">Display</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold">{displayVehicles}</span>
                <span className="text-xs text-muted-foreground">({displayPercentage}%)</span>
              </div>
            </div>
          </div>

          {/* Recently Added */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Recently Added</div>
              <div className="text-xs text-muted-foreground">Last 7 days</div>
            </div>
            <div className="space-y-2">
              {recentlyAdded.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{item.model}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Vehicle Type Breakdown - REDESIGNED for maximum visual communication */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/60 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
              <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg">Vehicle Type Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Direct labeling approach - no separate legend needed */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[220px] aspect-square mb-4">
              {/* Donut chart with values directly on segments */}
              <DonutChart
                data={vehicleTypes}
                size={220}
                thickness={50}
                showLegend={false}
                innerLabel={
                  <div className="text-center text-white">
                    <div className="text-3xl font-bold">{totalVehicles}</div>
                    <div className="text-xs text-gray-300 mt-1">vehicles</div>
                  </div>
                }
              />
            </div>

            {/* Unified data presentation - combines visual and textual information */}
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-3 mt-2">
              {vehicleTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-2 rounded-md"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-sm font-medium">{type.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{type.value}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((type.value / totalVehicles) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Inventory Highlights */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/60 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">Inventory Highlights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* New Arrivals */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">New Arrivals</div>
              <div className="text-xs text-muted-foreground">Last 7 days</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-xs font-medium">Sedan</div>
                <div className="text-sm font-medium">4</div>
              </div>
              <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-xs font-medium">SUV</div>
                <div className="text-sm font-medium">3</div>
              </div>
              <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-xs font-medium">Truck</div>
                <div className="text-sm font-medium">1</div>
              </div>
            </div>
          </div>

          {/* Top Models */}
          <div className="space-y-3 mb-6">
            <div className="text-sm font-medium">Top Models</div>
            <div className="space-y-2">
              {topModels.map((model, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{model.name}</span>
                  <span className="font-medium">{model.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Breakdown */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium">Location Breakdown</div>
            </div>
            <div className="space-y-2">
              {locationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{item.location}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
