"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Model {
  id: number
  name: string
  brand_name: string
}

interface ModelSelectorProps {
  models: Model[]
  modelId: number | null
  onChange: (modelId: number) => void
  error?: string
  disabled?: boolean
}

export function ModelSelector({ models, modelId, onChange, error, disabled = false }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Select disabled={disabled} value={modelId?.toString() || ""} onValueChange={(value) => onChange(Number(value))}>
        <SelectTrigger id="model" className={error ? "border-destructive" : ""}>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id.toString()}>
              {model.brand_name} {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
