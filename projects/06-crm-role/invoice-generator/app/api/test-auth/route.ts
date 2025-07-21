import { NextResponse } from "next/server"
import { createToken, verifyToken } from "@/lib/simple-jwt"

export async function GET() {
  try {
    // Check if JWT_SECRET exists
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      return NextResponse.json({
        success: false,
        message: "JWT_SECRET environment variable is not set",
        jwtSecretExists: false,
        jwtSecretLength: 0,
      })
    }

    // Test our simple JWT implementation
    const testPayload = {
      email: "test@example.com",
      role: "test",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    }

    const token = createToken(testPayload, JWT_SECRET)
    const decoded = verifyToken(token, JWT_SECRET)

    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: "Token verification failed",
        jwtSecretExists: true,
        jwtSecretLength: JWT_SECRET.length,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Simple JWT is working correctly!",
      jwtSecretExists: true,
      jwtSecretLength: JWT_SECRET.length,
      testToken: token.substring(0, 30) + "...",
      decodedPayload: decoded,
      implementation: "Simple JWT (no external deps)",
    })
  } catch (error) {
    console.error("JWT test error:", error)

    return NextResponse.json({
      success: false,
      message: "JWT test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      jwtSecretExists: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    })
  }
}
