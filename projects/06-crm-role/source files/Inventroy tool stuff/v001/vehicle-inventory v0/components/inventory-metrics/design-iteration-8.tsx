import { MetricBase, IconBackground, type MetricColor } from "./base-components"
import {
  ConsolidatedTotalVisualization,
  AverageTimeVisualization,
  UpcomingReservationsVisualization,
  AvailabilityTrendsVisualization,
  VehicleTypeBreakdownVisualization,
  DisplayUnitsVisualizationV8,
} from "./advanced-visualizations"
import { Clock, Calendar, TrendingUp, Car, BarChart3 } from "lucide-react"

interface DesignIteration8Props {
  title: string
  type: string
  color: MetricColor
  total: number
  available: number
  inTransit: number
  reserved: number
  display: number
  className?: string
}

export function DesignIteration8({
  title,
  type,
  color,
  total,
  available,
  inTransit,
  reserved,
  display,
  className,
}: DesignIteration8Props) {
  // Determine which visualization to render based on the type
  const renderVisualization = () => {
    switch (type) {
      case "total":
        return (
          <ConsolidatedTotalVisualization
            total={total}
            available={available}
            inTransit={inTransit}
            reserved={reserved}
            display={display}
          />
        )
      case "time-to-availability":
        return <AverageTimeVisualization />
      case "upcoming-reservations":
        return <UpcomingReservationsVisualization />
      case "availability-trends":
        return <AvailabilityTrendsVisualization />
      case "vehicle-types":
        return <VehicleTypeBreakdownVisualization />
      case "display":
        return <DisplayUnitsVisualizationV8 display={display} total={total} />
      default:
        return null
    }
  }

  // Get the appropriate icon based on the type
  const getIcon = () => {
    switch (type) {
      case "total":
        return <Car className="h-5 w-5" />
      case "time-to-availability":
        return <Clock className="h-5 w-5" />
      case "upcoming-reservations":
        return <Calendar className="h-5 w-5" />
      case "availability-trends":
        return <TrendingUp className="h-5 w-5" />
      case "vehicle-types":
        return <Car className="h-5 w-5" />
      case "display":
        return <BarChart3 className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  return (
    <MetricBase title={title} className={className}>
      <div className="flex items-center gap-2 mb-4">
        <IconBackground color={color}>{getIcon()}</IconBackground>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      <div className="mt-2">{renderVisualization()}</div>
    </MetricBase>
  )
}
