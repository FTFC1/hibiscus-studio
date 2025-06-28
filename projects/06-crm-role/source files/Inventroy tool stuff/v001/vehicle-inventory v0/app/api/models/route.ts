import { NextResponse } from "next/server"
import { getAllModels } from "@/app/actions/model-actions"

export async function GET() {
  try {
    const models = await getAllModels()
    return NextResponse.json(models)
  } catch (error) {
    console.error("Error fetching models:", error)
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
  }
}
