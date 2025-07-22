export type VehicleType = "PASSENGER" | "LHCV"

export interface Vehicle {
  type: VehicleType
  brand: string
  model: string
  trim: string
  description: string
  warranty: string
  segment: string
}

// Helper to categorize vehicles by segment
function isLHCV(segment: string): boolean {
  return segment.includes("TRUCK") || segment.includes("VAN") || segment.includes("BUS")
}

// Convert existing data to new structure
export const vehiclesByType: Record<VehicleType, Vehicle[]> = {
  PASSENGER: [
    {
      type: "PASSENGER",
      brand: "CHANGAN",
      model: "CS35 PLUS",
      trim: "LUXURY",
      description: "CHANGAN CS35 PLUS LUXURY",
      warranty: "6 YEARS / 200,000KM WHICHEVER COMES FIRST",
      segment: "SUV - B",
    },
    {
      type: "PASSENGER",
      brand: "CHANGAN",
      model: "EADO PLUS",
      trim: "LUXURY",
      description: "CHANGAN EADO PLUS LUXURY",
      warranty: "6 YEARS / 200,000KM WHICHEVER COMES FIRST",
      segment: "SEDAN - C",
    },
    {
      type: "PASSENGER",
      brand: "MAXUS",
      model: "D60",
      trim: "EXECUTIVE",
      description: "MAXUS D60 EXECUTIVE",
      warranty: "5 YEARS / 130,000KM WHICHEVER COMES FIRST",
      segment: "SUV - C",
    },
  ],
  LHCV: [
    {
      type: "LHCV",
      brand: "MAXUS",
      model: "V80",
      trim: "CARGO",
      description: "MAXUS V80 CARGO VAN",
      warranty: "3 YEARS / 100,000KM WHICHEVER COMES FIRST",
      segment: "VAN",
    },
    {
      type: "LHCV",
      brand: "MAXUS",
      model: "T60",
      trim: "PICKUP",
      description: "MAXUS T60 PICKUP",
      warranty: "3 YEARS / 100,000KM WHICHEVER COMES FIRST",
      segment: "TRUCK",
    },
  ],
}

// Get unique brands for a vehicle type
export function getBrandsForType(type: VehicleType): string[] {
  return [...new Set(vehiclesByType[type].map(v => v.brand))].sort()
}

// Get models for a type and brand
export function getModelsForBrand(type: VehicleType, brand: string): string[] {
  return [...new Set(
    vehiclesByType[type]
      .filter(v => v.brand === brand)
      .map(v => v.model)
  )].sort()
}

// Get full vehicle details
export function getVehicleDetails(type: VehicleType, brand: string, model: string): Vehicle | undefined {
  return vehiclesByType[type].find(v => v.brand === brand && v.model === model)
}

// Get default price for a vehicle (to be implemented with real data)
export function getDefaultPrice(type: VehicleType, brand: string, model: string): number {
  // This would come from a pricing database in production
  return 30000000 // Default to ₦30M
} 