"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface VehicleFormData {
  modelId: number
  trimId: number
  colorId: number
  vin: string
  status: string
  location: string
  arrivalDate: string
  customerName: string
  notes: string
}

interface VehicleFormProps {
  formData: VehicleFormData
  errors: Record<string, string>
  models: Model[]
  trims: Record<number, Trim[]>
  colors: Color[]
  onChange: (name: string, value: string | number) => void
  isEdit?: boolean
}

export function VehicleForm({ formData, errors, models, trims, colors, onChange, isEdit = false }: VehicleFormProps) {
  // Status options
  const statusOptions = ["Available", "Display", "In Transit", "Reserved"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  const handleSelectChange = (name: string, value: string) => {
    onChange(name, name === "modelId" || name === "trimId" || name === "colorId" ? Number.parseInt(value) : value)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit-" : ""}modelId`}>Model</Label>
        <Select
          value={formData.modelId ? formData.modelId.toString() : ""}
          onValueChange={(value) => handleSelectChange("modelId", value)}
        >
          <SelectTrigger className={errors.modelId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id.toString()}>
                {model.brand_name} - {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.modelId && <p className="text-sm text-destructive">{errors.modelId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit-" : ""}trimId`}>Trim</Label>
        <Select
          value={formData.trimId ? formData.trimId.toString() : ""}
          onValueChange={(value) => handleSelectChange("trimId", value)}
          disabled={!formData.modelId}
        >
          <SelectTrigger className={errors.trimId ? "border-destructive" : ""}>
            <SelectValue placeholder={formData.modelId ? "Select a trim" : "Select a model first"} />
          </SelectTrigger>
          <SelectContent>
            {formData.modelId && trims[formData.modelId]
              ? trims[formData.modelId].map((trim) => (
                  <SelectItem key={trim.id} value={trim.id.toString()}>
                    {trim.name}
                  </SelectItem>
                ))
              : []}
          </SelectContent>
        </Select>
        {errors.trimId && <p className="text-sm text-destructive">{errors.trimId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit-" : ""}colorId`}>Color</Label>
        <Select
          value={formData.colorId ? formData.colorId.toString() : ""}
          onValueChange={(value) => handleSelectChange("colorId", value)}
        >
          <SelectTrigger className={errors.colorId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color.id} value={color.id.toString()}>
                <div className="flex items-center gap-2">
                  {color.hex_code && (
                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hex_code }} />
                  )}
                  {color.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.colorId && <p className="text-sm text-destructive">{errors.colorId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit-" : ""}vin`}>VIN</Label>
        <Input
          id={`${isEdit ? "edit-" : ""}vin`}
          name="vin"
          value={formData.vin}
          onChange={handleInputChange}
          placeholder="Vehicle Identification Number"
          className={errors.vin ? "border-destructive" : ""}
        />
        {errors.vin && <p className="text-sm text-destructive">{errors.vin}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit-" : ""}status`}>Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger className={errors.status ? "border-destructive" : ""}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit-" : ""}location`}>Location</Label>
          <Input
            id={`${isEdit ? "edit-" : ""}location`}
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Showroom, Lot A"
            className={errors.location ? "border-destructive" : ""}
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit-" : ""}arrivalDate`}>Arrival Date (optional)</Label>
        <Input
          id={`${isEdit ? "edit-" : ""}arrivalDate`}
          name="arrivalDate"
          type="date"
          value={formData.arrivalDate}
          onChange={handleInputChange}
          className={errors.arrivalDate ? "border-destructive" : ""}
        />
        {errors.arrivalDate && <p className="text-sm text-destructive">{errors.arrivalDate}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit-" : ""}customerName`}>Customer Name (optional)</Label>
        <Input
          id={`${isEdit ? "edit-" : ""}customerName`}
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          placeholder="For reserved vehicles"
          className={errors.customerName ? "border-destructive" : ""}
        />
        {errors.customerName && <p className="text-sm text-destructive">{errors.customerName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit-" : ""}notes`}>Notes (optional)</Label>
        <Textarea
          id={`${isEdit ? "edit-" : ""}notes`}
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Additional information about this vehicle"
          className={errors.notes ? "border-destructive" : ""}
          rows={3}
        />
        {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
      </div>
    </div>
  )
}
