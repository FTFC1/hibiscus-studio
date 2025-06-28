"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react"
import { useEffect, useRef } from "react"

interface SearchFilterBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isFiltering: boolean
  filteredBrandsCount: number
  filteredModelsCount: number
  isFocused?: boolean
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  isFiltering,
  filteredBrandsCount,
  filteredModelsCount,
  isFocused = false,
}: SearchFilterBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input when isFocused is true
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search brands, models, or VINs..."
          className="pl-9 bg-white dark:bg-slate-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex-1">
          <div className="relative">
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-600"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          {isFiltering && (
            <div className="absolute top-full left-0 mt-1.5 text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Found {filteredBrandsCount} brand{filteredBrandsCount !== 1 ? "s" : ""} and {filteredModelsCount} model
              {filteredModelsCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 flex-1 sm:flex-none h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 flex-1 sm:flex-none h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
          >
            <span>Sort</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
