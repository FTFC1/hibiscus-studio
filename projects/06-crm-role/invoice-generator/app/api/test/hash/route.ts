import { NextResponse } from "next/server"

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
  const testPasswords = ["mikano2024!", "motors2024!", "test123", "password"]

  const results = testPasswords.map((password) => {
    const combined = password + "mikano-motors-salt-2024"
    let hash = 0

    // Show step-by-step calculation
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash | 0
    }

    const finalHash = Math.abs(hash).toString(36)

    return {
      password,
      hash: finalHash,
      steps: {
        combined,
        combinedLength: combined.length,
        rawHash: hash,
        absHash: Math.abs(hash),
        base36: finalHash,
      },
    }
  })

  return NextResponse.json({
    success: true,
    algorithm: "Simple hash with salt",
    salt: "mikano-motors-salt-2024",
    results,
    note: "Use these exact hashes in the database",
    correctHashes: {
      "mikano2024!": hashPassword("mikano2024!"),
      "motors2024!": hashPassword("motors2024!"),
    },
  })
}
