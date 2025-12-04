// Authentication utility functions
export interface User {
  id: number
  email: string
  name: string
  role: "admin" | "gerencia" | "asesor"
  avatar_url?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export const setAuthData = (token: string, user: User) => {
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}

export const clearAuthData = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export const isAuthenticated = (): boolean => {
  return !!getStoredToken()
}

export const hasRole = (requiredRoles: string[]): boolean => {
  const user = getStoredUser()
  return user ? requiredRoles.includes(user.role) : false
}
