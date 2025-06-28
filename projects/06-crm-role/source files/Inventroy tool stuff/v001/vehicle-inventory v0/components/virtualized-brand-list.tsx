"use client"

import { useEffect, useRef, useState } from "react"
import { BrandCard } from "@/components/brand-card"
import { VehicleModelCard } from "@/components/vehicle-model-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Brand {
  id: number
  name: string
  total_units: number | null
  available_units: number | null
  model_count: number | null
  models?: any[] // Add this for search results
}

interface Model {
  id: number
  name: string
  category: string
  fuel_type: string
  drive_type: string
  transmission: string
  total_stock: number | null
  available: number | null
  display: number | null
}

interface VirtualizedBrandListProps {
  brands: Brand[]
  modelsByBrand: Record<number, Model[]>
  expandedBrands: Record<number, boolean>
  loadingModels: Record<number, boolean>
  searchQuery: string
  onToggleBrand: (brandId: number) => void
  onViewInventory: (brand: string, model: string, modelId: number) => void
  onEditModel: (modelId: number, brand: string, model: Model) => void
}

export function VirtualizedBrandList({
  brands,
  modelsByBrand,
  expandedBrands,
  loadingModels,
  searchQuery,
  onToggleBrand,
  onViewInventory,
  onEditModel,
}: VirtualizedBrandListProps) {
  const [visibleBrands, setVisibleBrands] = useState<Brand[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 5

  // Load initial brands
  useEffect(() => {
    setVisibleBrands(brands.slice(0, ITEMS_PER_PAGE))
    setPage(1)
    setHasMore(brands.length > ITEMS_PER_PAGE)
  }, [brands])

  // Load more brands when scrolling
  const loadMore = () => {
    if (!hasMore) return

    const nextPage = page + 1
    const nextBrands = brands.slice(0, nextPage * ITEMS_PER_PAGE)

    setVisibleBrands(nextBrands)
    setPage(nextPage)
    setHasMore(nextBrands.length < brands.length)
  }

  // Intersection observer for infinite scrolling
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [hasMore])

  useEffect(() => {
    console.log(`[Render] VirtualizedBrandList with ${brands.length} brands, search: "${searchQuery}"`)

    // Log how many models we have in total
    let totalModels = 0
    let loadedBrands = 0

    brands.forEach((brand) => {
      if (modelsByBrand[brand.id]) {
        totalModels += modelsByBrand[brand.id].length
        loadedBrands++
      }
    })

    console.log(`[Render] ${loadedBrands}/${brands.length} brands have loaded models, total: ${totalModels} models`)

    // Log expanded brands
    const expandedCount = Object.values(expandedBrands).filter(Boolean).length
    console.log(`[Render] ${expandedCount} brands are expanded`)
  }, [brands, modelsByBrand, expandedBrands, searchQuery])

  if (brands.length === 0) {
    return (
      <div className="rounded-lg border bg-card/80 p-6 sm:p-8 text-center">
        <p>No brands or models found matching "{searchQuery}"</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {visibleBrands.map((brand) => {
        const query = searchQuery.toLowerCase().trim()
        const brandMatches = query ? brand.name.toLowerCase().includes(query) : false

        return (
          <div key={brand.id} className="rounded-lg border bg-card/80 overflow-hidden">
            {/* Use the BrandCard component for the header */}
            <BrandCard
              id={brand.id}
              name={brand.name}
              totalUnits={brand.total_units || 0}
              availableUnits={brand.available_units || 0}
              modelCount={brand.model_count || 0}
              isExpanded={!!expandedBrands[brand.id]}
              onToggle={() => onToggleBrand(brand.id)}
              highlight={brandMatches}
            />

            {/* Expandable content */}
            <div
              id={`brand-${brand.id}-content`}
              className={cn(
                "grid sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 transition-all duration-300 ease-in-out",
                expandedBrands[brand.id] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden p-0",
              )}
            >
              {expandedBrands[brand.id] &&
                (loadingModels[brand.id] ? (
                  // Loading models state
                  <div className="col-span-1 sm:col-span-2 p-4 text-center text-muted-foreground">
                    Loading models...
                  </div>
                ) : modelsByBrand[brand.id] && modelsByBrand[brand.id].length > 0 ? (
                  // Models list - directly use models from modelsByBrand
                  modelsByBrand[brand.id].map((model) => (
                    <VehicleModelCard
                      key={model.id}
                      brand={brand.name}
                      model={model.name}
                      category={model.category || ""}
                      fuelType={model.fuel_type || ""}
                      driveType={model.drive_type || ""}
                      transmission={model.transmission || ""}
                      totalStock={model.total_stock || 0}
                      available={model.available || 0}
                      display={model.display || 0}
                      onViewInventory={() => onViewInventory(brand.name, model.name, model.id)}
                      onEditModel={() => onEditModel(model.id, brand.name, model)}
                      highlight={searchQuery.trim() !== "" && model.score > 0.5} // Highlight based on search score
                    />
                  ))
                ) : (
                  // No models state
                  <div className="col-span-1 sm:col-span-2 p-4 text-center text-muted-foreground">
                    No models found for {brand.name}
                  </div>
                ))}
            </div>
          </div>
        )
      })}

      {/* Load more trigger element */}
      {hasMore && (
        <div ref={containerRef} className="h-10 flex items-center justify-center">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
