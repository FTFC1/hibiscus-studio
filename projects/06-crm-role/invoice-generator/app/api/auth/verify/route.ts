import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/simple-jwt"

export async function GET(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 },
      )
    }

    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "No token provided",
        },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token, JWT_SECRET)

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp,
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Token verification failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 },
    )
  }
}
