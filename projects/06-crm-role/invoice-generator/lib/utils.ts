import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyInput(value: string): string {
  // Remove all non-digit characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '')
  
  // Handle decimal points
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    // Only allow one decimal point
    parts.splice(2)
  }
  
  // Format the integer part with commas
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  // Combine with decimal part if it exists
  let formattedValue = integerPart
  if (parts.length > 1) {
    // Limit to 2 decimal places
    const decimalPart = parts[1].substring(0, 2)
    formattedValue = `${integerPart}.${decimalPart}`
  }
  
  return formattedValue
}

export function parseCurrencyInput(value: string): number {
  // Remove all non-digit characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '')
  const parsed = parseFloat(numericValue) || 0
  return parsed
}

export function validateMinimumPrice(price: number): boolean {
  const MINIMUM_VEHICLE_PRICE = 30000000 // ₦30,000,000
  return price >= MINIMUM_VEHICLE_PRICE
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-NG").format(num)
}

export function generateInvoiceNumber(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  const serial = String(Math.floor(Math.random() * 100)).padStart(2, "0")
  return `${year}${month}${day}${serial}`
}

export function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  const thousands = ["", "Thousand", "Million", "Billion"]

  if (num === 0) return "Zero"

  function convertHundreds(n: number): string {
    let result = ""

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred "
      n %= 100
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " "
      n %= 10
    } else if (n >= 10) {
      result += teens[n - 10] + " "
      return result
    }

    if (n > 0) {
      result += ones[n] + " "
    }

    return result
  }

  let result = ""
  let thousandIndex = 0

  while (num > 0) {
    if (num % 1000 !== 0) {
      result = convertHundreds(num % 1000) + thousands[thousandIndex] + " " + result
    }
    num = Math.floor(num / 1000)
    thousandIndex++
  }

  return result.trim() + " Naira Only"
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
  return phoneRegex.test(phone)
}

export function getCountryFlag(countryCode: string): string {
  const flags: { [key: string]: string } = {
    NG: "🇳🇬",
    US: "🇺🇸",
    GB: "🇬🇧",
    GH: "🇬🇭",
    KE: "🇰🇪",
    ZA: "🇿🇦",
  }
  return flags[countryCode] || "🌍"
}
