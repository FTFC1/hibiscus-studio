"use server"

import { sql } from "@/lib/db"
import { z } from "zod"

// Validation schema for model
const ModelSchema = z.object({
  brandId: z.number({
    required_error: "Brand ID is required",
    invalid_type_error: "Brand ID must be a number",
  }),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  driveType: z.string().min(1, "Drive type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
})

// Get all models
export async function getAllModels() {
  try {
    // First check if the description and image_url columns exist
    const columnsExist = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'models' AND column_name = 'description'
      ) as description_exists,
      EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'models' AND column_name = 'image_url'
      ) as image_url_exists
    `

    const descriptionExists = columnsExist[0]?.description_exists || false
    const imageUrlExists = columnsExist[0]?.image_url_exists || false

    // Dynamically build the query based on which columns exist
    let query = `
      SELECT 
        m.id, 
        m.name, 
        m.category, 
        m.fuel_type, 
        m.drive_type, 
        m.transmission,
    `

    if (descriptionExists) {
      query += `m.description,`
    }

    if (imageUrlExists) {
      query += `m.image_url,`
    }

    query += `
        m.brand_id,
        b.name as brand_name
      FROM 
        models m
      JOIN 
        brands b ON m.brand_id = b.id
      ORDER BY 
        b.name, m.name
    `

    const result = await sql.query(query)

    // If columns don't exist, add null values to the result
    if (!descriptionExists || !imageUrlExists) {
      return result.map((model) => ({
        ...model,
        description: descriptionExists ? model.description : null,
        image_url: imageUrlExists ? model.image_url : null,
      }))
    }

    return result
  } catch (error) {
    console.error("Error fetching all models:", error)
    return []
  }
}

// Get a specific model by ID
export async function getModelById(modelId: number) {
  try {
    const result = await sql`
      SELECT 
        m.id, 
        m.name, 
        m.category, 
        m.fuel_type, 
        m.drive_type, 
        m.transmission,
        m.description,
        m.image_url,
        m.brand_id,
        b.name as brand_name
      FROM 
        models m
      JOIN 
        brands b ON m.brand_id = b.id
      WHERE 
        m.id = ${modelId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching model ${modelId}:`, error)
    return null
  }
}

// Create a new model
export async function createModel(data: z.infer<typeof ModelSchema>) {
  try {
    // Validate input data
    const validatedData = ModelSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { brandId, name, category, fuelType, driveType, transmission, description, imageUrl } = validatedData.data

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

    // Check if model already exists for this brand
    const existingModel = await sql`
      SELECT id FROM models WHERE brand_id = ${brandId} AND name = ${name}
    `

    if (existingModel.length > 0) {
      return {
        success: false,
        message: "A model with this name already exists for this brand",
      }
    }

    // Insert the new model
    const result = await sql`
      INSERT INTO models (
        brand_id, 
        name, 
        category, 
        fuel_type, 
        drive_type, 
        transmission, 
        description, 
        image_url
      )
      VALUES (
        ${brandId}, 
        ${name}, 
        ${category}, 
        ${fuelType}, 
        ${driveType}, 
        ${transmission}, 
        ${description || null}, 
        ${imageUrl || null}
      )
      RETURNING id
    `

    if (result.length > 0) {
      return {
        success: true,
        message: "Model created successfully",
        modelId: result[0].id,
      }
    } else {
      return {
        success: false,
        message: "Failed to create model",
      }
    }
  } catch (error) {
    console.error("Error creating model:", error)
    return {
      success: false,
      message: "An error occurred while creating the model",
      error: String(error),
    }
  }
}

// Update a model
export async function updateModel(modelId: number, data: z.infer<typeof ModelSchema>) {
  try {
    // Validate input data
    const validatedData = ModelSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { brandId, name, category, fuelType, driveType, transmission, description, imageUrl } = validatedData.data

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

    // Check if another model with the same name exists for this brand
    const existingModel = await sql`
      SELECT id FROM models 
      WHERE brand_id = ${brandId} AND name = ${name} AND id != ${modelId}
    `

    if (existingModel.length > 0) {
      return {
        success: false,
        message: "Another model with this name already exists for this brand",
      }
    }

    // Update the model
    await sql`
      UPDATE models
      SET 
        brand_id = ${brandId},
        name = ${name},
        category = ${category},
        fuel_type = ${fuelType},
        drive_type = ${driveType},
        transmission = ${transmission},
        description = ${description || null},
        image_url = ${imageUrl || null}
      WHERE id = ${modelId}
    `

    return {
      success: true,
      message: "Model updated successfully",
    }
  } catch (error) {
    console.error("Error updating model:", error)
    return {
      success: false,
      message: "An error occurred while updating the model",
      error: String(error),
    }
  }
}

// Delete a model
export async function deleteModel(modelId: number) {
  try {
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

    // Check if model has any vehicles
    const vehicles = await sql`
      SELECT id FROM vehicles WHERE model_id = ${modelId}
    `

    if (vehicles.length > 0) {
      return {
        success: false,
        message: "Cannot delete model because it has vehicles associated with it",
      }
    }

    // Check if model has any trims
    const trims = await sql`
      SELECT id FROM trims WHERE model_id = ${modelId}
    `

    if (trims.length > 0) {
      return {
        success: false,
        message: "Cannot delete model because it has trims associated with it",
      }
    }

    // Delete the model
    await sql`
      DELETE FROM models WHERE id = ${modelId}
    `

    return {
      success: true,
      message: "Model deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting model:", error)
    return {
      success: false,
      message: "An error occurred while deleting the model",
      error: String(error),
    }
  }
}
