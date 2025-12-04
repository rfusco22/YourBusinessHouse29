"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
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

      setSuccess(true)
      setMessage(data.message || "Se ha enviado un correo con instrucciones para restablecer tu contraseña")
      setEmail("")
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
            Volver al inicio de sesión
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo-white.png"
              alt="Your Business House Logo"
              width={100}
              height={100}
              className="w-24 h-auto"
            />
          </div>
          <h1
            className="text-3xl font-bold text-primary mb-2"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.5px" }}
          >
            Restablecer Contraseña
          </h1>
          <p className="text-gray-400 text-sm">Ingresa tu correo para recibir instrucciones</p>
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
              <h2 className="text-xl font-bold text-white mb-2">Correo Enviado</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <p className="text-gray-500 text-sm mb-6">
                Revisa tu correo (incluido el carpeta de spam) para el enlace de restablecimiento.
              </p>
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors text-sm">
                Volver al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-gray-300 block">Correo Electrónico</label>
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
                <p className="text-xs text-gray-500">Te enviaremos un enlace seguro a este correo</p>
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
                  "Enviar Instrucciones"
                )}
              </Button>

              <p className="text-center text-gray-400 text-xs">
                ¿No recibiste el correo? Revisa tu carpeta de spam o{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError("")
                    setEmail("")
                    setSuccess(false)
                  }}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  intenta de nuevo
                </button>
              </p>
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
