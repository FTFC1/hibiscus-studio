"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateDatabaseSchema } from "@/app/actions/update-schema"
import { useToastContext } from "@/components/toast-provider"

export function SchemaUpdateButton() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToastContext()

  const handleUpdateSchema = async () => {
    try {
      setIsUpdating(true)
      const result = await updateDatabaseSchema()

      if (result.success) {
        toast({
          title: "Success",
          description: "Database schema updated successfully",
          type: "success",
        })
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
      setIsUpdating(false)
    }
  }

  return (
    <Button onClick={handleUpdateSchema} disabled={isUpdating}>
      {isUpdating ? "Updating..." : "Update Database Schema"}
    </Button>
  )
}
