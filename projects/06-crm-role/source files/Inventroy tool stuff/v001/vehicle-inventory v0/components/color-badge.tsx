import { cn } from "@/lib/utils"

type CarColor = string

interface ColorBadgeProps {
  color: CarColor
  size?: "sm" | "md"
  className?: string
}

export function ColorBadge({ color, size = "md", className }: ColorBadgeProps) {
  // Map color names to Tailwind classes
  const colorClasses: Record<string, string> = {
    White: "bg-white border border-gray-200",
    Black: "bg-gray-900",
    Silver: "bg-gray-300",
    Red: "bg-red-500",
    Blue: "bg-blue-500",
    // Add more colors as needed
  }

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
  }

  // Default to a gray color if the color is not in our map
  const colorClass = colorClasses[color] || "bg-gray-400"

  return (
    <div
      className={cn("rounded-full flex items-center justify-center", colorClass, sizeClasses[size], className)}
      aria-label={color}
    />
  )
}
