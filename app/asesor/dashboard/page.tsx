"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Home, Calendar, MapPin, Bell, BookOpen, AlertCircle, CheckCircle, LayoutDashboard } from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { cn } from "@/lib/utils"

interface DashboardStats {
  activeProperties: number
  addedThisMonth: number
  uniqueLocations: number
  activeAlerts: number
}

interface Alert {
  id: number
  alert_type: string
  message: string
  created_at: string
  property_title: string
  days_inactive?: number // Added days_inactive field
}

interface Activity {
  id: number
  event_type: string
  details: string
  created_at: string
  property_title: string
}

interface MonthlyData {
  mes: string
  propiedades: number
  ubicaciones: number
}

export default function AsesorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    activeProperties: 0,
    addedThisMonth: 0,
    uniqueLocations: 0,
    activeAlerts: 0,
  })
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(storedUser)
    setUser(userData)
    fetchDashboardData(userData.id)
  }, [router])

  const fetchDashboardData = async (userId: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/asesor/dashboard/stats?user_id=${userId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await response.json()
      setStats(data.stats)
      setRecentAlerts(data.recentAlerts)
      setRecentActivity(data.recentActivity)
      setMonthlyData(data.monthlyStats)
    } catch (error) {
      console.error("[v0] Error loading dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    document.cookie = "token=; path=/; max-age=0"
    router.push("/login")
  }

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

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  const getAlertLabel = (alertType: string) => {
    if (alertType === "no_alquilado_1m") return "Propiedad no alquilada"
    if (alertType === "no_vendido_2m") return "Propiedad no vendida"
    return "Alerta"
  }

  const getActivityLabel = (eventType: string) => {
    const labels: Record<string, string> = {
      consulta: "Cliente Interesado",
      visita: "Sitio Visitado",
      oferta: "Oferta Recibida",
      contrato: "Contrato Firmado",
    }
    return labels[eventType] || eventType
  }

  const getActivityBadge = (eventType: string) => {
    const badges: Record<string, string> = {
      consulta: "Consulta",
      visita: "Visita",
      oferta: "Oferta",
      contrato: "Contrato",
    }
    return badges[eventType] || eventType
  }

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Hoy"
    if (diffInDays === 1) return "Ayer"
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
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
        <div className="px-6 py-4">
          <h1 className="text-2xl font-heading font-bold text-white">Dashboard Asesor</h1>
          <p className="text-gray-400 text-sm">Bienvenido, {user?.name}</p>
        </div>
      </header>

      <main className={cn("transition-all duration-500 p-6", sidebarCollapsed ? "ml-20" : "ml-64")}>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-semibold">Propiedades Activas</h3>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Home className="text-blue-400" size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-white">{stats.activeProperties}</p>
              <p className="text-sm text-gray-400 mt-3">En tu cartera activa</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 hover:border-green-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-semibold">Agregadas Mes</h3>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Calendar className="text-green-400" size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-white">{stats.addedThisMonth}</p>
              <p className="text-sm text-gray-400 mt-3">Nuevas propiedades</p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-semibold">Ubicaciones</h3>
                <div className="p-3 bg-primary/20 rounded-lg">
                  <MapPin className="text-primary" size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-primary">{stats.uniqueLocations}</p>
              <p className="text-sm text-gray-400 mt-3">Diferentes ciudades</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 hover:border-red-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-semibold">Alertas Activas</h3>
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Bell className="text-red-400" size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-white">{stats.activeAlerts}</p>
              <p className="text-sm text-gray-400 mt-3">Requieren atención</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={24} />
                Alertas Recientes
              </h2>
              <div className="space-y-3">
                {recentAlerts.length === 0 ? (
                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center text-gray-400">
                    No hay alertas activas
                  </div>
                ) : (
                  recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-base">{getAlertLabel(alert.alert_type)}</h3>
                          <p className="text-sm text-gray-400 mt-2">{alert.message}</p>
                          {alert.days_inactive && (
                            <p className="text-xs text-gray-500 mt-1">Inactivo por: {alert.days_inactive} días</p>
                          )}
                        </div>
                        <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-red-500/20 text-red-400">
                          Alerta
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                Actividad de Propiedades
              </h2>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center text-gray-400">
                    No hay actividad reciente
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white text-base">{activity.property_title}</h3>
                        <span className="text-primary font-bold text-base">
                          {getActivityLabel(activity.event_type)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 font-semibold">
                          {getActivityBadge(activity.event_type)}
                        </span>
                        <span className="text-xs text-gray-400">{getRelativeDate(activity.created_at)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 hover:border-primary/50 transition-all duration-300">
              <h2 className="text-lg font-bold text-white mb-2">Propiedades por Mes</h2>
              <p className="text-gray-400 text-sm mb-6">Análisis de propiedades agregadas</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="mes" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #666" }} />
                  <Legend />
                  <Bar dataKey="propiedades" fill="#a27622" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 hover:border-primary/50 transition-all duration-300">
              <h2 className="text-lg font-bold text-white mb-2">Ubicaciones por Mes</h2>
              <p className="text-gray-400 text-sm mb-6">Evolución de zonas de cobertura</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="mes" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #666" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ubicaciones"
                    stroke="#a27622"
                    strokeWidth={2}
                    dot={{ fill: "#a27622" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
