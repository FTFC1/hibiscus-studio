export interface LineItem {
  id: string
  vehicleType: string
  brand: string
  model: string
  description: string
  warranty: string
  segment: string
  quantity: number
  unitPrice: number
  discountPercentage?: number
  discountedPrice?: number
  amount: number
}

export interface PFI {
  id: string
  invoiceNumber: string
  invoiceDate: Date
  validUntil: Date
  invoiceType: string
  customerName: string
  customerAddress: string
  customerStreet?: string
  customerArea?: string
  customerState?: string
  customerPostcode?: string
  customerPhone: string
  customerEmail: string
  customerContact?: string
  salesExecutive: string
  contactNumber: string
  lineItems: LineItem[]
  registration?: {
    type: string
    cost: number
  }
  insurance?: {
    type: string
    cost: number
  }
  serviceOilChange?: {
    type: string
    cost: number
    quantity: number
  }
  transportCost?: number
  registrationCost?: number
  discount?: number
  subtotal: number
  vat: number
  total: number
  amountInWords: string
  bank: string
  accountName: string
  accountNumber: string
  preparedBy: string
  approvedBy: string
  paymentTerms: string
  internalNotes?: string
  createdAt: Date
  updatedAt: Date
}
