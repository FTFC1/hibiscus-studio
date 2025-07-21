"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield, Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const AUTHORIZED_EMAILS = ["nicholasfcoker@googlemail.com", "mikanomotors23@gmail.com"]

export function MagicLinkAuth() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setDebugInfo("")

    const emailLower = email.toLowerCase().trim()

    // Check if email is authorized
    if (!AUTHORIZED_EMAILS.includes(emailLower)) {
      toast({
        title: "Access Denied",
        description: "This email is not authorized to access the system. Please contact your administrator.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      console.log("Attempting to send magic link to:", emailLower)

      const { data, error } = await supabase.auth.signInWithOtp({
        email: emailLower,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true, // Allow user creation if needed
        },
      })

      console.log("Magic link response:", { data, error })
      setDebugInfo(`Response: ${JSON.stringify({ data, error }, null, 2)}`)

      if (error) {
        console.error("Magic link error:", error)
        toast({
          title: "Error Sending Magic Link",
          description: `${error.message}. Please try again or contact support.`,
          variant: "destructive",
        })
      } else {
        setLinkSent(true)
        toast({
          title: "Magic Link Sent!",
          description: "Check your email (including spam folder) for a secure sign-in link.",
        })
      }
    } catch (error) {
      console.error("Magic link catch error:", error)
      setDebugInfo(`Catch error: ${error}`)
      toast({
        title: "Network Error",
        description: "Failed to connect to authentication service. Please check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Alternative: Direct sign-in for testing
  const handleDirectSignIn = async () => {
    try {
      // For testing - you can remove this in production
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.error("Anonymous sign-in error:", error)
      } else {
        console.log("Anonymous sign-in success:", data)
        toast({
          title: "Signed in for testing",
          description: "Using anonymous authentication for development.",
        })
      }
    } catch (error) {
      console.error("Direct sign-in error:", error)
    }
  }

  if (linkSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-600">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">We've sent a secure sign-in link to:</p>
            <p className="font-medium text-gray-900 bg-gray-100 p-3 rounded-lg break-all">{email}</p>

            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Email not arriving? Check these:</strong>
                <br />• Spam/Junk folder
                <br />• Promotions tab (Gmail)
                <br />• Email filters blocking the message
                <br />• Wait 2-3 minutes for delivery
                <br />
                <br />
                <strong>From:</strong> noreply@mail.app.supabase.io
                <br />
                <strong>Subject:</strong> Confirm your signup
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setLinkSent(false)
                  setEmail("")
                  setDebugInfo("")
                }}
                className="flex-1"
              >
                Use Different Email
              </Button>
              <Button
                onClick={() => handleMagicLink({ preventDefault: () => {} } as React.FormEvent)}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Resend
                  </>
                )}
              </Button>
            </div>

            {/* Debug info for troubleshooting */}
            {debugInfo && (
              <details className="text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">Debug Info</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">{debugInfo}</pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-red-600">Mikano Motors PFI Tool</CardTitle>
          <p className="text-gray-600">Secure access for authorized users</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your authorized email"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <Button type="submit" disabled={loading || !email} className="w-full bg-red-600 hover:bg-red-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>

          {/* Temporary bypass for testing */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Email Issues?</p>
                <p className="text-yellow-700 mb-2">
                  If magic links aren't working, this might be a Supabase configuration issue.
                </p>
                <Button
                  onClick={handleDirectSignIn}
                  variant="outline"
                  size="sm"
                  className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                >
                  Bypass for Testing
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-left">
                <strong>How it works:</strong>
                <br />
                1. Enter your authorized email address
                <br />
                2. Check your email for a secure link
                <br />
                3. Click the link to sign in instantly
                <br />
                <br />
                No passwords needed - just secure, one-click access.
              </AlertDescription>
            </Alert>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">Authorized emails: {AUTHORIZED_EMAILS.join(", ")}</p>

          {/* Debug info for troubleshooting */}
          {debugInfo && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">Debug Info</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">{debugInfo}</pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
