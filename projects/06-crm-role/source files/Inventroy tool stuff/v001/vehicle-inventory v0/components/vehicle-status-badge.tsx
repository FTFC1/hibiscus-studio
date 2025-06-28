import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"

type CarStatus = "Available" | "Display" | "In Transit" | "Reserved"

interface StatusBadgeProps {
  status: CarStatus
  className?: string
}

export function VehicleStatusBadge({ status, className }: StatusBadgeProps) {
  const statusInfo = getStatusInfo(status)

  return (
    <Badge variant="outline" className={cn("px-2 py-0", statusInfo.bgColor, statusInfo.color, className)}>
      <span className="flex items-center gap-1">
        {statusInfo.icon}
        <span>{status}</span>
      </span>
    </Badge>
  )
}

// Update the getStatusInfo function to improve contrast ratios and readability
export function getStatusInfo(status: CarStatus) {
  switch (status) {
    case "Available":
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />,
        color: "text-emerald-700 dark:text-emerald-300",
        bgColor: "bg-emerald-100 dark:bg-emerald-950/40",
      }
    case "Display":
      return {
        icon: <Circle className="h-4 w-4 text-blue-600 dark:text-blue-500" />,
        color: "text-blue-700 dark:text-blue-300",
        bgColor: "bg-blue-100 dark:bg-blue-950/40",
      }
    case "In Transit":
      return {
        icon: <Clock className="h-4 w-4 text-amber-600 dark:text-amber-500" />,
        color: "text-amber-700 dark:text-amber-300",
        bgColor: "bg-amber-100 dark:bg-amber-950/40",
      }
    case "Reserved":
      return {
        icon: <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-500" />,
        color: "text-purple-700 dark:text-purple-300",
        bgColor: "bg-purple-100 dark:bg-purple-950/40",
      }
  }
}
