"use client"
import { DesignIteration9 } from "./design-iteration-9"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardMetricsProps {
  totalVehicles: number
  availableVehicles: number
  inTransitVehicles: number
  reservedVehicles: number
  displayVehicles: number
}

export function DashboardMetricsShowcase({
  totalVehicles,
  availableVehicles,
  inTransitVehicles,
  reservedVehicles,
  displayVehicles,
}: DashboardMetricsProps) {
  // Calculate percentage available
  const availablePercentage = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0

  // Sample weekly changes for the fourth iteration
  const weeklyChanges = {
    total: 5,
    available: 10,
    transit: -20,
    reserved: 15,
    display: 0,
  }

  return (
    <Tabs defaultValue="iteration9" className="w-full">
      <TabsList className="mb-6 flex flex-wrap">
        <TabsTrigger value="iteration1">Iteration 1</TabsTrigger>
        <TabsTrigger value="iteration2">Iteration 2</TabsTrigger>
        <TabsTrigger value="iteration3">Iteration 3</TabsTrigger>
        <TabsTrigger value="iteration4">Iteration 4</TabsTrigger>
        <TabsTrigger value="iteration5">Iteration 5</TabsTrigger>
        <TabsTrigger value="iteration6">Iteration 6</TabsTrigger>
        <TabsTrigger value="iteration7">Iteration 7</TabsTrigger>
        <TabsTrigger value="iteration8">Iteration 8</TabsTrigger>
        <TabsTrigger value="iteration9">Iteration 9</TabsTrigger>
      </TabsList>

      {/* Previous iterations content (1-8) remains the same */}
      <TabsContent value="iteration1" className="mt-0">
        {/* Content for iteration 1 */}
      </TabsContent>

      {/* Include other previous iterations (2-8) here */}

      <TabsContent value="iteration9" className="mt-0">
        <h3 className="text-lg font-medium mb-4">Design Iteration 9: Final Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DesignIteration9
            title="Total Vehicles"
            type="total"
            color="blue"
            total={totalVehicles}
            available={availableVehicles}
            inTransit={inTransitVehicles}
            reserved={reservedVehicles}
            display={displayVehicles}
            className="md:col-span-1"
          />
          <DesignIteration9
            title="Vehicle Type Breakdown"
            type="vehicle-types"
            color="green"
            total={totalVehicles}
            available={availableVehicles}
            inTransit={inTransitVehicles}
            reserved={reservedVehicles}
            display={displayVehicles}
            className="md:col-span-1"
          />
          <DesignIteration9
            title="Inventory Highlights"
            type="inventory-highlights"
            color="purple"
            total={totalVehicles}
            available={availableVehicles}
            inTransit={inTransitVehicles}
            reserved={reservedVehicles}
            display={displayVehicles}
            className="md:col-span-1"
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
