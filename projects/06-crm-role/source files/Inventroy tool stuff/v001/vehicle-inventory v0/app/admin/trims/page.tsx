"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Box } from "lucide-react"
import { useToastContext } from "@/components/toast-provider"
import { getAllTrims, createTrim, updateTrim, deleteTrim } from "@/app/actions/trim-actions"
import { getAllModels } from "@/app/actions/model-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Trim {
  id: number
  name: string
  features: string | null
  model_id: number
  model_name: string
  brand_name: string
}

interface Model {
  id: number
  name: string
  brand_name: string
}

export default function TrimsPage() {
  const [trims, setTrims] = useState<Trim[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTrim, setSelectedTrim] = useState<Trim | null>(null)
  const [formData, setFormData] = useState({
    modelId: 0,
    name: "",
    features: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToastContext()

  // Fetch trims and models on component mount
  useEffect(() => {
    fetchTrims()
    fetchModels()
  }, [])

  // Function to fetch trims
  const fetchTrims = async () => {
    try {
      setLoading(true)
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
      [name]: Number.parseInt(value),
    }))
  }

  // Function to validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.modelId) {
      newErrors.modelId = "Model is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Function to handle add trim
  const handleAddTrim = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const result = await createTrim({
        modelId: formData.modelId,
        name: formData.name,
        features: formData.features || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Trim added successfully",
          type: "success",
        })
        setIsAddDialogOpen(false)
        resetForm()
        fetchTrims()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add trim",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error adding trim:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle edit trim
  const handleEditTrim = async () => {
    if (!validateForm() || !selectedTrim) return

    try {
      setIsSubmitting(true)
      const result = await updateTrim(selectedTrim.id, {
        modelId: formData.modelId,
        name: formData.name,
        features: formData.features || undefined,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Trim updated successfully",
          type: "success",
        })
        setIsEditDialogOpen(false)
        resetForm()
        fetchTrims()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update trim",
          type: "destructive",
        })
        if (result.errors) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error updating trim:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle delete trim
  const handleDeleteTrim = async () => {
    if (!selectedTrim) return

    try {
      setIsSubmitting(true)
      const result = await deleteTrim(selectedTrim.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Trim deleted successfully",
          type: "success",
        })
        setIsDeleteDialogOpen(false)
        fetchTrims()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete trim",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting trim:", error)
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
  const openEditDialog = (trim: Trim) => {
    setSelectedTrim(trim)
    setFormData({
      modelId: trim.model_id,
      name: trim.name,
      features: trim.features || "",
    })
    setErrors({})
    setIsEditDialogOpen(true)
  }

  // Function to open delete dialog
  const openDeleteDialog = (trim: Trim) => {
    setSelectedTrim(trim)
    setIsDeleteDialogOpen(true)
  }

  // Function to reset form
  const resetForm = () => {
    setFormData({
      modelId: 0,
      name: "",
      features: "",
    })
    setErrors({})
    setSelectedTrim(null)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Trims</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Trim
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading trims...</div>
      ) : trims.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <Box className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No trims found</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            Add Your First Trim
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Trim</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trims.map((trim) => (
                <TableRow key={trim.id}>
                  <TableCell>{trim.brand_name}</TableCell>
                  <TableCell>{trim.model_name}</TableCell>
                  <TableCell className="font-medium">{trim.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{trim.features || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(trim)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(trim)}>
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

      {/* Add Trim Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && setIsAddDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Trim</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="modelId">Model</Label>
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
              <Label htmlFor="name">Trim Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., SE, Limited, Sport"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (optional)</Label>
              <Textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="List key features of this trim level"
                className={errors.features ? "border-destructive" : ""}
                rows={4}
              />
              {errors.features && <p className="text-sm text-destructive">{errors.features}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddTrim} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Trim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trim Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Trim</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-modelId">Model</Label>
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
              <Label htmlFor="edit-name">Trim Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., SE, Limited, Sport"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-features">Features (optional)</Label>
              <Textarea
                id="edit-features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="List key features of this trim level"
                className={errors.features ? "border-destructive" : ""}
                rows={4}
              />
              {errors.features && <p className="text-sm text-destructive">{errors.features}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditTrim} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Trim Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trim</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the trim <strong>{selectedTrim?.name}</strong> for model{" "}
              <strong>{selectedTrim?.model_name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the trim from the database.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrim} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Trim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
