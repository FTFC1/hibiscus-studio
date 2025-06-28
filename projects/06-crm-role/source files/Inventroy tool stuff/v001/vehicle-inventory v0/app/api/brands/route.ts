import { NextResponse } from "next/server"
import { getBrands } from "@/app/actions"

export async function GET() {
  try {
    const brands = await getBrands()
    return NextResponse.json(brands)
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
  }
}
