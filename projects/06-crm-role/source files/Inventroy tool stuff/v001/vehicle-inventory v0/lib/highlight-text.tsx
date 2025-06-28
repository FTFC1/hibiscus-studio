import { cn } from "@/lib/utils"

interface HighlightTextProps {
  text: string
  query: string
  className?: string
  highlightClassName?: string
}

// Improve visibility of highlighted search terms
export function highlightText({ text, query, className, highlightClassName }: HighlightTextProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className={cn("bg-yellow-200 dark:bg-yellow-900/60 px-0.5 rounded-sm", highlightClassName)}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  )
}
