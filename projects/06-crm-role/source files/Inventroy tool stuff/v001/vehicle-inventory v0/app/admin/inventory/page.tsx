"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Car, Search, X } from "lucide-react"
import { useToastContext } from "@/components/toast-provider"
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/app/actions/vehicle-actions"
import { getAllModels } from "@/app/actions/model-actions"
import { getAllTrims } from "@/app/actions/trim-actions"
import { getAllColors } from "@/app/actions/color-actions"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"
// Import the VehicleForm component
import { VehicleForm } from "@/components/vehicle-form"

interface Vehicle {
  id: number
  vin: string
  status: string
  location: string
  arrival_date: string | null
  customer_name: string | null
  notes: string | null
  model_id: number
  trim_id: number
  color_id: number
  model_name: string
  brand_name: string
  trim_name: string
  color_name: string
}

interface Model {
  id: number
  name: string
  brand_name: string
}

interface Trim {
  id: number
  name: string
  model_id: number
  model_name: string
  brand_name: string
}

interface Color {
  id: number
  name: string
  hex_code: string | null
}

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [trims, setTrims] = useState<Trim[]>([])
  const [modelTrims, setModelTrims] = useState<Record<number, Trim[]>>({})
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    modelId: 0,
    trimId: 0,
    colorId: 0,
    vin: "",
    status: "",
    location: "",
    arrivalDate: "",
    customerName: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const { toast } = useToastContext()

  // Fetch data on component mount
  useEffect(() => {
    fetchVehicles()
    fetchModels()
    fetchTrims()
    fetchColors()
  }, [])

  // Filter vehicles based on search query
  useEffect(() => {
    if (!vehicles.length) return

    if (!debouncedSearchQuery.trim()) {
      setFilteredVehicles(vehicles)
      return
    }

    const query = debouncedSearchQuery.toLowerCase().trim()
    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.vin.toLowerCase().includes(query) ||
        vehicle.brand_name.toLowerCase().includes(query) ||
        vehicle.model_name.toLowerCase().includes(query) ||
        vehicle.trim_name.toLowerCase().includes(query) ||
        vehicle.color_name.toLowerCase().includes(query) ||
        vehicle.status.toLowerCase().includes(query) ||
        vehicle.location.toLowerCase().includes(query) ||
        (vehicle.customer_name && vehicle.customer_name.toLowerCase().includes(query)),
    )

    setFilteredVehicles(filtered)
  }, [debouncedSearchQuery, vehicles])

  // Update model trims when model or trim data changes
  useEffect(() => {
    if (trims.length > 0) {
      const trimsByModel: Record<number, Trim[]> = {}

      trims.forEach((trim) => {
        if (!trimsByModel[trim.model_id]) {
          trimsByModel[trim.model_id] = []
        }
        trimsByModel[trim.model_id].push(trim)
      })

      setModelTrims(trimsByModel)
    }
  }, [trims])

  // Function to fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const data = await getAllVehicles()
      if (Array.isArray(data)) {
        setVehicles(data)
        setFilteredVehicles(data)
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error)
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        type: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch models
  const fetchModels = async () => {
    try {
      const data = await getAllModels()
      if (Array.isArray(data)) {
        setModels(data)
      }
    } catch (error) {
      console.error("Error fetching models:", error)
      toast({
        title: "Error",
        description: "Failed to load models",
        type: "destructive",
      })
    }
  }

  // Function to fetch trims
  const fetchTrims = async () => {
    try {
      const data = await getAllTrims()
      if (Array.isArray(data)) {
        setTrims(data)
      }
    } catch (error) {
      console.error("Error fetching trims:", error)
      toast({
        title: "Error",
        description: "Failed to load trims",
        type: "destructive",
      })
    }
  }

  // Function to fetch colors
  const fetchColors = async () => {
    try {
      const data = await getAllColors()
      if (Array.isArray(data)) {
        setColors(data)
      }
    } catch (error) {
      console.error("Error fetching colors:", error)
      toast({
        title: "Error",
        description: "Failed to load colors",
        type: "destructive",
      })
    }
  }

  // Function to handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Function to handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === "modelId" || name === "trimId" || name === "colorId" ? Number.parseInt(value) : value,
      }

      // Reset trim when model changes
      if (name === "modelId") {
        newData.trimId = 0
      }

      return newData
    })
  }

  // Function to validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.modelId) {
      newErrors.modelId = "Model is required"
    }

    if (!formData.trimId) {
      newErrors.trimId = "Trim is required"
    }

    if (!formData.colorId) {
      newErrors.colorId = "Color is required"
    }

    if (!formData.vin.trim()) {
      newErrors.vin = "VIN is required"
    } else if (formData.vin.length < 10 || formData.vin.length > 17) {
      newErrors.vin = "VIN must be between 10 and 17 characters"
    }

    if (!formData.status) {
      newErrors.status = "Status is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Function to handle add vehicle
  const handleAddVehicle = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const result = await createVehicle({
        modelId: formData.modelId,
        trimId: formData.trimId,
        colorId: formData.colorId,
        vin: formData.vin,
        status: formData.status as any,
        location: formData.location,
        arrivalDate: formData.arrivalDate || null,
        customerName: formData.customerName || null,
        notes: formData.notes || null,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle added successfully",
          type: "success",
        })
        setIsAddDialogOpen(false)
        resetForm()
        fetchVehicles()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add vehicle",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error adding vehicle:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle edit vehicle
  const handleEditVehicle = async () => {
    if (!validateForm() || !selectedVehicle) return

    try {
      setIsSubmitting(true)
      const result = await updateVehicle(selectedVehicle.id, {
        modelId: formData.modelId,
        trimId: formData.trimId,
        colorId: formData.colorId,
        vin: formData.vin,
        status: formData.status as any,
        location: formData.location,
        arrivalDate: formData.arrivalDate || null,
        customerName: formData.customerName || null,
        notes: formData.notes || null,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle updated successfully",
          type: "success",
        })
        setIsEditDialogOpen(false)
        resetForm()
        fetchVehicles()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update vehicle",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error updating vehicle:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle delete vehicle
  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return

    try {
      setIsSubmitting(true)
      const result = await deleteVehicle(selectedVehicle.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle deleted successfully",
          type: "success",
        })
        setIsDeleteDialogOpen(false)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to open edit dialog
  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      modelId: vehicle.model_id,
      trimId: vehicle.trim_id,
      colorId: vehicle.color_id,
      vin: vehicle.vin,
      status: vehicle.status,
      location: vehicle.location,
      arrivalDate: vehicle.arrival_date || "",
      customerName: vehicle.customer_name || "",
      notes: vehicle.notes || "",
    })
    setErrors({})
    setIsEditDialogOpen(true)
  }

  // Function to open delete dialog
  const openDeleteDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDeleteDialogOpen(true)
  }

  // Function to reset form
  const resetForm = () => {
    setFormData({
      modelId: 0,
      trimId: 0,
      colorId: 0,
      vin: "",
      status: "",
      location: "",
      arrivalDate: "",
      customerName: "",
      notes: "",
    })
    setErrors({})
    setSelectedVehicle(null)
  }

  // Status options
  const statusOptions = ["Available", "Display", "In Transit", "Reserved"]

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "Display":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "In Transit":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "Reserved":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Inventory</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by VIN, brand, model, trim, color, status, or location..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading inventory...</div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <Car className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {vehicles.length === 0
              ? "No vehicles found in inventory"
              : `No vehicles found matching "${debouncedSearchQuery}"`}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            {vehicles.length === 0 ? "Add Your First Vehicle" : "Add New Vehicle"}
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VIN</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Trim</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.brand_name}</TableCell>
                  <TableCell>{vehicle.model_name}</TableCell>
                  <TableCell>{vehicle.trim_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {vehicle.color_id && (
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{
                            backgroundColor: colors.find((c) => c.id === vehicle.color_id)?.hex_code || undefined,
                          }}
                        />
                      )}
                      {vehicle.color_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.location}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(vehicle)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(vehicle)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && setIsAddDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          {/* Replace the form content in the Add Vehicle Dialog with the VehicleForm component */}
          <div className="py-4">
            <VehicleForm
              formData={formData}
              errors={errors}
              models={models}
              trims={modelTrims}
              colors={colors}
              onChange={(name, value) => {
                if (name === "modelId" && typeof value === "number") {
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    trimId: 0, // Reset trim when model changes
                  }))
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }))
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {/* Replace the form content in the Edit Vehicle Dialog with the VehicleForm component */}
          <div className="py-4">
            <VehicleForm
              formData={formData}
              errors={errors}
              models={models}
              trims={modelTrims}
              colors={colors}
              onChange={(name, value) => {
                if (name === "modelId" && typeof value === "number") {
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    trimId: 0, // Reset trim when model changes
                  }))
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }))
                }
              }}
              isEdit={true}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditVehicle} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the vehicle with VIN <strong>{selectedVehicle?.vin}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the vehicle from the database.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteVehicle} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
