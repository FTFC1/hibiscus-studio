"use server"

import { sql } from "@/lib/db"
import { z } from "zod"

// Validation schema for vehicle
const VehicleSchema = z.object({
  modelId: z.number({
    required_error: "Model is required",
    invalid_type_error: "Model must be a number",
  }),
  trimId: z.number({
    required_error: "Trim is required",
    invalid_type_error: "Trim must be a number",
  }),
  colorId: z.number({
    required_error: "Color is required",
    invalid_type_error: "Color must be a number",
  }),
  vin: z.string().min(10, "VIN must be at least 10 characters").max(17, "VIN must not exceed 17 characters"),
  status: z.enum(["Available", "Display", "In Transit", "Reserved"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
  location: z.string().min(1, "Location is required"),
  arrivalDate: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

// Get all vehicles
export async function getAllVehicles() {
  try {
    // First check if the notes column exists
    const columnsExist = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vehicles' AND column_name = 'notes'
      ) as notes_exists
    `

    const notesExists = columnsExist[0]?.notes_exists || false

    // Dynamically build the query based on which columns exist
    let query = `
      SELECT 
        v.id, 
        v.vin, 
        v.status, 
        v.location, 
        v.arrival_date, 
        v.customer_name,
    `

    if (notesExists) {
      query += `v.notes,`
    }

    query += `
        v.model_id,
        v.trim_id,
        v.color_id,
        m.name as model_name,
        b.name as brand_name,
        t.name as trim_name,
        c.name as color_name
      FROM 
        vehicles v
      JOIN 
        models m ON v.model_id = m.id
      JOIN 
        brands b ON m.brand_id = b.id
      JOIN 
        trims t ON v.trim_id = t.id
      JOIN 
        colors c ON v.color_id = c.id
      ORDER BY 
        v.status, v.vin
    `

    const result = await sql.query(query)

    // If column doesn't exist, add null values to the result
    if (!notesExists) {
      return result.map((vehicle) => ({
        ...vehicle,
        notes: null,
      }))
    }

    return result
  } catch (error) {
    console.error("Error fetching all vehicles:", error)
    return []
  }
}

// Get a specific vehicle by ID
export async function getVehicleById(vehicleId: number) {
  try {
    const result = await sql`
      SELECT 
        v.id, 
        v.vin, 
        v.status, 
        v.location, 
        v.arrival_date, 
        v.customer_name,
        v.notes,
        v.model_id,
        v.trim_id,
        v.color_id,
        m.name as model_name,
        b.name as brand_name,
        t.name as trim_name,
        c.name as color_name
      FROM 
        vehicles v
      JOIN 
        models m ON v.model_id = m.id
      JOIN 
        brands b ON m.brand_id = b.id
      JOIN 
        trims t ON v.trim_id = t.id
      JOIN 
        colors c ON v.color_id = c.id
      WHERE 
        v.id = ${vehicleId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching vehicle ${vehicleId}:`, error)
    return null
  }
}

// Create a new vehicle
export async function createVehicle(data: z.infer<typeof VehicleSchema>) {
  try {
    // Validate input data
    const validatedData = VehicleSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { modelId, trimId, colorId, vin, status, location, arrivalDate, customerName, notes } = validatedData.data

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

    // Check if VIN already exists
    const existingVin = await sql`
      SELECT id FROM vehicles WHERE vin = ${vin}
    `

    if (existingVin.length > 0) {
      return {
        success: false,
        message: "A vehicle with this VIN already exists",
      }
    }

    // Insert the new vehicle
    const result = await sql`
      INSERT INTO vehicles (
        model_id, 
        trim_id,
        color_id, 
        vin, 
        status, 
        location, 
        arrival_date, 
        customer_name,
        notes,
        created_at
      ) 
      VALUES (
        ${modelId}, 
        ${trimId},
        ${colorId}, 
        ${vin}, 
        ${status}, 
        ${location}, 
        ${arrivalDate || null}, 
        ${customerName || null},
        ${notes || null},
        NOW()
      )
      RETURNING id
    `

    if (result.length > 0) {
      return {
        success: true,
        message: "Vehicle added successfully",
        vehicleId: result[0].id,
      }
    } else {
      return {
        success: false,
        message: "Failed to add vehicle",
      }
    }
  } catch (error) {
    console.error("Error adding vehicle:", error)
    return {
      success: false,
      message: "An error occurred while adding the vehicle",
      error: String(error),
    }
  }
}

// Update a vehicle
export async function updateVehicle(vehicleId: number, data: z.infer<typeof VehicleSchema>) {
  try {
    // Validate input data
    const validatedData = VehicleSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { modelId, trimId, colorId, vin, status, location, arrivalDate, customerName, notes } = validatedData.data

    // Check if vehicle exists
    const vehicle = await sql`
      SELECT id FROM vehicles WHERE id = ${vehicleId}
    `

    if (vehicle.length === 0) {
      return {
        success: false,
        message: "Vehicle not found",
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

    // Check if another vehicle with the same VIN exists
    const existingVin = await sql`
      SELECT id FROM vehicles WHERE vin = ${vin} AND id != ${vehicleId}
    `

    if (existingVin.length > 0) {
      return {
        success: false,
        message: "Another vehicle with this VIN already exists",
      }
    }

    // Update the vehicle
    await sql`
      UPDATE vehicles
      SET 
        model_id = ${modelId},
        trim_id = ${trimId},
        color_id = ${colorId},
        vin = ${vin},
        status = ${status},
        location = ${location},
        arrival_date = ${arrivalDate || null},
        customer_name = ${customerName || null},
        notes = ${notes || null}
      WHERE id = ${vehicleId}
    `

    return {
      success: true,
      message: "Vehicle updated successfully",
    }
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return {
      success: false,
      message: "An error occurred while updating the vehicle",
      error: String(error),
    }
  }
}

// Delete a vehicle
export async function deleteVehicle(vehicleId: number) {
  try {
    // Check if vehicle exists
    const vehicle = await sql`
      SELECT id FROM vehicles WHERE id = ${vehicleId}
    `

    if (vehicle.length === 0) {
      return {
        success: false,
        message: "Vehicle not found",
      }
    }

    // Delete the vehicle
    await sql`
      DELETE FROM vehicles WHERE id = ${vehicleId}
    `

    return {
      success: true,
      message: "Vehicle deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return {
      success: false,
      message: "An error occurred while deleting the vehicle",
      error: String(error),
    }
  }
}
