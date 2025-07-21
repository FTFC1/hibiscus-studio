"use client"
import { Button } from "@/components/ui/button"
import { Eye, ArrowLeft, Download, Save } from "lucide-react"
import { useEffect, useState } from "react"

interface ProgressHeaderProps {
  progress: number
  onPreview: () => void
  title: string
  onBack?: () => void
  onSave?: () => void
  onDownload?: () => void
  showBackButton?: boolean
  showSaveButton?: boolean
  showDownloadButton?: boolean
  showPreviewButton?: boolean
}

export function ProgressHeader({
  progress,
  onPreview,
  title,
  onBack,
  onSave,
  onDownload,
  showBackButton = false,
  showSaveButton = false,
  showDownloadButton = false,
  showPreviewButton = true,
}: ProgressHeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(currentProgress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section - Logo/Title */}
          <div className="flex items-center gap-4">
            {showBackButton && onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
                <p className="text-xs text-gray-500 font-medium">Mikano Motors PFI System</p>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Form Progress Indicator */}
            {progress > 0 && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 min-w-[3rem]">{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {showSaveButton && onSave && (
                <Button
                  onClick={onSave}
                  variant="outline"
                  size="sm"
                  className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors bg-transparent"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}

              {showDownloadButton && onDownload && (
                <Button
                  onClick={onDownload}
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              )}

              {showPreviewButton && (
              <Button
                onClick={onPreview}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Progress Indicator */}
        {progress > 0 && (
          <div className="md:hidden mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Form Progress</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 min-w-[2.5rem]">{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  )
}
