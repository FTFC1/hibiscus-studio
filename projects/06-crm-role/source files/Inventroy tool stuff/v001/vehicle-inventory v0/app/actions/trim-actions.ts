"use server"

import { sql } from "@/lib/db"
import { z } from "zod"

// Validation schema for trim
const TrimSchema = z.object({
  modelId: z.number({
    required_error: "Model ID is required",
    invalid_type_error: "Model ID must be a number",
  }),
  name: z.string().min(1, "Name is required"),
  features: z.string().optional(),
})

// Get all trims
export async function getAllTrims() {
  try {
    const result = await sql`
      SELECT 
        t.id, 
        t.name, 
        t.features, 
        t.model_id,
        m.name as model_name,
        b.name as brand_name
      FROM 
        trims t
      JOIN 
        models m ON t.model_id = m.id
      JOIN 
        brands b ON m.brand_id = b.id
      ORDER BY 
        b.name, m.name, t.name
    `
    return result
  } catch (error) {
    console.error("Error fetching all trims:", error)
    return []
  }
}

// Get trims for a specific model
export async function getTrimsByModel(modelId: number) {
  try {
    const result = await sql`
      SELECT 
        id, 
        name, 
        features
      FROM 
        trims
      WHERE 
        model_id = ${modelId}
      ORDER BY 
        name
    `
    return result
  } catch (error) {
    console.error(`Error fetching trims for model ${modelId}:`, error)
    return []
  }
}

// Get a specific trim by ID
export async function getTrimById(trimId: number) {
  try {
    const result = await sql`
      SELECT 
        t.id, 
        t.name, 
        t.features, 
        t.model_id,
        m.name as model_name,
        b.name as brand_name
      FROM 
        trims t
      JOIN 
        models m ON t.model_id = m.id
      JOIN 
        brands b ON m.brand_id = b.id
      WHERE 
        t.id = ${trimId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching trim ${trimId}:`, error)
    return null
  }
}

// Create a new trim
export async function createTrim(data: z.infer<typeof TrimSchema>) {
  try {
    // Validate input data
    const validatedData = TrimSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { modelId, name, features } = validatedData.data

    // Check if model exists
    const model = await sql`
      SELECT id FROM models WHERE id = ${modelId}
    `

    if (model.length === 0) {
      return {
        success: false,
        message: "Model not found",
      }
    }

    // Check if trim already exists for this model
    const existingTrim = await sql`
      SELECT id FROM trims WHERE model_id = ${modelId} AND name = ${name}
    `

    if (existingTrim.length > 0) {
      return {
        success: false,
        message: "A trim with this name already exists for this model",
      }
    }

    // Insert the new trim
    const result = await sql`
      INSERT INTO trims (model_id, name, features, created_at)
      VALUES (${modelId}, ${name}, ${features || null}, NOW())
      RETURNING id
    `

    if (result.length > 0) {
      return {
        success: true,
        message: "Trim created successfully",
        trimId: result[0].id,
      }
    } else {
      return {
        success: false,
        message: "Failed to create trim",
      }
    }
  } catch (error) {
    console.error("Error creating trim:", error)
    return {
      success: false,
      message: "An error occurred while creating the trim",
      error: String(error),
    }
  }
}

// Update a trim
export async function updateTrim(trimId: number, data: z.infer<typeof TrimSchema>) {
  try {
    // Validate input data
    const validatedData = TrimSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { modelId, name, features } = validatedData.data

    // Check if trim exists
    const trim = await sql`
      SELECT id FROM trims WHERE id = ${trimId}
    `

    if (trim.length === 0) {
      return {
        success: false,
        message: "Trim not found",
      }
    }

    // Check if model exists
    const model = await sql`
      SELECT id FROM models WHERE id = ${modelId}
    `

    if (model.length === 0) {
      return {
        success: false,
        message: "Model not found",
      }
    }

    // Check if another trim with the same name exists for this model
    const existingTrim = await sql`
      SELECT id FROM trims 
      WHERE model_id = ${modelId} AND name = ${name} AND id != ${trimId}
    `

    if (existingTrim.length > 0) {
      return {
        success: false,
        message: "Another trim with this name already exists for this model",
      }
    }

    // Update the trim
    await sql`
      UPDATE trims
      SET 
        model_id = ${modelId},
        name = ${name},
        features = ${features || null}
      WHERE id = ${trimId}
    `

    return {
      success: true,
      message: "Trim updated successfully",
    }
  } catch (error) {
    console.error("Error updating trim:", error)
    return {
      success: false,
      message: "An error occurred while updating the trim",
      error: String(error),
    }
  }
}

// Delete a trim
export async function deleteTrim(trimId: number) {
  try {
    // Check if trim exists
    const trim = await sql`
      SELECT id FROM trims WHERE id = ${trimId}
    `

    if (trim.length === 0) {
      return {
        success: false,
        message: "Trim not found",
      }
    }

    // Check if trim is being used by any vehicles
    const vehicles = await sql`
      SELECT id FROM vehicles WHERE trim_id = ${trimId}
    `

    if (vehicles.length > 0) {
      return {
        success: false,
        message: "Cannot delete trim because it is being used by vehicles",
      }
    }

    // Delete the trim
    await sql`
      DELETE FROM trims WHERE id = ${trimId}
    `

    return {
      success: true,
      message: "Trim deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting trim:", error)
    return {
      success: false,
      message: "An error occurred while deleting the trim",
      error: String(error),
    }
  }
}
