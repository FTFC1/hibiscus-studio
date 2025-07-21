import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/simple-jwt"
import { database } from "@/lib/database"
import type { PFI } from "@/lib/types"

async function authorizeRequest(request: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    return {
      authorized: false,
      response: NextResponse.json({ message: "Server configuration error" }, { status: 500 }),
    }
  }

  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) }
  }

  const token = authHeader.substring(7)
  if (!verifyToken(token, JWT_SECRET)) {
    return { authorized: false, response: NextResponse.json({ message: "Invalid token" }, { status: 401 }) }
  }

  return { authorized: true, response: null }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authorizeRequest(request)
  if (!auth.authorized) return auth.response

  try {
    const pfiData = (await request.json()) as PFI
    if (params.id !== pfiData.id) {
      return NextResponse.json({ message: "ID mismatch" }, { status: 400 })
    }
    const savedPfi = await database.savePFI(pfiData)
    return NextResponse.json(savedPfi)
  } catch (error) {
    console.error(`Error updating PFI ${params.id}:`, error)
    return NextResponse.json({ message: "Error updating PFI" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authorizeRequest(request)
  if (!auth.authorized) return auth.response

  try {
    await database.deletePFI(params.id)
    return NextResponse.json({ message: "PFI deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error(`Error deleting PFI ${params.id}:`, error)
    return NextResponse.json({ message: "Error deleting PFI" }, { status: 500 })
  }
}
