import type { PFI } from "./types"
import { formatCurrency } from "./utils"
import { format } from "date-fns"

export function generatePDF(pfi: PFI): void {
  // Get the preview element that's already rendered
  const previewElement = document.getElementById('invoice-print')
  if (!previewElement) {
    alert("Preview not found. Please generate preview first.")
    return
  }

  // Clone the preview element to avoid modifying the original
  const clonedElement = previewElement.cloneNode(true) as HTMLElement
  
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow pop-ups to print the PFI.")
    return
  }

  // Get all the CSS from the current page
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>PFI ${pfi.invoiceNumber}</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      ${styles}
      @media print {
        body * {
          visibility: visible !important;
      }
        #invoice-print {
          position: static !important;
          width: 210mm !important;
          min-height: 297mm !important;
      }
      }
    </style>
  </head>
  <body>
    ${clonedElement.outerHTML}
  </body>
  </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  
  // Wait for images to load before printing
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 500)
}
