"use client"

import { Home, Search, BarChart2 } from "lucide-react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface MobileBottomNavProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <TabsList className="flex justify-around w-full rounded-none h-16 bg-background">
        <TabsTrigger
          value="overview"
          onClick={() => onTabChange("overview")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none flex-1 data-[state=active]:bg-transparent",
            activeTab === "overview" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Overview</span>
          {activeTab === "overview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </TabsTrigger>

        <TabsTrigger
          value="search"
          onClick={() => onTabChange("search")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none flex-1 data-[state=active]:bg-transparent",
            activeTab === "search" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Search</span>
          {activeTab === "search" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </TabsTrigger>

        <TabsTrigger
          value="inventory"
          onClick={() => onTabChange("inventory")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none flex-1 data-[state=active]:bg-transparent",
            activeTab === "inventory" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-xs mt-1">Inventory</span>
          {activeTab === "inventory" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </TabsTrigger>
      </TabsList>
    </div>
  )
}
