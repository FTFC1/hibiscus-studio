import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook for Supabase queries with error handling, retry, and offline awareness.
 *
 * @param {Function} queryFn - async function that returns { data, error }
 * @param {Object} opts
 * @param {Array} opts.deps - dependency array (re-fetches when these change)
 * @param {boolean} opts.enabled - skip fetch when false (default: true)
 * @param {number} opts.retries - max retry attempts (default: 2)
 * @returns {{ data, error, loading, refetch, isOffline }}
 */
export function useSupabaseQuery(queryFn, { deps = [], enabled = true, retries = 2 } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const attemptRef = useRef(0)

  useEffect(() => {
    const goOnline = () => setIsOffline(false)
    const goOffline = () => setIsOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOffline(true)
      setError(new Error('You are offline'))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    attemptRef.current = 0

    while (attemptRef.current <= retries) {
      try {
        const result = await queryFn()

        // Handle Supabase { data, error } pattern
        if (result?.error) {
          throw result.error
        }

        setData(result?.data ?? result)
        setError(null)
        setLoading(false)
        return
      } catch (err) {
        attemptRef.current++
        if (attemptRef.current > retries) {
          setError(err)
          setLoading(false)
          return
        }
        // Brief delay before retry
        await new Promise(r => setTimeout(r, 1000 * attemptRef.current))
      }
    }
  }, [queryFn, retries])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    fetchData()
  }, [enabled, ...deps])

  // Auto-retry when coming back online
  useEffect(() => {
    if (!isOffline && error && enabled) {
      fetchData()
    }
  }, [isOffline])

  return { data, error, loading, refetch: fetchData, isOffline }
}
