import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelId = searchParams.get("modelId")

    if (!modelId) {
      return NextResponse.json({ error: "Model ID is required" }, { status: 400 })
    }

    const trims = await sql`
      SELECT id, name, features
      FROM trims
      WHERE model_id = ${Number.parseInt(modelId)}
      ORDER BY name
    `

    return NextResponse.json(trims)
  } catch (error) {
    console.error("Error fetching trims:", error)
    return NextResponse.json({ error: "Failed to fetch trims" }, { status: 500 })
  }
}
