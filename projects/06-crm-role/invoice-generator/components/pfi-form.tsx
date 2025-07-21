"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { PhoneInput } from "@/components/ui/phone-input"
import { ProgressHeader } from "@/components/ui/progress-header"
import { DemoNotification } from "@/components/demo-notification"
import {
  vehicleData,
  banks,
  salesExecutives,
  invoiceTypes,
  registrationTypes,
  insuranceTypes,
  oilChangeServices,
  preparedByOptions,
  approvedByOptions,
} from "@/lib/data"
import { demoData } from "@/lib/demo-data"
import { formatCurrency, formatCurrencyInput, parseCurrencyInput, validateMinimumPrice, generateInvoiceNumber, numberToWords, addDays, validateEmail } from "@/lib/utils"
import type { LineItem, PFI } from "@/lib/types"
import { Plus, Trash2, Mail, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PFIFormProps {
  pfi?: PFI
  onSave: (pfi: PFI) => void
  onPreview: (pfi: PFI) => void
  onBack: () => void
  isPreviewMode?: boolean
}

// Validation state interface
interface ValidationErrors {
  customerName?: string
  customerAddress?: string
  customerPhone?: string
  customerEmail?: string
  salesExecutive?: string
  contactNumber?: string
  preparedBy?: string
  approvedBy?: string
  bank?: string
  accountName?: string
  accountNumber?: string
  lineItems?: { [key: number]: { brand?: string; model?: string; unitPrice?: string; quantity?: string } }
}

// Enhanced progress calculation based on form completion
const calculateProgress = (formData: Partial<PFI>) => {
  let formCompleted = 0
  const totalSections = 12 // Total sections to complete

  // Form completion checks - more granular
  if (formData.invoiceNumber && formData.invoiceDate && formData.validUntil && formData.invoiceType) formCompleted++
  if (formData.customerName && formData.customerAddress) formCompleted++
  if (formData.customerPhone && formData.customerEmail) formCompleted++
  if (formData.salesExecutive && formData.contactNumber) formCompleted++
  if (formData.lineItems && formData.lineItems.length > 0 && formData.lineItems[0].brand) formCompleted++
  if (formData.lineItems && formData.lineItems.some((item) => item.unitPrice > 0)) formCompleted++
  if (formData.lineItems && formData.lineItems.some((item) => item.quantity > 0)) formCompleted++
  if (formData.bank && formData.accountName && formData.accountNumber) formCompleted++
  if (formData.preparedBy && formData.approvedBy) formCompleted++
  if (formData.registration || formData.insurance || formData.serviceOilChange) formCompleted++
  if (formData.paymentTerms && formData.paymentTerms.length > 50) formCompleted++
  if ((formData.subtotal || 0) > 0 && (formData.total || 0) > 0) formCompleted++

  return Math.round((formCompleted / totalSections) * 100)
}

const defaultVehiclePrices: { [key: string]: number } = {
  Toyota: 25000000,
  Nissan: 22000000,
  Honda: 23000000,
  "Mercedes-Benz": 80000000,
  BMW: 75000000,
  Ford: 20000000,
  Chevrolet: 19000000,
  Hyundai: 18000000,
  Kia: 17000000,
}

export function PFIForm({ pfi, onSave, onPreview, onBack, isPreviewMode = false }: PFIFormProps) {
  // Load last used values from localStorage
  const getLastUsedValues = () => {
    if (typeof window !== 'undefined') {
      const lastPreparedBy = localStorage.getItem('lastPreparedBy')
      const lastApprovedBy = localStorage.getItem('lastApprovedBy')
      const lastSalesExecutive = localStorage.getItem('lastSalesExecutive')
      const lastBank = localStorage.getItem('lastBank')
      return {
        preparedBy: lastPreparedBy || "Rita", // Default to Rita
        approvedBy: lastApprovedBy || "Joelle Haykal", // Default to Joelle
        salesExecutive: lastSalesExecutive || "",
        bank: lastBank || "GTB", // Default to GTB
      }
    }
    return {
      preparedBy: "Rita",
      approvedBy: "Joelle Haykal",
      salesExecutive: "",
      bank: "GTB",
    }
  }

  // Save values to localStorage when they change
  const saveToLocalStorage = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  }

  // Enhanced currency input handler that preserves cursor position
  const handleCurrencyInput = (value: string, callback: (amount: number) => void) => {
    const rawValue = parseCurrencyInput(value);
    callback(rawValue);
  }

  // Initialize form data with smart defaults
  const initializeFormData = () => {
    const lastUsed = getLastUsedValues()
    return {
      invoiceNumber: pfi?.invoiceNumber || generateInvoiceNumber(),
      invoiceDate: pfi?.invoiceDate || new Date(),
      validUntil: pfi?.validUntil || addDays(new Date(), 30),
      invoiceType: pfi?.invoiceType || "Standard",
      customerName: pfi?.customerName || "",
      customerAddress: pfi?.customerAddress || "",
      customerPhone: pfi?.customerPhone || "",
      customerEmail: pfi?.customerEmail || "",
      customerContact: pfi?.customerContact || "",
      salesExecutive: pfi?.salesExecutive || lastUsed.salesExecutive,
      contactNumber: pfi?.contactNumber || "",
      lineItems: pfi?.lineItems || [
        {
          id: "1",
          brand: "",
          model: "",
          description: "",
          warranty: "",
          segment: "",
          quantity: 1,
          unitPrice: 30000000, // Default to 30M instead of 0
          discountedPrice: 0,
          amount: 30000000,
        },
      ],
      registration: pfi?.registration,
      insurance: pfi?.insurance,
      serviceOilChange: pfi?.serviceOilChange,
      transportCost: pfi?.transportCost,
      registrationCost: pfi?.registrationCost,
      bank: pfi?.bank || lastUsed.bank, // Smart default bank selection
      accountName: pfi?.accountName || "",
      accountNumber: pfi?.accountNumber || "",
      preparedBy: pfi?.preparedBy || lastUsed.preparedBy,
      approvedBy: pfi?.approvedBy || lastUsed.approvedBy,
      paymentTerms: pfi?.paymentTerms || "Payment to be made within 30 days of invoice date. Delivery upon full payment confirmation.",
      internalNotes: pfi?.internalNotes || "",
      discount: pfi?.discount || 0,
    }
  }

  const [formData, setFormData] = React.useState<Partial<PFI>>(initializeFormData)
  const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({})

  // Auto-populate bank details when bank is selected via smart defaults
  React.useEffect(() => {
    if (formData.bank && (!formData.accountName || !formData.accountNumber)) {
      const bank = banks.find((b) => b.name === formData.bank)
      if (bank) {
        setFormData((prev) => ({
          ...prev,
          accountName: bank.accountName,
          accountNumber: bank.accountNumber,
        }))
      }
    }
  }, [formData.bank])

  // Clear validation error for a specific field
  const clearValidationError = (field: keyof ValidationErrors) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const [showTransport, setShowTransport] = React.useState(!!pfi?.transportCost)
  const [showRegistration, setShowRegistration] = React.useState(!!pfi?.registrationCost)
  const [emailValid, setEmailValid] = React.useState(false)
  const [isDemoMode, setIsDemoMode] = React.useState(false)
  const [showDemoNotification, setShowDemoNotification] = React.useState(false)

  // Remove scroll tracking - using form completion percentage instead

  const brands = [...new Set(vehicleData.map((v) => v.BRAND))].sort()

  const getModelsForBrand = (brand: string) => {
    return vehicleData
      .filter((v) => v.BRAND === brand)
      .map((v) => `${v.MODEL} ${v.TRIM}`)
      .sort()
  }

  const getVehicleDetails = (brand: string, model: string) => {
    const vehicle = vehicleData.find((v) => v.BRAND === brand && `${v.MODEL} ${v.TRIM}` === model)
    return vehicle || null
  }

  // Demo functionality
  const loadDemoData = () => {
    setFormData(demoData)
    setShowTransport(!!demoData.transportCost)
    setShowRegistration(!!demoData.registrationCost)
    setEmailValid(true)
    setIsDemoMode(true)
    // Remove annoying notification - just silent auto-fill
    // setShowDemoNotification(true)

    // Auto-trigger preview for immediate feedback
    onPreview(demoData as PFI)
  }

  // Removed scroll tracking - using form completion percentage instead

  const clearDemoData = () => {
    const lastUsed = getLastUsedValues()
    setFormData({
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date(),
      validUntil: addDays(new Date(), 30),
      invoiceType: "Standard",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerEmail: "",
      customerContact: "",
      salesExecutive: lastUsed.salesExecutive,
      contactNumber: "",
      lineItems: [
        {
          id: "1",
          brand: "",
          model: "",
          description: "",
          warranty: "",
          segment: "",
          quantity: 1,
          unitPrice: 30000000,
          discountedPrice: 0,
          amount: 30000000,
        },
      ],
      registration: undefined,
      insurance: undefined,
      serviceOilChange: undefined,
      transportCost: undefined,
      registrationCost: undefined,
      bank: lastUsed.bank,
      accountName: "",
      accountNumber: "",
      preparedBy: lastUsed.preparedBy,
      approvedBy: lastUsed.approvedBy,
      paymentTerms: "Payment to be made within 30 days of invoice date. Delivery upon full payment confirmation.",
      internalNotes: "",
      discount: 0,
    })
    setShowTransport(false)
    setShowRegistration(false)
    setEmailValid(false)
    setIsDemoMode(false)
    setShowDemoNotification(false)

    toast({
      title: "Demo Data Cleared",
      description: "All fields have been reset to their default values.",
    })
  }

  // Update the sales executive change handler
  const handleSalesExecutiveChange = (executiveName: string) => {
    const executive = salesExecutives.find((exec) => exec.name === executiveName)
    setFormData((prev) => ({
      ...prev,
      salesExecutive: executiveName,
      contactNumber: executive?.phone || "",
    }))
    saveToLocalStorage('lastSalesExecutive', executiveName)
  }

  // Update the brand change handler to set default prices
  const updateLineItem = React.useCallback((index: number, field: keyof LineItem, value: any) => {
    setFormData((prev) => {
      const newLineItems = [...(prev.lineItems || [])]
      newLineItems[index] = { ...newLineItems[index], [field]: value }

      if (field === "brand") {
        newLineItems[index].model = ""
        newLineItems[index].description = ""
        newLineItems[index].warranty = ""
        newLineItems[index].segment = ""
        // Set default price based on brand
        newLineItems[index].unitPrice = defaultVehiclePrices[value] || 30000000
      }

      if (field === "model" && value) {
        const vehicle = getVehicleDetails(newLineItems[index].brand, value)
        if (vehicle) {
          newLineItems[index].description = vehicle.ITEM_DESCRIPTION
          newLineItems[index].warranty = vehicle.WARRANTY
          newLineItems[index].segment = vehicle.SEGMENT
        }
      }

      if (field === "quantity" || field === "unitPrice" || field === "discountedPrice") {
        const quantity = field === "quantity" ? value : newLineItems[index].quantity
        const unitPrice = field === "unitPrice" ? value : newLineItems[index].unitPrice
        const discountedPrice = field === "discountedPrice" ? value : newLineItems[index].discountedPrice

        newLineItems[index].amount = quantity * (discountedPrice || unitPrice)
      }

      return { ...prev, lineItems: newLineItems }
    })
  }, [])

  const addLineItem = () => {
    const newLineItem: LineItem = {
      id: Date.now().toString(),
      brand: "",
      model: "",
      description: "",
      warranty: "",
      segment: "",
      quantity: 1,
      unitPrice: 30000000,
      discountedPrice: 0,
      amount: 30000000,
    }
    setFormData((prev) => ({
      ...prev,
      lineItems: [...(prev.lineItems || []), newLineItem],
    }))
  }

  const removeLineItem = (index: number) => {
    if ((formData.lineItems?.length || 0) > 1) {
      const newLineItems = formData.lineItems?.filter((_, i) => i !== index) || []
      setFormData((prev) => ({ ...prev, lineItems: newLineItems }))
    }
  }

  const calculateTotals = React.useMemo(() => {
    const lineItemsTotal = (formData.lineItems || []).reduce((sum, item) => sum + (item.amount || 0), 0)
    const registrationCost = formData.registration?.cost || 0
    const insuranceCost = formData.insurance?.cost || 0
    const serviceCost = (formData.serviceOilChange?.cost || 0) * (formData.serviceOilChange?.quantity || 0)
    const transportCost = showTransport ? formData.transportCost || 0 : 0
    const regCost = showRegistration ? formData.registrationCost || 0 : 0

    const subtotal = lineItemsTotal + registrationCost + insuranceCost + serviceCost + transportCost + regCost
    const discount = formData.discount || 0
    const afterDiscount = subtotal - discount
    const vatRate = formData.invoiceType === "Standard" ? 0.075 : 0
    const vat = afterDiscount * vatRate
    const total = afterDiscount + vat

    return { subtotal, discount, afterDiscount, vat, total }
  }, [
    formData.lineItems,
    formData.registration?.cost,
    formData.insurance?.cost,
    formData.serviceOilChange?.cost,
    formData.serviceOilChange?.quantity,
    formData.transportCost,
    formData.registrationCost,
    formData.discount,
    formData.invoiceType,
    showTransport,
    showRegistration,
  ])

  const handleBankChange = (bankName: string) => {
    const bank = banks.find((b) => b.name === bankName)
    if (bank) {
      setFormData((prev) => ({
        ...prev,
        bank: bankName,
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
      }))
      saveToLocalStorage('lastBank', bankName)
      // Clear validation errors for bank-related fields
      clearValidationError('bank')
      clearValidationError('accountName')
      clearValidationError('accountNumber')
    }
  }

  const handleEmailChange = React.useCallback((email: string) => {
    setFormData((prev) => ({ ...prev, customerEmail: email }))
    setEmailValid(validateEmail(email))
  }, [])

  const handleSave = () => {
    let hasErrors = false
    const newValidationErrors: ValidationErrors = {}

    if (!formData.customerName) {
      newValidationErrors.customerName = "Customer Name is required."
      hasErrors = true
    }
    if (!formData.customerAddress) {
      newValidationErrors.customerAddress = "Customer Address is required."
      hasErrors = true
    }
    if (!formData.customerPhone) {
      newValidationErrors.customerPhone = "Phone Number is required."
      hasErrors = true
    }
    if (!formData.customerEmail) {
      newValidationErrors.customerEmail = "Email Address is required."
      hasErrors = true
    }
    if (!formData.salesExecutive) {
      newValidationErrors.salesExecutive = "Sales Executive is required."
      hasErrors = true
    }
    if (!formData.contactNumber) {
      newValidationErrors.contactNumber = "Contact Number is required."
      hasErrors = true
    }
    if (!formData.preparedBy) {
      newValidationErrors.preparedBy = "Prepared By is required."
      hasErrors = true
    }
    if (!formData.approvedBy) {
      newValidationErrors.approvedBy = "Approved By is required."
      hasErrors = true
    }
    if (!formData.bank) {
      newValidationErrors.bank = "Bank is required."
      hasErrors = true
    }
    if (!formData.accountName) {
      newValidationErrors.accountName = "Account Name is required."
      hasErrors = true
    }
    if (!formData.accountNumber) {
      newValidationErrors.accountNumber = "Account Number is required."
      hasErrors = true
    }
    if (formData.lineItems && formData.lineItems.length === 0) {
      newValidationErrors.lineItems = { 0: { brand: "At least one vehicle item is required." } }
      hasErrors = true
    }
    if (formData.lineItems && formData.lineItems.some((item) => item.brand === "" || item.model === "")) {
      newValidationErrors.lineItems = { 0: { brand: "Brand and Model are required for each item." } }
      hasErrors = true
    }
    if (formData.lineItems && formData.lineItems.some((item) => item.unitPrice < 30000000)) {
      newValidationErrors.lineItems = { 0: { unitPrice: "Unit price must be at least ₦30,000,000.00." } }
      hasErrors = true
    }
    if (formData.lineItems && formData.lineItems.some((item) => item.quantity < 1)) {
      newValidationErrors.lineItems = { 0: { quantity: "Quantity must be at least 1." } }
      hasErrors = true
    }

    setValidationErrors(newValidationErrors)

    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and correct any errors.",
        variant: "destructive",
      })
      return
    }

    const pfiData: PFI = {
      id: pfi?.id || Date.now().toString(),
      ...formData,
      subtotal: calculateTotals.subtotal,
      vat: calculateTotals.vat,
      total: calculateTotals.total,
      amountInWords: numberToWords(calculateTotals.total),
      createdAt: pfi?.createdAt || new Date(),
      updatedAt: new Date(),
    } as PFI

    onSave(pfiData)
    toast({
      title: "Success",
      description: "PFI saved successfully!",
    })
  }

  const handlePreview = () => {
    const pfiData: PFI = {
      id: pfi?.id || Date.now().toString(),
      ...formData,
      subtotal: calculateTotals.subtotal,
      vat: calculateTotals.vat,
      total: calculateTotals.total,
      amountInWords: numberToWords(calculateTotals.total),
      createdAt: pfi?.createdAt || new Date(),
      updatedAt: new Date(),
    } as PFI

    onPreview(pfiData)
  }

  // Get demo styling classes
  const getDemoInputClasses = (baseClasses: string) => {
    return isDemoMode ? `${baseClasses} bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200` : baseClasses
  }

  // Replace the return statement to include ProgressHeader and better styling
  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressHeader
        progress={calculateProgress(formData)}
        onPreview={handlePreview}
        title="Create PFI"
        showBackButton={true}
        showSaveButton={true}
        showDemoButton={true}
        onBack={onBack}
        onSave={handleSave}
        onDemo={loadDemoData}
        onLogoClick={onBack}
      />

      {/* Removed annoying demo notification that won't dismiss */}

      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-20 sm:pb-24 max-w-4xl mx-auto">
        {/* Invoice Details - Enhanced Visual Hierarchy */}
        <Card className="shadow-sm border-0 ring-1 ring-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4">
            <CardTitle className="text-slate-800 text-xl font-semibold tracking-tight">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
                <Label htmlFor="invoiceNumber" className="text-sm font-semibold text-slate-700 mb-2 block">
                Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                placeholder="Auto-generated"
                  className={`${getDemoInputClasses("")} h-11 text-base`}
              />
            </div>

            <div>
                <Label htmlFor="invoiceType" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Invoice Type
                </Label>
                <Select
                  value={formData.invoiceType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, invoiceType: value }))}
                >
                  <SelectTrigger className={`${getDemoInputClasses("")} h-11 text-base`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="invoiceDate" className="text-sm font-semibold text-slate-700 mb-2 block">
                Invoice Date
              </Label>
                <DatePicker
                  date={formData.invoiceDate}
                  onDateChange={(date) => setFormData((prev) => ({ ...prev, invoiceDate: date }))}
                  className={getDemoInputClasses("")}
                />
            </div>

            <div>
                <Label htmlFor="validUntil" className="text-sm font-semibold text-slate-700 mb-2 block">
                Valid Until
              </Label>
                <DatePicker
                  date={formData.validUntil}
                  onDateChange={(date) => setFormData((prev) => ({ ...prev, validUntil: date }))}
                  className={getDemoInputClasses("")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information - Enhanced Visual Hierarchy */}
        <Card className="shadow-sm border-0 ring-1 ring-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4">
            <CardTitle className="text-slate-800 text-xl font-semibold tracking-tight">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="customerName" className="text-sm font-semibold text-slate-700 mb-2 block">
                Customer Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                    if (e.target.value) clearValidationError('customerName')
                  }}
                  placeholder="Enter customer name"
                  className={`${getDemoInputClasses("")} h-11 text-base ${validationErrors.customerName ? 'border-red-300 bg-red-50' : ''}`}
              />
              {validationErrors.customerName && (
                <p className="text-xs text-red-600 mt-1">
                  <AlertCircle className="inline-block mr-1" /> {validationErrors.customerName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="customerAddress" className="text-sm font-semibold text-slate-700 mb-2 block">
                Customer Address <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="customerAddress"
                value={formData.customerAddress}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, customerAddress: e.target.value }))
                    if (e.target.value) clearValidationError('customerAddress')
                  }}
                  placeholder="Enter complete address"
                  className={`${getDemoInputClasses("")} min-h-[80px] text-base resize-none ${validationErrors.customerAddress ? 'border-red-300 bg-red-50' : ''}`}
                rows={3}
              />
              {validationErrors.customerAddress && (
                <p className="text-xs text-red-600 mt-1">
                  <AlertCircle className="inline-block mr-1" /> {validationErrors.customerAddress}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
                <Label htmlFor="customerPhone" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Phone Number <span className="text-red-600">*</span>
              </Label>
                <PhoneInput
                  value={formData.customerPhone || ""}
                  onChange={(value) => setFormData((prev) => ({ ...prev, customerPhone: value }))}
                  placeholder="Enter phone number"
                  className={getDemoInputClasses("")}
                />
                {validationErrors.customerPhone && (
                  <p className="text-xs text-red-600 mt-1">
                    <AlertCircle className="inline-block mr-1" /> {validationErrors.customerPhone}
                  </p>
                )}
            </div>

            <div>
                <Label htmlFor="customerEmail" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Email Address <span className="text-red-600">*</span>
              </Label>
                <div className="relative">
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="Enter email address"
                      className={`${getDemoInputClasses("")} h-11 text-base pr-10`}
                />
                  {emailValid && (
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                  )}
                  {validationErrors.customerEmail && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-600" />
                )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Information - Enhanced Visual Hierarchy */}
        <Card className="shadow-sm border-0 ring-1 ring-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4">
            <CardTitle className="text-slate-800 text-xl font-semibold tracking-tight">Sales Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
                <Label htmlFor="salesExecutive" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Sales Executive <span className="text-red-600">*</span>
              </Label>
              <Select value={formData.salesExecutive} onValueChange={handleSalesExecutiveChange}>
                  <SelectTrigger className={`${getDemoInputClasses("")} h-11 text-base`}>
                  <SelectValue placeholder="Select sales executive" />
                </SelectTrigger>
                <SelectContent>
                  {salesExecutives.map((exec) => (
                    <SelectItem key={exec.name} value={exec.name}>
                      {exec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                {validationErrors.salesExecutive && (
                  <p className="text-xs text-red-600 mt-1">
                    <AlertCircle className="inline-block mr-1" /> {validationErrors.salesExecutive}
                  </p>
                )}
            </div>

            <div>
                <Label htmlFor="contactNumber" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Contact Number <span className="text-red-600">*</span>
              </Label>
                <PhoneInput
                  value={formData.contactNumber || ""}
                  onChange={(value) => setFormData((prev) => ({ ...prev, contactNumber: value }))}
                  placeholder="Sales executive contact"
                  className={getDemoInputClasses("")}
                />
                {validationErrors.contactNumber && (
                  <p className="text-xs text-red-600 mt-1">
                    <AlertCircle className="inline-block mr-1" /> {validationErrors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="preparedBy" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Prepared By <span className="text-red-600">*</span>
                </Label>
                <Select value={formData.preparedBy || ""} onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, preparedBy: value }))
                  saveToLocalStorage('lastPreparedBy', value)
                }}>
                  <SelectTrigger className={`${getDemoInputClasses("")} h-11 text-base`}>
                    <SelectValue placeholder="Select who prepared this PFI" />
                  </SelectTrigger>
                  <SelectContent>
                    {preparedByOptions.map((person) => (
                      <SelectItem key={person} value={person}>
                        {person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.preparedBy && (
                  <p className="text-xs text-red-600 mt-1">
                    <AlertCircle className="inline-block mr-1" /> {validationErrors.preparedBy}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="approvedBy" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Approved By <span className="text-red-600">*</span>
                </Label>
                <Select value={formData.approvedBy || ""} onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, approvedBy: value }))
                  saveToLocalStorage('lastApprovedBy', value)
                }}>
                  <SelectTrigger className={`${getDemoInputClasses("")} h-11 text-base`}>
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedByOptions.map((person) => (
                      <SelectItem key={person} value={person}>
                        {person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.approvedBy && (
                  <p className="text-xs text-red-600 mt-1">
                    <AlertCircle className="inline-block mr-1" /> {validationErrors.approvedBy}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Items - Enhanced Visual Hierarchy & Mobile Responsive */}
        <Card className={`shadow-sm border-0 ring-1 ring-gray-200 ${isDemoMode ? "ring-amber-300" : ""}`}>
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4">
            <CardTitle className="text-slate-800 text-xl font-semibold tracking-tight">Vehicle Items</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {formData.lineItems?.map((item, index) => (
              <div
                key={item.id}
                className={`border rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 ${isDemoMode ? "border-amber-300 bg-gradient-to-r from-amber-50/50 to-orange-50/50" : "border-slate-200 bg-white"} shadow-sm`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h4 className="font-semibold text-lg text-slate-800">Vehicle {index + 1}</h4>
                  {(formData.lineItems?.length || 0) > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeLineItem(index)} className="text-red-600 border-red-200 hover:bg-red-50 self-start sm:self-center">
                      <Trash2 className="w-4 h-4 mr-1 sm:mr-0" />
                      <span className="sm:hidden">Remove Vehicle</span>
                    </Button>
                  )}
                </div>

                {/* Brand & Model - Mobile Stack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Brand Selection */}
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Brand <span className="text-red-600">*</span>
                    </Label>
                    <Select value={item.brand} onValueChange={(value) => updateLineItem(index, "brand", value)}>
                      <SelectTrigger className={`${getDemoInputClasses("")} h-11 text-base`}>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.lineItems?.[index]?.brand && (
                      <p className="text-xs text-red-600 mt-1">
                        <AlertCircle className="inline-block mr-1 w-3 h-3" /> {validationErrors.lineItems[index].brand}
                      </p>
                    )}
                  </div>

                  {/* Model Selection */}
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Model <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={item.model}
                      onValueChange={(value) => updateLineItem(index, "model", value)}
                      disabled={!item.brand}
                    >
                      <SelectTrigger className={`${getDemoInputClasses("")} h-11 text-base ${!item.brand ? 'opacity-50' : ''}`}>
                        <SelectValue placeholder={!item.brand ? "Select brand first" : "Select model"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getModelsForBrand(item.brand).map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.lineItems?.[index]?.model && (
                      <p className="text-xs text-red-600 mt-1">
                        <AlertCircle className="inline-block mr-1 w-3 h-3" /> {validationErrors.lineItems[index].model}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity & Total - Mobile Stack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Quantity <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                      className={`${getDemoInputClasses("")} h-11 text-base text-center`}
                    />
                    {validationErrors.lineItems?.[index]?.quantity && (
                      <p className="text-xs text-red-600 mt-1">
                        <AlertCircle className="inline-block mr-1 w-3 h-3" /> {validationErrors.lineItems[index].quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Total Amount <span className="text-xs text-slate-500 font-normal">(Auto-calculated)</span>
                    </Label>
                    <div className="h-11 px-3 py-2 bg-slate-100 border border-slate-300 rounded-md flex items-center">
                      <span className="text-base font-semibold text-slate-900">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Unit Price - Full Width on Mobile */}
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Unit Price <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={item.unitPrice > 0 ? formatCurrencyInput(item.unitPrice.toString()) : ''}
                      onChange={(e) => {
                        handleCurrencyInput(e.target.value, (rawValue) => updateLineItem(index, "unitPrice", rawValue));
                      }}
                      placeholder="30,000,000.00"
                      className={`${getDemoInputClasses("")} h-11 text-base pl-8 ${
                        item.unitPrice > 0 && !validateMinimumPrice(item.unitPrice) ? 'border-red-300 bg-red-50' : ''
                      }`}
                    />
                    <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium text-base pointer-events-none">₦</span>
                    {item.unitPrice > 0 && !validateMinimumPrice(item.unitPrice) && (
                      <p className="text-xs text-red-600 mt-1">Price must be at least ₦30,000,000.00</p>
                    )}
                    {validationErrors.lineItems?.[index]?.unitPrice && (
                      <p className="text-xs text-red-600 mt-1">
                        <AlertCircle className="inline-block mr-1 w-3 h-3" /> {validationErrors.lineItems[index].unitPrice}
                      </p>
                    )}
                  </div>
                </div>

                {/* Discounted Price - Full Width on Mobile */}
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Discounted Price <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={(item.discountedPrice || 0) > 0 ? formatCurrencyInput((item.discountedPrice || 0).toString()) : ''}
                      onChange={(e) => {
                        handleCurrencyInput(e.target.value, (rawValue) => updateLineItem(index, "discountedPrice", rawValue));
                      }}
                      placeholder="Enter discounted price"
                      className={`${getDemoInputClasses("")} h-11 text-base pl-8`}
                    />
                    <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium text-base pointer-events-none">₦</span>
                  </div>
                </div>

                {/* Description - Read Only */}
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Description <span className="text-xs text-slate-500 font-normal">(Auto-filled)</span>
                  </Label>
                  <Textarea 
                    value={item.description} 
                    readOnly 
                    className="bg-slate-100 border-slate-300 text-sm text-slate-700 cursor-not-allowed" 
                    rows={2} 
                  />
                </div>
              </div>
            ))}

            <Button onClick={addLineItem} variant="outline" className="w-full h-12 bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-medium">
              <Plus className="w-5 h-5 mr-2" />
              Add Another Vehicle
            </Button>
          </CardContent>
        </Card>

        {/* Additional Services - Mobile Optimized */}
        <Card className={`shadow-sm ${isDemoMode ? "border-orange-200" : ""}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Additional Services</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Registration</Label>
              <Select
                value={formData.registration?.type || ""}
                onValueChange={(value) => {
                  const cost = value === "Passenger Vehicle" ? 100000 : 100000
                  setFormData((prev) => ({
                    ...prev,
                    registration: { type: value, cost },
                  }))
                }}
              >
                <SelectTrigger className={`mt-1 ${getDemoInputClasses("")}`}>
                  <SelectValue placeholder="Select registration type" />
                </SelectTrigger>
                <SelectContent>
                  {registrationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Insurance</Label>
              <Select
                value={formData.insurance?.type || ""}
                onValueChange={(value) => {
                  const cost = value === "Comprehensive" ? 11627906.98 : 0
                  setFormData((prev) => ({
                    ...prev,
                    insurance: { type: value, cost },
                  }))
                }}
              >
                <SelectTrigger className={`mt-1 ${getDemoInputClasses("")}`}>
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Service/Oil Change</Label>
              <Select
                value={formData.serviceOilChange?.type || ""}
                onValueChange={(value) => {
                  const quantity = Number.parseInt(value.match(/$$(\d+)$$/)?.[1] || "1")
                  setFormData((prev) => ({
                    ...prev,
                    serviceOilChange: { type: value, cost: 65100, quantity },
                  }))
                }}
              >
                <SelectTrigger className={`mt-1 ${getDemoInputClasses("")}`}>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {oilChangeServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transport Cost */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox id="transport" checked={showTransport} onCheckedChange={(checked) => setShowTransport(checked === true)} />
                <Label htmlFor="transport" className="text-sm font-medium">
                  Transport Cost
                </Label>
              </div>
              {showTransport && (
                <Input
                  type="number"
                  value={formData.transportCost || 100000}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, transportCost: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className={`w-24 ${getDemoInputClasses("")}`}
                  placeholder="Amount"
                />
              )}
            </div>

            {/* Registration Cost */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox id="registration" checked={showRegistration} onCheckedChange={(checked) => setShowRegistration(checked === true)} />
                <Label htmlFor="registration" className="text-sm font-medium">
                  Registration Cost
                </Label>
              </div>
              {showRegistration && (
                <Input
                  type="number"
                  value={formData.registrationCost || 100000}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, registrationCost: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className={`w-24 ${getDemoInputClasses("")}`}
                  placeholder="Amount"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Totals - Enhanced Visual Hierarchy */}
        <Card className="shadow-sm border-0 ring-1 ring-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4">
            <CardTitle className="text-slate-800 text-xl font-semibold tracking-tight">Invoice Totals</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">Subtotal</Label>
              <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md flex items-center">
                <span className="text-base font-medium text-slate-800">{formatCurrency(calculateTotals.subtotal)}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Discount <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </Label>
              <div className="relative">
              <Input
                  type="text"
                  value={(formData.discount || 0) > 0 ? formatCurrencyInput((formData.discount || 0).toString()) : ''}
                  onChange={(e) => {
                    handleCurrencyInput(e.target.value, (rawValue) => setFormData((prev) => ({ ...prev, discount: rawValue })));
                  }}
                  placeholder="0.00"
                  className="h-11 text-base pl-9"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium text-base">₦</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">VAT (7.5%)</Label>
              <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md flex items-center">
                <span className="text-base font-medium text-slate-800">{formatCurrency(calculateTotals.vat)}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">Total Amount</Label>
              <div className="h-12 px-3 py-2 bg-gradient-to-r from-slate-100 to-slate-50 border-2 border-slate-300 rounded-md flex items-center">
                <span className="text-lg font-bold text-slate-900">{formatCurrency(calculateTotals.total)}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Amount in Words</Label>
              <Textarea
                value={numberToWords(calculateTotals.total)}
                readOnly
                className="mt-1 bg-gray-50 text-sm"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Internal Notes - Enhanced Visual Hierarchy */}
        <Card className="shadow-sm border-0 ring-1 ring-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4">
            <CardTitle className="text-slate-800 text-xl font-semibold tracking-tight">Internal Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <Label htmlFor="internalNotes" className="text-sm font-semibold text-slate-700 mb-2 block">
                Notes <span className="text-xs text-slate-500 font-normal">(For internal team communication)</span>
              </Label>
              <Textarea
                id="internalNotes"
                value={formData.internalNotes || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, internalNotes: e.target.value }))}
                placeholder="Add any internal notes, status updates, or team communications..."
                className={`${getDemoInputClasses("")} min-h-[100px] text-base resize-none`}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information - Enhanced Visual Hierarchy */}
        <Card className={`shadow-sm border-0 ring-1 ring-gray-200 ${isDemoMode ? "ring-amber-300" : ""}`}>
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4">
            <CardTitle className="text-slate-800 text-xl font-semibold tracking-tight">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Bank</Label>
              <Select value={formData.bank} onValueChange={handleBankChange}>
                <SelectTrigger className={`mt-1 ${getDemoInputClasses("")}`}>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.name} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.bank && (
                <p className="text-xs text-red-600 mt-1">
                  <AlertCircle className="inline-block mr-1" /> {validationErrors.bank}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Account Name</Label>
              <Input value={formData.accountName} readOnly className="mt-1 bg-gray-50" />
              {validationErrors.accountName && (
                <p className="text-xs text-red-600 mt-1">
                  <AlertCircle className="inline-block mr-1" /> {validationErrors.accountName}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Account Number</Label>
              <Input value={formData.accountNumber} readOnly className="mt-1 bg-gray-50" />
              {validationErrors.accountNumber && (
                <p className="text-xs text-red-600 mt-1">
                  <AlertCircle className="inline-block mr-1" /> {validationErrors.accountNumber}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Terms & Authorization - Mobile Optimized */}
        <Card className={`shadow-sm ${isDemoMode ? "border-orange-200" : ""}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Terms & Authorization</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Prepared By</Label>
              <Select
                value={formData.preparedBy}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, preparedBy: value }))
                  localStorage.setItem('lastPreparedBy', value)
                }}
              >
                <SelectTrigger className={`mt-1 ${getDemoInputClasses("")}`}>
                  <SelectValue placeholder="Select prepared by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rita">Rita</SelectItem>
                  <SelectItem value="Maryam">Maryam</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.preparedBy && (
                <p className="text-xs text-red-600 mt-1">
                  <AlertCircle className="inline-block mr-1" /> {validationErrors.preparedBy}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Approved By</Label>
              <Select
                value={formData.approvedBy}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, approvedBy: value }))
                  localStorage.setItem('lastApprovedBy', value)
                }}
              >
                <SelectTrigger className={`mt-1 ${getDemoInputClasses("")}`}>
                  <SelectValue placeholder="Select approved by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Joelle Haykal">Joelle Haykal</SelectItem>
                  <SelectItem value="Gaurav Kaul">Gaurav Kaul</SelectItem>
                  <SelectItem value="Syam Abdukadir">Syam Abdukadir</SelectItem>
                  <SelectItem value="Omar Karameh">Omar Karameh</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.approvedBy && (
                <p className="text-xs text-red-600 mt-1">
                  <AlertCircle className="inline-block mr-1" /> {validationErrors.approvedBy}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Payment & Delivery Terms</Label>
              <Textarea
                value={formData.paymentTerms}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentTerms: e.target.value }))}
                rows={4}
                className={`mt-1 ${getDemoInputClasses("")}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
