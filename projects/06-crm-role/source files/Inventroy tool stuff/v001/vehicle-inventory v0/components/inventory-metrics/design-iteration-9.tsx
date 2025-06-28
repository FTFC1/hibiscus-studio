import { MetricBase, IconBackground, type MetricColor } from "./base-components"
import {
  TotalVehiclesVisualization,
  VehicleTypeDonutVisualization,
  InventoryHighlightsVisualization,
} from "./final-visualizations"
import { cn } from "@/lib/utils"
import { Car, PieChart, BarChart3 } from "lucide-react"

interface DesignIteration9Props {
  title: string
  type: string
  color: MetricColor
  total: number
  available: number
  inTransit: number
  reserved: number
  display: number
  recentlyAdded?: Array<{ model: string; count: number }>
  vehicleTypes?: Array<{ name: string; value: number; color: string }>
  newArrivals?: {
    count: number
    trend: number
    breakdown: Array<{ type: string; count: number }>
  }
  topModels?: Array<{ name: string; count: number }>
  className?: string
}

export function DesignIteration9({
  title,
  type,
  color,
  total,
  available,
  inTransit,
  reserved,
  display,
  recentlyAdded = [],
  vehicleTypes = [],
  newArrivals = { count: 0, trend: 0, breakdown: [] },
  topModels = [],
  className,
}: DesignIteration9Props) {
  // Determine which visualization to render based on the type
  const renderVisualization = () => {
    switch (type) {
      case "total":
        return (
          <div className="flex justify-center w-full h-full pt-1">
            <TotalVehiclesVisualization
              total={total}
              available={available}
              inTransit={inTransit}
              reserved={reserved}
              display={display}
              recentlyAdded={recentlyAdded}
              className="w-full"
            />
          </div>
        )
      case "vehicle-types":
        return (
          <div className="flex justify-center w-full h-full pt-2">
            <VehicleTypeDonutVisualization vehicleTypes={vehicleTypes} className="w-full" />
          </div>
        )
      case "inventory-highlights":
        return <InventoryHighlightsVisualization newArrivals={newArrivals} topModels={topModels} />
      default:
        return null
    }
  }

  // Get the appropriate icon based on the type
  const getIcon = () => {
    switch (type) {
      case "total":
        return <Car className="h-5 w-5" />
      case "vehicle-types":
        return <PieChart className="h-5 w-5" />
      case "inventory-highlights":
        return <BarChart3 className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  // Apply width class to all cards for consistency
  const containerClass = "w-full"

  return (
    <MetricBase title={title} className={cn(className, containerClass)}>
      <div className="flex items-center gap-2 mb-4">
        <IconBackground color={color}>{getIcon()}</IconBackground>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      <div className="mt-2 flex-1 flex flex-col w-full">{renderVisualization()}</div>
    </MetricBase>
  )
}
