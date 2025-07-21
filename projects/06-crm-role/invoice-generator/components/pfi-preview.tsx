"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { PFI } from "@/lib/types"
import { format } from "date-fns"
import { ProgressHeader } from "@/components/progress-header"

interface PFIPreviewProps {
  pfi: PFI
  onBack: () => void
  onEdit: (pfi: PFI) => void
  onDownloadPDF: (pfi: PFI) => void
  isEmbedded?: boolean
}

export function PFIPreview({ pfi, onBack, onEdit, onDownloadPDF, isEmbedded = false }: PFIPreviewProps) {
  return (
    <div className={isEmbedded ? "h-full bg-gray-50" : "min-h-screen bg-gray-50"}>
      {!isEmbedded && (
        <ProgressHeader
          progress={0}
          onPreview={() => onEdit(pfi)}
          title="PFI Preview"
          showBackButton={true}
          showDownloadButton={true}
          onBack={onBack}
          onDownload={() => onDownloadPDF(pfi)}
        />
      )}
      
      {isEmbedded && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm lg:hidden">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-700 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">PFI Preview</h1>
                <p className="text-xs text-gray-500">Mikano Motors PFI System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Back
              </Button>
              <Button
                onClick={() => onDownloadPDF(pfi)}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={`${isEmbedded ? 'p-2 sm:p-4' : 'max-w-4xl mx-auto p-3 sm:p-6 pt-8'}`}>
        <Card className="print:shadow-none overflow-hidden" id="invoice-print">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <img src="/images/mkheaderpfi.png" alt="Mikano Motors Header" className="w-full h-auto" />
            </div>

            {/* Invoice Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-red-600 mb-2">PROFORMA INVOICE</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Invoice No:</strong> {pfi.invoiceNumber}
                </div>
                <div>
                  <strong>Date:</strong> {format(pfi.invoiceDate, "dd/MM/yyyy")}
                </div>
                <div>
                  <strong>Valid Until:</strong> {format(pfi.validUntil, "dd/MM/yyyy")}
                </div>
                <div>
                  <strong>Type:</strong> {pfi.invoiceType}
                </div>
              </div>
            </div>

            {/* Customer & Sales Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-red-600 mb-2">BILL TO:</h3>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>{pfi.customerName}</strong>
                  </div>
                  <div>{pfi.customerAddress}</div>
                  <div>Phone: {pfi.customerPhone}</div>
                  <div>Email: {pfi.customerEmail}</div>
                  {pfi.customerContact && <div>Contact: {pfi.customerContact}</div>}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-red-600 mb-2">SALES INFORMATION:</h3>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Sales Executive:</strong> {pfi.salesExecutive}
                  </div>
                  <div>
                    <strong>Contact:</strong> {pfi.contactNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="border border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">S/N</th>
                    <th className="border border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Description</th>
                    <th className="border border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Warranty</th>
                    <th className="border border-gray-300 p-1 sm:p-2 text-center text-xs sm:text-sm">Qty</th>
                    <th className="border border-gray-300 p-1 sm:p-2 text-right text-xs sm:text-sm">Unit Price</th>
                    <th className="border border-gray-300 p-1 sm:p-2 text-right text-xs sm:text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {pfi.lineItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{index + 1}</td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{item.description}</td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-xs">{item.warranty}</td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-center text-xs sm:text-sm">{item.quantity}</td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-right text-xs sm:text-sm">
                        {formatCurrency(item.discountedPrice || item.unitPrice)}
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-right font-bold text-xs sm:text-sm">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}

                  {/* Additional Services */}
                  {pfi.registration && (
                    <tr>
                      <td className="border border-gray-300 p-2">{pfi.lineItems.length + 1}</td>
                      <td className="border border-gray-300 p-2">Registration - {pfi.registration.type}</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2 text-center">1</td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(pfi.registration.cost)}</td>
                      <td className="border border-gray-300 p-2 text-right font-bold">
                        {formatCurrency(pfi.registration.cost)}
                      </td>
                    </tr>
                  )}

                  {pfi.insurance && (
                    <tr>
                      <td className="border border-gray-300 p-2">
                        {pfi.lineItems.length + (pfi.registration ? 2 : 1)}
                      </td>
                      <td className="border border-gray-300 p-2">Insurance - {pfi.insurance.type}</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2 text-center">1</td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(pfi.insurance.cost)}</td>
                      <td className="border border-gray-300 p-2 text-right font-bold">
                        {formatCurrency(pfi.insurance.cost)}
                      </td>
                    </tr>
                  )}

                  {pfi.serviceOilChange && (
                    <tr>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">{pfi.serviceOilChange.type}</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2 text-center">{pfi.serviceOilChange.quantity}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatCurrency(pfi.serviceOilChange.cost)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right font-bold">
                        {formatCurrency(pfi.serviceOilChange.cost * pfi.serviceOilChange.quantity)}
                      </td>
                    </tr>
                  )}

                  {pfi.transportCost && (
                    <tr>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">Transport Cost</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2 text-center">1</td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(pfi.transportCost)}</td>
                      <td className="border border-gray-300 p-2 text-right font-bold">
                        {formatCurrency(pfi.transportCost)}
                      </td>
                    </tr>
                  )}

                  {pfi.registrationCost && (
                    <tr>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">Registration Cost</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2 text-center">1</td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(pfi.registrationCost)}</td>
                      <td className="border border-gray-300 p-2 text-right font-bold">
                        {formatCurrency(pfi.registrationCost)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span className="font-bold">{formatCurrency(pfi.subtotal)}</span>
                </div>
                {pfi.vat > 0 && (
                  <div className="flex justify-between py-1">
                    <span>VAT (7.5%):</span>
                    <span className="font-bold">{formatCurrency(pfi.vat)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-300 text-lg font-bold text-red-600">
                  <span>Total:</span>
                  <span>{formatCurrency(pfi.total)}</span>
                </div>
                <div className="text-sm mt-2">
                  <strong>Amount in Words:</strong>
                  <br />
                  {pfi.amountInWords}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8">
              <h3 className="font-bold text-red-600 mb-2">PAYMENT INFORMATION:</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Bank:</strong> {pfi.bank}
                </div>
                <div>
                  <strong>Account Name:</strong> {pfi.accountName}
                </div>
                <div>
                  <strong>Account Number:</strong> {pfi.accountNumber}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-8">
              <h3 className="font-bold text-red-600 mb-2">PAYMENT & DELIVERY TERMS:</h3>
              <p className="text-sm">{pfi.paymentTerms}</p>
            </div>

            {/* Authorization */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="border-t border-gray-300 pt-2 mt-16">
                  <strong>Prepared By:</strong>
                  <br />
                  {pfi.preparedBy}
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-300 pt-2 mt-16">
                  <strong>Approved By:</strong>
                  <br />
                  {pfi.approvedBy}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8">
              <img src="/images/mkfooterpfi.png" alt="Mikano Motors Footer" className="w-full h-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
