"use client"

import { useEffect, useState, useCallback } from "react"

interface UseLiveDataOptions {
  endpoint: string
  interval?: number // milliseconds, default 5000ms (5 seconds)
  onError?: (error: Error) => void
  shouldFetch?: boolean
}

interface UseLiveDataReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook para obtener datos en vivo con polling automático
 * Actualiza los datos automáticamente sin recargar la página
 */
export function useLiveData<T>(options: UseLiveDataOptions): UseLiveDataReturn<T> {
  const { endpoint, interval = 5000, onError, shouldFetch = true } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return

    try {
      setError(null)
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error(`Error: ${response.statusText}`)

      const result = await response.json()
      setData(result)
      setLoading(false)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
      setLoading(false)
    }
  }, [endpoint, shouldFetch, onError])

  // Fetch inicial
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Polling automático
  useEffect(() => {
    if (!shouldFetch) return

    const timer = setInterval(fetchData, interval)
    return () => clearInterval(timer)
  }, [fetchData, interval, shouldFetch])

  return { data, loading, error, refetch: fetchData }
}
