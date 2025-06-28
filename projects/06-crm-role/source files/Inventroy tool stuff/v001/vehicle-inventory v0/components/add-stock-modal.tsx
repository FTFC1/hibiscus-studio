"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addVehicleStock } from "@/app/actions"
import { useToastContext } from "@/components/toast-provider"
import { ModelSelector } from "@/components/vehicle-form/model-selector"
import { TrimSelector } from "@/components/vehicle-form/trim-selector"
import { ColorSelector } from "@/components/vehicle-form/color-selector"
import { useModels, useColors, useTrims } from "@/lib/swr-hooks"
import { logPerformance } from "@/lib/performance"

interface AddStockModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

export function AddStockModal({ isOpen, onClose, onSubmit }: AddStockModalProps) {
  const startTime = performance.now()

  // Form state
  const [modelId, setModelId] = useState<number | null>(null)
  const [colorId, setColorId] = useState<number | null>(null)
  const [trimId, setTrimId] = useState<number | null>(null)
  const [vin, setVin] = useState("")
  const [status, setStatus] = useState("Available")
  const [location, setLocation] = useState("Main Warehouse")
  const [arrivalDate, setArrivalDate] = useState("")
  const [customerName, setCustomerName] = useState("")

  // Fetch data with SWR
  const { models, isLoading: isLoadingModels } = useModels()
  const { colors, isLoading: isLoadingColors } = useColors()
  const { trims, isLoading: isLoadingTrims } = useTrims(modelId)

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingData = isLoadingModels || isLoadingColors || (modelId && isLoadingTrims)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Toast context
  const { toast } = useToastContext()

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  // Reset form
  const resetForm = useCallback(() => {
    setModelId(null)
    setColorId(null)
    setVin("")
    setStatus("Available")
    setLocation("Main Warehouse")
    setArrivalDate("")
    setCustomerName("")
    setErrors({})
    setTrimId(null)
  }, [])

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!modelId) {
      newErrors.modelId = "Please select a model"
    }

    if (!colorId) {
      newErrors.colorId = "Please select a color"
    }

    if (!vin) {
      newErrors.vin = "VIN is required"
    } else if (vin.length < 10 || vin.length > 17) {
      newErrors.vin = "VIN must be between 10 and 17 characters"
    }

    if (!location) {
      newErrors.location = "Location is required"
    }

    if (status === "In Transit" && !arrivalDate) {
      newErrors.arrivalDate = "Arrival date is required for In Transit vehicles"
    }

    if (status === "Reserved" && !customerName) {
      newErrors.customerName = "Customer name is required for Reserved vehicles"
    }

    // Add trim validation
    if (!trimId) {
      newErrors.trimId = "Please select a trim"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [modelId, colorId, vin, location, status, arrivalDate, customerName, trimId])

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await addVehicleStock({
        modelId,
        colorId,
        vin,
        status,
        location,
        arrivalDate: arrivalDate || null,
        customerName: customerName || null,
        trimId,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle added successfully",
          type: "success",
        })
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
          description: result.message || "Failed to add vehicle",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding vehicle:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Memoize the form content to prevent unnecessary re-renders
  const formContent = useMemo(
    () => (
      <div className="grid gap-4 py-4">
        {/* Model selection */}
        <ModelSelector
          models={models}
          modelId={modelId}
          onChange={setModelId}
          error={errors.modelId}
          disabled={isLoadingModels}
        />

        {/* Trim selection */}
        <TrimSelector
          modelId={modelId}
          trimId={trimId}
          trims={trims}
          onChange={setTrimId}
          error={errors.trimId}
          disabled={isLoadingTrims || !modelId}
        />

        {/* Color selection */}
        <ColorSelector
          colors={colors}
          colorId={colorId}
          onChange={setColorId}
          error={errors.colorId}
          disabled={isLoadingColors}
        />

        {/* VIN */}
        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            className={errors.vin ? "border-destructive" : ""}
            placeholder="Enter VIN"
          />
          {errors.vin && <p className="text-sm text-destructive mt-1">{errors.vin}</p>}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
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

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={errors.location ? "border-destructive" : ""}
            placeholder="Enter location"
          />
          {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
        </div>

        {/* Arrival Date - only shown for In Transit status */}
        {status === "In Transit" && (
          <div className="space-y-2">
            <Label htmlFor="arrivalDate">Arrival Date</Label>
            <Input
              id="arrivalDate"
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className={errors.arrivalDate ? "border-destructive" : ""}
            />
            {errors.arrivalDate && <p className="text-sm text-destructive mt-1">{errors.arrivalDate}</p>}
          </div>
        )}

        {/* Customer Name - only shown for Reserved status */}
        {status === "Reserved" && (
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={errors.customerName ? "border-destructive" : ""}
              placeholder="Enter customer name"
            />
            {errors.customerName && <p className="text-sm text-destructive mt-1">{errors.customerName}</p>}
          </div>
        )}
      </div>
    ),
    [
      models,
      modelId,
      errors.modelId,
      isLoadingModels,
      trims,
      trimId,
      errors.trimId,
      isLoadingTrims,
      colors,
      colorId,
      errors.colorId,
      isLoadingColors,
      vin,
      errors.vin,
      status,
      location,
      errors.location,
      arrivalDate,
      errors.arrivalDate,
      customerName,
      errors.customerName,
    ],
  )

  // Log performance when component renders
  useEffect(() => {
    return () => {
      logPerformance("AddStockModal", startTime)
    }
  }, [startTime])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>

        {formContent}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isLoadingData}>
            {isLoading ? "Adding..." : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
