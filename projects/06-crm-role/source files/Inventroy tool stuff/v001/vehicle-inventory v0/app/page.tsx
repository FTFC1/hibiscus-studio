"use client"

import { useRef } from "react"

import { useState, useEffect, useMemo, Suspense, lazy, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import { getDashboardMetrics } from "./actions"
import { useToastContext } from "@/components/toast-provider"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { useMediaQuery } from "@/hooks/use-media-query"
import { seedVehicleData } from "./actions/seed-data"
import { SearchFilterBar } from "@/components/search-filter-bar"
import { AdminNotificationBar } from "@/components/admin-notification-bar"
import { VirtualizedBrandList } from "@/components/virtualized-brand-list"
import { useBrands } from "@/lib/swr-hooks"
import { logPerformance } from "@/lib/performance"
import { addVehicleStock, updateModel } from "./actions"
import { fetchBrands } from "@/lib/data"
import { setupFuzzySearch } from "./actions/setup-search"
import { useDatabaseSearch } from "@/lib/use-database-search"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChartIcon as ChartBar, Home, Search } from "lucide-react"

// Lazy load heavy components
const AddStockModal = lazy(() => import("@/components/add-stock-modal").then((mod) => ({ default: mod.AddStockModal })))
const ViewInventorySheet = lazy(() =>
  import("@/components/view-inventory-sheet").then((mod) => ({ default: mod.ViewInventorySheet })),
)
const EditModelDialog = lazy(() =>
  import("@/components/edit-model-dialog").then((mod) => ({ default: mod.EditModelDialog })),
)

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

interface DashboardMetricsData {
  totalVehicles: number
  availableVehicles: number
  inTransitVehicles: number
  reservedVehicles: number
  displayVehicles: number
  totalBrands: number
  totalModels: number
}

