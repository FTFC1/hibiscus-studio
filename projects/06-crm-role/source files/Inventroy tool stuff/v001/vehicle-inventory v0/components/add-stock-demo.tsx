"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddStockModal } from "@/components/add-stock-modal"

export default function AddStockDemo() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // Here you would typically send the data to your API
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Button onClick={() => setIsOpen(true)}>Open Add Stock Modal</Button>

      <AddStockModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleSubmit} />
    </div>
  )
}
