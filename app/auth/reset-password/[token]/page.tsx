"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validations, setValidations] = useState({
    minLength: false,
    match: false,
  })

  // Validate passwords on change
  useEffect(() => {
    const newValidations = {
      minLength: password.length >= 6,
      match: password.length > 0 && password === passwordConfirm,
    }
    setValidations(newValidations)
  }, [password, passwordConfirm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate
    if (!validations.minLength) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (!validations.match) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, passwordConfirm }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Error al restablecer la contraseña")
        return
      }

      setSuccess(true)

      // Redirect to login after 5 seconds
      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } catch (err) {
      setError("Error de conexión")
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
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/50 group hover:shadow-primary/75 transition-all duration-300">
              <div className="text-white font-heading font-bold text-2xl">✦</div>
              <div className="absolute inset-0 rounded-2xl border border-primary/50 group-hover:border-primary transition-all duration-300" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Your Business House</h1>
          <p className="text-gray-400 text-sm">Establece una nueva contraseña</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 border border-primary/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-slide-up">
          {success ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">¡Éxito!</h2>
              <p className="text-gray-400 mb-6">
                Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión en 5 segundos...
              </p>
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nueva Contraseña Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-gray-300 block">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {password && (
                  <div className="flex items-center gap-2 text-xs mt-2">
                    <div className={`w-2 h-2 rounded-full ${validations.minLength ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={validations.minLength ? "text-green-400" : "text-red-400"}>
                      Mínimo 6 caracteres
                    </span>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-gray-300 block">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 group-hover:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordConfirm && (
                  <div className="flex items-center gap-2 text-xs mt-2">
                    <div className={`w-2 h-2 rounded-full ${validations.match ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={validations.match ? "text-green-400" : "text-red-400"}>
                      {validations.match ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                    </span>
                  </div>
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
                disabled={isLoading || !validations.minLength || !validations.match}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Actualizando...
                  </span>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>
            Vuelve a{" "}
            <a href="/" className="text-primary hover:text-primary/80 transition-colors">
              inicio
            </a>
          </p>
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
