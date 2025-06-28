"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Edit, Trash2, Palette, Plus } from "lucide-react"
import { useToastContext } from "@/components/toast-provider"
import { getAllColors, createColor, updateColor, deleteColor } from "@/app/actions/color-actions"
import { EmptyState } from "@/components/admin/empty-state"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { ResponsiveTable } from "@/components/ui/responsive-table"

interface Color {
  id: number
  name: string
  hex_code: string | null
}

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    hexCode: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToastContext()

  // Fetch colors on component mount
  useEffect(() => {
    fetchColors()
  }, [])

  // Function to fetch colors
  const fetchColors = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  // Function to handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (formData.hexCode && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.hexCode)) {
      newErrors.hexCode = "Invalid hex code format (e.g., #RRGGBB)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Function to handle add color
  const handleAddColor = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const result = await createColor({
        name: formData.name,
        hexCode: formData.hexCode || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Color added successfully",
          type: "success",
        })
        setIsAddDialogOpen(false)
        resetForm()
        fetchColors()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add color",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error adding color:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle edit color
  const handleEditColor = async () => {
    if (!validateForm() || !selectedColor) return

    try {
      setIsSubmitting(true)
      const result = await updateColor(selectedColor.id, {
        name: formData.name,
        hexCode: formData.hexCode || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Color updated successfully",
          type: "success",
        })
        setIsEditDialogOpen(false)
        resetForm()
        fetchColors()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update color",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error updating color:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle delete color
  const handleDeleteColor = async () => {
    if (!selectedColor) return

    try {
      setIsSubmitting(true)
      const result = await deleteColor(selectedColor.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Color deleted successfully",
          type: "success",
        })
        setIsDeleteDialogOpen(false)
        fetchColors()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete color",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting color:", error)
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
  const openEditDialog = (color: Color) => {
    setSelectedColor(color)
    setFormData({
      name: color.name,
      hexCode: color.hex_code || "",
    })
    setErrors({})
    setIsEditDialogOpen(true)
  }

  // Function to open delete dialog
  const openDeleteDialog = (color: Color) => {
    setSelectedColor(color)
    setIsDeleteDialogOpen(true)
  }

  // Function to reset form
  const resetForm = () => {
    setFormData({
      name: "",
      hexCode: "",
    })
    setErrors({})
    setSelectedColor(null)
  }

  return (
    <>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Colors</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Color
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading colors...</div>
        ) : colors.length === 0 ? (
          <EmptyState
            icon={Palette}
            title="No colors found"
            actionLabel="Add Your First Color"
            onAction={() => setIsAddDialogOpen(true)}
          />
        ) : (
          <ResponsiveTable
            data={colors}
            keyField="id"
            columns={[
              {
                header: "Color",
                accessorKey: (color) => (
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: color.hex_code || undefined }}
                  />
                ),
              },
              {
                header: "Name",
                accessorKey: "name",
                className: "font-medium",
              },
              {
                header: "Hex Code",
                accessorKey: (color) => color.hex_code || "-",
                isHiddenOnMobile: true,
              },
              {
                header: "Actions",
                accessorKey: (color) => (
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(color)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(color)}>
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
      </div>

      {/* Add Color Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && setIsAddDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Red, Blue, Silver"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hexCode">Hex Code (optional)</Label>
              <div className="flex space-x-2">
                <Input
                  id="hexCode"
                  name="hexCode"
                  value={formData.hexCode}
                  onChange={handleInputChange}
                  placeholder="#RRGGBB"
                  className={errors.hexCode ? "border-destructive" : ""}
                />
                {formData.hexCode && (
                  <div className="h-10 w-10 rounded-full border" style={{ backgroundColor: formData.hexCode }} />
                )}
              </div>
              {errors.hexCode && <p className="text-sm text-destructive">{errors.hexCode}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddColor} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Color"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Color Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Red, Blue, Silver"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-hexCode">Hex Code (optional)</Label>
              <div className="flex space-x-2">
                <Input
                  id="edit-hexCode"
                  name="hexCode"
                  value={formData.hexCode}
                  onChange={handleInputChange}
                  placeholder="#RRGGBB"
                  className={errors.hexCode ? "border-destructive" : ""}
                />
                {formData.hexCode && (
                  <div className="h-10 w-10 rounded-full border" style={{ backgroundColor: formData.hexCode }} />
                )}
              </div>
              {errors.hexCode && <p className="text-sm text-destructive">{errors.hexCode}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditColor} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Color Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteColor}
        title="Delete Color"
        description={`Are you sure you want to delete the color ${selectedColor?.name}? This action cannot be undone.`}
        confirmText="Delete Color"
        variant="destructive"
        isSubmitting={isSubmitting}
      />
    </>
  )
}
