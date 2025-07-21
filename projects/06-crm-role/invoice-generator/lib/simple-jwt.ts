// Simple JWT implementation without external dependencies
// For production, use a proper JWT library

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(str: string): string {
  // Add padding if needed
  str += "=".repeat((4 - (str.length % 4)) % 4)
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"))
}

function hmacSha256(message: string, secret: string): string {
  // Simple hash function - in production use crypto.createHmac
  let hash = 0
  const combined = message + secret
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

export interface JWTPayload {
  email: string
  role: string
  iat: number
  exp: number
}

export function createToken(payload: JWTPayload, secret: string): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const headerEncoded = base64UrlEncode(JSON.stringify(header))
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload))

  const message = `${headerEncoded}.${payloadEncoded}`
  const signature = hmacSha256(message, secret)
  const signatureEncoded = base64UrlEncode(signature)

  return `${message}.${signatureEncoded}`
}

export function verifyToken(token: string, secret: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts
    const message = `${headerEncoded}.${payloadEncoded}`

    // Verify signature
    const expectedSignature = hmacSha256(message, secret)
    const expectedSignatureEncoded = base64UrlEncode(expectedSignature)

    if (signatureEncoded !== expectedSignatureEncoded) {
      return null
    }

    // Decode payload
    const payloadJson = base64UrlDecode(payloadEncoded)
    const payload = JSON.parse(payloadJson) as JWTPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) {
      return null
    }

    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
