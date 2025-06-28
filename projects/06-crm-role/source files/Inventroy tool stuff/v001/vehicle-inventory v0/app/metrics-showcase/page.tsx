"use client"

import { useState } from "react"
import { DashboardMetricsShowcase } from "@/components/inventory-metrics/dashboard-metrics-showcase"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DesignIteration5 } from "@/components/inventory-metrics/design-iteration-5"
import { DesignIteration6 } from "@/components/inventory-metrics/design-iteration-6"
import { DesignIteration7 } from "@/components/inventory-metrics/design-iteration-7"
import { DesignIteration8 } from "@/components/inventory-metrics/design-iteration-8"
import { DesignIteration9 } from "@/components/inventory-metrics/design-iteration-9"

export default function MetricsShowcasePage() {
  const [metrics, setMetrics] = useState({
    totalVehicles: 100,
    availableVehicles: 65,
    inTransitVehicles: 15,
    reservedVehicles: 12,
    displayVehicles: 8,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Metrics Design Showcase</h1>
      <p className="text-muted-foreground mb-8">
        Explore different design iterations for displaying vehicle inventory metrics
      </p>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Customize Demo Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="totalVehicles">Total Vehicles</Label>
            <Input
              id="totalVehicles"
              type="number"
              value={metrics.totalVehicles}
              onChange={(e) => setMetrics((prev) => ({ ...prev, totalVehicles: Number.parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label htmlFor="availableVehicles">Available</Label>
            <Input
              id="availableVehicles"
              type="number"
              value={metrics.availableVehicles}
              onChange={(e) =>
                setMetrics((prev) => ({ ...prev, availableVehicles: Number.parseInt(e.target.value) || 0 }))
              }
            />
          </div>
          <div>
            <Label htmlFor="inTransitVehicles">In Transit</Label>
            <Input
              id="inTransitVehicles"
              type="number"
              value={metrics.inTransitVehicles}
              onChange={(e) =>
                setMetrics((prev) => ({ ...prev, inTransitVehicles: Number.parseInt(e.target.value) || 0 }))
              }
            />
          </div>
          <div>
            <Label htmlFor="reservedVehicles">Reserved</Label>
            <Input
              id="reservedVehicles"
              type="number"
              value={metrics.reservedVehicles}
              onChange={(e) =>
                setMetrics((prev) => ({ ...prev, reservedVehicles: Number.parseInt(e.target.value) || 0 }))
              }
            />
          </div>
          <div>
            <Label htmlFor="displayVehicles">Display Units</Label>
            <Input
              id="displayVehicles"
              type="number"
              value={metrics.displayVehicles}
              onChange={(e) =>
                setMetrics((prev) => ({ ...prev, displayVehicles: Number.parseInt(e.target.value) || 0 }))
              }
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <DashboardMetricsShowcase
          totalVehicles={metrics.totalVehicles}
          availableVehicles={metrics.availableVehicles}
          inTransitVehicles={metrics.inTransitVehicles}
          reservedVehicles={metrics.reservedVehicles}
          displayVehicles={metrics.displayVehicles}
        />
      </div>

      <h2 className="text-xl font-semibold mb-6">Individual Versions</h2>
      <Tabs defaultValue="version9" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="version1">Version 1</TabsTrigger>
          <TabsTrigger value="version2">Version 2</TabsTrigger>
          <TabsTrigger value="version3">Version 3</TabsTrigger>
          <TabsTrigger value="version4">Version 4</TabsTrigger>
          <TabsTrigger value="version5">Version 5</TabsTrigger>
          <TabsTrigger value="version6">Version 6</TabsTrigger>
          <TabsTrigger value="version7">Version 7</TabsTrigger>
          <TabsTrigger value="version8">Version 8</TabsTrigger>
          <TabsTrigger value="version9">Version 9</TabsTrigger>
        </TabsList>

        <TabsContent value="version1" className="mt-0">
          <DashboardMetrics
            totalVehicles={metrics.totalVehicles}
            availableVehicles={metrics.availableVehicles}
            inTransitVehicles={metrics.inTransitVehicles}
            reservedVehicles={metrics.reservedVehicles}
            displayVehicles={metrics.displayVehicles}
            version={1}
          />
        </TabsContent>

        <TabsContent value="version2" className="mt-0">
          <DashboardMetrics
            totalVehicles={metrics.totalVehicles}
            availableVehicles={metrics.availableVehicles}
            inTransitVehicles={metrics.inTransitVehicles}
            reservedVehicles={metrics.reservedVehicles}
            displayVehicles={metrics.displayVehicles}
            version={2}
          />
        </TabsContent>

        <TabsContent value="version3" className="mt-0">
          <DashboardMetrics
            totalVehicles={metrics.totalVehicles}
            availableVehicles={metrics.availableVehicles}
            inTransitVehicles={metrics.inTransitVehicles}
            reservedVehicles={metrics.reservedVehicles}
            displayVehicles={metrics.displayVehicles}
            version={3}
          />
        </TabsContent>

        <TabsContent value="version4" className="mt-0">
          <DashboardMetrics
            totalVehicles={metrics.totalVehicles}
            availableVehicles={metrics.availableVehicles}
            inTransitVehicles={metrics.inTransitVehicles}
            reservedVehicles={metrics.reservedVehicles}
            displayVehicles={metrics.displayVehicles}
            version={4}
          />
        </TabsContent>

        <TabsContent value="version5" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <DesignIteration5
              title="Total Vehicles"
              value={metrics.totalVehicles}
              type="total"
              color="blue"
              total={metrics.totalVehicles}
            />
            <DesignIteration5
              title="Available"
              value={metrics.availableVehicles}
              type="available"
              color="green"
              total={metrics.totalVehicles}
              className="shadow-md shadow-emerald-100 dark:shadow-none border-emerald-200 dark:border-emerald-900/30"
            />
            <DesignIteration5
              title="In Transit"
              value={metrics.inTransitVehicles}
              type="transit"
              color="amber"
              total={metrics.totalVehicles}
            />
            <DesignIteration5
              title="Reserved"
              value={metrics.reservedVehicles}
              type="reserved"
              color="purple"
              total={metrics.totalVehicles}
            />
            <DesignIteration5
              title="Display Units"
              value={metrics.displayVehicles}
              type="display"
              color="slate"
              total={metrics.totalVehicles}
            />
          </div>
        </TabsContent>

        <TabsContent value="version6" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <DesignIteration6
              title="Total Vehicles"
              value={metrics.totalVehicles}
              type="total"
              color="blue"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
            />
            <DesignIteration6
              title="Available"
              value={metrics.availableVehicles}
              type="available"
              color="green"
              total={metrics.totalVehicles}
              className="shadow-md shadow-emerald-100 dark:shadow-none border-emerald-200 dark:border-emerald-900/30"
            />
            <DesignIteration6
              title="In Transit"
              value={metrics.inTransitVehicles}
              type="transit"
              color="amber"
              total={metrics.totalVehicles}
            />
            <DesignIteration6
              title="Reserved"
              value={metrics.reservedVehicles}
              type="reserved"
              color="purple"
              total={metrics.totalVehicles}
            />
            <DesignIteration6
              title="Display Units"
              value={metrics.displayVehicles}
              type="display"
              color="slate"
              total={metrics.totalVehicles}
            />
          </div>
        </TabsContent>

        <TabsContent value="version7" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <DesignIteration7
              title="Total Vehicles"
              value={metrics.totalVehicles}
              type="total"
              color="blue"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
            />
            <DesignIteration7
              title="Available"
              value={metrics.availableVehicles}
              type="available"
              color="green"
              total={metrics.totalVehicles}
              className="shadow-md shadow-emerald-100 dark:shadow-none border-emerald-200 dark:border-emerald-900/30"
            />
            <DesignIteration7
              title="In Transit"
              value={metrics.inTransitVehicles}
              type="transit"
              color="amber"
              total={metrics.totalVehicles}
            />
            <DesignIteration7
              title="Reserved"
              value={metrics.reservedVehicles}
              type="reserved"
              color="purple"
              total={metrics.totalVehicles}
            />
            <DesignIteration7
              title="Display Units"
              value={metrics.displayVehicles}
              type="display"
              color="slate"
              total={metrics.totalVehicles}
            />
          </div>
        </TabsContent>

        <TabsContent value="version8" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <DesignIteration8
              title="Total Vehicles"
              type="total"
              color="blue"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="row-span-2 md:col-span-2"
            />
            <DesignIteration8
              title="Average Time to Availability"
              type="time-to-availability"
              color="amber"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-1"
            />
            <DesignIteration8
              title="Upcoming Reservations"
              type="upcoming-reservations"
              color="purple"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-1"
            />
            <DesignIteration8
              title="Display Units"
              type="display"
              color="slate"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-1"
            />
            <DesignIteration8
              title="Availability Trends"
              type="availability-trends"
              color="green"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-1 lg:col-span-2"
            />
            <DesignIteration8
              title="Vehicle Type Breakdown"
              type="vehicle-types"
              color="blue"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-2 lg:col-span-2"
            />
          </div>
        </TabsContent>

        <TabsContent value="version9" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DesignIteration9
              title="Total Vehicles"
              type="total"
              color="blue"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-1"
            />
            <DesignIteration9
              title="Vehicle Type Breakdown"
              type="vehicle-types"
              color="green"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-1"
            />
            <DesignIteration9
              title="Change Metrics"
              type="change-metrics"
              color="purple"
              total={metrics.totalVehicles}
              available={metrics.availableVehicles}
              inTransit={metrics.inTransitVehicles}
              reserved={metrics.reservedVehicles}
              display={metrics.displayVehicles}
              className="md:col-span-1"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
