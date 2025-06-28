"use server"

import { sql } from "@/lib/db"
import { z } from "zod"

// Validation schema for color
const ColorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hexCode: z.string().optional(),
})

// Get all colors
export async function getAllColors() {
  try {
    // First check if the hex_code column exists
    const columnsExist = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'colors' AND column_name = 'hex_code'
      ) as hex_code_exists
    `

    const hexCodeExists = columnsExist[0]?.hex_code_exists || false

    // Dynamically build the query based on which columns exist
    let query = `
      SELECT 
        id, 
        name
    `

    if (hexCodeExists) {
      query += `, hex_code`
    }

    query += `
      FROM 
        colors
      ORDER BY 
        name
    `

    const result = await sql.query(query)

    // If column doesn't exist, add null values to the result
    if (!hexCodeExists) {
      return result.map((color) => ({
        ...color,
        hex_code: null,
      }))
    }

    return result
  } catch (error) {
    console.error("Error fetching all colors:", error)
    return []
  }
}

// Get a specific color by ID
export async function getColorById(colorId: number) {
  try {
    const result = await sql`
      SELECT 
        id, 
        name,
        hex_code
      FROM 
        colors
      WHERE 
        id = ${colorId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching color ${colorId}:`, error)
    return null
  }
}

// Create a new color
export async function createColor(data: z.infer<typeof ColorSchema>) {
  try {
    // Validate input data
    const validatedData = ColorSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { name, hexCode } = validatedData.data

    // Check if color already exists
    const existingColor = await sql`
      SELECT id FROM colors WHERE name = ${name}
    `

    if (existingColor.length > 0) {
      return {
        success: false,
        message: "A color with this name already exists",
      }
    }

    // Insert the new color
    const result = await sql`
      INSERT INTO colors (name, hex_code)
      VALUES (${name}, ${hexCode || null})
      RETURNING id
    `

    if (result.length > 0) {
      return {
        success: true,
        message: "Color created successfully",
        colorId: result[0].id,
      }
    } else {
      return {
        success: false,
        message: "Failed to create color",
      }
    }
  } catch (error) {
    console.error("Error creating color:", error)
    return {
      success: false,
      message: "An error occurred while creating the color",
      error: String(error),
    }
  }
}

// Update a color
export async function updateColor(colorId: number, data: z.infer<typeof ColorSchema>) {
  try {
    // Validate input data
    const validatedData = ColorSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { name, hexCode } = validatedData.data

    // Check if color exists
    const color = await sql`
      SELECT id FROM colors WHERE id = ${colorId}
    `

    if (color.length === 0) {
      return {
        success: false,
        message: "Color not found",
      }
    }

    // Check if another color with the same name exists
    const existingColor = await sql`
      SELECT id FROM colors WHERE name = ${name} AND id != ${colorId}
    `

    if (existingColor.length > 0) {
      return {
        success: false,
        message: "Another color with this name already exists",
      }
    }

    // Update the color
    await sql`
      UPDATE colors
      SET 
        name = ${name},
        hex_code = ${hexCode || null}
      WHERE id = ${colorId}
    `

    return {
      success: true,
      message: "Color updated successfully",
    }
  } catch (error) {
    console.error("Error updating color:", error)
    return {
      success: false,
      message: "An error occurred while updating the color",
      error: String(error),
    }
  }
}

// Delete a color
export async function deleteColor(colorId: number) {
  try {
    // Check if color exists
    const color = await sql`
      SELECT id FROM colors WHERE id = ${colorId}
    `

    if (color.length === 0) {
      return {
        success: false,
        message: "Color not found",
      }
    }

    // Check if color is being used by any vehicles
    const vehicles = await sql`
      SELECT id FROM vehicles WHERE color_id = ${colorId}
    `

    if (vehicles.length > 0) {
      return {
        success: false,
        message: "Cannot delete color because it is being used by vehicles",
      }
    }

    // Delete the color
    await sql`
      DELETE FROM colors WHERE id = ${colorId}
    `

    return {
      success: true,
      message: "Color deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting color:", error)
    return {
      success: false,
      message: "An error occurred while deleting the color",
      error: String(error),
    }
  }
}
