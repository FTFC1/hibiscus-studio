import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create the main client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').single()
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

// Types for our database
export type Profile = {
  id: string
  email: string
  full_name?: string
  role: string
  created_at: string
  updated_at: string
}

export type DatabasePFI = {
  id: string
  user_id: string
  invoice_number: string
  invoice_date: string
  valid_until: string
  invoice_type: string
  customer_name: string
  customer_address: string
  customer_phone: string
  customer_email: string
  customer_contact?: string
  sales_executive: string
  contact_number: string
  line_items: any[]
  registration?: any
  insurance?: any
  service_oil_change?: any
  transport_cost?: number
  registration_cost?: number
  subtotal: number
  vat: number
  total: number
  amount_in_words?: string
  bank: string
  account_name: string
  account_number: string
  prepared_by: string
  approved_by: string
  payment_terms?: string
  created_at: string
  updated_at: string
}
