"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, ChevronRight } from "lucide-react"

interface SmartDefaultsProps {
  section: "vehicles" | "authorization" | "bank" | "pricing"
  onSelect?: (value: any) => void
}

export function SmartDefaultsPanel({ section, onSelect }: SmartDefaultsProps) {
  // This would come from your analytics/localStorage in production
  const mockUsageData = {
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

  const renderContent = () => {
    switch (section) {
      case "vehicles":
        return (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">Most Used This Week:</p>
            {mockUsageData.vehicles.map((vehicle, i) => (
              <button
                key={vehicle.name}
                onClick={() => onSelect?.(vehicle)}
                className="w-full flex items-center justify-between p-2 text-sm text-left hover:bg-gray-50 rounded-md group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span>{vehicle.name}</span>
                  <span className="text-gray-400">({vehicle.count})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )

      case "authorization":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Prepared By:</span>
              <span className="font-medium">{mockUsageData.authorization.preparedBy}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Approved By:</span>
              <span className="font-medium">{mockUsageData.authorization.approvedBy}</span>
            </div>
          </div>
        )

      case "bank":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Bank:</span>
              <span className="font-medium">{mockUsageData.bank.name}</span>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">{mockUsageData.bank.account}</p>
              <p className="font-mono text-gray-900">{mockUsageData.bank.number}</p>
            </div>
          </div>
        )

      case "pricing":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Standard Price:</span>
              <span className="font-mono font-medium">₦{mockUsageData.pricing.standardPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Common Discounts:</span>
              <div className="flex gap-1">
                {mockUsageData.pricing.commonDiscounts.map((discount) => (
                  <button
                    key={discount}
                    onClick={() => onSelect?.(discount)}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    {discount}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className="w-64 shadow-lg border-0 ring-1 ring-gray-200">
      <CardContent className="p-3">{renderContent()}</CardContent>
    </Card>
  )
} 