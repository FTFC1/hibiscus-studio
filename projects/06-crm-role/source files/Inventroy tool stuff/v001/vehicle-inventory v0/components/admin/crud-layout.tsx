"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

interface CrudLayoutProps<T> {
  title: string
  items: T[]
  loading: boolean
  emptyState: React.ReactNode
  renderTableHeader: () => React.ReactNode
  renderTableRow: (item: T) => React.ReactNode
  onAddClick: () => void
  actionButtons?: React.ReactNode
}

export function CrudLayout<T extends { id: number | string }>({
  title,
  items,
  loading,
  emptyState,
  renderTableHeader,
  renderTableRow,
  onAddClick,
  actionButtons,
}: CrudLayoutProps<T>) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          {actionButtons}
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add {title.replace("Manage ", "")}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading {title.toLowerCase()}...</div>
      ) : items.length === 0 ? (
        emptyState
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>{renderTableHeader()}</TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>{renderTableRow(item)}</TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
