"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from URL (magic links use hash fragments)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")

        // Also check URL params (some flows use query params)
        const urlAccessToken = searchParams.get("access_token")
        const urlRefreshToken = searchParams.get("refresh_token")
        const error = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")

        // Handle errors first
        if (error) {
          console.error("Auth error:", error, errorDescription)
          setStatus("error")
          setMessage(errorDescription || "Authentication failed")
          setTimeout(() => router.push("/"), 3000)
          return
        }

        // Try to get session from Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setStatus("error")
          setMessage("Failed to establish session")
          setTimeout(() => router.push("/"), 3000)
          return
        }

        if (sessionData.session) {
          // Success! User is authenticated
          setStatus("success")
          setMessage("Successfully signed in!")
          setTimeout(() => router.push("/"), 1500)
        } else {
          // Try to handle the tokens manually if session doesn't exist
          const token = accessToken || urlAccessToken
          const refresh = refreshToken || urlRefreshToken

          if (token && refresh) {
            const { data, error: setSessionError } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: refresh,
            })

            if (setSessionError) {
              console.error("Set session error:", setSessionError)
              setStatus("error")
              setMessage("Failed to authenticate")
              setTimeout(() => router.push("/"), 3000)
            } else if (data.session) {
              setStatus("success")
              setMessage("Successfully signed in!")
              setTimeout(() => router.push("/"), 1500)
            } else {
              setStatus("error")
              setMessage("No valid session found")
              setTimeout(() => router.push("/"), 3000)
            }
          } else {
            setStatus("error")
            setMessage("No authentication tokens found")
            setTimeout(() => router.push("/"), 3000)
          }
        }
      } catch (error) {
        console.error("Callback handling error:", error)
        setStatus("error")
        setMessage("Something went wrong during authentication")
        setTimeout(() => router.push("/"), 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
              <h2 className="text-xl font-semibold mb-2">Signing you in...</h2>
              <p className="text-gray-600">Please wait while we authenticate your account.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-xl font-semibold mb-2 text-green-600">Welcome!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h2 className="text-xl font-semibold mb-2 text-red-600">Authentication Failed</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
