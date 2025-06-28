"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { X, Search, Edit, Trash2, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getVehiclesByModel, deleteVehicle } from "@/app/actions"
import { useToastContext } from "@/components/toast-provider"
import { EditVehicleDialog } from "./edit-vehicle-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// Import the new components
import { VehicleStatusBadge, getStatusInfo } from "@/components/vehicle-status-badge"
import { ColorBadge } from "@/components/color-badge"

interface ViewInventorySheetProps {
  isOpen: boolean
  onClose: () => void
  vehicleBrand: string
  vehicleModel: string
  modelId: number
}

type CarStatus = "Available" | "Display" | "In Transit" | "Reserved"
type CarColor = string

interface CarItem {
  id: number
  vin: string
  color: CarColor
  status: CarStatus
  location: string
  arrival_date?: string | null
  customer_name?: string | null
}

export function ViewInventorySheet({ isOpen, onClose, vehicleBrand, vehicleModel, modelId }: ViewInventorySheetProps) {
  const [selectedColor, setSelectedColor] = useState<CarColor | null>(null)
  const [activeStatus, setActiveStatus] = useState<CarStatus>("Available")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [inventory, setInventory] = useState<CarItem[]>([])
  const [error, setError] = useState<string | null>(null)

  // Filter visibility state
  const [filtersVisible, setFiltersVisible] = useState(false)

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<CarItem | null>(null)

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<CarItem | null>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToastContext()

  // Fetch inventory data when sheet opens
  useEffect(() => {
    if (isOpen && modelId) {
      fetchVehicles()
    }
  }, [isOpen, modelId])

  // Reset state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedColor(null)
      setActiveStatus("Available")
      setSearchQuery("")
      setError(null)
      setFiltersVisible(false)
    }
  }, [isOpen])

  // Function to fetch vehicles
  const fetchVehicles = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getVehiclesByModel(modelId)
      console.log(`Vehicles for model ${modelId}:`, data)

      if (Array.isArray(data)) {
        setInventory(data)
      } else {
        console.error(`Unexpected vehicles data format for model ${modelId}:`, data)
        setError("Failed to load vehicle data")
        setInventory([])
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error)
      setError("Failed to load vehicle data")
      setInventory([])
    } finally {
      setIsLoading(false)
    }
  }

  // Filter inventory by selected status, color and search query
  const filteredInventory = inventory.filter((car) => {
    // Filter by status
    if (car.status !== activeStatus) return false

    // Filter by color if selected
    if (selectedColor && car.color !== selectedColor) return false

    // Filter by search query
    if (searchQuery && !car.vin.toLowerCase().includes(searchQuery.toLowerCase())) return false

    return true
  })

  // Count cars by status
  const statusCounts = {
    Available: inventory.filter((car) => car.status === "Available").length,
    Display: inventory.filter((car) => car.status === "Display").length,
    "In Transit": inventory.filter((car) => car.status === "In Transit").length,
    Reserved: inventory.filter((car) => car.status === "Reserved").length,
  }

  // Get status icon and color
  // const getStatusInfo = (status: CarStatus) => {
  //   switch (status) {
  //     case "Available":
  //       return {
  //         icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  //         color: "text-emerald-500",
  //         bgColor: "bg-emerald-50",
  //       }
  //     case "Display":
  //       return { icon: <Circle className="h-4 w-4 text-blue-500" />, color: "text-blue-500", bgColor: "bg-blue-50" }
  //     case "In Transit":
  //       return { icon: <Clock className="h-4 w-4 text-amber-500" />, color: "text-amber-500", bgColor: "bg-amber-50" }
  //     case "Reserved":
  //       return {
  //         icon: <AlertCircle className="h-4 w-4 text-purple-500" />,
  //         color: "text-purple-500",
  //         bgColor: "bg-purple-50",
  //       }
  //   }
  // }

  // Get color badge
  // const getColorBadge = (color: CarColor, size: "sm" | "md" = "md") => {
  //   // Map color names to Tailwind classes
  //   const colorClasses: Record<string, string> = {
  //     White: "bg-white border border-gray-200",
  //     Black: "bg-gray-900",
  //     Silver: "bg-gray-300",
  //     Red: "bg-red-500",
  //     Blue: "bg-blue-500",
  //     // Add more colors as needed
  //   }

  //   const sizeClasses = {
  //     sm: "h-6 w-6",
  //     md: "h-10 w-10",
  //   }

  //   // Default to a gray color if the color is not in our map
  //   const colorClass = colorClasses[color] || "bg-gray-400"

  //   return (
  //     <div
  //       className={cn("rounded-full flex items-center justify-center", colorClass, sizeClasses[size])}
  //       aria-label={color}
  //     />
  //   )
  // }

  // Handle edit vehicle
  const handleEditVehicle = (vehicle: CarItem) => {
    setSelectedVehicle(vehicle)
    setIsEditDialogOpen(true)
  }

  // Handle delete vehicle
  const handleDeleteVehicle = (vehicle: CarItem) => {
    setVehicleToDelete(vehicle)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete vehicle
  const confirmDeleteVehicle = async () => {
    if (!vehicleToDelete) return

    try {
      const result = await deleteVehicle(vehicleToDelete.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle deleted successfully",
          type: "success",
        })

        // Refresh the inventory
        fetchVehicles()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete vehicle",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    }
  }

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={cn("p-0 flex flex-col", isMobile ? "h-[90vh] rounded-t-xl" : "w-[450px] max-w-full")}
        >
          <SheetHeader className="px-4 py-4 border-b sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-xl font-bold sm:text-2xl">{vehicleModel}</SheetTitle>
                <p className="text-muted-foreground text-sm mt-0.5">{vehicleBrand}</p>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Close">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          {/* Error message */}
          {error && (
            <div className="p-4 border-b border-destructive/50 bg-destructive/10 text-center text-destructive">
              {error}
            </div>
          )}

          {/* Mobile-optimized search and filter bar */}
          <div className="sticky top-0 z-10 bg-background border-b p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by VIN..."
                  className="pl-9 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search by VIN"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={toggleFilters}
                aria-expanded={filtersVisible}
                aria-label="Toggle filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Status pills - always visible for quick filtering */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {(["Available", "Display", "In Transit", "Reserved"] as CarStatus[]).map((status) => {
                const isActive = activeStatus === status
                const count = statusCounts[status]
                const statusInfo = getStatusInfo(status as CarStatus)

                return (
                  <button
                    key={status}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                      isActive
                        ? cn("bg-primary text-primary-foreground dark:bg-primary/90")
                        : cn(
                            "bg-muted hover:bg-muted/80 text-foreground/80 dark:text-foreground/70",
                            "border border-transparent dark:border-muted/30",
                          ),
                    )}
                    onClick={() => setActiveStatus(status as CarStatus)}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${status} status`}
                  >
                    {status}
                    <span
                      className={cn(
                        "inline-flex items-center justify-center rounded-full text-xs font-medium",
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : "bg-background dark:bg-muted/30 text-foreground/90 dark:text-foreground/80",
                        "min-w-5 h-5 ml-0.5",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Collapsible filters section */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out border-b",
              filtersVisible ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 border-b-0",
            )}
          >
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3">Filter by Color</h3>
              <div className="flex flex-wrap gap-3">
                {/* Get unique colors from inventory */}
                {Array.from(new Set(inventory.map((car) => car.color))).map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "relative rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      selectedColor === color && "ring-2 ring-primary ring-offset-2",
                    )}
                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                    aria-pressed={selectedColor === color}
                    aria-label={`Filter by ${color}`}
                  >
                    <div className="flex items-center justify-center">
                      <ColorBadge color={color} />
                      <span className="sr-only">{color}</span>
                    </div>
                  </button>
                ))}

                {selectedColor && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-10 px-4 ml-1"
                    onClick={() => setSelectedColor(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Inventory list */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <p className="text-muted-foreground mb-2">No vehicles found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className="p-4 space-y-3" role="list" aria-label={`${activeStatus} vehicles`}>
                {filteredInventory.map((car) => {
                  const statusInfo = getStatusInfo(car.status as CarStatus)

                  return (
                    <Accordion type="single" collapsible key={car.id}>
                      <AccordionItem value={car.id.toString()} className="border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{car.vin}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <VehicleStatusBadge status={car.status} />
                              <span className="text-sm text-muted-foreground truncate">{car.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <ColorBadge color={car.color} size="sm" />
                            <AccordionTrigger className="p-0 hover:no-underline">
                              <span className="sr-only">Toggle details</span>
                            </AccordionTrigger>
                          </div>
                        </div>

                        <AccordionContent>
                          <div className="px-3 pb-3 pt-0 border-t mt-1">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                              <div>
                                <dt className="text-muted-foreground">Status</dt>
                                <dd className="font-medium">{car.status}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">Color</dt>
                                <dd className="font-medium">{car.color}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">Location</dt>
                                <dd className="font-medium">{car.location}</dd>
                              </div>

                              {car.status === "In Transit" && car.arrival_date && (
                                <div>
                                  <dt className="text-muted-foreground">Arrival Date</dt>
                                  <dd className="font-medium">{car.arrival_date}</dd>
                                </div>
                              )}

                              {car.status === "Reserved" && car.customer_name && (
                                <div>
                                  <dt className="text-muted-foreground">Customer</dt>
                                  <dd className="font-medium">{car.customer_name}</dd>
                                </div>
                              )}
                            </dl>

                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEditVehicle(car)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteVehicle(car)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Vehicle Dialog */}
      {selectedVehicle && (
        <EditVehicleDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={fetchVehicles}
          vehicle={selectedVehicle}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {vehicleToDelete && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDeleteVehicle}
          title="Delete Vehicle"
          description={`Are you sure you want to delete the vehicle with VIN ${vehicleToDelete.vin}? This action cannot be undone.`}
        />
      )}
    </>
  )
}
