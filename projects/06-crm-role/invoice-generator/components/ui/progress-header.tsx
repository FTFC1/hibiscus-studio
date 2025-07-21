"use client"
import { Button } from "@/components/ui/button"
import { Eye, ArrowLeft, Download, Save, Zap } from "lucide-react"

interface ProgressHeaderProps {
  progress: number
  onPreview: () => void
  title: string
  onBack?: () => void
  onSave?: () => void
  onDownload?: () => void
  onDemo?: () => void
  onLogoClick?: () => void
  showBackButton?: boolean
  showSaveButton?: boolean
  showDownloadButton?: boolean
  showDemoButton?: boolean
  showPreviewButton?: boolean
}

export function ProgressHeader({
  progress,
  onPreview,
  title,
  onBack,
  onSave,
  onDownload,
  onDemo,
  onLogoClick,
  showBackButton = false,
  showSaveButton = false,
  showDownloadButton = false,
  showDemoButton = false,
  showPreviewButton = true,
}: ProgressHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Top Row - Back button and Logo/Title */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {showBackButton && onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 transition-colors p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <button
              onClick={onLogoClick}
              className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex-shrink-0"
            >
              <span className="text-white font-bold text-sm">M</span>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">{title}</h1>
              <p className="text-xs text-gray-500 font-medium truncate">Mikano Motors PFI System</p>
            </div>
          </div>

          {/* Primary Action - Preview Button */}
          {showPreviewButton && (
            <Button
              onClick={onPreview}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm transition-all duration-200 hover:shadow-md flex-shrink-0"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          )}
        </div>

        {/* Second Row - Action Buttons (if any) */}
        {(showDemoButton || showSaveButton || showDownloadButton) && (
          <div className="flex items-center gap-2 px-4 pb-3">
            {showDemoButton && onDemo && (
              <Button
                onClick={onDemo}
                variant="outline"
                size="sm"
                className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-700 font-medium flex-1"
              >
                <Zap className="w-4 h-4 mr-1" />
                Demo
              </Button>
            )}

            {showSaveButton && onSave && (
              <Button
                onClick={onSave}
                variant="outline"
                size="sm"
                className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors bg-transparent flex-1"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            )}

            {showDownloadButton && onDownload && (
              <Button
                onClick={onDownload}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors bg-transparent flex-1"
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
              </Button>
            )}
          </div>
        )}

        {/* Progress Indicator - Only show if there's actual progress */}
        {progress > 0 && (
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Form Progress</span>
              <span className="text-xs font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
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
                <button
                  onClick={onLogoClick}
                  className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <span className="text-white font-bold text-sm">M</span>
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
                  <p className="text-xs text-gray-500 font-medium">Mikano Motors PFI System</p>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              {/* Progress Indicator - Only show if there's actual progress */}
              {progress > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 min-w-[3rem]">{Math.round(progress)}%</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {showDemoButton && onDemo && (
                  <Button
                    onClick={onDemo}
                    variant="outline"
                    size="sm"
                    className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-700 font-medium"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                )}

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
        </div>
      </div>

      {/* Single Progress Bar at bottom - Only show if there's actual progress */}
      {progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
