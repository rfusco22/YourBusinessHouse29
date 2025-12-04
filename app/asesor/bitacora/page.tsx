"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, DollarSign } from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { BitacoraFormModal } from "@/components/bitacora-form-modal"
import { Home, Bell, BookOpen, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

interface BitacoraEntry {
  id: number
  inmueble_id: number
  title: string
  type: string
  description: string
  visit_date?: string
  offer_amount?: number
  created_at: string
}

export default function AsesorBitacora() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<BitacoraEntry[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navItems = [
    {
      label: "Dashboard",
      path: "/asesor/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Inmuebles",
      path: "/asesor/inmuebles",
      icon: <Home size={20} />,
    },
    {
      label: "Alertas",
      path: "/asesor/alertas",
      icon: <Bell size={20} />,
    },
    {
      label: "Bitácora",
      path: "/asesor/bitacora",
      icon: <BookOpen size={20} />,
    },
  ]

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      console.log("[v0] User loaded:", parsedUser.id)
      loadEntries(parsedUser.id)
    } catch (err) {
      console.error("[v0] Error parsing user data:", err)
      setError("Error al cargar datos del usuario")
    }

    setIsLoading(false)
  }, [router])

  const loadEntries = async (userId: number) => {
    try {
      console.log("[v0] Loading bitacora entries for user:", userId)
      const response = await fetch(`/api/bitacora?user_id=${userId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Loaded entries:", data)
      setEntries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error loading entries:", error)
      setError("Error al cargar las entradas de bitácora")
      setEntries([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleFormSuccess = () => {
    if (user) {
      loadEntries(user.id)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-6 rounded">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <PremiumSidebar
        items={navItems}
        onLogout={handleLogout}
        userName={user?.name}
        userRole="ASESOR"
        userImage={user?.avatar_url}
        onCollapsedChange={setSidebarCollapsed}
      />

      <header
        className={cn(
          "bg-neutral-900/95 backdrop-blur border-b border-primary/20 sticky top-0 z-40 transition-all duration-500",
          sidebarCollapsed ? "ml-20" : "ml-64",
        )}
      >
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">Bitácora</h1>
            <p className="text-gray-400 text-sm">{user?.name}</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={18} />
            Añadir Entrada
          </Button>
        </div>
      </header>

      <main className={cn("transition-all duration-500 px-6 py-8", sidebarCollapsed ? "ml-20" : "ml-64")}>
        {/* Entries Timeline */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-neutral-800/50 border border-primary/20 rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{entry.title}</h3>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                      entry.type === "visita" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {entry.type === "visita" ? "Visita" : "Contraoferta"}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{new Date(entry.created_at).toLocaleDateString("es-ES")}</span>
              </div>

              <p className="text-gray-300 mb-3">{entry.description}</p>

              {entry.type === "visita" && entry.visit_date && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={16} />
                  Fecha de visita: {new Date(entry.visit_date).toLocaleDateString("es-ES")}
                </div>
              )}

              {entry.type === "contraoferta" && entry.offer_amount && (
                <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                  <DollarSign size={16} />
                  Monto ofrecido: ${entry.offer_amount.toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="bg-neutral-800/50 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-gray-400">No hay entradas en la bitácora</p>
          </div>
        )}
      </main>

      {user && (
        <BitacoraFormModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          userId={user.id}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
