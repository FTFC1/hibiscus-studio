"use client"

import * as React from "react"

interface SmartDefaults {
  vehicles: Array<{ name: string; count: number }>
  authorization: {
    preparedBy: string
    approvedBy: string
  }
  bank: {
    name: string
    account: string
    number: string
  }
  pricing: {
    standardPrice: number
    commonDiscounts: number[]
  }
}

const DEFAULT_DATA: SmartDefaults = {
  vehicles: [
    { name: "CS35 PLUS LUXURY", count: 5 },
    { name: "EADO PLUS LUXURY", count: 3 },
    { name: "MAXUS D60 EXECUTIVE", count: 2 },
  ],
  authorization: {
    preparedBy: "Management",
    approvedBy: "Gaurav Kaul",
  },
  bank: {
    name: "GTB",
    account: "MIKANO INTERNATIONAL LTD",
    number: "0800046902",
  },
  pricing: {
    standardPrice: 30000000,
    commonDiscounts: [2.5, 5, 7.5],
  },
}

export function useSmartDefaults() {
  const [defaults, setDefaults] = React.useState<SmartDefaults>(DEFAULT_DATA)

  // Load defaults from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("smart-defaults")
      if (saved) {
        try {
          setDefaults(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse smart defaults:", e)
        }
      }
    }
  }, [])

  // Update vehicle usage count
  const updateVehicleUsage = React.useCallback((vehicleName: string) => {
    setDefaults((prev) => {
      const vehicles = [...prev.vehicles]
      const index = vehicles.findIndex((v) => v.name === vehicleName)
      
      if (index > -1) {
        // Update existing vehicle count
        vehicles[index] = { ...vehicles[index], count: vehicles[index].count + 1 }
      } else {
        // Add new vehicle
        vehicles.push({ name: vehicleName, count: 1 })
      }

      // Sort by count descending
      vehicles.sort((a, b) => b.count - a.count)

      // Keep only top 5
      const newDefaults = { ...prev, vehicles: vehicles.slice(0, 5) }
      
      // Save to localStorage
      localStorage.setItem("smart-defaults", JSON.stringify(newDefaults))
      
      return newDefaults
    })
  }, [])

  // Update authorization defaults
  const updateAuthorization = React.useCallback((preparedBy?: string, approvedBy?: string) => {
    setDefaults((prev) => {
      const newDefaults = {
        ...prev,
        authorization: {
          ...prev.authorization,
          ...(preparedBy && { preparedBy }),
          ...(approvedBy && { approvedBy }),
        },
      }
      localStorage.setItem("smart-defaults", JSON.stringify(newDefaults))
      return newDefaults
    })
  }, [])

  // Update bank defaults
  const updateBank = React.useCallback((bank: Partial<SmartDefaults["bank"]>) => {
    setDefaults((prev) => {
      const newDefaults = {
        ...prev,
        bank: { ...prev.bank, ...bank },
      }
      localStorage.setItem("smart-defaults", JSON.stringify(newDefaults))
      return newDefaults
    })
  }, [])

  // Reset all defaults
  const resetDefaults = React.useCallback(() => {
    setDefaults(DEFAULT_DATA)
    localStorage.removeItem("smart-defaults")
  }, [])

  return {
    defaults,
    updateVehicleUsage,
    updateAuthorization,
    updateBank,
    resetDefaults,
  }
} 