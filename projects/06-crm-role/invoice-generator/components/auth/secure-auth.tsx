"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Loader2, CheckCircle, XCircle, Database, Copy, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SecureAuthProps {
  onAuthenticated: (token: string, user: { email: string; role: string }) => void
}

export function SecureAuth({ onAuthenticated }: SecureAuthProps) {
  const [email, setEmail] = useState("nicholasfcoker@googlemail.com")
  const [password, setPassword] = useState("mikano2024!")
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Test system on component mount
  const testSystem = async () => {
    setTestLoading(true)
    try {
      console.log("Testing system setup...")

      // Test JWT first
      const jwtResponse = await fetch("/api/test-auth")
      const jwtResult = await jwtResponse.json()

      // Test database
      const dbResponse = await fetch("/api/debug/users")
      const dbResult = await dbResponse.json()

      // Test hash calculation
      const hashResponse = await fetch("/api/test/hash")
      const hashResult = await hashResponse.json()

      setTestResult({
        jwt: jwtResult,
        database: dbResult,
        hash: hashResult,
        overall: jwtResult.success && dbResult.success,
      })

      setDebugInfo(dbResult)

      console.log("System Test Results:", {
        jwt: jwtResult.success,
        database: dbResult.success,
        tableExists: dbResult.tableExists,
        correctHashes: hashResult.correctHashes,
      })
    } catch (error) {
      console.error("System test failed:", error)
      setTestResult({
        jwt: { success: false, message: "JWT test failed" },
        database: { success: false, message: "Database test failed" },
        overall: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setTestLoading(false)
    }
  }

  useEffect(() => {
    testSystem()
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Attempting login for:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (data.success && data.token) {
        toast({
          title: "Access Granted",
          description: `Welcome ${data.user.name || data.user.email}!`,
        })

        onAuthenticated(data.token, data.user)
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        })

        if (data.debug) {
          console.error("Login debug info:", data.debug)
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      toast({
        title: "Authentication Error",
        description: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "SQL script copied to clipboard",
    })
  }

  const getSystemStatus = () => {
    if (testLoading)
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />,
        color: "border-blue-200 bg-blue-50",
        message: "Testing system...",
      }

    if (testResult?.overall && debugInfo?.recommendation?.includes("✅")) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        color: "border-green-200 bg-green-50",
        message: `✅ System Ready - ${debugInfo?.userCount || 0} users, hashes match`,
      }
    }

    if (testResult?.database?.tableExists && debugInfo?.recommendation?.includes("❌")) {
      return {
        icon: <XCircle className="h-4 w-4 text-orange-600" />,
        color: "border-orange-200 bg-orange-50",
        message: "⚠️ Password hash mismatch - needs fixing",
      }
    }

    return {
      icon: <XCircle className="h-4 w-4 text-red-600" />,
      color: "border-red-200 bg-red-50",
      message: "❌ System Error - Database setup required",
    }
  }

  const status = getSystemStatus()
  const isFormValid = email.trim() !== "" && password.trim() !== ""
  const canSubmit = isFormValid && !loading

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-red-600">Mikano Motors PFI Tool</CardTitle>
          <p className="text-gray-600">Secure access for authorized personnel</p>
        </CardHeader>
        <CardContent>
          {/* System Status */}
          <Alert className={`mb-4 ${status.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status.icon}
                <AlertDescription>
                  <strong>System Status:</strong> {status.message}
                  {debugInfo && (
                    <>
                      <br />
                      <small>
                        Database: {debugInfo.tableExists ? "✅ Connected" : "❌ Not found"} | JWT:{" "}
                        {testResult?.jwt?.success ? "✅ Working" : "❌ Error"}
                      </small>
                    </>
                  )}
                </AlertDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={testSystem} disabled={testLoading}>
                <RefreshCw className={`h-4 w-4 ${testLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </Alert>

          {/* Database Setup Instructions */}
          {!testLoading && debugInfo && !debugInfo.tableExists && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <Database className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <strong>⚠️ Database Setup Required</strong>
                    <br />
                    <small>The users table doesn't exist yet. Follow these steps:</small>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        1
                      </span>
                      <span>Go to your Supabase dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        2
                      </span>
                      <span>Click on "SQL Editor" in the sidebar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        3
                      </span>
                      <span>Copy and run this SQL script:</span>
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto max-h-40 font-mono">
                      {`-- Create users table with CORRECT password hashes
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);

INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', '${testResult?.hash?.correctHashes?.["mikano2024!"] || "nnlu9g"}', 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', '${testResult?.hash?.correctHashes?.["motors2024!"] || "nnlu9g"}', 'Mikano Motors Admin', 'admin', true)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;`}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/90"
                      onClick={() =>
                        copyToClipboard(`-- Create users table with CORRECT password hashes
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);

INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', '${testResult?.hash?.correctHashes?.["mikano2024!"] || "nnlu9g"}', 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', '${testResult?.hash?.correctHashes?.["motors2024!"] || "nnlu9g"}', 'Mikano Motors Admin', 'admin', true)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Hash Mismatch Fix */}
          {!testLoading && debugInfo && debugInfo.tableExists && debugInfo.recommendation?.includes("❌") && (
            <Alert className="mb-4 border-orange-200 bg-orange-50">
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <strong>⚠️ Password Hash Mismatch Detected</strong>
                    <br />
                    <small>The stored password hashes don't match the calculated ones. Run this fix:</small>
                  </div>

                  <div className="relative">
                    <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto max-h-32 font-mono">
                      {debugInfo.fixScript ||
                        `-- Fix password hashes
UPDATE public.users SET password_hash = '${testResult?.hash?.correctHashes?.["mikano2024!"] || "nnlu9g"}' WHERE email = 'nicholasfcoker@googlemail.com';
UPDATE public.users SET password_hash = '${testResult?.hash?.correctHashes?.["motors2024!"] || "nnlu9g"}' WHERE email = 'mikanomotors23@gmail.com';`}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/90"
                      onClick={() =>
                        copyToClipboard(
                          debugInfo.fixScript ||
                            `-- Fix password hashes
UPDATE public.users SET password_hash = '${testResult?.hash?.correctHashes?.["mikano2024!"] || "nnlu9g"}' WHERE email = 'nicholasfcoker@googlemail.com';
UPDATE public.users SET password_hash = '${testResult?.hash?.correctHashes?.["motors2024!"] || "nnlu9g"}' WHERE email = 'mikanomotors23@gmail.com';`,
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-sm text-orange-700">
                    After running the fix script, click the refresh button above to test again.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Credentials Info */}
          <div className="mt-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Login Credentials:</strong>
                <br />📧 nicholasfcoker@googlemail.com
                <br />🔑 mikano2024!
                <br />
                <br />📧 mikanomotors23@gmail.com
                <br />🔑 motors2024!
                <br />
                <br />
                <small>
                  Expected hash: <code>{testResult?.hash?.correctHashes?.["mikano2024!"] || "nnlu9g"}</code>
                </small>
              </AlertDescription>
            </Alert>
          </div>

          {/* Debug Info */}
          {debugInfo && (
            <details className="mt-4">
              <summary className="text-sm text-gray-500 cursor-pointer">
                🔧 System Debug Info {testResult?.overall ? "✅" : "❌"}
              </summary>
              <div className="text-xs bg-gray-100 p-2 rounded mt-2 space-y-2 max-h-60 overflow-auto">
                {testResult?.hash && (
                  <div>
                    <strong>Password Hashes:</strong>
                    <pre>{JSON.stringify(testResult.hash.correctHashes, null, 2)}</pre>
                  </div>
                )}
                <div>
                  <strong>Database Status:</strong>
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
