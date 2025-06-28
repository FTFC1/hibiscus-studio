"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Trim {
  id: number
  name: string
  features?: string
}

interface TrimSelectorProps {
  modelId: number | null
  trimId: number | null
  trims: Trim[]
  onChange: (trimId: number) => void
  error?: string
  disabled?: boolean
}

export function TrimSelector({ modelId, trimId, trims, onChange, error, disabled = false }: TrimSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="trim">Trim</Label>
      <Select
        disabled={disabled || !modelId || trims.length === 0}
        value={trimId?.toString() || ""}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger id="trim" className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={trims.length === 0 ? "Select a model first" : "Select a trim"} />
        </SelectTrigger>
        <SelectContent>
          {trims.map((trim) => (
            <SelectItem key={trim.id} value={trim.id.toString()}>
              {trim.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      {trimId && trims.find((t) => t.id === trimId)?.features && (
        <p className="text-xs text-muted-foreground mt-1">{trims.find((t) => t.id === trimId)?.features}</p>
      )}
    </div>
  )
}
