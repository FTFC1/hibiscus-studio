"use server"

import { sql } from "@/lib/db"

// Function to seed the database with brands, models, trims, and colors
export async function seedVehicleData() {
  try {
    // First, let's create the brands if they don't exist
    const brands = ["CAMC", "CHANGAN", "GEELY", "GWM", "KMC", "NISSAN", "ZNA"]

    for (const brand of brands) {
      // Check if brand exists
      const existingBrand = await sql`
        SELECT id FROM brands WHERE name = ${brand}
      `

      if (existingBrand.length === 0) {
        await sql`
          INSERT INTO brands (name, created_at)
          VALUES (${brand}, NOW())
        `
      }
    }

    // Now let's add the models with their respective brands
    const modelData = [
      // CAMC
      { brand: "CAMC", name: "40 TON" },

      // CHANGAN
      { brand: "CHANGAN", name: "ALSVIN V3" },
      { brand: "CHANGAN", name: "CS15" },
      { brand: "CHANGAN", name: "CS35" },
      { brand: "CHANGAN", name: "CS55 PLUS" },
      { brand: "CHANGAN", name: "CS55+" },
      { brand: "CHANGAN", name: "CS85" },
      { brand: "CHANGAN", name: "CS95 PLUS" },
      { brand: "CHANGAN", name: "EADO PLUS" },
      { brand: "CHANGAN", name: "G10 BUS" },
      { brand: "CHANGAN", name: "HUNTER" },
      { brand: "CHANGAN", name: "STAR 5" },
      { brand: "CHANGAN", name: "STAR TRUCK" },
      { brand: "CHANGAN", name: "UNI-K" },
      { brand: "CHANGAN", name: "UNI-T" },
      { brand: "CHANGAN", name: "X7 PLUS" },

      // GEELY
      { brand: "GEELY", name: "AZKARRA" },
      { brand: "GEELY", name: "COOLRAY" },
      { brand: "GEELY", name: "EMGRAND" },
      { brand: "GEELY", name: "GC9" },

      // GWM
      { brand: "GWM", name: "TANK500" },

      // KMC
      { brand: "KMC", name: "1.5 TON" },
      { brand: "KMC", name: "3 TON" },
      { brand: "KMC", name: "7 TON" },

      // NISSAN
      { brand: "NISSAN", name: "NAVARA" },
      { brand: "NISSAN", name: "TERRA" },

      // ZNA
      { brand: "ZNA", name: "RICH6" },
    ]

    for (const model of modelData) {
      // Get brand ID
      const brandResult = await sql`
        SELECT id FROM brands WHERE name = ${model.brand}
      `

      if (brandResult.length > 0) {
        const brandId = brandResult[0].id

        // Check if model exists
        const existingModel = await sql`
          SELECT id FROM models WHERE name = ${model.name} AND brand_id = ${brandId}
        `

        if (existingModel.length === 0) {
          // Default values for category, fuel type, etc.
          const category = model.name.includes("TON")
            ? "Truck"
            : model.name.includes("BUS")
              ? "Bus"
              : model.name.includes("TRUCK")
                ? "Truck"
                : "SUV"

          const fuelType = "Gasoline" // Default
          const driveType = "4x2" // Default to 4x2
          const transmission = "Automatic" // Default

          await sql`
            INSERT INTO models (brand_id, name, category, fuel_type, drive_type, transmission, created_at)
            VALUES (${brandId}, ${model.name}, ${category}, ${fuelType}, ${driveType}, ${transmission}, NOW())
          `
        }
      }
    }

    // Add trim levels to the database (first create the table if it doesn't exist)
    await sql`
      CREATE TABLE IF NOT EXISTS trims (
        id SERIAL PRIMARY KEY,
        model_id INTEGER NOT NULL REFERENCES models(id),
        name VARCHAR(100) NOT NULL,
        features TEXT,
        created_at TIMESTAMP NOT NULL,
        UNIQUE(model_id, name)
      )
    `

    // Add trim data
    const trimData = [
      // CAMC
      {
        brand: "CAMC",
        model: "40 TON",
        trim: "Standard Trim",
        features: "Available in RED, YELLOW, WHITE color options",
      },

      // CHANGAN
      { brand: "CHANGAN", model: "ALSVIN V3", trim: "Standard Trim", features: "Compact sedan" },
      { brand: "CHANGAN", model: "CS15", trim: "Standard Trim", features: "Compact crossover SUV" },
      { brand: "CHANGAN", model: "CS35", trim: "LUX Trim", features: "Compact SUV with premium features" },
      { brand: "CHANGAN", model: "CS55 PLUS", trim: "LUX Trim", features: "Compact SUV with premium features" },
      {
        brand: "CHANGAN",
        model: "CS55 PLUS",
        trim: "LUX PRO Trim",
        features: "Top trim level with advanced driver assistance systems",
      },
      {
        brand: "CHANGAN",
        model: "CS55+",
        trim: "LUX PRO Trim",
        features: '1.5L TURBO AUTO, 19" RIMS, 360 CAMERA, PANORAMIC SUNROOF, BLACK INTERIOR, DARK GREY EXTERIOR',
      },
      { brand: "CHANGAN", model: "CS85", trim: "Standard Trim", features: "Coupe-styled SUV" },
      {
        brand: "CHANGAN",
        model: "CS95 PLUS",
        trim: "Standard Trim",
        features: "Full-size SUV with three rows of seating",
      },
      {
        brand: "CHANGAN",
        model: "EADO PLUS",
        trim: "EXECUTIVE Trim",
        features: "Midsize sedan with executive features",
      },
      {
        brand: "CHANGAN",
        model: "EADO PLUS",
        trim: "LAMORE Trim",
        features: "Premium trim level with luxury appointments",
      },
      {
        brand: "CHANGAN",
        model: "G10 BUS",
        trim: "Standard Trim",
        features: "Passenger bus/van with multiple seating configurations",
      },
      { brand: "CHANGAN", model: "HUNTER", trim: "EXECUTIVE Trim", features: "Pickup truck with executive features" },
      {
        brand: "CHANGAN",
        model: "HUNTER",
        trim: "LUXURY Trim",
        features: "Luxury trim with enhanced comfort features",
      },
      {
        brand: "CHANGAN",
        model: "HUNTER",
        trim: "LUXURY PRO Trim",
        features: "Top-spec pickup with premium features and technology",
      },
      {
        brand: "CHANGAN",
        model: "HUNTER",
        trim: "PLUS Trim",
        features: "Enhanced version with additional capabilities",
      },
      {
        brand: "CHANGAN",
        model: "STAR 5",
        trim: "CARGO BUS Trim",
        features: '1.25L ENGINE, 5 SPEED MANUAL, 2 SEATS, 14" RIMS, WHITE EXTERIOR',
      },
      { brand: "CHANGAN", model: "STAR 5", trim: "PASSENGER Trim", features: "People carrier variant of the STAR 5" },
      { brand: "CHANGAN", model: "STAR TRUCK", trim: "Standard Trim", features: "Light commercial truck" },
      {
        brand: "CHANGAN",
        model: "UNI-K",
        trim: "BESPOKE Trim",
        features: "Premium midsize SUV with customizable options",
      },
      {
        brand: "CHANGAN",
        model: "UNI-T",
        trim: "AVENTUS Trim",
        features: "Stylish compact SUV with futuristic design",
      },
      {
        brand: "CHANGAN",
        model: "UNI-T",
        trim: "SVP Trim",
        features: "Special Value Package with additional features",
      },
      { brand: "CHANGAN", model: "X7 PLUS", trim: "Standard Trim", features: "Midsize crossover SUV" },

      // GEELY
      {
        brand: "GEELY",
        model: "AZKARRA",
        trim: "PLATINUM Trim",
        features: "Available in BLUE, RED, SILVER, WHITE, BLACK, GREY color options",
      },
      {
        brand: "GEELY",
        model: "AZKARRA",
        trim: "TITANIUM Trim",
        features: "Available in BLUE, RED, SILVER, WHITE, BLACK, GREY color options",
      },
      {
        brand: "GEELY",
        model: "COOLRAY",
        trim: "DYNAMIC Trim",
        features: "Available in SILVER, WHITE, ORANGE & BLACK, RED, BLUE color options",
      },
      {
        brand: "GEELY",
        model: "COOLRAY",
        trim: "SPORT PLUS Trim",
        features: "Available in SILVER & BLACK, WHITE & BLACK, ORANGE & BLACK, RED & BLACK color options",
      },
      {
        brand: "GEELY",
        model: "EMGRAND",
        trim: "Standard Trim",
        features: "Available in CRYSTAL WHITE, MILAN WHITE, TITANIUM GREY, AMBER GOLD, MICA RED color options",
      },
      { brand: "GEELY", model: "GC9", trim: "Standard Trim", features: "Available in GREY color" },

      // GWM
      {
        brand: "GWM",
        model: "TANK500",
        trim: "LUX Trim",
        features: '3.0 TWIN TURBO V6, 9 SPEED AUTOMATIC, 7 SEATS, 19" RIMS, BROWN INTERIOR, BLACK EXTERIOR',
      },

      // KMC
      {
        brand: "KMC",
        model: "1.5 TON",
        trim: "Standard Trim",
        features: "Available in BLACK, RED, WHITE color options",
      },
      { brand: "KMC", model: "3 TON", trim: "Standard Trim", features: "Available in BLACK, RED, WHITE color options" },
      { brand: "KMC", model: "7 TON", trim: "Standard Trim", features: "Available in BLACK, RED, WHITE color options" },

      // NISSAN
      {
        brand: "NISSAN",
        model: "NAVARA",
        trim: "Standard Trim",
        features: "Available in BLACK, SILVER, WHITE color options",
      },
      { brand: "NISSAN", model: "TERRA", trim: "Standard Trim", features: "Available in WHITE color option" },

      // ZNA
      {
        brand: "ZNA",
        model: "RICH6",
        trim: "4X2 Trim",
        features: "Available in SILVER, WHITE, BLACK, BLUE, GREEN, RED color options",
      },
      {
        brand: "ZNA",
        model: "RICH6",
        trim: "4X4 LUXURY Trim",
        features: "Available in WHITE, BLACK, BLUE color options",
      },
      {
        brand: "ZNA",
        model: "RICH6",
        trim: "4X4 STANDARD Trim",
        features: "Available in SILVER, WHITE, BLACK, BLUE color options",
      },
    ]

    for (const trim of trimData) {
      // Get brand ID
      const brandResult = await sql`
        SELECT id FROM brands WHERE name = ${trim.brand}
      `

      if (brandResult.length > 0) {
        const brandId = brandResult[0].id

        // Get model ID
        const modelResult = await sql`
          SELECT id FROM models WHERE name = ${trim.model} AND brand_id = ${brandId}
        `

        if (modelResult.length > 0) {
          const modelId = modelResult[0].id

          // Check if trim exists
          const existingTrim = await sql`
            SELECT id FROM trims WHERE model_id = ${modelId} AND name = ${trim.trim}
          `

          if (existingTrim.length === 0) {
            await sql`
              INSERT INTO trims (model_id, name, features, created_at)
              VALUES (${modelId}, ${trim.trim}, ${trim.features}, NOW())
            `
          }
        }
      }
    }

    // Make sure we have all the colors in the database
    const colors = [
      "RED",
      "YELLOW",
      "WHITE",
      "BLACK",
      "BLUE",
      "SILVER",
      "GREY",
      "ORANGE",
      "GOLD",
      "GREEN",
      "CRYSTAL WHITE",
      "MILAN WHITE",
      "TITANIUM GREY",
      "AMBER GOLD",
      "MICA RED",
      "DARK GREY",
      "BROWN",
    ]

    for (const color of colors) {
      // Check if color exists
      const existingColor = await sql`
        SELECT id FROM colors WHERE name = ${color}
      `

      if (existingColor.length === 0) {
        await sql`
          INSERT INTO colors (name)
          VALUES (${color})
        `
      }
    }

    return { success: true, message: "Vehicle data seeded successfully" }
  } catch (error) {
    console.error("Error seeding vehicle data:", error)
    return { success: false, message: "Failed to seed vehicle data", error: String(error) }
  }
}