export default function VehicleInventory() {
  const startTime = performance.now()

  // State for models
  const [modelsByBrand, setModelsByBrand] = useState<Record<number, Model[]>>({})
  const [loadingModels, setLoadingModels] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  // State for dashboard metrics
  const [metrics, setMetrics] = useState<DashboardMetricsData>({
    totalVehicles: 0,
    availableVehicles: 0,
    inTransitVehicles: 0,
    reservedVehicles: 0,
    displayVehicles: 0,
    totalBrands: 0,
    totalModels: 0,
  })
  const [loadingMetrics, setLoadingMetrics] = useState(true)

  // State to track which brands are expanded
  const [expandedBrands, setExpandedBrands] = useState<Record<number, boolean>>({})

  // State for add stock modal
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false)

  // State for view inventory sheet
  const [inventorySheet, setInventorySheet] = useState<{
    isOpen: boolean
    brand: string
    model: string
    modelId: number
  }>({
    isOpen: false,
    brand: "",
    model: "",
    modelId: 0,
  })

  // Toast context
  const { toast } = useToastContext()

  // Media query for responsive design
  const isMobile = useMediaQuery("(max-width: 768px)")

  // State for edit model dialog
  const [isEditModelDialogOpen, setIsEditModelDialogOpen] = useState(false)
  const [selectedModelForEdit, setSelectedModelForEdit] = useState<{
    id: number
    brand: string
    name: string
    category: string
    fuelType: string
    driveType: string
    transmission: string
  }>({
    id: 0,
    brand: "",
    name: "",
    category: "",
    fuelType: "",
    driveType: "",
    transmission: "",
  })

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)
  const [filteredBrandsCount, setFilteredBrandsCount] = useState(0)
  const [filteredModelsCount, setFilteredModelsCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mobile tabs state
  const [activeTab, setActiveTab] = useState("overview")

  // Admin mode state
  const [isAdminMode, setIsAdminMode] = useState(false)

  // Admin toggle tap counter
  const [adminTapCount, setAdminTapCount] = useState(0)
  const [lastTapTime, setLastTapTime] = useState(0)

  // useRef for tracking initial render
  const isInitialRender = useRef(true)

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery])

  // Use our new database search hook with the debounced query
  const { results: searchResults, isLoading: isSearching } = useDatabaseSearch(debouncedSearchQuery)

  // Fetch brands with SWR for initial load
  const { brands: allBrands, isLoading: loadingBrands } = useBrands()

  // Use search results when available, otherwise use all brands
  const displayBrands = useMemo(() => {
    if (!debouncedSearchQuery || !searchResults) {
      return allBrands || []
    }

    // When we have search results, use those instead
    return searchResults.brands.map((brand) => ({
      ...brand,
      total_units: brand.models.reduce((sum, model) => sum + (model.total_stock || 0), 0),
      available_units: brand.models.reduce((sum, model) => sum + (model.available || 0), 0),
      model_count: brand.models.length,
    }))
  }, [debouncedSearchQuery, searchResults, allBrands])

  // Update modelsByBrand with search results
  useEffect(() => {
    // Safely check if searchQuery exists and has a trim method
    const trimmedQuery = typeof debouncedSearchQuery === "string" ? debouncedSearchQuery.trim() : ""

    if (searchResults && trimmedQuery) {
      const newModelsByBrand: Record<number, Model[]> = {}

      // Group models by brand_id
      searchResults.models.forEach((model) => {
        if (!newModelsByBrand[model.brand_id]) {
          newModelsByBrand[model.brand_id] = []
        }
        newModelsByBrand[model.brand_id].push(model)
      })

      // Update state with search results
      setModelsByBrand((prev) => ({
        ...prev,
        ...newModelsByBrand,
      }))

      // Auto-expand brands with search results
      const brandsToExpand = searchResults.brands.filter((brand) => brand.models.length > 0).map((brand) => brand.id)

      if (brandsToExpand.length > 0) {
        setExpandedBrands((prev) => {
          const newState = { ...prev }
          brandsToExpand.forEach((brandId) => {
            newState[brandId] = true
          })
          return newState
        })
      }

      // Update filter counts for UI
      setFilteredBrandsCount(searchResults.brands.length)
      setFilteredModelsCount(searchResults.models.length)
      setIsFiltering(true)
    } else if (!trimmedQuery) {
      // Reset filtering state when search is cleared
      setIsFiltering(false)
      setFilteredBrandsCount(allBrands?.length || 0)
      const totalModels = Object.values(modelsByBrand).reduce((acc, models) => acc + models.length, 0)
      setFilteredModelsCount(totalModels)
    }
  }, [searchResults, debouncedSearchQuery, allBrands])

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardMetrics()
    setupSearchDatabase()

    // Load saved tab from localStorage if available
    const savedTab = typeof window !== "undefined" ? localStorage.getItem("vehicle-inventory-tab") : null
    if (savedTab) {
      setActiveTab(savedTab)
    }

    // Check if admin mode is enabled in localStorage
    const adminMode = typeof window !== "undefined" ? localStorage.getItem("admin-mode") === "true" : false
    setIsAdminMode(adminMode)

    // Add keyboard shortcut for toggling admin mode (Ctrl+Shift+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        toggleAdminMode()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Toggle admin mode
  const toggleAdminMode = useCallback(() => {
    setIsAdminMode((prev) => {
      const newState = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("admin-mode", newState.toString())
      }
      return newState
    })
  }, [])

  // Show toast notification when admin mode changes
  useEffect(() => {
    // Skip the initial render
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    // Store the previous admin mode to prevent unnecessary toasts
    const prevAdminMode = localStorage.getItem("admin-mode") === "true"

    // Only show toast if the current state differs from what's in localStorage
    if (isAdminMode !== prevAdminMode) {
      toast({
        title: isAdminMode ? "Admin Mode Enabled" : "Admin Mode Disabled",
        description: isAdminMode
          ? "You now have access to administrative features"
          : "Administrative features are now hidden",
        type: isAdminMode ? "info" : "default",
      })
    }
  }, [isAdminMode, toast])

  // Handle title tap for admin mode toggle on mobile
  const handleTitleTap = () => {
    const now = Date.now()

    // Reset counter if it's been more than 2 seconds since last tap
    if (now - lastTapTime > 2000) {
      setAdminTapCount(1)
    } else {
      setAdminTapCount((prev) => prev + 1)
    }

    setLastTapTime(now)

    // If tapped 5 times in quick succession, toggle admin mode
    if (adminTapCount === 4) {
      toggleAdminMode()
      setAdminTapCount(0)
    }
  }

  // Setup search database
  const setupSearchDatabase = async () => {
    try {
      const result = await setupFuzzySearch()
      if (!result.success) {
        console.error("Failed to set up fuzzy search:", result.message)
      } else {
        console.log("Fuzzy search setup completed successfully")
      }
    } catch (error) {
      console.error("Error setting up fuzzy search:", error)
    }
  }

  // Also modify the fetchModelsForBrand function to include performance logging
  const fetchModelsForBrand = useCallback(
    async (brandId: number) => {
      try {
        if (!modelsByBrand[brandId]) {
          const startTime = performance.now()
          console.log(`[Data] Fetching models for brand ID ${brandId}`)

          setLoadingModels((prev) => ({ ...prev, [brandId]: true }))

          const response = await fetch(`/api/models/brand/${brandId}`)
          const models = await response.json()

          const fetchTime = performance.now() - startTime
          console.log(
            `[Performance] Fetched ${models.length} models for brand ID ${brandId} in ${fetchTime.toFixed(2)}ms`,
          )

          if (Array.isArray(models)) {
            setModelsByBrand((prev) => ({
              ...prev,
              [brandId]: models,
            }))
          } else {
            console.error(`Unexpected models data format for brand ${brandId}:`, models)
          }

          setLoadingModels((prev) => ({ ...prev, [brandId]: false }))
        } else {
          console.log(`[Data] Models for brand ID ${brandId} already loaded (${modelsByBrand[brandId].length} models)`)
        }
      } catch (error) {
        console.error(`Error fetching models for brand ${brandId}:`, error)
        setLoadingModels((prev) => ({ ...prev, [brandId]: false }))
      }
    },
    [modelsByBrand],
  )

  // Function to fetch dashboard metrics
  const fetchDashboardMetrics = async () => {
    try {
      setLoadingMetrics(true)
      const metricsData = await getDashboardMetrics()
      setMetrics(metricsData)
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error)
    } finally {
      setLoadingMetrics(false)
    }
  }

  // Function to toggle brand expansion
  const toggleBrand = async (brandId: number) => {
    const newExpandedState = !expandedBrands[brandId]

    setExpandedBrands((prev) => ({
      ...prev,
      [brandId]: newExpandedState,
    }))

    // Fetch models if expanding and we don't have them yet
    if (newExpandedState && !modelsByBrand[brandId]) {
      fetchModelsForBrand(brandId)
    }
  }

  // Function to handle form submission
  const handleAddStock = async (data: any) => {
    try {
      const result = await addVehicleStock(data)

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle added successfully",
          type: "success",
        })

        // Refresh data after adding stock
        fetchDashboardMetrics()
        fetchBrands()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add vehicle",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding stock:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    }
  }

  // Function to open inventory sheet
  const openInventorySheet = (brand: string, model: string, modelId: number) => {
    setInventorySheet({
      isOpen: true,
      brand,
      model,
      modelId,
    })
  }

  // Function to close inventory sheet
  const closeInventorySheet = () => {
    setInventorySheet((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }

  // Function to handle edit model
  const handleEditModel = (modelId: number, brand: string, model: Model) => {
    setSelectedModelForEdit({
      id: modelId,
      brand,
      name: model.name,
      category: model.category || "",
      fuelType: model.fuel_type || "",
      driveType: model.drive_type || "",
      transmission: model.transmission || "",
    })
    setIsEditModelDialogOpen(true)
  }

  // Function to handle saving the edited model
  const handleSaveModel = async (data: any) => {
    try {
      const result = await updateModel(data)

      if (result.success) {
        toast({
          title: "Success",
          description: "Model updated successfully",
          type: "success",
        })

        // Refresh data after updating the model
        fetchBrands()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update model",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating model:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    }
  }

  // Add a function to handle seeding the data
  const handleSeedData = async () => {
    try {
      setIsSubmitting(true)
      const result = await seedVehicleData()

      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle data seeded successfully",
          type: "success",
        })

        // Refresh data after seeding
        fetchDashboardMetrics()
        fetchBrands()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to seed vehicle data",
          type: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding data:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("vehicle-inventory-tab", value)
    }
  }

  // Log performance when component renders
  useEffect(() => {
    return () => {
      logPerformance("VehicleInventory", startTime)
    }
  }, [startTime])

  return (
    <div className="min-h-screen bg-background">
      {/* Admin notification bar - only shown in admin mode */}
      {isAdminMode && <AdminNotificationBar onSeedData={handleSeedData} isSubmitting={isSubmitting} />}

      <div className="container mx-auto px-4 sm:px-6 pb-20">
        {/* Header section with improved layout and visual hierarchy */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3 sm:mb-6">
            <div onClick={handleTitleTap} className="cursor-default">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Vehicle Inventory
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Dashboard overview and inventory management</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Admin toggle button for non-mobile */}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleAdminMode}
                  className="text-muted-foreground hover:text-foreground"
                  title="Toggle Admin Mode"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Toggle Admin Mode</span>
                </Button>
              )}

              {/* Add Vehicle button on desktop */}
              {!isMobile && (
                <Button
                  size="lg"
                  className="gap-2 w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 shadow-md"
                  onClick={() => setIsAddStockModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile tabbed navigation */}
        {isMobile ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsContent value="overview" className="mt-0 pb-16">
              {/* Dashboard Metrics with improved visual design */}
              <DashboardMetrics
                totalVehicles={metrics.totalVehicles}
                availableVehicles={metrics.availableVehicles}
                inTransitVehicles={metrics.inTransitVehicles}
                reservedVehicles={metrics.reservedVehicles}
                displayVehicles={metrics.displayVehicles}
                totalBrands={metrics.totalBrands}
                totalModels={metrics.totalModels}
                isLoading={loadingMetrics}
              />
            </TabsContent>

            <TabsContent value="inventory" className="mt-0 space-y-6 pb-16">
              {loadingBrands ? (
                <div className="rounded-lg border bg-card/80 p-6 sm:p-8 text-center">
                  <p>Loading vehicle inventory...</p>
                </div>
              ) : (
                <VirtualizedBrandList
                  brands={displayBrands}
                  modelsByBrand={modelsByBrand}
                  expandedBrands={expandedBrands}
                  loadingModels={loadingModels}
                  searchQuery={searchQuery}
                  onToggleBrand={toggleBrand}
                  onViewInventory={openInventorySheet}
                  onEditModel={handleEditModel}
                />
              )}
            </TabsContent>

            <TabsContent value="search" className="mt-0 space-y-6 pb-16">
              <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                <SearchFilterBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isFiltering={isFiltering}
                  filteredBrandsCount={filteredBrandsCount}
                  filteredModelsCount={filteredModelsCount}
                  isFocused={activeTab === "search"}
                />
              </div>

              {searchResults && !searchResults.fuzzySearch && isAdminMode && (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Basic Search Mode</AlertTitle>
                  <AlertDescription>
                    The pg_trgm extension is not enabled in your database. Search is working in basic mode.
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => (window.location.href = "/admin/search-setup")}
                    >
                      Set up advanced search
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Safely check if searchQuery exists and has a trim method */}
              {typeof debouncedSearchQuery === "string" && debouncedSearchQuery.trim() ? (
                loadingBrands || isSearching ? (
                  <div className="rounded-lg border bg-card/80 p-6 sm:p-8 text-center">
                    <p>Searching...</p>
                  </div>
                ) : (
                  <VirtualizedBrandList
                    brands={displayBrands}
                    modelsByBrand={modelsByBrand}
                    expandedBrands={expandedBrands}
                    loadingModels={loadingModels}
                    searchQuery={searchQuery}
                    onToggleBrand={toggleBrand}
                    onViewInventory={openInventorySheet}
                    onEditModel={handleEditModel}
                  />
                )
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-3 opacity-50" />
                  <p>Enter a search term to find vehicles, models, or brands</p>
                </div>
              )}
            </TabsContent>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
              <TabsList className="flex justify-around w-full rounded-none h-16 bg-background">
                <TabsTrigger
                  value="overview"
                  className="flex flex-col items-center justify-center h-full rounded-none flex-1 data-[state=active]:bg-transparent"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className="flex flex-col items-center justify-center h-full rounded-none flex-1 data-[state=active]:bg-transparent"
                >
                  <Search className="h-5 w-5" />
                  <span className="text-xs mt-1">Search</span>
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="flex flex-col items-center justify-center h-full rounded-none flex-1 data-[state=active]:bg-transparent"
                >
                  <ChartBar className="h-5 w-5" />
                  <span className="text-xs mt-1">Inventory</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        ) : (
          <>
            {/* Dashboard Metrics with improved visual design */}
            <div className="mb-8">
              <DashboardMetrics
                totalVehicles={metrics.totalVehicles}
                availableVehicles={metrics.availableVehicles}
                inTransitVehicles={metrics.inTransitVehicles}
                reservedVehicles={metrics.reservedVehicles}
                displayVehicles={metrics.displayVehicles}
                totalBrands={metrics.totalBrands}
                totalModels={metrics.totalModels}
                isLoading={loadingMetrics}
              />
            </div>

            {/* Search and filters with improved design */}
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6">
              <SearchFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isFiltering={isFiltering}
                filteredBrandsCount={filteredBrandsCount}
                filteredModelsCount={filteredModelsCount}
              />
            </div>

            {searchResults && !searchResults.fuzzySearch && isAdminMode && (
              <Alert variant="warning" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Basic Search Mode</AlertTitle>
                <AlertDescription>
                  The pg_trgm extension is not enabled in your database. Search is working in basic mode.
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={() => (window.location.href = "/admin/search-setup")}
                  >
                    Set up advanced search
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Vehicle list */}
            {loadingBrands || isSearching ? (
              <div className="rounded-lg border bg-card/80 p-6 sm:p-8 text-center">
                <p>Loading vehicle inventory...</p>
              </div>
            ) : (
              <VirtualizedBrandList
                brands={displayBrands}
                modelsByBrand={modelsByBrand}
                expandedBrands={expandedBrands}
                loadingModels={loadingModels}
                searchQuery={searchQuery}
                onToggleBrand={toggleBrand}
                onViewInventory={openInventorySheet}
                onEditModel={handleEditModel}
              />
            )}
          </>
        )}
      </div>

      {/* Add padding at the bottom on mobile to account for the floating button */}
      {isMobile && <div className="h-24" />}

      {/* Mobile floating action button - positioned above the bottom nav */}
      {isMobile && (
        <div className="fixed right-4 bottom-20 z-50">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg"
            onClick={() => setIsAddStockModalOpen(true)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Vehicle</span>
          </Button>
        </div>
      )}

      {/* Lazy loaded modals and sheets */}
      <Suspense fallback={null}>
        {isAddStockModalOpen && (
          <AddStockModal
            isOpen={isAddStockModalOpen}
            onClose={() => setIsAddStockModalOpen(false)}
            onSubmit={handleAddStock}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {inventorySheet.isOpen && (
          <ViewInventorySheet
            isOpen={inventorySheet.isOpen}
            onClose={closeInventorySheet}
            vehicleBrand={inventorySheet.brand}
            vehicleModel={inventorySheet.model}
            modelId={inventorySheet.modelId}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isEditModelDialogOpen && (
          <EditModelDialog
            isOpen={isEditModelDialogOpen}
            onClose={() => setIsEditModelDialogOpen(false)}
            onSave={handleSaveModel}
            model={selectedModelForEdit}
          />
        )}
      </Suspense>
    </div>
  )
}
