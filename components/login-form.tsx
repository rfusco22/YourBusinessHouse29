'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}
