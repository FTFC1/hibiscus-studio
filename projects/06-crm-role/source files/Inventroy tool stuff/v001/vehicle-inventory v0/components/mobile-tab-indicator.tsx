"use client"
import { motion, AnimatePresence } from "framer-motion"

interface MobileTabIndicatorProps {
  isSelected: boolean
  color?: string
}

export function MobileTabIndicator({ isSelected, color = "#3b82f6" }: MobileTabIndicatorProps) {
  return (
    <AnimatePresence>
      {isSelected && (
        <motion.div
          className="absolute -bottom-[1px] left-0 right-0 h-0.5 rounded-full"
          initial={{ opacity: 0, width: "0%" }}
          animate={{ opacity: 1, width: "100%" }}
          exit={{ opacity: 0, width: "0%" }}
          style={{ backgroundColor: color }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  )
}
