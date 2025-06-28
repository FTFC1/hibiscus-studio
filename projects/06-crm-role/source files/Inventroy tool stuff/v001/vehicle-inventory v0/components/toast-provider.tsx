"use client"

import type React from "react"

import { createContext, useContext } from "react"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastProviderUI,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast, type Toast as ToastType } from "@/hooks/use-toast"

interface ToastContextType {
  toast: (props: Omit<ToastType, "id">) => string
  dismiss: (toastId: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, dismiss, dismissAll, toasts } = useToast()

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      <ToastProviderUI>
        {children}
        {toasts.map(({ id, title, description, type, action }) => (
          <Toast key={id} variant={type} onOpenChange={() => dismiss(id)}>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            {action && <ToastAction altText="Action">{action}</ToastAction>}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProviderUI>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }

  return context
}
