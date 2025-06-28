"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Car } from "lucide-react"
import { useToastContext } from "@/components/toast-provider"
import { getAllModels, createModel, updateModel, deleteModel } from "@/app/actions/model-actions"
import { getAllBrands } from "@/app/actions/brand-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Model {
  id: number
  name: string
  category: string
  fuel_type: string
  drive_type: string
  transmission: string
  description: string | null
  image_url: string | null
  brand_id: number
  brand_name: string
}

interface Brand {
  id: number
  name: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [formData, setFormData] = useState({
    brandId: 0,
    name: "",
    category: "",
    fuelType: "",
    driveType: "",
    transmission: "",
    description: "",
    imageUrl: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToastContext()

  // Fetch models and brands on component mount
  useEffect(() => {
    fetchModels()
    fetchBrands()
  }, [])

  // Function to fetch models
  const fetchModels = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch brands
  const fetchBrands = async () => {
    try {
      const data = await getAllBrands()
      if (Array.isArray(data)) {
        setBrands(data)
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
      toast({
        title: "Error",
        description: "Failed to load brands",
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "brandId" ? Number.parseInt(value) : value,
    }))
  }

  // Function to validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.brandId) {
      newErrors.brandId = "Brand is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.fuelType.trim()) {
      newErrors.fuelType = "Fuel type is required"
    }

    if (!formData.driveType.trim()) {
      newErrors.driveType = "Drive type is required"
    }

    if (!formData.transmission.trim()) {
      newErrors.transmission = "Transmission is required"
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Function to validate URL
  const isValidUrl = (url: string) => {
    if (!url) return true
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Function to handle add model
  const handleAddModel = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const result = await createModel({
        brandId: formData.brandId,
        name: formData.name,
        category: formData.category,
        fuelType: formData.fuelType,
        driveType: formData.driveType,
        transmission: formData.transmission,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Model added successfully",
          type: "success",
        })
        setIsAddDialogOpen(false)
        resetForm()
        fetchModels()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add model",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error adding model:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle edit model
  const handleEditModel = async () => {
    if (!validateForm() || !selectedModel) return

    try {
      setIsSubmitting(true)
      const result = await updateModel(selectedModel.id, {
        brandId: formData.brandId,
        name: formData.name,
        category: formData.category,
        fuelType: formData.fuelType,
        driveType: formData.driveType,
        transmission: formData.transmission,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Model updated successfully",
          type: "success",
        })
        setIsEditDialogOpen(false)
        resetForm()
        fetchModels()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update model",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error updating model:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle delete model
  const handleDeleteModel = async () => {
    if (!selectedModel) return

    try {
      setIsSubmitting(true)
      const result = await deleteModel(selectedModel.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Model deleted successfully",
          type: "success",
        })
        setIsDeleteDialogOpen(false)
        fetchModels()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete model",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting model:", error)
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
  const openEditDialog = (model: Model) => {
    setSelectedModel(model)
    setFormData({
      brandId: model.brand_id,
      name: model.name,
      category: model.category,
      fuelType: model.fuel_type,
      driveType: model.drive_type,
      transmission: model.transmission,
      description: model.description || "",
      imageUrl: model.image_url || "",
    })
    setErrors({})
    setIsEditDialogOpen(true)
  }

  // Function to open delete dialog
  const openDeleteDialog = (model: Model) => {
    setSelectedModel(model)
    setIsDeleteDialogOpen(true)
  }

  // Function to reset form
  const resetForm = () => {
    setFormData({
      brandId: 0,
      name: "",
      category: "",
      fuelType: "",
      driveType: "",
      transmission: "",
      description: "",
      imageUrl: "",
    })
    setErrors({})
    setSelectedModel(null)
  }

  // Categories, fuel types, drive types, and transmission options
  const categories = ["Sedan", "SUV", "Truck", "Van", "Coupe", "Convertible", "Hatchback", "Wagon", "Minivan"]
  const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"]
  const driveTypes = ["4x2", "4x4"]
  const transmissions = ["Automatic", "Manual", "CVT", "DCT", "Semi-Automatic"]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Models</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading models...</div>
      ) : models.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <Car className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No models found</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            Add Your First Model
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Drive Type</TableHead>
                <TableHead>Transmission</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>{model.brand_name}</TableCell>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.category}</TableCell>
                  <TableCell>{model.fuel_type}</TableCell>
                  <TableCell>{model.drive_type}</TableCell>
                  <TableCell>{model.transmission}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(model)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(model)}>
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

      {/* Add Model Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && setIsAddDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brandId">Brand</Label>
              <Select
                value={formData.brandId ? formData.brandId.toString() : ""}
                onValueChange={(value) => handleSelectChange("brandId", value)}
              >
                <SelectTrigger className={errors.brandId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brandId && <p className="text-sm text-destructive">{errors.brandId}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Model Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Camry, Civic, F-150"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select value={formData.fuelType} onValueChange={(value) => handleSelectChange("fuelType", value)}>
                  <SelectTrigger className={errors.fuelType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuelType) => (
                      <SelectItem key={fuelType} value={fuelType}>
                        {fuelType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelType && <p className="text-sm text-destructive">{errors.fuelType}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driveType">Drive Type</Label>
                <Select value={formData.driveType} onValueChange={(value) => handleSelectChange("driveType", value)}>
                  <SelectTrigger className={errors.driveType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select drive type" />
                  </SelectTrigger>
                  <SelectContent>
                    {driveTypes.map((driveType) => (
                      <SelectItem key={driveType} value={driveType}>
                        {driveType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.driveType && <p className="text-sm text-destructive">{errors.driveType}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => handleSelectChange("transmission", value)}
                >
                  <SelectTrigger className={errors.transmission ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((transmission) => (
                      <SelectItem key={transmission} value={transmission}>
                        {transmission}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.transmission && <p className="text-sm text-destructive">{errors.transmission}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the model"
                className={errors.description ? "border-destructive" : ""}
                rows={3}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? "border-destructive" : ""}
              />
              {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddModel} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Model"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Model Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-brandId">Brand</Label>
              <Select
                value={formData.brandId ? formData.brandId.toString() : ""}
                onValueChange={(value) => handleSelectChange("brandId", value)}
              >
                <SelectTrigger className={errors.brandId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brandId && <p className="text-sm text-destructive">{errors.brandId}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Model Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Camry, Civic, F-150"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fuelType">Fuel Type</Label>
                <Select value={formData.fuelType} onValueChange={(value) => handleSelectChange("fuelType", value)}>
                  <SelectTrigger className={errors.fuelType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuelType) => (
                      <SelectItem key={fuelType} value={fuelType}>
                        {fuelType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelType && <p className="text-sm text-destructive">{errors.fuelType}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-driveType">Drive Type</Label>
                <Select value={formData.driveType} onValueChange={(value) => handleSelectChange("driveType", value)}>
                  <SelectTrigger className={errors.driveType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select drive type" />
                  </SelectTrigger>
                  <SelectContent>
                    {driveTypes.map((driveType) => (
                      <SelectItem key={driveType} value={driveType}>
                        {driveType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.driveType && <p className="text-sm text-destructive">{errors.driveType}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => handleSelectChange("transmission", value)}
                >
                  <SelectTrigger className={errors.transmission ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((transmission) => (
                      <SelectItem key={transmission} value={transmission}>
                        {transmission}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.transmission && <p className="text-sm text-destructive">{errors.transmission}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the model"
                className={errors.description ? "border-destructive" : ""}
                rows={3}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">Image URL (optional)</Label>
              <Input
                id="edit-imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? "border-destructive" : ""}
              />
              {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditModel} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Model Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Model</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the model <strong>{selectedModel?.name}</strong> from{" "}
              <strong>{selectedModel?.brand_name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the model from the database.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteModel} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Model"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
