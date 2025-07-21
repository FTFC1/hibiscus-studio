"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const countries = [
  { code: "NG", dialCode: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
  { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PhoneInput({ value, onChange, placeholder = "Phone number", className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = React.useState(countries[0])
  const [phoneNumber, setPhoneNumber] = React.useState("")

  React.useEffect(() => {
    if (value) {
      // Try to parse existing value to extract country and number
      const country = countries.find((c) => value.startsWith(c.dialCode))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.substring(country.dialCode.length))
      } else {
        setPhoneNumber(value)
      }
    }
  }, [value])

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    if (country) {
      setSelectedCountry(country)
      onChange(`${country.dialCode}${phoneNumber}`)
    }
  }

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone)
    onChange(`${selectedCountry.dialCode}${phone}`)
  }

  return (
    <div className={cn("flex", className)}>
      <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[120px] rounded-r-none border-r-0 bg-white">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-gray-900">{selectedCountry.dialCode}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {countries.map((country) => (
            <SelectItem
              key={country.code}
              value={country.code}
              className="flex items-center gap-3 px-3 py-2 text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-lg flex-shrink-0">{country.flag}</span>
                <span className="font-medium text-gray-900 min-w-[3rem]">{country.dialCode}</span>
                <span className="text-sm text-gray-700 truncate">{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-l-none border-l-0 flex-1"
      />
    </div>
  )
}
