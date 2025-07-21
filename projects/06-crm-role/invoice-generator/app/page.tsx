"use client"

import * as React from "react"
import { PFIForm } from "@/components/pfi-form"
import { PFIPreview } from "@/components/pfi-preview"
import { PFIDashboard } from "@/components/pfi-dashboard"
import { generatePDF } from "@/lib/pdf-generator"
import type { PFI } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

type View = "dashboard" | "form" | "preview" | "form-preview" | "settings"

export default function Home() {
  const [view, setView] = React.useState<View>("dashboard")
  const [pfis, setPfis] = React.useState<PFI[]>([])
  const [selectedPfi, setSelectedPfi] = React.useState<PFI | undefined>()
  const [appLoading, setAppLoading] = React.useState(false)

  const handleSavePfi = async (pfiData: PFI) => {
    setAppLoading(true)
    try {
      // For now, just add to local state
      if (pfiData.id) {
        setPfis(prev => prev.map(p => p.id === pfiData.id ? pfiData : p))
      } else {
        const newPfi = { ...pfiData, id: Date.now().toString() }
        setPfis(prev => [...prev, newPfi])
      }
      toast({ title: "Success", description: `PFI ${pfiData.id ? "updated" : "saved"} successfully!` })
      setView("dashboard")
    } catch (error) {
      toast({ title: "Error", description: "Failed to save PFI.", variant: "destructive" })
    } finally {
      setAppLoading(false)
    }
  }

  const handleDeletePfi = async (pfiId: string) => {
    if (!confirm("Are you sure you want to delete this PFI?")) return
    setAppLoading(true)
    try {
      setPfis(prev => prev.filter(p => p.id !== pfiId))
        toast({ title: "Success", description: "PFI deleted successfully." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete PFI.", variant: "destructive" })
    } finally {
      setAppLoading(false)
    }
  }

  const handleCreateNew = () => {
    setSelectedPfi(undefined)
    setView("form")
  }
  
  const handleEdit = (pfi: PFI) => {
    setSelectedPfi(pfi)
    setView("form")
  }
  
  const handleView = (pfi: PFI) => {
    setSelectedPfi(pfi)
    setView("preview")
  }
  
  const handleBackToDashboard = () => setView("dashboard")

  if (appLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="mt-2 text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  const renderView = () => {
    const currentPfi = selectedPfi
    switch (view) {
      case "dashboard":
        return (
          <PFIDashboard
            pfis={pfis}
            onCreateNew={handleCreateNew}
            onView={handleView}
            onEdit={handleEdit}
            onDownloadPDF={generatePDF}
            onSettings={() => setView("settings")}
            onDelete={handleDeletePfi}
          />
        )
      case "form":
        return (
          <PFIForm 
            pfi={selectedPfi} 
            onSave={handleSavePfi} 
            onPreview={(pfi) => {
              setSelectedPfi(pfi)
              setView("form-preview")
            }} 
            onBack={handleBackToDashboard} 
          />
        )
      case "form-preview":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="flex flex-col lg:flex-row">
              {/* Form Section - Left Side */}
              <div className="lg:w-1/2 lg:max-h-screen lg:overflow-y-auto">
                <PFIForm 
                  pfi={selectedPfi} 
                  onSave={handleSavePfi} 
                  onPreview={(pfi) => setSelectedPfi(pfi)} 
                  onBack={handleBackToDashboard}
                  isPreviewMode={true}
                />
              </div>
              {/* Preview Section - Right Side */}
              <div className="lg:w-1/2 lg:max-h-screen lg:overflow-y-auto lg:border-l lg:border-gray-200">
                {currentPfi && (
                  <PFIPreview
                    pfi={currentPfi}
                    onBack={() => setView("form")}
                    onEdit={handleEdit}
                    onDownloadPDF={generatePDF}
                    isEmbedded={true}
                  />
                )}
              </div>
            </div>
          </div>
        )
      case "preview":
        return (
          currentPfi && (
            <PFIPreview
              pfi={currentPfi}
              onBack={handleBackToDashboard}
              onEdit={handleEdit}
              onDownloadPDF={generatePDF}
            />
          )
        )
      case "settings":
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <button onClick={handleBackToDashboard} className="text-red-600 hover:text-red-700 mb-4">
                  ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            </div>
          </div>
        )
      default:
        return <div>Invalid view</div>
    }
  }

  return <div className="min-h-screen bg-gray-50">{renderView()}</div>
}
