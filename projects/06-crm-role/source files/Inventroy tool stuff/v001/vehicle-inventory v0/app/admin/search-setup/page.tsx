"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { setupFuzzySearch } from "@/app/actions/setup-search"
import { useToastContext } from "@/components/toast-provider"
import { Database, Search, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SearchSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupStatus, setSetupStatus] = useState<{
    success?: boolean
    message?: string
    error?: string
  }>({})
  const { toast } = useToastContext()

  const handleSetupSearch = async () => {
    try {
      setIsLoading(true)
      setSetupStatus({})

      const result = await setupFuzzySearch()
      setSetupStatus(result)

      if (result.success) {
        toast({
          title: "Success",
          description: "Fuzzy search setup completed successfully",
          type: "success",
        })
      } else {
        toast({
          title: "Warning",
          description: result.message || "Partial setup completed with some issues",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error setting up fuzzy search:", error)
      setSetupStatus({
        success: false,
        message: "An unexpected error occurred",
        error: String(error),
      })

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Search Setup</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              PostgreSQL Fuzzy Search
            </CardTitle>
            <CardDescription>
              Set up PostgreSQL's pg_trgm extension and create indexes for efficient fuzzy searching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will enable the pg_trgm extension in your Neon database and create GIN indexes on relevant columns to
              speed up similarity searches.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-green-500" />
                <span className="text-sm">Faster search performance</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-green-500" />
                <span className="text-sm">Better handling of typos and misspellings</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-green-500" />
                <span className="text-sm">Server-side processing reduces client load</span>
              </div>
            </div>

            {setupStatus.message && (
              <Alert variant={setupStatus.success ? "default" : "destructive"} className="mt-4">
                {setupStatus.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{setupStatus.success ? "Setup Completed" : "Setup Issue"}</AlertTitle>
                <AlertDescription>
                  {setupStatus.message}
                  {setupStatus.error && (
                    <div className="mt-2 text-xs overflow-auto max-h-24 p-2 bg-muted rounded">{setupStatus.error}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSetupSearch} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Set Up Fuzzy Search
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
