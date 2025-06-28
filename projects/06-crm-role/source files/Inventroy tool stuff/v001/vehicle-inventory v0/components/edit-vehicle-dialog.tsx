"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateVehicle } from "@/app/actions"
import { useToastContext } from "@/components/toast-provider"

interface EditVehicleDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  vehicle: {
    id: number
    vin: string
    color: string
    status: string
    location: string
    arrival_date?: string | null
    customer_name?: string | null
  }
}

export function EditVehicleDialog({ isOpen, onClose, onSuccess, vehicle }: EditVehicleDialogProps) {
  // Form state
  const [status, setStatus] = useState(vehicle.status || "Available")
  const [location, setLocation] = useState(vehicle.location || "")
  const [arrivalDate, setArrivalDate] = useState(vehicle.arrival_date || "")
  const [customerName, setCustomerName] = useState(vehicle.customer_name || "")

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Toast context
  const { toast } = useToastContext()

  // Reset form when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setStatus(vehicle.status || "Available")
      setLocation(vehicle.location || "")
      setArrivalDate(vehicle.arrival_date || "")
      setCustomerName(vehicle.customer_name || "")
      setErrors({})
    }
  }, [vehicle])

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!location) {
      newErrors.location = "Location is required"
    }

    if (status === "In Transit" && !arrivalDate) {
      newErrors.arrivalDate = "Arrival date is required for In Transit vehicles"
    }

    if (status === "Reserved" && !customerName) {
      newErrors.customerName = "Customer name is required for Reserved vehicles"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await updateVehicle({
        id: vehicle.id,
        status,
        location,
        arrivalDate: arrivalDate || null,
        customerName: customerName || null,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle updated successfully",
          type: "success",
        })
        onSuccess()
        onClose()
      } else {
        // Handle validation errors from server
        if (result.errors) {
          const serverErrors: Record<string, string> = {}

          Object.entries(result.errors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              serverErrors[key] = value[0]
            }
          })

          setErrors(serverErrors)
        }

        toast({
          title: "Error",
          description: result.message || "Failed to update vehicle",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating vehicle:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* VIN (read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vin" className="text-right">
              VIN
            </Label>
            <div className="col-span-3">
              <Input id="vin" value={vehicle.vin} readOnly disabled />
            </div>
          </div>

          {/* Color (read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <div className="col-span-3">
              <Input id="color" value={vehicle.color} readOnly disabled />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Display">Display</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <div className="col-span-3">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={errors.location ? "border-destructive" : ""}
                placeholder="Enter location"
              />
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Arrival Date - only shown for In Transit status */}
          {status === "In Transit" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="arrivalDate" className="text-right">
                Arrival Date
              </Label>
              <div className="col-span-3">
                <Input
                  id="arrivalDate"
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className={errors.arrivalDate ? "border-destructive" : ""}
                />
                {errors.arrivalDate && <p className="text-sm text-destructive mt-1">{errors.arrivalDate}</p>}
              </div>
            </div>
          )}

          {/* Customer Name - only shown for Reserved status */}
          {status === "Reserved" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right">
                Customer
              </Label>
              <div className="col-span-3">
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={errors.customerName ? "border-destructive" : ""}
                  placeholder="Enter customer name"
                />
                {errors.customerName && <p className="text-sm text-destructive mt-1">{errors.customerName}</p>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
