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
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import PermissionsModal from "@/components/permissions-modal"

export default function GerenciaDashboard() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showPermissions, setShowPermissions] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    propertiesThisMonth: 0,
    totalMovements: 0,
  })
  const [alerts, setAlerts] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [activityByUser, setActivityByUser] = useState([])
  const [totalActiveUsers, setTotalActiveUsers] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)

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
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true)
        const response = await fetch("/api/gerencia/dashboard/stats")
        const data = await response.json()

        setStats({
          totalUsers: data.totalUsers || 0,
          totalProperties: data.totalProperties || 0,
          propertiesThisMonth: data.propertiesThisMonth || 0,
          totalMovements: data.totalMovements || 0,
        })
        setAlerts(data.alerts || [])
        setRecentActivity(data.recentActivity || [])
        setActivityByUser(data.activityByUser || [])
        setTotalActiveUsers(data.totalActiveUsers || 0)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    if (!isLoading) {
      fetchDashboardData()
    }
  }, [isLoading])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const navItems = [
    {
      label: "Dashboard",
      path: "/gerencia/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Inmuebles",
      path: "/gerencia/inmuebles",
      icon: <Home size={20} />,
    },
    {
      label: "Alertas",
      path: "/gerencia/alertas",
      icon: <Bell size={20} />,
    },
    {
      label: "Bitácora",
      path: "/gerencia/bitacora",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Usuarios",
      path: "/gerencia/usuarios",
      icon: <Users size={20} />,
    },
    {
      label: "Permisos",
      path: "#",
      icon: <AlertCircle size={20} />,
      onClick: () => setShowPermissions(true),
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
        userRole="GERENCIA"
        userImage={user?.avatar_url}
        onCollapsedChange={setSidebarCollapsed}
      />

      <header
        className={cn(
          "bg-neutral-900/95 backdrop-blur border-b border-primary/20 sticky top-0 z-40 transition-all duration-500",
          sidebarCollapsed ? "ml-20" : "ml-64",
          isMobile ? "ml-20 px-4" : "px-6",
        )}
      >
        <div className={cn("py-4", isMobile ? "space-y-2" : "space-y-1")}>
          <h1 className={cn("font-heading font-bold text-white", isMobile ? "text-lg" : "text-2xl")}>
            Dashboard de Gerencia
          </h1>
          <p className={cn("text-gray-400", isMobile ? "text-xs" : "text-sm")}>Reportes Ejecutivos - {user?.name}</p>
        </div>
      </header>

      <main
        className={cn(
          "transition-all duration-500 p-4 md:p-6",
          sidebarCollapsed ? "ml-20" : "ml-64",
          isMobile && "ml-20",
        )}
      >
        <div className="space-y-6 md:space-y-8">
          <div
            className={cn(
              "gap-4 md:gap-6",
              isMobile ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
            )}
          >
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 md:p-6 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-gray-400 text-xs md:text-sm font-semibold">Usuarios Totales</h3>
                <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg">
                  <Users className="text-blue-400" size={isMobile ? 20 : 24} />
                </div>
              </div>
              <p className={cn("font-bold text-white", isMobile ? "text-2xl" : "text-4xl")}>
                {dataLoading ? "..." : stats.totalUsers}
              </p>
              <p className={cn("text-gray-400 mt-2 md:mt-3", isMobile ? "text-xs" : "text-sm")}>
                Usuarios activos en el sistema
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 md:p-6 hover:border-green-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-gray-400 text-xs md:text-sm font-semibold">Total Inmuebles</h3>
                <div className="p-2 md:p-3 bg-green-500/20 rounded-lg">
                  <Home className="text-green-400" size={isMobile ? 20 : 24} />
                </div>
              </div>
              <p className={cn("font-bold text-white", isMobile ? "text-2xl" : "text-4xl")}>
                {dataLoading ? "..." : stats.totalProperties}
              </p>
              <p className={cn("text-gray-400 mt-2 md:mt-3", isMobile ? "text-xs" : "text-sm")}>
                Inmuebles registrados
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 md:p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-gray-400 text-xs md:text-sm font-semibold">Agregadas Este Mes</h3>
                <div className="p-2 md:p-3 bg-primary/20 rounded-lg">
                  <Calendar className="text-primary" size={isMobile ? 20 : 24} />
                </div>
              </div>
              <p className={cn("font-bold text-primary", isMobile ? "text-2xl" : "text-4xl")}>
                {dataLoading ? "..." : stats.propertiesThisMonth}
              </p>
              <p className={cn("text-gray-400 mt-2 md:mt-3", isMobile ? "text-xs" : "text-sm")}>
                De todos los usuarios
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 md:p-6 hover:border-purple-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-gray-400 text-xs md:text-sm font-semibold">Movimientos Totales</h3>
                <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg">
                  <Activity className="text-purple-400" size={isMobile ? 20 : 24} />
                </div>
              </div>
              <p className={cn("font-bold text-white", isMobile ? "text-2xl" : "text-4xl")}>
                {dataLoading ? "..." : stats.totalMovements}
              </p>
              <p className={cn("text-gray-400 mt-2 md:mt-3", isMobile ? "text-xs" : "text-sm")}>
                Actividades registradas
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 md:p-6 hover:border-red-500/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-gray-400 text-xs md:text-sm font-semibold">Alertas Activas</h3>
                <div className="p-2 md:p-3 bg-red-500/20 rounded-lg">
                  <Bell className="text-red-400" size={isMobile ? 20 : 24} />
                </div>
              </div>
              <p className={cn("font-bold text-white", isMobile ? "text-2xl" : "text-4xl")}>
                {dataLoading ? "..." : alerts.length}
              </p>
              <p className={cn("text-gray-400 mt-2 md:mt-3", isMobile ? "text-xs" : "text-sm")}>Requieren atención</p>
            </div>
          </div>

          <div className={cn("gap-4 md:gap-6", isMobile ? "grid grid-cols-1" : "grid grid-cols-1 lg:grid-cols-2")}>
            <div>
              <h2
                className={cn(
                  "font-bold text-white mb-3 md:mb-4 flex items-center gap-2",
                  isMobile ? "text-base" : "text-xl",
                )}
              >
                <AlertCircle className="text-red-500" size={isMobile ? 20 : 24} />
                Alertas Recientes
              </h2>
              <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
                {dataLoading ? (
                  <div className="text-center text-gray-400 py-4 md:py-8 text-sm">Cargando alertas...</div>
                ) : alerts.length > 0 ? (
                  alerts.map((alert: any) => (
                    <div
                      key={alert.id}
                      className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 md:p-4 hover:border-red-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2 md:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm md:text-base line-clamp-2">{alert.title}</h3>
                          <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 line-clamp-2">{alert.message}</p>
                          {alert.days_inactive && (
                            <p className="text-xs text-gray-500 mt-1">Inactivo por: {alert.days_inactive} días</p>
                          )}
                        </div>
                        <span className="inline-block px-2 md:px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-red-500/20 text-red-400 flex-shrink-0">
                          Alerta
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4 md:py-8 text-sm">No hay alertas activas</div>
                )}
              </div>
            </div>

            <div>
              <h2
                className={cn(
                  "font-bold text-white mb-3 md:mb-4 flex items-center gap-2",
                  isMobile ? "text-base" : "text-xl",
                )}
              >
                <CheckCircle className="text-green-500" size={isMobile ? 20 : 24} />
                Actividad de Propiedades
              </h2>
              <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
                {dataLoading ? (
                  <div className="text-center text-gray-400 py-4 md:py-8 text-sm">Cargando actividad...</div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity: any) => {
                    const badge = getActivityBadge(activity.type)
                    return (
                      <div
                        key={activity.id}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 md:p-4 hover:border-green-500/50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-2 md:gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm md:text-base line-clamp-2">
                              {activity.property_name}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-400 mt-1 line-clamp-2">{activity.description}</p>
                            {activity.offer_amount && (
                              <p className="text-xs text-primary mt-1">Monto ofrecido: ${activity.offer_amount}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span
                              className={`inline-block px-2 md:px-3 py-1 rounded-md text-xs font-semibold ${badge.color}`}
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
                  <div className="text-center text-gray-400 py-4 md:py-8 text-sm">No hay actividad reciente</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 md:p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2 md:mb-4 flex-wrap gap-2">
              <h2 className={cn("font-bold text-white", isMobile ? "text-base" : "text-lg")}>
                Movimientos por Usuario
              </h2>
              {totalActiveUsers > 15 && (
                <span className={cn("text-purple-400", isMobile ? "text-xs" : "text-sm")}>
                  Mostrando top 15 de {totalActiveUsers} usuarios activos
                </span>
              )}
            </div>
            <p className={cn("text-gray-400 mb-4 md:mb-6", isMobile ? "text-xs" : "text-sm")}>
              Usuarios más activos del sistema
            </p>
            {dataLoading ? (
              <div className={cn("flex items-center justify-center text-gray-400", isMobile ? "h-64" : "h-96")}>
                Cargando datos...
              </div>
            ) : activityByUser.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={isMobile ? 300 : 500} minWidth={280}>
                  <BarChart data={activityByUser} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#999" />
                    <YAxis
                      dataKey="usuario"
                      type="category"
                      stroke="#999"
                      width={isMobile ? 100 : 150}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
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
              <div className={cn("flex items-center justify-center text-gray-400", isMobile ? "h-64" : "h-96")}>
                No hay datos de actividad disponibles
              </div>
            )}
          </div>
        </div>
      </main>

      {showPermissions && (
        <PermissionsModal
          isOpen={showPermissions}
          onClose={() => setShowPermissions(false)}
          onRefresh={() => {
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
