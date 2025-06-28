"use server"

import { sql } from "@/lib/db"

export async function updateDatabaseSchema() {
  try {
    // Add hex_code column to colors table if it doesn't exist
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'colors' AND column_name = 'hex_code'
        ) THEN
          ALTER TABLE colors ADD COLUMN hex_code VARCHAR(10);
        END IF;
      END $$;
    `

    // Add logo_url and description columns to brands table if they don't exist
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'brands' AND column_name = 'logo_url'
        ) THEN
          ALTER TABLE brands ADD COLUMN logo_url VARCHAR(255);
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'brands' AND column_name = 'description'
        ) THEN
          ALTER TABLE brands ADD COLUMN description TEXT;
        END IF;
      END $$;
    `

    // Add description and image_url columns to models table if they don't exist
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'models' AND column_name = 'description'
        ) THEN
          ALTER TABLE models ADD COLUMN description TEXT;
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'models' AND column_name = 'image_url'
        ) THEN
          ALTER TABLE models ADD COLUMN image_url VARCHAR(255);
        END IF;
      END $$;
    `

    // Add notes column to vehicles table if it doesn't exist
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'vehicles' AND column_name = 'notes'
        ) THEN
          ALTER TABLE vehicles ADD COLUMN notes TEXT;
        END IF;
      END $$;
    `

    return { success: true, message: "Database schema updated successfully" }
  } catch (error) {
    console.error("Error updating database schema:", error)
    return { success: false, message: "Failed to update database schema", error: String(error) }
  }
}
