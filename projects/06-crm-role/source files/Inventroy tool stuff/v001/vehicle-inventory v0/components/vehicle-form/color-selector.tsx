"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Color {
  id: number
  name: string
  hex_code?: string | null
}

interface ColorSelectorProps {
  colors: Color[]
  colorId: number | null
  onChange: (colorId: number) => void
  error?: string
  disabled?: boolean
}

export function ColorSelector({ colors, colorId, onChange, error, disabled = false }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="color">Color</Label>
      <Select disabled={disabled} value={colorId?.toString() || ""} onValueChange={(value) => onChange(Number(value))}>
        <SelectTrigger id="color" className={error ? "border-destructive" : ""}>
          <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent>
          {colors.map((color) => (
            <SelectItem key={color.id} value={color.id.toString()}>
              <div className="flex items-center gap-2">
                {color.hex_code && (
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hex_code }} />
                )}
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
