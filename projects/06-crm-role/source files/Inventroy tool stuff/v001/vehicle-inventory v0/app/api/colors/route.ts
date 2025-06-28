import { NextResponse } from "next/server"
import { getAllColors } from "@/app/actions/color-actions"

export async function GET() {
  try {
    const colors = await getAllColors()
    return NextResponse.json(colors)
  } catch (error) {
    console.error("Error fetching colors:", error)
    return NextResponse.json({ error: "Failed to fetch colors" }, { status: 500 })
  }
}
