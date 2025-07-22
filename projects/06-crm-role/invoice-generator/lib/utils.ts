import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  // Safety check for undefined, null, or NaN values
  if (amount == null || isNaN(amount)) {
    return "₦0.00"
  }
  
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

// Enhanced email validation with multiple criteria
export function validateEmail(email: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!email) {
    return { isValid: false, errors: ["Email is required"] }
  }
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.push("Invalid email format")
  }
  
  // Check for common issues
  if (email.includes("..")) {
    errors.push("Email cannot contain consecutive dots")
  }
  
  if (email.startsWith(".") || email.endsWith(".")) {
    errors.push("Email cannot start or end with a dot")
  }
  
  if (email.length > 254) {
    errors.push("Email address is too long")
  }
  
  const [localPart, domain] = email.split("@")
  if (localPart && localPart.length > 64) {
    errors.push("Email username is too long")
  }
  
  return { isValid: errors.length === 0, errors }
}

// Enhanced phone validation for Nigerian numbers
export function validatePhone(phone: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!phone) {
    return { isValid: false, errors: ["Phone number is required"] }
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '')
  
  // Check length
  if (digitsOnly.length < 10) {
    errors.push("Phone number is too short")
  } else if (digitsOnly.length > 14) {
    errors.push("Phone number is too long")
  }
  
  // Nigerian phone patterns
  const nigerianMobileRegex = /^(\+234|234|0)([789]\d{9})$/
  const cleanPhone = phone.replace(/[\s\-$$$$]/g, '')
  
  if (!nigerianMobileRegex.test(digitsOnly) && !cleanPhone.startsWith('+')) {
    errors.push("Invalid Nigerian phone number format")
  }
  
  return { isValid: errors.length === 0, errors }
}

// Backward compatibility - simple boolean versions
export function isValidEmail(email: string): boolean {
  return validateEmail(email).isValid
}

export function isValidPhone(phone: string): boolean {
  return validatePhone(phone).isValid
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
