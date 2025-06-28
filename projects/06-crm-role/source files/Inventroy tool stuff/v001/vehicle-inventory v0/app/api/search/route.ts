import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query.trim()) {
      return NextResponse.json({ brands: [], models: [] })
    }

    console.log(`[Server] Executing search for: "${query}"`)
    const startTime = performance.now()

    // First check if pg_trgm extension is available
    const extensionCheck = await sql`
      SELECT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
      ) as is_installed;
    `

    const isExtensionInstalled = extensionCheck[0]?.is_installed || false

    let results

    if (isExtensionInstalled) {
      // Use PostgreSQL's trigram similarity for fuzzy matching if available
      results = await sql`
        WITH search_results AS (
          -- Search in brands
          SELECT 
            b.id as brand_id,
            b.name as brand_name,
            NULL as model_id,
            NULL as model_name,
            NULL as category,
            NULL as fuel_type,
            NULL as drive_type,
            NULL as transmission,
            similarity(b.name, ${query}) as score,
            'brand' as result_type
          FROM 
            brands b
          WHERE 
            similarity(b.name, ${query}) > 0.3
            
          UNION ALL
          
          -- Search in models
          SELECT 
            b.id as brand_id,
            b.name as brand_name,
            m.id as model_id,
            m.name as model_name,
            m.category,
            m.fuel_type,
            m.drive_type,
            m.transmission,
            greatest(
              similarity(m.name, ${query}),
              similarity(m.category, ${query}),
              similarity(m.fuel_type, ${query}),
              similarity(m.drive_type, ${query}),
              similarity(m.transmission, ${query})
            ) as score,
            'model' as result_type
          FROM 
            models m
          JOIN 
            brands b ON m.brand_id = b.id
          WHERE 
            similarity(m.name, ${query}) > 0.3 OR
            similarity(m.category, ${query}) > 0.3 OR
            similarity(m.fuel_type, ${query}) > 0.3 OR
            similarity(m.drive_type, ${query}) > 0.3 OR
            similarity(m.transmission, ${query}) > 0.3
        )
        
        SELECT * FROM search_results
        ORDER BY score DESC, result_type, brand_name, model_name
        LIMIT 50;
      `
    } else {
      // Fallback to basic ILIKE search if pg_trgm is not available
      console.log("[Server] pg_trgm extension not available, using basic search")

      results = await sql`
        WITH search_results AS (
          -- Search in brands
          SELECT 
            b.id as brand_id,
            b.name as brand_name,
            NULL as model_id,
            NULL as model_name,
            NULL as category,
            NULL as fuel_type,
            NULL as drive_type,
            NULL as transmission,
            1.0 as score,
            'brand' as result_type
          FROM 
            brands b
          WHERE 
            b.name ILIKE ${"%" + query + "%"}
            
          UNION ALL
          
          -- Search in models
          SELECT 
            b.id as brand_id,
            b.name as brand_name,
            m.id as model_id,
            m.name as model_name,
            m.category,
            m.fuel_type,
            m.drive_type,
            m.transmission,
            1.0 as score,
            'model' as result_type
          FROM 
            models m
          JOIN 
            brands b ON m.brand_id = b.id
          WHERE 
            m.name ILIKE ${"%" + query + "%"} OR
            m.category ILIKE ${"%" + query + "%"} OR
            m.fuel_type ILIKE ${"%" + query + "%"} OR
            m.drive_type ILIKE ${"%" + query + "%"} OR
            m.transmission ILIKE ${"%" + query + "%"}
        )
        
        SELECT * FROM search_results
        ORDER BY result_type, brand_name, model_name
        LIMIT 50;
      `
    }

    // Process results to group by brands
    const brands = new Map()
    const models = []

    for (const row of results) {
      if (row.result_type === "brand") {
        brands.set(row.brand_id, {
          id: row.brand_id,
          name: row.brand_name,
          score: row.score,
          models: [],
        })
      } else if (row.result_type === "model") {
        models.push({
          id: row.model_id,
          name: row.model_name,
          brand_id: row.brand_id,
          brand_name: row.brand_name,
          category: row.category,
          fuel_type: row.fuel_type,
          drive_type: row.drive_type,
          transmission: row.transmission,
          score: row.score,
        })

        // Add this model's brand to the brands map if not already there
        if (!brands.has(row.brand_id)) {
          brands.set(row.brand_id, {
            id: row.brand_id,
            name: row.brand_name,
            score: 0,
            models: [],
          })
        }
      }
    }

    // Group models by brand
    for (const model of models) {
      if (brands.has(model.brand_id)) {
        const brand = brands.get(model.brand_id)
        brand.models.push(model)
      }
    }

    const endTime = performance.now()
    console.log(
      `[Server] Search completed in ${(endTime - startTime).toFixed(2)}ms, found ${brands.size} brands and ${models.length} models`,
    )

    return NextResponse.json({
      brands: Array.from(brands.values()),
      models: models,
      timing: {
        query: endTime - startTime,
      },
      fuzzySearch: isExtensionInstalled,
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 })
  }
}
