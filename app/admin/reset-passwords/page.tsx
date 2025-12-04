"use client"

import { useState } from "react"

export default function ResetPasswordsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleResetPasswords = async () => {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/admin/reset-passwords", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || "Contraseñas restablecidas exitosamente")
      } else {
        setError(data.error || "Error al restablecer contraseñas")
      }
    } catch (err) {
      setError("Error de conexión: " + (err instanceof Error ? err.message : "desconocido"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
      <div className="bg-neutral-800 rounded-lg p-8 max-w-md w-full border border-neutral-700">
        <h1 className="text-2xl font-bold text-amber-600 mb-2">Your Business House</h1>
        <p className="text-neutral-400 mb-6">Panel de Administración - Restablecer Contraseñas</p>

        <div className="mb-6 p-4 bg-neutral-700 rounded-lg">
          <h2 className="text-white font-semibold mb-3">Usuarios de Demostración:</h2>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>Email: asesor@test.com</li>
            <li>Email: admin@test.com</li>
            <li>Email: gerencia@test.com</li>
            <li className="text-amber-500 font-semibold mt-3">Contraseña: demo123</li>
          </ul>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 text-green-200 rounded-lg text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">{error}</div>
        )}

        <button
          onClick={handleResetPasswords}
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Procesando..." : "Restablecer Contraseñas"}
        </button>

        <p className="text-xs text-neutral-500 mt-4 text-center">
          Esto actualizará las contraseñas de los 3 usuarios de demostración en la base de datos.
        </p>
      </div>
    </div>
  )
}
