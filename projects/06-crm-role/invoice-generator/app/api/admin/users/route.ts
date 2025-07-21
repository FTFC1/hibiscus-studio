import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/simple-jwt"
import { supabase } from "@/lib/supabase"

// Simple password hashing function
function hashPassword(password: string): string {
  let hash = 0
  const salt = "mikano-motors-salt-2024"
  const combined = password + salt
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash | 0 // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

export async function GET(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 })
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token, JWT_SECRET)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    // Check if user is admin
    const { data: currentUser } = await supabase.from("users").select("role").eq("email", decoded.email).single()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    // Get all users
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, full_name, role, active, created_at, last_login")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Database error" }, { status: 500 })
    }

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 })
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token, JWT_SECRET)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    // Check if user is admin
    const { data: currentUser } = await supabase.from("users").select("role").eq("email", decoded.email).single()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    const { email, password, full_name, role, active } = await request.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Hash password
    const password_hash = hashPassword(password)

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase().trim(),
        password_hash,
        full_name,
        role: role || "user",
        active: active !== false,
      })
      .select("id, email, full_name, role, active, created_at")
      .single()

    if (error) {
      console.error("Create user error:", error)
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 })
      }
      return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
