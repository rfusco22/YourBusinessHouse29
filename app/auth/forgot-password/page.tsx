"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Error al procesar la solicitud")
        return
      }

      setSubmitted(true)
      setEmail("")
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
          <p className="text-gray-400 text-sm">Recupera el acceso a tu cuenta</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 border border-primary/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-slide-up">
          {submitted ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Correo Enviado</h2>
              <p className="text-gray-400 mb-6">
                Hemos enviado un enlace de restablecimiento a{" "}
                <span className="text-primary font-semibold">{email}</span>. Revisa tu bandeja de entrada (y carpeta de
                spam) para continuar.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setSubmitted(false)}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all duration-300"
                >
                  Usar otro email
                </Button>
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full py-3 border-primary/30 text-primary hover:bg-primary/10 font-bold rounded-lg transition-all duration-300 bg-transparent"
                  >
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm text-gray-400 mb-6">
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-gray-300 block">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 group-hover:border-primary/50"
                  />
                </div>
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
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "Enviar enlace de restablecimiento"
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
                >
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>
            Vuelve a{" "}
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
              inicio
            </Link>
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
