"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, Bell } from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { Home, BookOpen, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: number
  title: string
  description: string
  type: string
  status: string
  createdAt: string
  propertyTitle: string
  daysInactive?: number
  agentName?: string
  agentPhone?: string
  propertyId?: number
  operationType?: string
}

interface NotificationResult {
  propertyId: number
  type: string
  success?: boolean
  sent?: boolean
  reason?: string
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export default function AsesorAlertas() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loadingAlerts, setLoadingAlerts] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<{
    sent: number
    failed: number
    alreadyNotified: number
  } | null>(null)

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
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    loadAlerts(parsedUser.id, parsedUser.role)
    setIsLoading(false)

    const intervalId = setInterval(() => {
      loadAlerts(parsedUser.id, parsedUser.role)
    }, 60000) // 60 segundos

    return () => clearInterval(intervalId)
  }, [router])

  const loadAlerts = async (userId: number, userRole: string) => {
    setLoadingAlerts(true)
    try {
      const response = await fetch(`/api/alerts/my-alerts?userId=${userId}&userRole=${userRole}`)
      const data = await response.json()

      console.log("[v0] Alerts response:", data)

      if (data.success) {
        setAlerts(data.alerts.filter((a: Alert) => a.status === "activa"))
      } else {
        console.error("[v0] Error loading alerts:", data.error)
      }
    } catch (error) {
      console.error("[v0] Error fetching alerts:", error)
    } finally {
      setLoadingAlerts(false)
    }
  }

  const resolveAlert = async (alertId: number, propertyId: number, actionType: "rented" | "sold" | "edited") => {
    try {
      console.log("[v0] Resolving alert:", alertId, "Action:", actionType)

      const response = await fetch("/api/alerts/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId,
          propertyId,
          actionType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAlerts(alerts.filter((a) => a.id !== alertId))
        console.log("[v0] Alert resolved successfully")
      } else {
        console.error("[v0] Error resolving alert:", data.error)
      }
    } catch (error) {
      console.error("[v0] Error resolving alert:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  const activeAlerts = alerts.filter((a) => a.status === "activa")

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
        <div className="px-6 py-4">
          <h1 className="text-2xl font-heading font-bold text-white">Alertas</h1>
          <p className="text-gray-400 text-sm">{user?.name}</p>
        </div>
      </header>

      <main className={cn("transition-all duration-500 px-6 py-8", sidebarCollapsed ? "ml-20" : "ml-64")}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Alertas de Propiedades</h2>
          <p className="text-xs text-gray-400 mt-1">Las alertas se actualizan automáticamente cada minuto</p>
        </div>

        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bell className="text-green-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-white font-medium">Notificaciones Automáticas por WhatsApp</p>
              <p className="text-gray-400 text-sm mt-1">
                Recibirás automáticamente un mensaje de WhatsApp cuando se detecte una propiedad que cumple los
                criterios de alerta (alquileres sin movimiento por 30+ días, ventas sin movimiento por 60+ días).
              </p>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            Alertas Activas ({activeAlerts.length})
          </h2>
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{alert.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                      <div className="mt-2 space-y-1 text-xs text-gray-400">
                        <p>Propiedad: {alert.propertyTitle}</p>
                        {alert.daysInactive && <p>Inactivo por: {alert.daysInactive} días</p>}
                        <p>Fecha: {formatDate(alert.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-col">
                      {alert.type === "no_alquilado_1m" && (
                        <>
                          <Button
                            onClick={() => resolveAlert(alert.id, alert.propertyId!, "rented")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs whitespace-nowrap"
                            title="Marcar como alquilado"
                          >
                            Alquilado
                          </Button>
                          <Button
                            onClick={() => resolveAlert(alert.id, alert.propertyId!, "edited")}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs whitespace-nowrap"
                            title="Marcar como editado"
                          >
                            Editado
                          </Button>
                        </>
                      )}
                      {alert.type === "no_vendido_2m" && (
                        <>
                          <Button
                            onClick={() => resolveAlert(alert.id, alert.propertyId!, "sold")}
                            className="bg-primary hover:bg-primary/90 text-white text-xs whitespace-nowrap"
                            title="Marcar como vendido"
                          >
                            Vendido
                          </Button>
                          <Button
                            onClick={() => resolveAlert(alert.id, alert.propertyId!, "edited")}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs whitespace-nowrap"
                            title="Marcar como editado"
                          >
                            Editado
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-800/50 border border-primary/20 rounded-lg p-6 text-center">
              <p className="text-gray-400">{loadingAlerts ? "Cargando alertas..." : "No hay alertas activas"}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
