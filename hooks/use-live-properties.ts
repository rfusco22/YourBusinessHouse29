"use client"

import { useLiveData } from "./use-live-data"

interface Property {
  id: number
  title: string
  location: string
  price: number
  image_url?: string
  bedrooms: number
  bathrooms: number
  area: number
  status?: string
  type?: string
  description?: string
  owner_id?: number
  amenities?: string[]
}

interface LivePropertiesResponse {
  data: Property[]
  total?: number
}

interface UseLivePropertiesOptions {
  userId?: number
  status?: string
  limit?: number
  interval?: number
  shouldFetch?: boolean
}

/**
 * Hook especializado para obtener propiedades en vivo
 */
export function useLiveProperties(options: UseLivePropertiesOptions = {}) {
  const { userId, status, limit, interval = 5000, shouldFetch = true } = options

  // Construir URL con parámetros
  let endpoint = "/api/properties"
  const params = new URLSearchParams()
  if (userId) params.append("userId", userId.toString())
  if (status) params.append("status", status)
  if (limit) params.append("limit", limit.toString())

  if (params.toString()) {
    endpoint += `?${params.toString()}`
  }

  const { data, loading, error, refetch } = useLiveData<LivePropertiesResponse>({
    endpoint,
    interval,
    shouldFetch,
  })

  return {
    properties: data?.data || [],
    total: data?.total || 0,
    loading,
    error,
    refetch,
  }
}
