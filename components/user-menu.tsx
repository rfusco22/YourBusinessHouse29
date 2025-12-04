'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'
import { getStoredUser, clearAuthData } from '@/lib/auth'

export function UserMenu() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const user = getStoredUser()

  const handleLogout = () => {
    clearAuthData()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {user.name.charAt(0)}
        </div>
        <span className="text-white hidden sm:inline">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-lg border border-primary/20">
          <div className="p-4 border-b border-primary/20">
            <p className="text-white font-semibold text-sm">{user.name}</p>
            <p className="text-gray-400 text-xs">{user.email}</p>
            <p className="text-primary text-xs mt-1 font-semibold uppercase">{user.role}</p>
          </div>

          <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-primary/20 transition-colors flex items-center gap-2">
            <User size={16} />
            Perfil
          </button>

          <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-primary/20 transition-colors flex items-center gap-2">
            <Settings size={16} />
            Configuración
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors flex items-center gap-2 border-t border-primary/20"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  )
}
