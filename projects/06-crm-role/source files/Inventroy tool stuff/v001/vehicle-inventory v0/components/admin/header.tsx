"use client"

import { ShieldCheck, Database, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToastContext } from "@/components/toast-provider"
import { updateDatabaseSchema } from "@/app/actions/update-schema"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const { toast } = useToastContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

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
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
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
