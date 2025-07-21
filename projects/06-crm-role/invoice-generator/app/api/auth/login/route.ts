import { type NextRequest, NextResponse } from "next/server"
import { createToken } from "@/lib/simple-jwt"
import { supabase } from "@/lib/supabase"

// Simple password hashing function - MUST match exactly across all files
function hashPassword(password: string): string {
  let hash = 0
  const salt = "mikano-motors-salt-2024"
  const combined = password + salt

  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash | 0 // Convert to 32-bit integer
  }

  // Convert to base36 string
  const result = Math.abs(hash).toString(36)
  return result || "0"
}

export async function POST(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables")
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: JWT_SECRET not set",
        },
        { status: 500 },
      )
    }

    const { email, password } = await request.json()
    console.log("Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    const emailLower = email.toLowerCase().trim()
    const passwordHash = hashPassword(password)

    console.log("Password hash calculation:", {
      password,
      salt: "mikano-motors-salt-2024",
      combined: password + "mikano-motors-salt-2024",
      calculatedHash: passwordHash,
    })

    // First, let's check if the users table exists and has data
    const { data: tableCheck, error: tableError } = await supabase.from("users").select("id").limit(1)

    if (tableError) {
      console.error("Users table error:", tableError)
      return NextResponse.json(
        {
          success: false,
          message: "Database table not found. Please run the setup script.",
          debug: {
            error: tableError.message,
            code: tableError.code,
            hint: "Run the SQL script to create the users table",
          },
        },
        { status: 500 },
      )
    }

    // Look up user in database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", emailLower)
      .eq("active", true)
      .single()

    console.log("Database lookup result:", {
      userFound: !!user,
      error: error?.message,
      userEmail: user?.email,
      storedHash: user?.password_hash,
      calculatedHash: passwordHash,
      hashMatch: user?.password_hash === passwordHash,
    })

    if (error) {
      console.error("Database error:", error)

      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials",
            debug: {
              reason: "User not found",
              email: emailLower,
            },
          },
          { status: 401 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: "Database error occurred",
          debug: {
            error: error.message,
            code: error.code,
          },
        },
        { status: 500 },
      )
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          debug: {
            reason: "User not found",
          },
        },
        { status: 401 },
      )
    }

    // Verify password
    const isValidPassword = user.password_hash === passwordHash
    console.log("Password verification:", {
      stored: user.password_hash,
      calculated: passwordHash,
      match: isValidPassword,
    })

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          debug: {
            reason: "Password mismatch",
            storedHash: user.password_hash,
            calculatedHash: passwordHash,
            password: password,
            combined: password + "mikano-motors-salt-2024",
          },
        },
        { status: 401 },
      )
    }

    // Update last login
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    // Generate token
    const tokenPayload = {
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    }

    const token = createToken(tokenPayload, JWT_SECRET)

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role,
        name: user.full_name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
