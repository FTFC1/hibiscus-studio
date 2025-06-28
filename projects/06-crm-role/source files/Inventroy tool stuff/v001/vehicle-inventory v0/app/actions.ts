"use server"

import { sql } from "@/lib/db"
import { z } from "zod"

// Get all models with brand information for search
export async function getAllModelsWithBrands() {
  try {
    const result = await sql`
    SELECT 
      m.id, 
      m.name as model_name, 
      b.name as brand_name,
      m.category, 
      m.fuel_type, 
      m.drive_type, 
      m.transmission,
      COUNT(v.id) as total_stock,
      SUM(CASE WHEN v.status = 'Available' THEN 1 ELSE 0 END) as available
    FROM 
      models m
    JOIN 
      brands b ON m.brand_id = b.id
    LEFT JOIN 
      vehicles v ON m.id = v.model_id
    GROUP BY 
      m.id, m.name, b.name, m.category, m.fuel_type, m.drive_type, m.transmission
    ORDER BY 
      b.name, m.name
  `

    return result
  } catch (error) {
    console.error("Error fetching all models with brands:", error)
    return []
  }
}

// Get dashboard metrics
export async function getDashboardMetrics() {
  try {
    // Get total vehicles by status
    const vehicleStats = await sql`
    SELECT 
      COUNT(*) as total_vehicles,
      SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) as available_vehicles,
      SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END) as in_transit_vehicles,
      SUM(CASE WHEN status = 'Reserved' THEN 1 ELSE 0 END) as reserved_vehicles,
      SUM(CASE WHEN status = 'Display' THEN 1 ELSE 0 END) as display_vehicles
    FROM vehicles
  `

    // Get total brands and models
    const brandModelStats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM brands) as total_brands,
      (SELECT COUNT(*) FROM models) as total_models
  `

    // Get recently added models (last 7 days)
    const recentlyAdded = await sql`
    SELECT 
      m.name || ' ' || b.name as model,
      COUNT(v.id) as count
    FROM 
      vehicles v
    JOIN 
      models m ON v.model_id = m.id
    JOIN 
      brands b ON m.brand_id = b.id
    WHERE 
      v.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY 
      m.name, b.name
    ORDER BY 
      count DESC
    LIMIT 2
  `

    // Get top models by count
    const topModels = await sql`
    SELECT 
      m.name || ' ' || b.name as name,
      COUNT(v.id) as count
    FROM 
      vehicles v
    JOIN 
      models m ON v.model_id = m.id
    JOIN 
      brands b ON m.brand_id = b.id
    GROUP BY 
      m.name, b.name
    ORDER BY 
      count DESC
    LIMIT 3
  `

    // Get vehicle types breakdown
    const vehicleTypes = await sql`
    SELECT 
      m.category as name,
      COUNT(v.id) as value
    FROM 
      vehicles v
    JOIN 
      models m ON v.model_id = m.id
    GROUP BY 
      m.category
    ORDER BY 
      value DESC
  `

    // Map colors to vehicle types
    const colorMap = {
      Sedan: "#3b82f6", // blue
      SUV: "#10b981", // green
      Truck: "#f59e0b", // amber
      Van: "#8b5cf6", // purple
      Coupe: "#ec4899", // pink
      Convertible: "#f43f5e", // rose
      Hatchback: "#8b5cf6", // purple
      Wagon: "#6366f1", // indigo
    }

    const vehicleTypesWithColors = vehicleTypes.map((type) => ({
      name: type.name,
      value: Number(type.value),
      color: colorMap[type.name] || "#6b7280", // gray as fallback
    }))

    // Get new arrivals in the last 7 days
    const newArrivalsCount = await sql`
    SELECT COUNT(*) as count
    FROM vehicles
    WHERE created_at >= NOW() - INTERVAL '7 days'
  `

    // Get new arrivals breakdown by vehicle type
    const newArrivalsBreakdown = await sql`
    SELECT 
      m.category as type,
      COUNT(v.id) as count
    FROM 
      vehicles v
    JOIN 
      models m ON v.model_id = m.id
    WHERE 
      v.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY 
      m.category
    ORDER BY 
      count DESC
  `

    // Calculate trend (difference from previous 7 days)
    const previousPeriodArrivals = await sql`
    SELECT COUNT(*) as count
    FROM vehicles
    WHERE 
      created_at >= NOW() - INTERVAL '14 days' AND
      created_at < NOW() - INTERVAL '7 days'
  `

    const currentCount = Number(newArrivalsCount[0]?.count || 0)
    const previousCount = Number(previousPeriodArrivals[0]?.count || 0)
    const trend = currentCount - previousCount

    return {
      totalVehicles: vehicleStats[0]?.total_vehicles || 0,
      availableVehicles: vehicleStats[0]?.available_vehicles || 0,
      inTransitVehicles: vehicleStats[0]?.in_transit_vehicles || 0,
      reservedVehicles: vehicleStats[0]?.reserved_vehicles || 0,
      displayVehicles: vehicleStats[0]?.display_vehicles || 0,
      totalBrands: brandModelStats[0]?.total_brands || 0,
      totalModels: brandModelStats[0]?.total_models || 0,
      recentlyAdded: recentlyAdded.map((item) => ({
        model: item.model,
        count: Number(item.count),
      })),
      topModels: topModels.map((model) => ({
        name: model.name,
        count: Number(model.count),
      })),
      vehicleTypes: vehicleTypesWithColors,
      newArrivals: {
        count: currentCount,
        trend: trend,
        breakdown: newArrivalsBreakdown.map((item) => ({
          type: item.type,
          count: Number(item.count),
        })),
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    return {
      totalVehicles: 0,
      availableVehicles: 0,
      inTransitVehicles: 0,
      reservedVehicles: 0,
      displayVehicles: 0,
      totalBrands: 0,
      totalModels: 0,
      recentlyAdded: [],
      topModels: [],
      vehicleTypes: [],
      newArrivals: {
        count: 0,
        trend: 0,
        breakdown: [],
      },
    }
  }
}

// Fetch all brands with their total units and available units
export async function getBrands() {
  try {
    const result = await sql`
    SELECT 
      b.id, 
      b.name, 
      COUNT(v.id) as total_units,
      SUM(CASE WHEN v.status = 'Available' THEN 1 ELSE 0 END) as available_units,
      COUNT(DISTINCT m.id) as model_count
    FROM 
      brands b
    LEFT JOIN 
      models m ON b.id = m.brand_id
    LEFT JOIN 
      vehicles v ON m.id = v.model_id
    GROUP BY 
      b.id, b.name
    ORDER BY 
      b.name
  `

    return result
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}

// Fetch models for a specific brand
export async function getModelsByBrand(brandId: number) {
  try {
    const result = await sql`
    SELECT 
      m.id, 
      m.name, 
      m.category, 
      m.fuel_type, 
      m.drive_type, 
      m.transmission,
      COUNT(v.id) as total_stock,
      SUM(CASE WHEN v.status = 'Available' THEN 1 ELSE 0 END) as available,
      SUM(CASE WHEN v.status = 'Display' THEN 1 ELSE 0 END) as display
    FROM 
      models m
    LEFT JOIN 
      vehicles v ON m.id = v.model_id
    WHERE 
      m.brand_id = ${brandId}
    GROUP BY 
      m.id, m.name, m.category, m.fuel_type, m.drive_type, m.transmission
    ORDER BY 
      m.name
  `

    return result
  } catch (error) {
    console.error(`Error fetching models for brand ${brandId}:`, error)
    return []
  }
}

// Fetch vehicles for a specific model
export async function getVehiclesByModel(modelId: number) {
  try {
    const result = await sql`
    SELECT 
      v.id, 
      v.vin, 
      c.name as color, 
      v.status, 
      v.location, 
      v.arrival_date, 
      v.customer_name
    FROM 
      vehicles v
    JOIN 
      colors c ON v.color_id = c.id
    WHERE 
      v.model_id = ${modelId}
    ORDER BY 
      v.status, v.vin
  `

    return result
  } catch (error) {
    console.error(`Error fetching vehicles for model ${modelId}:`, error)
    return []
  }
}

// Update the validation schema for adding a new vehicle
const AddVehicleSchema = z.object({
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
})

// Update the addVehicleStock function to include trim
export async function addVehicleStock(data: any) {
  try {
    // Validate input data
    const validatedData = AddVehicleSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { modelId, trimId, colorId, vin, status, location, arrivalDate, customerName } = validatedData.data

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

// Fetch all models for dropdown
export async function getAllModels() {
  try {
    const result = await sql`
    SELECT 
      m.id, 
      m.name, 
      b.name as brand_name
    FROM 
      models m
    JOIN 
      brands b ON m.brand_id = b.id
    ORDER BY 
      b.name, m.name
  `

    return result
  } catch (error) {
    console.error("Error fetching all models:", error)
    return []
  }
}

// Fetch all colors for dropdown
export async function getAllColors() {
  try {
    const result = await sql`
    SELECT id, name
    FROM colors
    ORDER BY name
  `

    return result
  } catch (error) {
    console.error("Error fetching colors:", error)
    return []
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

// Validation schema for updating a vehicle
const UpdateVehicleSchema = z.object({
  id: z.number({
    required_error: "Vehicle ID is required",
    invalid_type_error: "Vehicle ID must be a number",
  }),
  status: z.enum(["Available", "Display", "In Transit", "Reserved"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
  location: z.string().min(1, "Location is required"),
  arrivalDate: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
})

// Update a vehicle
export async function updateVehicle(data: any) {
  try {
    // Validate input data
    const validatedData = UpdateVehicleSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { id, status, location, arrivalDate, customerName } = validatedData.data

    // Check if vehicle exists
    const vehicle = await sql`
    SELECT id FROM vehicles WHERE id = ${id}
  `

    if (vehicle.length === 0) {
      return {
        success: false,
        message: "Vehicle not found",
      }
    }

    // Update the vehicle
    await sql`
    UPDATE vehicles 
    SET 
      status = ${status}, 
      location = ${location}, 
      arrival_date = ${arrivalDate || null}, 
      customer_name = ${customerName || null}
    WHERE id = ${id}
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

// Validation schema for updating a model
const UpdateModelSchema = z.object({
  id: z.number({
    required_error: "Model ID is required",
    invalid_type_error: "Model ID must be a number",
  }),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  driveType: z.string().min(1, "Drive type is required"),
  transmission: z.string().min(1, "Transmission is required"),
})

// Update a model
export async function updateModel(data: any) {
  try {
    // Validate input data
    const validatedData = UpdateModelSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const { id, name, category, fuelType, driveType, transmission } = validatedData.data

    // Check if model exists
    const model = await sql`
    SELECT id FROM models WHERE id = ${id}
  `

    if (model.length === 0) {
      return {
        success: false,
        message: "Model not found",
      }
    }

    // Update the model
    await sql`
    UPDATE models 
    SET 
      name = ${name}, 
      category = ${category}, 
      fuel_type = ${fuelType}, 
      drive_type = ${driveType}, 
      transmission = ${transmission}
    WHERE id = ${id}
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
