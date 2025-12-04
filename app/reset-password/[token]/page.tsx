"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Validar que el token esté presente
  useEffect(() => {
    if (!token) {
      setError("Token inválido o expirado")
    }
  }, [token])

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Mínimo 8 caracteres")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Al menos una mayúscula")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Al menos una minúscula")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Al menos un número")
    }

    return errors
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)
    setValidationErrors(validatePassword(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors([])

    // Validaciones
    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    const errors = validatePassword(newPassword)
    if (errors.length > 0) {
      setValidationErrors(errors)
      setError("La contraseña no cumple los requisitos")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Error al cambiar la contraseña")
        return
      }

      setSuccess(true)

      // Redirigir después de 5 segundos
      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } catch (err) {
      setError("Error de conexión. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Volver al login
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/50 group hover:shadow-primary/75 transition-all duration-300">
              <div className="text-white font-heading font-bold text-2xl">✦</div>
              <div className="absolute inset-0 rounded-2xl border border-primary/50 group-hover:border-primary transition-all duration-300" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Cambiar Contraseña</h1>
          <p className="text-gray-400 text-sm">Ingresa tu nueva contraseña</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 border border-primary/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-slide-up">
          {success ? (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-green-400">✓</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¡Contraseña Actualizada!</h2>
              <p className="text-gray-400 mb-6">Tu contraseña ha sido cambiada exitosamente.</p>
              <p className="text-gray-500 text-sm">Serás redirigido al login en 5 segundos...</p>
              <div className="mt-6 w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full animate-[width_5s_linear_infinite]"
                  style={{ animation: "progress 5s linear" }}
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-gray-300 block">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 group-hover:border-primary/50"
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

              {/* Password Requirements */}
              {newPassword && (
                <div className="p-3 bg-neutral-700/30 border border-neutral-600 rounded-lg">
                  <p className="text-xs font-semibold text-gray-300 mb-2">Requisitos:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={newPassword.length >= 8 ? "text-green-400" : "text-gray-500"}>
                      ✓ Mínimo 8 caracteres
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? "text-green-400" : "text-gray-500"}>
                      ✓ Al menos una mayúscula
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? "text-green-400" : "text-gray-500"}>
                      ✓ Al menos una minúscula
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? "text-green-400" : "text-gray-500"}>
                      ✓ Al menos un número
                    </li>
                  </ul>
                </div>
              )}

              {/* Confirm Password Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-gray-300 block">Confirmar Contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 group-hover:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-400">Las contraseñas no coinciden</p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-xs text-green-400">Las contraseñas coinciden</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm animate-shake">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || validationErrors.length > 0 || !confirmPassword}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Cambiando contraseña...
                  </span>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
