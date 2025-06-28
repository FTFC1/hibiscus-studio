"use client"

// Update the AdminHeader component to have a subtle gradient background in dark mode
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, ShieldCheck } from "lucide-react"
import { useToastContext } from "@/components/providers/toast-provider"

export function AdminHeader() {
  const { toast } = useToastContext()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateSchema = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/update-schema", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast({
          variant: "destructive",
          title: "Error updating schema",
          description: errorData.message || "Something went wrong.",
        })
      } else {
        toast({
          title: "Schema updated",
          description: "The database schema has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating schema",
        description: "Failed to connect to the server.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-5 w-5" />
          <span>Vehicle Inventory Admin</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpdateSchema}
          disabled={isUpdating}
          className="flex items-center gap-1"
        >
          <Database className="h-4 w-4" />
          {isUpdating ? "Updating Schema..." : "Update Schema"}
        </Button>
      </div>
    </header>
  )
}
