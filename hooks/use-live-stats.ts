"use client"

import { useLiveData } from "./use-live-data"

interface Stats {
  totalUsers?: number
  totalProperties?: number
  propertiesThisMonth?: number
  totalMovements?: number
  totalActiveUsers?: number
  alerts?: any[]
  recentActivity?: any[]
  [key: string]: any
}

interface UseLiveStatsOptions {
  endpoint: string
  interval?: number
  shouldFetch?: boolean
}

/**
 * Hook especializado para obtener estadísticas en vivo
 */
export function useLiveStats(options: UseLiveStatsOptions) {
  const { endpoint, interval = 5000, shouldFetch = true } = options

  const { data, loading, error, refetch } = useLiveData<Stats>({
    endpoint,
    interval,
    shouldFetch,
  })

  return {
    stats: data || {},
    loading,
    error,
    refetch,
  }
}
