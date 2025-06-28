"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToastContext } from "@/components/toast-provider"

interface ModelFormData {
  id: number
  name: string
  category: string
  fuelType: string
  driveType: string
  transmission: string
}

interface EditModelDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ModelFormData) => Promise<void>
  model: {
    id: number
    brand: string
    name: string
    category: string
    fuelType: string
    driveType: string
    transmission: string
  }
}

export function EditModelDialog({ isOpen, onClose, onSave, model }: EditModelDialogProps) {
  const [formData, setFormData] = useState<ModelFormData>({
    id: model.id,
    name: model.name,
    category: model.category,
    fuelType: model.fuelType,
    driveType: model.driveType,
    transmission: model.transmission,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToastContext()

  // Update form data when model changes
  useEffect(() => {
    setFormData({
      id: model.id,
      name: model.name,
      category: model.category,
      fuelType: model.fuelType,
      driveType: model.driveType,
      transmission: model.transmission,
    })
  }, [model])

  const handleChange = (field: keyof ModelFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      await onSave(formData)
      toast({
        title: "Success",
        description: "Model updated successfully",
        type: "success",
      })
      onClose()
    } catch (error) {
      console.error("Error updating model:", error)
      toast({
        title: "Error",
        description: "Failed to update model",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit Model - {model.brand} {model.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model-name" className="text-right">
              Name
            </Label>
            <Input
              id="model-name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="Crossover">Crossover</SelectItem>
                <SelectItem value="Pickup">Pickup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fuel-type" className="text-right">
              Fuel Type
            </Label>
            <Select value={formData.fuelType} onValueChange={(value) => handleChange("fuelType", value)}>
              <SelectTrigger id="fuel-type" className="col-span-3">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline">Gasoline</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="drive-type" className="text-right">
              Drive Type
            </Label>
            <Select value={formData.driveType} onValueChange={(value) => handleChange("driveType", value)}>
              <SelectTrigger id="drive-type" className="col-span-3">
                <SelectValue placeholder="Select drive type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4x2">4x2</SelectItem>
                <SelectItem value="4x4">4x4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transmission" className="text-right">
              Transmission
            </Label>
            <Select value={formData.transmission} onValueChange={(value) => handleChange("transmission", value)}>
              <SelectTrigger id="transmission" className="col-span-3">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
                <SelectItem value="DCT">DCT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
