"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatCurrency } from "@/lib/utils"
import type { PFI } from "@/lib/types"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Download,
  Filter,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  Trash2,
  MoreVertical,
} from "lucide-react"
import { format } from "date-fns"
import { vehicleData, salesExecutives } from "@/lib/data"
import { ProgressHeader } from "@/components/progress-header"

interface PFIDashboardProps {
  pfis: PFI[]
  onCreateNew: () => void
  onView: (pfi: PFI) => void
  onEdit: (pfi: PFI) => void
  onDelete: (pfiId: string) => void
  onDownloadPDF: (pfi: PFI) => void
  onSettings: () => void
}

export function PFIDashboard({
  pfis,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
  onDownloadPDF,
  onSettings,
}: PFIDashboardProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [brandFilter, setBrandFilter] = React.useState("all")
  const [salesFilter, setSalesFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("date")
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const brands = [...new Set(vehicleData.map((v) => v.BRAND))].sort()

  const handleSignOut = () => {
    sessionStorage.removeItem("mikano-auth-token")
    window.location.reload()
  }

  const filteredPfis = React.useMemo(() => {
    const filtered = pfis.filter((pfi) => {
      const lowerSearchTerm = searchTerm.toLowerCase()
      const matchesSearch =
        pfi.customerName.toLowerCase().includes(lowerSearchTerm) ||
        pfi.invoiceNumber.toLowerCase().includes(lowerSearchTerm)
      const matchesBrand = brandFilter === "all" || pfi.lineItems.some((item) => item.brand === brandFilter)
      const matchesSales = salesFilter === "all" || pfi.salesExecutive === salesFilter

      return matchesSearch && matchesBrand && matchesSales
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "customer":
          return a.customerName.localeCompare(b.customerName)
        case "total":
          return b.total - a.total
        case "status":
          const aExpired = new Date(a.validUntil) < new Date()
          const bExpired = new Date(b.validUntil) < new Date()
          return Number(aExpired) - Number(bExpired)
        default:
          return 0
      }
    })

    return filtered
  }, [pfis, searchTerm, brandFilter, salesFilter, sortBy])

  const stats = React.useMemo(() => {
    const total = pfis.length
    const thisMonth = pfis.filter((pfi) => {
      const pfiDate = new Date(pfi.createdAt)
      const now = new Date()
      return pfiDate.getMonth() === now.getMonth() && pfiDate.getFullYear() === now.getFullYear()
    }).length
    const totalValue = pfis.reduce((sum, pfi) => sum + pfi.total, 0)
    const avgValue = total > 0 ? totalValue / total : 0

    return { total, thisMonth, totalValue, avgValue }
  }, [pfis])

  const getStatusBadge = (pfi: PFI) => {
    const isExpired = new Date(pfi.validUntil) < new Date()
    return (
      <Badge
        variant={isExpired ? "destructive" : "default"}
        className={isExpired ? "" : "bg-green-600 hover:bg-green-700"}
      >
        {isExpired ? "Expired" : "Active"}
      </Badge>
    )
  }

  // Mobile PFI Card Component
  const PFICard = ({ pfi }: { pfi: PFI }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-sm">{pfi.invoiceNumber}</h3>
            <p className="text-xs text-gray-600">{pfi.customerName}</p>
          </div>
          {getStatusBadge(pfi)}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <span className="text-gray-500">Sales:</span> {pfi.salesExecutive}
          </div>
          <div>
            <span className="text-gray-500">Date:</span> {format(new Date(pfi.createdAt), "dd/MM/yyyy")}
          </div>
          <div>
            <span className="text-gray-500">Items:</span> {pfi.lineItems.reduce((sum, item) => sum + item.quantity, 0)}
          </div>
          <div>
            <span className="text-gray-500 font-semibold">Total:</span> {formatCurrency(pfi.total)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(pfi)} className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(pfi)} className="flex-1">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onDownloadPDF(pfi)}>
                <Download className="w-3 h-3 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(pfi.id)} className="text-red-600">
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressHeader
        progress={0}
        onPreview={() => {}}
        title="Management PFI Dashboard"
        showPreviewButton={false}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 pt-6 md:pt-8 pb-20 md:pb-8">
        {/* Mobile-First Create New PFI - Fixed at bottom for thumb access */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <Button
            onClick={onCreateNew}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Management PFI
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600">Manage your proforma invoices</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onSettings} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              User Management
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards - Hidden on mobile, shown on desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total PFIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.avgValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Create New PFI Button */}
        <Card className="hidden md:block bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="flex items-center justify-between p-6">
            <div>
                              <h3 className="text-lg font-semibold text-red-800">Create New Management PFI</h3>
                              <p className="text-red-600">Fast-track PFI generation for management requests</p>
            </div>
            <Button onClick={onCreateNew} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
                              New Management PFI
            </Button>
          </CardContent>
        </Card>

        {/* Search Bar - Always visible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customer or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Collapsible Filters - Progressive Disclosure */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters & Sort
              </div>
              {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={salesFilter} onValueChange={setSalesFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by sales exec" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sales Executives</SelectItem>
                      {salesExecutives.map((exec) => (
                        <SelectItem key={exec.name} value={exec.name}>
                          {exec.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date (Newest)</SelectItem>
                      <SelectItem value="customer">Customer Name</SelectItem>
                      <SelectItem value="total">Total Amount</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setBrandFilter("all")
                      setSalesFilter("all")
                      setSortBy("date")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Mobile Settings and Sign Out */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          <Button onClick={onSettings} variant="outline" className="bg-transparent">
            <Settings className="w-4 h-4 mr-2" />
            User Management
          </Button>
          <Button onClick={handleSignOut} variant="outline" className="bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* PFI List - Mobile Cards / Desktop Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">PFI List ({filteredPfis.length})</h3>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredPfis.map((pfi) => (
              <PFICard key={pfi.id} pfi={pfi} />
            ))}
            {filteredPfis.length === 0 && (
              <Card>
                <CardContent className="text-center py-8 text-gray-500">
                  No PFIs found matching your criteria
                </CardContent>
              </Card>
            )}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Sales Executive</TableHead>
                    <TableHead>Models</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPfis.map((pfi) => (
                    <TableRow key={pfi.id}>
                      <TableCell className="font-medium">{pfi.invoiceNumber}</TableCell>
                      <TableCell>{pfi.customerName}</TableCell>
                      <TableCell>{pfi.salesExecutive}</TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate">
                          {pfi.lineItems.map((item) => `${item.brand} ${item.model}`).join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>{pfi.lineItems.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(pfi.total)}</TableCell>
                      <TableCell>{getStatusBadge(pfi)}</TableCell>
                      <TableCell>{format(new Date(pfi.createdAt), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => onView(pfi)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(pfi)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDownloadPDF(pfi)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(pfi.id)}
                            className="text-red-600 hover:bg-red-100 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPfis.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No PFIs found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
