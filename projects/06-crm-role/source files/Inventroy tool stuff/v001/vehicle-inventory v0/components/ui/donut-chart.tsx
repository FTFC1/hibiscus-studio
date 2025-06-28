"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface DonutChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
  size?: number
  thickness?: number
  className?: string
  innerLabel?: React.ReactNode
  showLegend?: boolean
  legendPosition?: "bottom" | "right" | "integrated"
}

export function DonutChart({
  data,
  size = 200,
  thickness = 40,
  className,
  innerLabel,
  showLegend = true,
  legendPosition = "bottom",
}: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const total = data.reduce((sum, item) => sum + item.value, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr

    // Scale all drawing operations
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw donut chart
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 2 // Small margin

    let startAngle = -0.5 * Math.PI // Start at top

    data.forEach((item) => {
      const portion = item.value / total
      const endAngle = startAngle + portion * Math.PI * 2

      // Draw segment
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.arc(centerX, centerY, radius - thickness, endAngle, startAngle, true)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      // If using integrated legend, draw labels directly on the chart
      if (legendPosition === "integrated" && portion > 0.08) {
        // Only draw labels for segments that are large enough
        const midAngle = startAngle + (endAngle - startAngle) / 2
        const labelRadius = radius - thickness / 2
        const labelX = centerX + Math.cos(midAngle) * labelRadius * 0.8
        const labelY = centerY + Math.sin(midAngle) * labelRadius * 0.8

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(item.value.toString(), labelX, labelY)
      }

      startAngle = endAngle
    })

    // Draw inner circle for label background if innerLabel is provided
    if (innerLabel) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius - thickness - 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)" // Dark background for the label
      ctx.fill()
    }
  }, [data, size, thickness, innerLabel, legendPosition])

  if (!showLegend) {
    return (
      <div className={cn("flex justify-center w-full", className)}>
        <div className="relative">
          <canvas
            ref={canvasRef}
            style={{
              width: size,
              height: size,
            }}
            className="max-w-full"
          />
          {innerLabel && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">{innerLabel}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="relative flex justify-center w-full mb-6">
        <canvas
          ref={canvasRef}
          style={{
            width: size,
            height: size,
          }}
          className="max-w-full"
        />

        {innerLabel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">{innerLabel}</div>
        )}
      </div>

      {showLegend && legendPosition !== "integrated" && (
        <div className={cn("grid gap-3 w-full", legendPosition === "bottom" ? "grid-cols-2" : "grid-cols-1")}>
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-semibold">{item.value}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({Math.round((item.value / total) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
