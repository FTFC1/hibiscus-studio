import type React from "react"
// Replace the entire component with a re-export of the new ConfirmationDialog
import { ConfirmationDialog } from "@/components/confirmation-dialog"

export function DeleteConfirmationDialog(props: React.ComponentProps<typeof ConfirmationDialog>) {
  return <ConfirmationDialog {...props} variant="destructive" confirmText="Delete" />
}
