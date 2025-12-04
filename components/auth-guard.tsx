'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { getStoredUser } from '@/lib/auth'

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const user = getStoredUser()

    if (!user) {
      router.push('/login')
      return
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.push('/')
      return
    }
  }, [router, requiredRoles])

  const user = getStoredUser()
  if (!user) return null

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
