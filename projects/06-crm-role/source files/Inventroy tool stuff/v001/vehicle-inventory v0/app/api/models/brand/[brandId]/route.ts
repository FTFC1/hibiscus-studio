import { type NextRequest, NextResponse } from "next/server"
import { getModelsByBrand } from "@/app/actions"

export async function GET(request: NextRequest, { params }: { params: { brandId: string } }) {
  try {
    const brandId = Number.parseInt(params.brandId, 10)

    if (isNaN(brandId)) {
      return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 })
    }

    const models = await getModelsByBrand(brandId)
    return NextResponse.json(models)
  } catch (error) {
    console.error(`Error fetching models for brand ${params.brandId}:`, error)
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
  }
}
