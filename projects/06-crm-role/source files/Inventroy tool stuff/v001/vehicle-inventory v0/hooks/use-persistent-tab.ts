"use client"

import { useState, useEffect } from "react"

export function usePersistentTab(defaultTab: string, storageKey: string) {
  // Initialize with defaultTab, will be updated from localStorage in useEffect
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Load saved tab from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem(storageKey)
      if (savedTab) {
        setActiveTab(savedTab)
      }
    }
  }, [storageKey])

  // Handle tab change and save to localStorage
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (typeof window !== "undefined") {
      localStorage.getItem(storageKey)
      localStorage.setItem(storageKey, value)
    }
  }

  return { activeTab, handleTabChange }
}
