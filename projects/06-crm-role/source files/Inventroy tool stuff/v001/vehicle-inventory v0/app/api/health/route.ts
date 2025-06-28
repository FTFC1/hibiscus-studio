import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Simple query to check database connection
    const result = await sql`SELECT NOW() as time`

    return NextResponse.json({
      status: "ok",
      database: "connected",
      time: result[0]?.time,
    })
  } catch (error) {
    console.error("Database health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
