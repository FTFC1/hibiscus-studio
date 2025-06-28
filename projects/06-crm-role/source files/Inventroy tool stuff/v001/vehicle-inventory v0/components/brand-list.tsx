"use client"
import { cn } from "@/lib/utils"
import { BrandCard } from "@/components/brand-card"
import { VehicleModelCard } from "@/components/vehicle-model-card"
import { Button } from "@/components/ui/button"
// Import the fuzzy search utilities
import { createModelFuzzyMatcher } from "@/lib/fuzzy-search"

interface Brand {
  id: number
  name: string
  total_units: number | null
  available_units: number | null
  model_count: number | null
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

interface BrandListProps {
  brands: Brand[]
  modelsByBrand: Record<number, Model[]>
  expandedBrands: Record<number, boolean>
  loadingModels: Record<number, boolean>
  searchQuery: string
  onToggleBrand: (brandId: number) => void
  onViewInventory: (brand: string, model: string, modelId: number) => void
  onEditModel: (modelId: number, brand: string, model: Model) => void
}

export function BrandList({
  brands,
  modelsByBrand,
  expandedBrands,
  loadingModels,
  searchQuery,
  onToggleBrand,
  onViewInventory,
  onEditModel,
}: BrandListProps) {
  // Replace the modelMatchesSearch function with this improved version
  const modelMatchesSearch = (model: Model, query: string) => {
    if (!query.trim()) return false

    const modelMatcher = createModelFuzzyMatcher([model])
    return modelMatcher(query).length > 0
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {brands.length === 0 ? (
        <div className="rounded-lg border bg-card/80 p-6 sm:p-8 text-center">
          <p>No brands or models found matching "{searchQuery}"</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      ) : (
        brands.map((brand) => {
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
                    // Models list - filter models if searching
                    modelsByBrand[brand.id]
                      .filter((model) => {
                        if (!searchQuery.trim()) return true
                        return modelMatchesSearch(model, searchQuery)
                      })
                      .map((model) => (
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
                          highlight={searchQuery.trim() !== "" && modelMatchesSearch(model, searchQuery)}
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
        })
      )}
    </div>
  )
}
