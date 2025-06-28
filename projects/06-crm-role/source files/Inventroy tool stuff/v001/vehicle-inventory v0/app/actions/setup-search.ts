"use server"

import { sql } from "@/lib/db"

export async function setupFuzzySearch() {
  try {
    console.log("Starting fuzzy search setup...")

    // Try to check if pg_trgm is already installed instead of creating it
    const extensionCheck = await sql`
      SELECT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
      ) as is_installed;
    `

    const isExtensionInstalled = extensionCheck[0]?.is_installed || false

    if (isExtensionInstalled) {
      console.log("pg_trgm extension is already installed")
    } else {
      // Only try to create the extension if it's not already installed
      try {
        await sql`CREATE EXTENSION pg_trgm;`
        console.log("pg_trgm extension installed successfully")
      } catch (extError) {
        console.warn("Could not create pg_trgm extension, it may require admin privileges:", extError)
        return {
          success: false,
          message: "Could not create pg_trgm extension. Please contact your database administrator to install it.",
          error: String(extError),
        }
      }
    }

    // Create indexes to speed up similarity searches
    // We'll use a try-catch for each index to continue even if one fails

    try {
      console.log("Creating index on brands.name...")
      await sql`
        CREATE INDEX IF NOT EXISTS idx_brands_name_trgm 
        ON brands USING gin (name gin_trgm_ops);
      `
      console.log("Index on brands.name created successfully")
    } catch (indexError) {
      console.warn("Error creating index on brands.name:", indexError)
      // Continue with other indexes
    }

    try {
      console.log("Creating index on models.name...")
      await sql`
        CREATE INDEX IF NOT EXISTS idx_models_name_trgm 
        ON models USING gin (name gin_trgm_ops);
      `
      console.log("Index on models.name created successfully")
    } catch (indexError) {
      console.warn("Error creating index on models.name:", indexError)
      // Continue with other indexes
    }

    try {
      console.log("Creating index on models.category...")
      await sql`
        CREATE INDEX IF NOT EXISTS idx_models_category_trgm 
        ON models USING gin (category gin_trgm_ops);
      `
      console.log("Index on models.category created successfully")
    } catch (indexError) {
      console.warn("Error creating index on models.category:", indexError)
      // Continue with other indexes
    }

    try {
      console.log("Creating index on models.fuel_type...")
      await sql`
        CREATE INDEX IF NOT EXISTS idx_models_fuel_type_trgm 
        ON models USING gin (fuel_type gin_trgm_ops);
      `
      console.log("Index on models.fuel_type created successfully")
    } catch (indexError) {
      console.warn("Error creating index on models.fuel_type:", indexError)
      // Continue with other indexes
    }

    console.log("Fuzzy search setup completed")
    return { success: true, message: "Fuzzy search setup completed successfully" }
  } catch (error) {
    console.error("Error setting up fuzzy search:", error)
    return {
      success: false,
      message: "Failed to set up fuzzy search",
      error: String(error),
    }
  }
}
