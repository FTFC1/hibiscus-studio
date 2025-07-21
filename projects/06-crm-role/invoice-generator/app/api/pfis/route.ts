import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/simple-jwt"
import { database } from "@/lib/database"
import type { PFI } from "@/lib/types"

export async function GET(request: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
  }

  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.substring(7)
  if (!verifyToken(token, JWT_SECRET)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  try {
    const pfis = await database.getPFIs()
    return NextResponse.json(pfis)
  } catch (error) {
    console.error("Error fetching PFIs:", error)
    return NextResponse.json({ message: "Error fetching PFIs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
  }

  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.substring(7)
  if (!verifyToken(token, JWT_SECRET)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  try {
    const pfiData = (await request.json()) as PFI
    const savedPfi = await database.savePFI(pfiData)
    return NextResponse.json(savedPfi, { status: 201 })
  } catch (error) {
    console.error("Error saving PFI:", error)
    return NextResponse.json({ message: "Error saving PFI" }, { status: 500 })
  }
}
