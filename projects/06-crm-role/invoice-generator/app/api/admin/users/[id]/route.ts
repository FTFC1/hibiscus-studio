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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    if (!email || !full_name) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      email: email.toLowerCase().trim(),
      full_name,
      role: role || "user",
      active: active !== false,
      updated_at: new Date().toISOString(),
    }

    // Only update password if provided
    if (password && password.trim()) {
      updateData.password_hash = hashPassword(password)
    }

    // Update user
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", params.id)
      .select("id, email, full_name, role, active, created_at, updated_at")
      .single()

    if (error) {
      console.error("Update user error:", error)
      if (error.code === "23505") {
        return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 })
      }
      return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { data: currentUser } = await supabase.from("users").select("role, email").eq("email", decoded.email).single()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    // Check if trying to delete self
    const { data: targetUser } = await supabase.from("users").select("email").eq("id", params.id).single()

    if (targetUser && targetUser.email === currentUser.email) {
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 })
    }

    // Delete user
    const { error } = await supabase.from("users").delete().eq("id", params.id)

    if (error) {
      console.error("Delete user error:", error)
      return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
