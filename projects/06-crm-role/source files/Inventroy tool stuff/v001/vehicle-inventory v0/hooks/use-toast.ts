"use client"

import type React from "react"

import { useState, useEffect } from "react"

type ToastType = "default" | "success" | "destructive"

interface Toast {
  id: string
  title?: string
  description?: string
  type?: ToastType
  duration?: number
  action?: React.ReactNode
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    toasts.forEach((toast) => {
      if (toast.duration !== Number.POSITIVE_INFINITY) {
        const timer = setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))
        }, toast.duration || 5000)

        timers.push(timer)
      }
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts])

  const toast = ({ title, description, type = "default", duration = 5000, action }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prevToasts) => [...prevToasts, { id, title, description, type, duration, action }])

    return id
  }

  const dismiss = (toastId: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }

  const dismissAll = () => {
    setToasts([])
  }

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  }
}

export type { Toast, ToastType }
