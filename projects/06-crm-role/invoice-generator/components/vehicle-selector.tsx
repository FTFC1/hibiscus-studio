"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Car, CheckCircle2 } from "lucide-react"
import { vehicleData } from "@/lib/data"

export type VehicleType = "PASSENGER" | "LHCV"

interface VehicleSelection {
  type: VehicleType
  brand: string
  model: string
  description: string
  warranty: string
  segment: string
}

interface VehicleSelectorProps {
  defaultType?: VehicleType
  defaultBrand?: string
  defaultModel?: string
  onSelect: (vehicle: VehicleSelection) => void
}

export function VehicleSelector({ 
  defaultType, 
  defaultBrand, 
  defaultModel, 
  onSelect 
}: VehicleSelectorProps) {
  const [selectedType, setSelectedType] = React.useState<VehicleType | null>(defaultType || null)
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(defaultBrand || null)
  const [selectedModel, setSelectedModel] = React.useState<string | null>(defaultModel || null)

  // Get available brands for selected vehicle type
  const availableBrands = React.useMemo(() => {
    if (!selectedType) return []
    
    const vehicleTypeFilter = selectedType === "PASSENGER" 
      ? (v: any) => !v.SEGMENT.includes("COMMERCIAL") && !v.SEGMENT.includes("TRUCK")
      : (v: any) => v.SEGMENT.includes("COMMERCIAL") || v.SEGMENT.includes("TRUCK") || v.SEGMENT.includes("VAN")

    return [...new Set(vehicleData.filter(vehicleTypeFilter).map(v => v.BRAND))].sort()
  }, [selectedType])

  // Get available models for selected brand and type
  const availableModels = React.useMemo(() => {
    if (!selectedType || !selectedBrand) return []
    
    const vehicleTypeFilter = selectedType === "PASSENGER" 
      ? (v: any) => !v.SEGMENT.includes("COMMERCIAL") && !v.SEGMENT.includes("TRUCK")
      : (v: any) => v.SEGMENT.includes("COMMERCIAL") || v.SEGMENT.includes("TRUCK") || v.SEGMENT.includes("VAN")

    return vehicleData
      .filter(v => v.BRAND === selectedBrand && vehicleTypeFilter(v))
      .map(v => ({
        model: `${v.MODEL} ${v.TRIM}`,
        description: v.ITEM_DESCRIPTION,
        warranty: v.WARRANTY,
        segment: v.SEGMENT
      }))
      .sort((a, b) => a.model.localeCompare(b.model))
  }, [selectedType, selectedBrand])

  // Reset selections when type changes
  React.useEffect(() => {
    setSelectedBrand(null)
    setSelectedModel(null)
  }, [selectedType])

  // Reset model when brand changes
  React.useEffect(() => {
    setSelectedModel(null)
  }, [selectedBrand])

  // Call onSelect when we have complete selection
  React.useEffect(() => {
    if (selectedType && selectedBrand && selectedModel) {
      const modelData = availableModels.find(m => m.model === selectedModel)
      if (modelData) {
        onSelect({
          type: selectedType,
          brand: selectedBrand,
          model: selectedModel,
          description: modelData.description,
          warranty: modelData.warranty,
          segment: modelData.segment
        })
      }
    }
  }, [selectedType, selectedBrand, selectedModel, availableModels, onSelect])

  return (
    <div className="space-y-8">
      {/* Step 1: Vehicle Type Selection - Visual Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Choose Vehicle Type</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Passenger Vehicle Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedType === "PASSENGER" 
                ? "ring-2 ring-blue-500 bg-blue-50/50" 
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedType("PASSENGER")}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative">
                <Car className={`w-16 h-16 mx-auto ${
                  selectedType === "PASSENGER" ? "text-blue-600" : "text-slate-400"
                }`} />
                {selectedType === "PASSENGER" && (
                  <CheckCircle2 className="w-6 h-6 text-green-600 absolute -top-2 -right-2" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg text-slate-800">Passenger Vehicle</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Cars, SUVs, and personal transportation vehicles
                </p>
              </div>
              <Badge variant={selectedType === "PASSENGER" ? "default" : "secondary"}>
                Personal Use
              </Badge>
            </CardContent>
          </Card>

          {/* LHCV Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedType === "LHCV" 
                ? "ring-2 ring-blue-500 bg-blue-50/50" 
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedType("LHCV")}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative">
                <Truck className={`w-16 h-16 mx-auto ${
                  selectedType === "LHCV" ? "text-blue-600" : "text-slate-400"
                }`} />
                {selectedType === "LHCV" && (
                  <CheckCircle2 className="w-6 h-6 text-green-600 absolute -top-2 -right-2" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg text-slate-800">LHCV (Heavy Duty)</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Light commercial vehicles, trucks, and vans
                </p>
              </div>
              <Badge variant={selectedType === "LHCV" ? "default" : "secondary"}>
                Commercial Use
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Step 2: Brand Selection - Modern Toggle Group */}
      {selectedType && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Select Brand</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableBrands.map((brand) => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand)}
                className={`transition-all duration-200 ${
                  selectedBrand === brand 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Model Selection - Modern Grid */}
      {selectedType && selectedBrand && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Choose Model</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableModels.map((modelData) => (
              <Card
                key={modelData.model}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedModel === modelData.model 
                    ? "ring-2 ring-blue-500 bg-blue-50/50" 
                    : "hover:shadow-sm"
                }`}
                onClick={() => setSelectedModel(modelData.model)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-slate-800 text-sm leading-tight">
                        {modelData.model}
                      </h4>
                      {selectedModel === modelData.model && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {modelData.segment}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedType && selectedBrand && selectedModel && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Selection Complete!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            {selectedType === "PASSENGER" ? "Passenger" : "Commercial"} • {selectedBrand} • {selectedModel}
          </p>
        </div>
      )}
    </div>
  )
} 