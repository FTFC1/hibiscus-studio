"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, X, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"

interface DemoNotificationProps {
  onClear: () => void
  onDismiss: () => void
}

export function DemoNotification({ onClear, onDismiss }: DemoNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // Allow fade-out animation before calling parent dismiss
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className={`fixed top-24 right-6 z-50 max-w-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <Alert className="border-gray-200 bg-white/80 backdrop-blur-md shadow-lg">
        <Info className="h-4 w-4 text-gray-600" />
        <AlertDescription className="text-gray-700 pr-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium mb-1 text-gray-800">Demo Mode</p>
              <p className="text-sm text-gray-600">
                The form is filled with sample data. You can clear it to start over.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={onClear}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Clear Demo
                </Button>
              </div>
            </div>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-200 absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
