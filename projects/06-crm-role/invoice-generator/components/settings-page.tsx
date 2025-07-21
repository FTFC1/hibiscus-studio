"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { salesExecutives } from "@/lib/data"
import { Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProgressHeader } from "@/components/progress-header"

interface SettingsPageProps {
  onBack: () => void
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [executives, setExecutives] = React.useState(salesExecutives)

  const updateExecutive = (index: number, field: "name" | "phone", value: string) => {
    const updated = [...executives]
    updated[index] = { ...updated[index], [field]: value }
    setExecutives(updated)
  }

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem("mikano-sales-executives", JSON.stringify(executives))
    toast({
      title: "Settings Saved",
      description: "Sales executive information has been updated.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressHeader
        progress={0}
        onPreview={() => {}}
        title="Settings"
        showBackButton={true}
        showSaveButton={true}
        onBack={onBack}
        onSave={handleSave}
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6 pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Sales Executives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {executives.map((exec, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={exec.name}
                    onChange={(e) => updateExecutive(index, "name", e.target.value)}
                    placeholder="Executive name"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <PhoneInput
                    value={exec.phone}
                    onChange={(value) => updateExecutive(index, "phone", value)}
                    placeholder="Contact number"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
