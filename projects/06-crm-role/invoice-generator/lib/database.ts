import { supabase } from "./supabase"
import type { PFI } from "./types"
import type { DatabasePFI } from "./supabase"

// Convert PFI to database format
function pfiToDatabase(pfi: PFI, userId: string): Omit<DatabasePFI, "id" | "created_at" | "updated_at"> {
  return {
    user_id: userId,
    invoice_number: pfi.invoiceNumber,
    invoice_date: pfi.invoiceDate.toISOString().split("T")[0],
    valid_until: pfi.validUntil.toISOString().split("T")[0],
    invoice_type: pfi.invoiceType,
    customer_name: pfi.customerName,
    customer_address: pfi.customerAddress,
    customer_phone: pfi.customerPhone,
    customer_email: pfi.customerEmail,
    customer_contact: pfi.customerContact,
    sales_executive: pfi.salesExecutive,
    contact_number: pfi.contactNumber,
    line_items: pfi.lineItems,
    registration: pfi.registration,
    insurance: pfi.insurance,
    service_oil_change: pfi.serviceOilChange,
    transport_cost: pfi.transportCost,
    registration_cost: pfi.registrationCost,
    subtotal: pfi.subtotal,
    vat: pfi.vat,
    total: pfi.total,
    amount_in_words: pfi.amountInWords,
    bank: pfi.bank,
    account_name: pfi.accountName,
    account_number: pfi.accountNumber,
    prepared_by: pfi.preparedBy,
    approved_by: pfi.approvedBy,
    payment_terms: pfi.paymentTerms,
  }
}

// Convert database format to PFI
function databaseToPfi(dbPfi: DatabasePFI): PFI {
  return {
    id: dbPfi.id,
    invoiceNumber: dbPfi.invoice_number,
    invoiceDate: new Date(dbPfi.invoice_date),
    validUntil: new Date(dbPfi.valid_until),
    invoiceType: dbPfi.invoice_type,
    customerName: dbPfi.customer_name,
    customerAddress: dbPfi.customer_address,
    customerPhone: dbPfi.customer_phone,
    customerEmail: dbPfi.customer_email,
    customerContact: dbPfi.customer_contact,
    salesExecutive: dbPfi.sales_executive,
    contactNumber: dbPfi.contact_number,
    lineItems: dbPfi.line_items,
    registration: dbPfi.registration,
    insurance: dbPfi.insurance,
    serviceOilChange: dbPfi.service_oil_change,
    transportCost: dbPfi.transport_cost,
    registrationCost: dbPfi.registration_cost,
    subtotal: dbPfi.subtotal,
    vat: dbPfi.vat,
    total: dbPfi.total,
    amountInWords: dbPfi.amount_in_words || "",
    bank: dbPfi.bank,
    accountName: dbPfi.account_name,
    accountNumber: dbPfi.account_number,
    preparedBy: dbPfi.prepared_by,
    approvedBy: dbPfi.approved_by,
    paymentTerms: dbPfi.payment_terms,
    createdAt: new Date(dbPfi.created_at),
    updatedAt: new Date(dbPfi.updated_at),
  }
}

export const database = {
  // Get all PFIs for current user
  async getPFIs(): Promise<PFI[]> {
    const { data, error } = await supabase.from("pfis").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching PFIs:", error)
      throw error
    }

    return data.map(databaseToPfi)
  },

  // Save a PFI (create or update)
  async savePFI(pfi: Partial<PFI>): Promise<PFI> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const pfiData = { ...pfi }
    // Ensure there's an ID for upsert, but don't generate it here
    // The form will handle providing an ID for existing PFIs
    if (!pfiData.id) {
      delete pfiData.id // Let the database handle default UUID generation for new records
    }

    const dbPfi = pfiToDatabase(pfiData as PFI, user.id)

    const { data, error } = await supabase.from("pfis").upsert(dbPfi).select().single()

    if (error) {
      console.error("Error saving PFI:", error)
      throw error
    }

    return databaseToPfi(data)
  },

  // Delete a PFI
  async deletePFI(id: string): Promise<void> {
    const { error } = await supabase.from("pfis").delete().eq("id", id)

    if (error) throw error
  },
}
