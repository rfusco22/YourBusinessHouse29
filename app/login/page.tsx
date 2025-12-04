"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión")
        return
      }

      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`
      localStorage.setItem("user", JSON.stringify(data.user))

      console.log("[v0] Login successful. User role:", data.user.role)

      const redirectMap: { [key: string]: string } = {
        admin: "/admin/dashboard",
        gerencia: "/gerencia/dashboard",
        asesor: "/asesor/dashboard",
      }

      const redirectUrl = redirectMap[data.user.role] || "/propiedades"
      console.log("[v0] Redirecting to:", redirectUrl)
      router.push(redirectUrl)
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
            <Image
              src="/logo-white.png"
              alt="Your Business House Logo"
              width={140}
              height={140}
              className="w-40 h-auto"
            />
          </div>
          <h1
            className="text-4xl font-bold text-primary mb-2"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.5px" }}
          >
            Your Business House
          </h1>
          <p className="text-gray-400 text-sm">Acceso a tu cuenta de agente inmobiliario</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 border border-primary/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password Input */}
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-gray-300 block">Contraseña</label>
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" />
                <span className="text-gray-400 hover:text-gray-300 transition-colors">Recuérdame</span>
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </div>

        {/* Footer Link */}
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
