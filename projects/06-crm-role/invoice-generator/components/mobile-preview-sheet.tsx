"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { PFI } from "@/lib/types"
import { format } from "date-fns"
import { ChevronUp, ChevronDown, X, Download, Eye } from "lucide-react"

interface MobilePreviewSheetProps {
  pfi: PFI
  isOpen: boolean
  onClose: () => void
  onDownloadPDF: (pfi: PFI) => void
  sheetHeight: "collapsed" | "half" | "full"
  onSheetHeightChange: (height: "collapsed" | "half" | "full") => void
}

export function MobilePreviewSheet({ 
  pfi, 
  isOpen, 
  onClose, 
  onDownloadPDF,
  sheetHeight,
  onSheetHeightChange 
}: MobilePreviewSheetProps) {
  const [startY, setStartY] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)

  const getSheetStyles = () => {
    switch (sheetHeight) {
      case "collapsed":
        return "h-32 translate-y-0"
      case "half":
        return "h-[50vh] translate-y-0"
      case "full":
        return "h-[90vh] translate-y-0"
      default:
        return "h-32 translate-y-0"
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentY = e.touches[0].clientY
    const deltaY = startY - currentY

    // Prevent scrolling when dragging the sheet
    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const endY = e.changedTouches[0].clientY
    const deltaY = startY - endY
    
    // Determine new height based on drag distance and current state
    if (Math.abs(deltaY) > 50) { // Minimum drag threshold
      if (deltaY > 0) { // Dragged up
        if (sheetHeight === "collapsed") {
          onSheetHeightChange("half")
        } else if (sheetHeight === "half") {
          onSheetHeightChange("full")
        }
      } else { // Dragged down
        if (sheetHeight === "full") {
          onSheetHeightChange("half")
        } else if (sheetHeight === "half") {
          onSheetHeightChange("collapsed")
        } else {
          onClose()
        }
      }
    }
    
    setIsDragging(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - only visible when half or full */}
      {(sheetHeight === "half" || sheetHeight === "full") && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => onSheetHeightChange("collapsed")}
        />
      )}
      
      {/* Bottom Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl z-50 transition-all duration-300 ease-out lg:hidden ${getSheetStyles()}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-700 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">PFI Preview</h3>
              <p className="text-xs text-slate-500">{pfi.invoiceNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {sheetHeight === "full" && (
              <Button
                onClick={() => onDownloadPDF(pfi)}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                PDF
              </Button>
            )}
            
            {/* Expand/Collapse Button */}
            <Button
              onClick={() => {
                if (sheetHeight === "collapsed") onSheetHeightChange("half")
                else if (sheetHeight === "half") onSheetHeightChange("full")
                else onSheetHeightChange("collapsed")
              }}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              {sheetHeight === "full" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sheet Content */}
        <div className="flex-1 overflow-y-auto">
          {sheetHeight === "collapsed" && (
            <CollapsedContent pfi={pfi} />
          )}
          
          {sheetHeight === "half" && (
            <HalfContent pfi={pfi} />
          )}
          
          {sheetHeight === "full" && (
            <FullContent pfi={pfi} />
          )}
        </div>
      </div>
    </>
  )
}

// Collapsed state - just key totals
function CollapsedContent({ pfi }: { pfi: PFI }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total Amount</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(pfi.total || 0)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Customer</p>
          <p className="text-sm font-medium text-slate-700 truncate max-w-32">{pfi.customerName}</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{pfi.lineItems?.length || 0} vehicles</span>
        <span>Valid until {pfi.validUntil ? format(pfi.validUntil, "MMM dd") : ""}</span>
      </div>
    </div>
  )
}

// Half state - key info + summary
function HalfContent({ pfi }: { pfi: PFI }) {
  return (
    <div className="p-4 space-y-4">
      <CollapsedContent pfi={pfi} />
      
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Vehicle Summary</h4>
        <div className="space-y-2">
          {pfi.lineItems?.slice(0, 3).map((item, index) => (
            <div key={item.id} className="flex justify-between text-xs">
              <span className="text-slate-600">{item.brand} {item.model}</span>
              <span className="font-medium">{formatCurrency(item.amount)}</span>
            </div>
          ))}
          {(pfi.lineItems?.length || 0) > 3 && (
            <p className="text-xs text-slate-500 text-center pt-2">
              +{(pfi.lineItems?.length || 0) - 3} more vehicles
            </p>
          )}
        </div>
      </div>
      
      <div className="border-t border-slate-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span>{formatCurrency(pfi.subtotal || 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">VAT (7.5%)</span>
          <span>{formatCurrency(pfi.vat || 0)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t border-slate-200 mt-2">
          <span>Total</span>
          <span>{formatCurrency(pfi.total || 0)}</span>
        </div>
      </div>
    </div>
  )
}

// Full state - complete preview
function FullContent({ pfi }: { pfi: PFI }) {
  return (
    <div className="p-4">
      <Card className="print:shadow-none overflow-hidden">
        <CardContent className="p-4">
          {/* Header */}
          <div className="mb-6">
            <img src="/images/mkheaderpfi.png" alt="Mikano Motors Header" className="w-full h-auto" />
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-red-600 mb-2">PROFORMA INVOICE</h1>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <strong>Invoice No:</strong> {pfi.invoiceNumber}
              </div>
              <div>
                <strong>Date:</strong> {pfi.invoiceDate ? format(pfi.invoiceDate, "dd/MM/yyyy") : ""}
              </div>
              <div>
                <strong>Valid Until:</strong> {pfi.validUntil ? format(pfi.validUntil, "dd/MM/yyyy") : ""}
              </div>
              <div>
                <strong>Type:</strong> {pfi.invoiceType}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h3 className="font-semibold text-red-600 mb-2">BILL TO:</h3>
                <div className="space-y-1">
                  <div><strong>{pfi.customerName}</strong></div>
                  <div>{pfi.customerAddress}</div>
                  <div>Phone: {pfi.customerPhone}</div>
                  <div>Email: {pfi.customerEmail}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 mb-2">SALES EXECUTIVE:</h3>
                <div className="space-y-1">
                  <div><strong>{pfi.salesExecutive}</strong></div>
                  <div>Phone: {pfi.contactNumber}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="border border-gray-300 p-1 text-left">S/N</th>
                  <th className="border border-gray-300 p-1 text-left">Description</th>
                  <th className="border border-gray-300 p-1 text-center">Qty</th>
                  <th className="border border-gray-300 p-1 text-right">Unit Price</th>
                  <th className="border border-gray-300 p-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {pfi.lineItems?.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-1">{index + 1}</td>
                    <td className="border border-gray-300 p-1">{item.description}</td>
                    <td className="border border-gray-300 p-1 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-1 text-right">
                      {formatCurrency(item.discountedPrice || item.unitPrice)}
                    </td>
                    <td className="border border-gray-300 p-1 text-right font-bold">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(pfi.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (7.5%):</span>
                <span>{formatCurrency(pfi.vat || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(pfi.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mb-4">
            <img src="/images/mkfooterpfi.png" alt="Mikano Motors Footer" className="w-full h-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 