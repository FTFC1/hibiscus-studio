import { neon } from "@neondatabase/serverless"

// Create a SQL client with the database URL from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function for raw SQL queries with parameters
export async function query(sqlQuery: string, params: any[] = []) {
  try {
    // Use sql.query for conventional function call with placeholders
    return await sql.query(sqlQuery, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for raw SQL queries without parameters (using tagged template)
export async function queryRaw(strings: TemplateStringsArray, ...values: any[]) {
  try {
    // Use the tagged template syntax
    return await sql(strings, ...values)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
