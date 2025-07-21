"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import type { PFI } from "@/lib/types"
import { Eye, Download, X } from "lucide-react"

interface FloatingPreviewButtonProps {
  pfi: PFI
  onDownloadPDF: (pfi: PFI) => void
  isVisible: boolean
}

export function FloatingPreviewButton({ pfi, onDownloadPDF, isVisible }: FloatingPreviewButtonProps) {
  const [showModal, setShowModal] = React.useState(false)

  if (!isVisible || !pfi) return null

  return (
    <>
      {/* Floating Action Button - Mobile Only */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <Button
          onClick={() => setShowModal(true)}
          className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Eye className="h-6 w-6 text-white" />
        </Button>
        
        {/* Live total indicator */}
        <div className="absolute -top-2 -left-2 bg-white border-2 border-red-600 rounded-full px-2 py-1 shadow-lg">
          <span className="text-xs font-bold text-red-600">
            {formatCurrency(pfi.total || 0).replace('₦', '₦')}
          </span>
        </div>
      </div>

      {/* Full-Screen Modal Preview */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-full h-full p-0 gap-0 lg:hidden">
          <DialogHeader className="p-4 border-b bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-700 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  PFI Preview
                </DialogTitle>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onDownloadPDF(pfi)}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div id="invoice-print" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {/* Compact Invoice Header */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-red-600 mb-3">PROFORMA INVOICE</h1>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Invoice No:</strong> {pfi.invoiceNumber}</div>
                  <div><strong>Date:</strong> {pfi.invoiceDate ? new Date(pfi.invoiceDate).toLocaleDateString() : ""}</div>
                  <div><strong>Valid Until:</strong> {pfi.validUntil ? new Date(pfi.validUntil).toLocaleDateString() : ""}</div>
                  <div><strong>Type:</strong> {pfi.invoiceType}</div>
                </div>
              </div>

              {/* Customer & Sales Info */}
              <div className="grid grid-cols-1 gap-4 mb-6 text-sm">
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">BILL TO:</h3>
                  <div className="space-y-1">
                    <div><strong>{pfi.customerName}</strong></div>
                    <div className="text-gray-600">{pfi.customerAddress}</div>
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

              {/* Simplified Line Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Vehicle Summary</h3>
                <div className="space-y-3">
                  {pfi.lineItems?.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.brand} {item.model}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-lg text-gray-900">{formatCurrency(item.amount)}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Unit Price: {formatCurrency(item.discountedPrice || item.unitPrice)}</p>
                        <p className="text-xs mt-1">{item.warranty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(pfi.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (7.5%):</span>
                    <span className="font-medium">{formatCurrency(pfi.vat || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t pt-2 text-red-600">
                    <span>Total:</span>
                    <span>{formatCurrency(pfi.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 