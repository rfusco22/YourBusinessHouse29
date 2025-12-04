"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  Users,
  Home,
  Calendar,
  Bell,
  BookOpen,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { cn } from "@/lib/utils"
import { useLiveStats } from "@/hooks/use-live-stats"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const { stats, loading: dataLoading } = useLiveStats({
    endpoint: "/api/admin/dashboard/stats",
    interval: 5000, // Actualizar cada 5 segundos
  })

  const [alerts, setAlerts] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [activityByUser, setActivityByUser] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (stats) {
      setAlerts(stats.alerts || [])
      setRecentActivity(stats.recentActivity || [])
      setActivityByUser(stats.activityByUser || [])
    }
  }, [stats])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Inmuebles",
      path: "/admin/inmuebles",
      icon: <Home size={20} />,
    },
    {
      label: "Alertas",
      path: "/admin/alertas",
      icon: <Bell size={20} />,
    },
    {
      label: "Bitácora",
      path: "/admin/bitacora",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Usuarios",
      path: "/admin/usuarios",
      icon: <Users size={20} />,
    },
    {
      label: "Permisos",
      path: "/admin/permisos",
      icon: <AlertCircle size={20} />,
    },
  ]

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  const getActivityBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case "visita":
        return { color: "bg-blue-500/20 text-blue-400", label: "Visita" }
      case "contraoferta":
        return { color: "bg-orange-500/20 text-orange-400", label: "contraoferta" }
      case "oferta":
        return { color: "bg-yellow-500/20 text-yellow-400", label: "Oferta" }
      default:
        return { color: "bg-gray-500/20 text-gray-400", label: type || "Actividad" }
    }
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const activityDate = new Date(date)
    const diffMs = now.getTime() - activityDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Hace 1 día"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    return `Hace ${Math.floor(diffDays / 30)} meses`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <PremiumSidebar
        items={navItems}
        onLogout={handleLogout}
        userName={user?.name}
        userRole="ADMIN"
        userImage={user?.avatar_url}
        onCollapsedChange={setSidebarCollapsed}
      />

      <header
        className={cn(
          "bg-neutral-900/95 backdrop-blur border-b border-primary/20 sticky top-0 z-40 transition-all duration-500",
          sidebarCollapsed ? "ml-16 sm:ml-20" : "ml-16 sm:ml-64",
        )}
      >
        <div className="px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">Dashboard Administrador</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Bienvenido, {user?.name}</p>
        </div>
      </header>

      <main
        className={cn("transition-all duration-500 p-3 sm:p-6", sidebarCollapsed ? "ml-16 sm:ml-20" : "ml-16 sm:ml-64")}
      >
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
            {/* Usuarios Totales Card */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-6 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-400 text-xs sm:text-sm font-semibold line-clamp-2">Usuarios Totales</h3>
                <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <Users className="text-blue-400" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-4xl font-bold text-white">{dataLoading ? "..." : stats.totalUsers || 0}</p>
              <p className="text-xs text-gray-400 mt-2">Usuarios activos</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-6 hover:border-green-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-400 text-xs sm:text-sm font-semibold line-clamp-2">Total Inmuebles</h3>
                <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                  <Home className="text-green-400" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-4xl font-bold text-white">
                {dataLoading ? "..." : stats.totalProperties || 0}
              </p>
              <p className="text-xs text-gray-400 mt-2">Inmuebles registrados</p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 sm:p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-400 text-xs sm:text-sm font-semibold line-clamp-2">Agregadas Este Mes</h3>
                <div className="p-2 sm:p-3 bg-primary/20 rounded-lg flex-shrink-0">
                  <Calendar className="text-primary" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-4xl font-bold text-primary">
                {dataLoading ? "..." : stats.propertiesThisMonth || 0}
              </p>
              <p className="text-xs text-gray-400 mt-2">De todos los usuarios</p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 sm:p-6 hover:border-purple-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-400 text-xs sm:text-sm font-semibold line-clamp-2">Movimientos Totales</h3>
                <div className="p-2 sm:p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                  <Activity className="text-purple-400" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-4xl font-bold text-white">
                {dataLoading ? "..." : stats.totalMovements || 0}
              </p>
              <p className="text-xs text-gray-400 mt-2">Actividades registradas</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-6 hover:border-red-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-400 text-xs sm:text-sm font-semibold line-clamp-2">Alertas Activas</h3>
                <div className="p-2 sm:p-3 bg-red-500/20 rounded-lg flex-shrink-0">
                  <Bell className="text-red-400" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-4xl font-bold text-white">{dataLoading ? "..." : alerts.length || 0}</p>
              <p className="text-xs text-gray-400 mt-2">Requieren atención</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Alerts */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Alertas Recientes
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {dataLoading ? (
                  <div className="text-center text-gray-400 py-8 text-sm">Cargando alertas...</div>
                ) : alerts.length > 0 ? (
                  alerts.map((alert: any) => (
                    <div
                      key={alert.id}
                      className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 hover:border-red-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2">{alert.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">{alert.message}</p>
                          {alert.days_inactive && (
                            <p className="text-xs text-gray-500 mt-1">Inactivo por: {alert.days_inactive} días</p>
                          )}
                        </div>
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-red-500/20 text-red-400 flex-shrink-0">
                          Alerta
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8 text-sm">No hay alertas activas</div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                Actividad de Propiedades
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {dataLoading ? (
                  <div className="text-center text-gray-400 py-8 text-sm">Cargando actividad...</div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity: any) => {
                    const badge = getActivityBadge(activity.type)
                    return (
                      <div
                        key={activity.id}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 hover:border-green-500/50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2">
                              {activity.property_name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">{activity.description}</p>
                            {activity.offer_amount && (
                              <p className="text-xs text-primary mt-1">Monto ofrecido: ${activity.offer_amount}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span
                              className={`inline-block px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                            <span className="text-xs text-gray-500">{getRelativeTime(activity.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center text-gray-400 py-8 text-sm">No hay actividad reciente</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 sm:p-6 hover:border-purple-500/50 transition-all duration-300 overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold text-white">Movimientos por Usuario</h2>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Usuarios más activos del sistema</p>
            {dataLoading ? (
              <div className="h-96 flex items-center justify-center text-gray-400 text-sm">Cargando datos...</div>
            ) : activityByUser.length > 0 ? (
              <div className="w-full" style={{ minWidth: "min(100%, 600px)" }}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={activityByUser} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#999" />
                    <YAxis dataKey="usuario" type="category" stroke="#999" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #9333ea",
                        borderRadius: "8px",
                      }}
                      cursor={{ fill: "rgba(147, 51, 234, 0.1)" }}
                    />
                    <Legend />
                    <Bar dataKey="movimientos" fill="#9333ea" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-400 text-sm">
                No hay datos de actividad disponibles
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
