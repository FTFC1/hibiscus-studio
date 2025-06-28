"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "empty",
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Generate a placeholder URL if none is provided
  const placeholderUrl = blurDataURL || `/placeholder.svg?height=${height}&width=${width}`

  // Reset error state if src changes
  useEffect(() => {
    setError(false)
  }, [src])

  return (
    <div className={`relative ${className || ""}`} style={{ width, height }}>
      <Image
        src={error ? placeholderUrl : src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={placeholderUrl}
      />

      {!isLoaded && !error && <div className="absolute inset-0 bg-muted animate-pulse" style={{ width, height }} />}
    </div>
  )
}
