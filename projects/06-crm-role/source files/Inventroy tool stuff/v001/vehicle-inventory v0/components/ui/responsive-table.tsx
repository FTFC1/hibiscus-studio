import type React from "react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

interface Column<T> {
  header: string
  accessorKey: keyof T | ((item: T) => React.ReactNode)
  cell?: (item: T) => React.ReactNode
  className?: string
  isHiddenOnMobile?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  className?: string
  emptyState?: React.ReactNode
}

export function ResponsiveTable<T>({ data, columns, keyField, className, emptyState }: ResponsiveTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  // Function to get cell value
  const getCellValue = (item: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(item)
    }

    if (typeof column.accessorKey === "function") {
      return column.accessorKey(item)
    }

    return item[column.accessorKey] as React.ReactNode
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.header)} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={String(item[keyField])}>
                {columns.map((column) => (
                  <TableCell key={`${String(item[keyField])}-${String(column.header)}`} className={column.className}>
                    {getCellValue(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {data.map((item) => (
          <Card key={String(item[keyField])}>
            <CardContent className="p-4 space-y-3">
              {columns
                .filter((column) => !column.isHiddenOnMobile)
                .map((column) => (
                  <div key={`${String(item[keyField])}-${String(column.header)}`} className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium text-muted-foreground">{column.header}</div>
                    <div className={cn("text-sm", column.className)}>{getCellValue(item, column)}</div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
