"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import { useToastContext } from "@/components/toast-provider"
import { getAllBrands, createBrand, updateBrand, deleteBrand } from "@/app/actions/brand-actions"
// Add a function to update the schema directly from the brands page
import { updateDatabaseSchema } from "@/app/actions/update-schema"
import { ResponsiveTable } from "@/components/ui/responsive-table"

interface Brand {
  id: number
  name: string
  logo_url: string | null
  description: string | null
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToastContext()

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands()
  }, [])

  // Function to fetch brands
  const fetchBrands = async () => {
    try {
      setLoading(true)
      const data = await getAllBrands()
      if (Array.isArray(data)) {
        setBrands(data)
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
      const errorMessage = String(error).includes("column")
        ? "Database schema needs to be updated. Please click 'Update Database Schema'."
        : "Failed to load brands"

      toast({
        title: "Error",
        description: errorMessage,
        type: "destructive",
      })
    } finally {
      setLoading(false)
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

  // Function to validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (formData.logoUrl && !isValidUrl(formData.logoUrl)) {
      newErrors.logoUrl = "Please enter a valid URL"
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

  // Function to handle add brand
  const handleAddBrand = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const result = await createBrand({
        name: formData.name,
        logoUrl: formData.logoUrl || undefined,
        description: formData.description || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Brand added successfully",
          type: "success",
        })
        setIsAddDialogOpen(false)
        resetForm()
        fetchBrands()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add brand",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error adding brand:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle edit brand
  const handleEditBrand = async () => {
    if (!validateForm() || !selectedBrand) return

    try {
      setIsSubmitting(true)
      const result = await updateBrand(selectedBrand.id, {
        name: formData.name,
        logoUrl: formData.logoUrl || undefined,
        description: formData.description || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Brand updated successfully",
          type: "success",
        })
        setIsEditDialogOpen(false)
        resetForm()
        fetchBrands()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update brand",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error updating brand:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle delete brand
  const handleDeleteBrand = async () => {
    if (!selectedBrand) return

    try {
      setIsSubmitting(true)
      const result = await deleteBrand(selectedBrand.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Brand deleted successfully",
          type: "success",
        })
        setIsDeleteDialogOpen(false)
        fetchBrands()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete brand",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting brand:", error)
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
  const openEditDialog = (brand: Brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      logoUrl: brand.logo_url || "",
      description: brand.description || "",
    })
    setErrors({})
    setIsEditDialogOpen(true)
  }

  // Function to open delete dialog
  const openDeleteDialog = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteDialogOpen(true)
  }

  // Function to reset form
  const resetForm = () => {
    setFormData({
      name: "",
      logoUrl: "",
      description: "",
    })
    setErrors({})
    setSelectedBrand(null)
  }

  // Add this function inside the BrandsPage component, after the existing functions
  const handleUpdateSchema = async () => {
    try {
      setIsSubmitting(true)
      const result = await updateDatabaseSchema()

      if (result.success) {
        toast({
          title: "Success",
          description: "Database schema updated successfully. Refreshing data...",
          type: "success",
        })
        // Refresh the brands data after schema update
        await fetchBrands()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update database schema",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating schema:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Update the header section to include a schema update button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Brands</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUpdateSchema} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Schema"}
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading brands...</div>
      ) : brands.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <Tag className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No brands found</p>
          <div className="flex flex-col gap-2 items-center mt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              Add Your First Brand
            </Button>
            <Button variant="outline" onClick={handleUpdateSchema}>
              Update Database Schema
            </Button>
          </div>
        </div>
      ) : (
        <ResponsiveTable
          data={brands}
          keyField="id"
          columns={[
            {
              header: "Logo",
              accessorKey: (brand) =>
                brand.logo_url ? (
                  <img
                    src={brand.logo_url || "/placeholder.svg"}
                    alt={`${brand.name} logo`}
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Tag className="h-4 w-4" />
                  </div>
                ),
              isHiddenOnMobile: true,
            },
            {
              header: "Name",
              accessorKey: "name",
              className: "font-medium",
            },
            {
              header: "Description",
              accessorKey: "description",
              cell: (brand) => brand.description || "-",
              className: "max-w-xs truncate",
              isHiddenOnMobile: true,
            },
            {
              header: "Actions",
              accessorKey: (brand) => (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(brand)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(brand)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ),
              className: "w-[100px]",
            },
          ]}
        />
      )}

      {/* Add Brand Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && setIsAddDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Toyota, Honda, Ford"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL (optional)</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className={errors.logoUrl ? "border-destructive" : ""}
              />
              {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the brand"
                className={errors.description ? "border-destructive" : ""}
                rows={4}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Brand"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Brand Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Toyota, Honda, Ford"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logoUrl">Logo URL (optional)</Label>
              <Input
                id="edit-logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className={errors.logoUrl ? "border-destructive" : ""}
              />
              {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the brand"
                className={errors.description ? "border-destructive" : ""}
                rows={4}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditBrand} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Brand Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the brand <strong>{selectedBrand?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the brand from the database.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBrand} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Brand"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
