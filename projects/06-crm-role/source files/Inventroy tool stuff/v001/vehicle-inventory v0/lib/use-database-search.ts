"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  brands: {
    id: number
    name: string
    score: number
    models: any[]
  }[]
  models: any[]
  timing?: {
    query: number
  }
}

export function useDatabaseSearch(query: string, delay = 300) {
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, delay)

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setResults(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const startTime = performance.now()
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)

        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}`)
        }

        const data = await response.json()
        const clientTime = performance.now() - startTime

        console.log(`[Client] Search request completed in ${clientTime.toFixed(2)}ms`)
        console.log(`[Client] Server processing time: ${data.timing?.query.toFixed(2)}ms`)

        setResults(data)
      } catch (err) {
        console.error("Search error:", err)
        setError(err instanceof Error ? err.message : "An error occurred during search")
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  return { results, isLoading, error }
}
