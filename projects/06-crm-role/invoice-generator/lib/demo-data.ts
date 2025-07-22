import { addDays } from "./utils"
import type { PFI } from "./types"

export const demoData: Partial<PFI> = {
  id: "demo-pfi-001",
  invoiceNumber: "20241217001",
  invoiceDate: new Date(),
  validUntil: addDays(new Date(), 30),
  invoiceType: "Standard",
  customerName: "Metro Transportation Authority",
  customerAddress: "125 Park Avenue, Manhattan, New York, 10017",
  customerStreet: "125 Park Avenue",
  customerArea: "Manhattan",
  customerState: "New York",
  customerPostcode: "10017",
  customerPhone: "+1 (555) 123-4567",
  customerEmail: "procurement@mta.info",
  customerContact: "Ms. Sarah Johnson",
  salesExecutive: "Cynthia",
  contactNumber: "+234 803 123 4567",
  lineItems: [
    {
      id: "demo-1",
      vehicleType: "PASSENGER",
      brand: "CHANGAN",
      model: "CS35 PLUS LUXURY",
      description: "CHANGAN CS35 PLUS LUXURY",
      warranty: "6 YEARS / 200,000KM WHICHEVER COMES FIRST",
      segment: "SUV - B",
      quantity: 5,
      unitPrice: 30000000,
      discountedPrice: 29500000,
      amount: 147500000,
    },
    {
      id: "demo-2",
      vehicleType: "PASSENGER",
      brand: "CHANGAN",
      model: "EADO PLUS LUXURY",
      description: "CHANGAN EADO PLUS LUXURY",
      warranty: "6 YEARS / 200,000KM WHICHEVER COMES FIRST",
      segment: "SEDAN - C",
      quantity: 3,
      unitPrice: 32000000,
      discountedPrice: 31000000,
      amount: 93000000,
    },
    {
      id: "demo-3",
      vehicleType: "PASSENGER",
      brand: "MAXUS",
      model: "D60 EXECUTIVE",
      description: "MAXUS D60 EXECUTIVE",
      warranty: "5 YEARS / 130,000KM WHICHEVER COMES FIRST",
      segment: "SUV - C",
      quantity: 2,
      unitPrice: 35000000,
      discountedPrice: 33500000,
      amount: 67000000,
    },
  ],
  registration: {
    type: "Commercial Vehicle",
    cost: 500000,
  },
  insurance: {
    type: "Comprehensive",
    cost: 11627906.98,
  },
  serviceOilChange: {
    type: "2 Years Oil Change (6)",
    cost: 65100,
    quantity: 6,
  },
  transportCost: 2500000,
  registrationCost: 750000,
  bank: "GTB",
  accountName: "MIKANO INTERNATIONAL LTD",
  accountNumber: "0800046902",
  preparedBy: "Management",
  approvedBy: "JOELLE HAYAK",
  paymentTerms:
    "Payment to be made within 30 days of invoice date. Delivery upon full payment confirmation. All vehicles to be delivered to customer's designated location in Lagos State.",
}

export const demoCustomers = [
  {
    name: "Lagos State Transport Corporation",
    address: "Plot 15, Alausa Secretariat Road, Ikeja, Lagos State, Nigeria",
    phone: "+234 803 456 7890",
    email: "procurement@lagostransport.gov.ng",
    contact: "Mr. Adebayo Johnson",
  },
  {
    name: "Federal Road Safety Corps",
    address: "FRSC National Headquarters, Jabi, Abuja, FCT, Nigeria",
    phone: "+234 807 234 5678",
    email: "procurement@frsc.gov.ng",
    contact: "Mrs. Fatima Abdullahi",
  },
  {
    name: "Nigerian Police Force",
    address: "Force Headquarters, Louis Edet House, Abuja, FCT, Nigeria",
    phone: "+234 809 876 5432",
    email: "logistics@npf.gov.ng",
    contact: "ACP Michael Okafor",
  },
  {
    name: "Dangote Group",
    address: "1 Alfred Rewane Road, Ikoyi, Lagos State, Nigeria",
    phone: "+234 801 234 5678",
    email: "fleet@dangote.com",
    contact: "Mr. Ibrahim Suleiman",
  },
  {
    name: "MTN Nigeria Communications",
    address: "Churchgate Tower, 30 Afribank Street, Victoria Island, Lagos",
    phone: "+234 805 123 4567",
    email: "procurement@mtn.ng",
    contact: "Ms. Chioma Okwu",
  },
]

export const demoVehicleConfigurations = [
  {
    name: "Government Fleet Package",
    items: [
      {
        brand: "CHANGAN",
        model: "CS35 PLUS LUXURY",
        quantity: 10,
        unitPrice: 22000000,
        discountedPrice: 20500000,
      },
      {
        brand: "CHANGAN",
        model: "EADO PLUS LUXURY",
        quantity: 5,
        unitPrice: 18500000,
        discountedPrice: 17800000,
      },
    ],
  },
  {
    name: "Corporate Executive Package",
    items: [
      {
        brand: "MAXUS",
        model: "D90 MAX EXECUTIVE PRO",
        quantity: 3,
        unitPrice: 35000000,
        discountedPrice: 33000000,
      },
      {
        brand: "GWM",
        model: "TANK500 PRESTIGE",
        quantity: 2,
        unitPrice: 45000000,
        discountedPrice: 42000000,
      },
    ],
  },
  {
    name: "Commercial Transport Package",
    items: [
      {
        brand: "CHANGAN",
        model: "STAR 5 8 SEATER",
        quantity: 8,
        unitPrice: 15000000,
        discountedPrice: 14200000,
      },
      {
        brand: "DFAC",
        model: "CAPTAIN W 12+2 PASSENGER VAN - PETROL",
        quantity: 4,
        unitPrice: 12000000,
        discountedPrice: 11500000,
      },
    ],
  },
]
