import { NextResponse } from "next/server"
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

export async function GET() {
  try {
    // Test password hashing first
    const testHashes = {
      "mikano2024!": hashPassword("mikano2024!"),
      "motors2024!": hashPassword("motors2024!"),
    }

    console.log("Test hashes:", testHashes)

    // Check if users table exists
    const { data: users, error } = await supabase
      .from("users")
      .select("email, password_hash, full_name, role, active, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Database error",
        error: error.message,
        code: error.code,
        tableExists: false,
        testHashes,
        setupInstructions: {
          step1: "Go to your Supabase dashboard",
          step2: "Navigate to SQL Editor",
          step3: "Run the SQL script below",
          sqlScript: `-- Create users table with CORRECT password hashes
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);

-- Insert users with CORRECT password hashes
INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', '${testHashes["mikano2024!"]}', 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', '${testHashes["motors2024!"]}', 'Mikano Motors Admin', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();`,
        },
      })
    }

    // Test password matching
    const hashMatches =
      users?.map((user) => ({
        email: user.email,
        storedHash: user.password_hash,
        expectedMikanoHash: testHashes["mikano2024!"],
        expectedMotorsHash: testHashes["motors2024!"],
        mikanoMatch: user.password_hash === testHashes["mikano2024!"],
        motorsMatch: user.password_hash === testHashes["motors2024!"],
      })) || []

    return NextResponse.json({
      success: true,
      tableExists: true,
      userCount: users?.length || 0,
      users:
        users?.map((user) => ({
          email: user.email,
          passwordHash: user.password_hash,
          fullName: user.full_name,
          role: user.role,
          active: user.active,
          createdAt: user.created_at,
        })) || [],
      testHashes,
      hashMatches,
      recommendation: hashMatches.some((m) => m.mikanoMatch || m.motorsMatch)
        ? "✅ Password hashes match - login should work"
        : "❌ Password hashes don't match - need to update database",
      fixScript: `-- Fix password hashes in existing table
UPDATE public.users SET password_hash = '${testHashes["mikano2024!"]}' WHERE email = 'nicholasfcoker@googlemail.com';
UPDATE public.users SET password_hash = '${testHashes["motors2024!"]}' WHERE email = 'mikanomotors23@gmail.com';`,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
