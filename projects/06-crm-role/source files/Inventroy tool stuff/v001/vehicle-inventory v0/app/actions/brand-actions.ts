"use server"

import { sql } from "@/lib/db"
import { z } from "zod"

// Validation schema for brand
const BrandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
})

// Get all brands
export async function getAllBrands() {
  try {
    // First check if the logo_url and description columns exist
    const columnsExist = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'brands' AND column_name = 'logo_url'
      ) as logo_url_exists,
      EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'brands' AND column_name = 'description'
      ) as description_exists
    `

    const logoUrlExists = columnsExist[0]?.logo_url_exists || false
    const descriptionExists = columnsExist[0]?.description_exists || false

    // Dynamically build the query based on which columns exist
    let query = `
      SELECT 
        id, 
        name
    `

    if (logoUrlExists) {
      query += `, logo_url`
    }

    if (descriptionExists) {
      query += `, description`
    }

    query += `
      FROM 
        brands
      ORDER BY 
        name
    `

    const result = await sql.query(query)

    // If columns don't exist, add null values to the result
    if (!logoUrlExists || !descriptionExists) {
      return result.map((brand) => ({
        ...brand,
        logo_url: logoUrlExists ? brand.logo_url : null,
        description: descriptionExists ? brand.description : null,
      }))
    }

    return result
  } catch (error) {
    console.error("Error fetching all brands:", error)
    return []
  }
}

// Get a specific brand by ID
export async function getBrandById(brandId: number) {
  try {
    const result = await sql`
      SELECT 
        id, 
        name,
        logo_url,
        description
      FROM 
        brands
      WHERE 
        id = ${brandId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching brand ${brandId}:`, error)
    return null
  }
}

// Create a new brand
export async function createBrand(data: z.infer<typeof BrandSchema>) {
  try {
    // Validate input data
    const validatedData = BrandSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { name, logoUrl, description } = validatedData.data

    // Check if brand already exists
    const existingBrand = await sql`
      SELECT id FROM brands WHERE name = ${name}
    `

    if (existingBrand.length > 0) {
      return {
        success: false,
        message: "A brand with this name already exists",
      }
    }

    // Insert the new brand
    const result = await sql`
      INSERT INTO brands (name, logo_url, description)
      VALUES (${name}, ${logoUrl || null}, ${description || null})
      RETURNING id
    `

    if (result.length > 0) {
      return {
        success: true,
        message: "Brand created successfully",
        brandId: result[0].id,
      }
    } else {
      return {
        success: false,
        message: "Failed to create brand",
      }
    }
  } catch (error) {
    console.error("Error creating brand:", error)
    return {
      success: false,
      message: "An error occurred while creating the brand",
      error: String(error),
    }
  }
}

// Update a brand
export async function updateBrand(brandId: number, data: z.infer<typeof BrandSchema>) {
  try {
    // Validate input data
    const validatedData = BrandSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { name, logoUrl, description } = validatedData.data

    // Check if brand exists
    const brand = await sql`
      SELECT id FROM brands WHERE id = ${brandId}
    `

    if (brand.length === 0) {
      return {
        success: false,
        message: "Brand not found",
      }
    }

    // Check if another brand with the same name exists
    const existingBrand = await sql`
      SELECT id FROM brands WHERE name = ${name} AND id != ${brandId}
    `

    if (existingBrand.length > 0) {
      return {
        success: false,
        message: "Another brand with this name already exists",
      }
    }

    // Update the brand
    await sql`
      UPDATE brands
      SET 
        name = ${name},
        logo_url = ${logoUrl || null},
        description = ${description || null}
      WHERE id = ${brandId}
    `

    return {
      success: true,
      message: "Brand updated successfully",
    }
  } catch (error) {
    console.error("Error updating brand:", error)
    return {
      success: false,
      message: "An error occurred while updating the brand",
      error: String(error),
    }
  }
}

// Delete a brand
export async function deleteBrand(brandId: number) {
  try {
    // Check if brand exists
    const brand = await sql`
      SELECT id FROM brands WHERE id = ${brandId}
    `

    if (brand.length === 0) {
      return {
        success: false,
        message: "Brand not found",
      }
    }

    // Check if brand has any models
    const models = await sql`
      SELECT id FROM models WHERE brand_id = ${brandId}
    `

    if (models.length > 0) {
      return {
        success: false,
        message: "Cannot delete brand because it has models associated with it",
      }
    }

    // Delete the brand
    await sql`
      DELETE FROM brands WHERE id = ${brandId}
    `

    return {
      success: true,
      message: "Brand deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting brand:", error)
    return {
      success: false,
      message: "An error occurred while deleting the brand",
      error: String(error),
    }
  }
}
