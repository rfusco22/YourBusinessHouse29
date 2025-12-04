"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Users,
  Home,
  Bell,
  Archive,
  BookOpen,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  List,
  Key,
  Plus,
} from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PermissionRequest {
  id: number
  inmueble_id: number
  asesor_id: number
  asesor_name: string
  asesor_email: string
  title: string
  location: string
  request_type: string
  status: string
  justification: string
  created_at: string
  property_status: string
  review_date?: string
  reviewer_name?: string
  reviewer_email?: string
  admin_notes?: string
  rejection_reason?: string
}

type TabType = "todos" | "alquilados" | "nuevo_inmueble" | "historial"

export default function GerenciaPermisos() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [requests, setRequests] = useState<PermissionRequest[]>([])
  const [historialRequests, setHistorialRequests] = useState<PermissionRequest[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("todos")

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    type: "approve" | "reject" | null
    request: PermissionRequest | null
  }>({ open: false, type: null, request: null })
  const [rejectionReason, setRejectionReason] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

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
    if (!isLoading) {
      loadPermissions()
    }
  }, [isLoading, activeTab])

  const loadPermissions = async () => {
    try {
      setDataLoading(true)

      if (activeTab === "historial") {
        const response = await fetch("/api/permissions/history")
        const data = await response.json()
        if (data.success) {
          setHistorialRequests(data.data || [])
        } else {
          throw new Error(data.error || "Error al cargar historial")
        }
      } else {
        const response = await fetch("/api/permissions/pending")
        const data = await response.json()

        if (data.success) {
          let filteredData = data.data || []

          if (activeTab === "alquilados") {
            filteredData = filteredData.filter((r: PermissionRequest) => r.request_type === "disponible_request")
          } else if (activeTab === "nuevo_inmueble") {
            filteredData = filteredData.filter((r: PermissionRequest) => r.request_type === "nuevo_inmueble")
          }

          setRequests(filteredData)
        } else {
          throw new Error(data.error || "Error al cargar permisos")
        }
      }
    } catch (error) {
      console.error("[v0] Error loading permissions:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar permisos",
        variant: "destructive",
      })
    } finally {
      setDataLoading(false)
    }
  }

  const openApproveDialog = (request: PermissionRequest) => {
    setRejectionReason("")
    setAdminNotes("")
    setConfirmDialog({ open: true, type: "approve", request })
  }

  const openRejectDialog = (request: PermissionRequest) => {
    setRejectionReason("")
    setAdminNotes("")
    setConfirmDialog({ open: true, type: "reject", request })
  }

  const closeDialog = () => {
    setConfirmDialog({ open: false, type: null, request: null })
    setRejectionReason("")
    setAdminNotes("")
  }

  const handleApprove = async () => {
    const request = confirmDialog.request
    if (!request) return

    try {
      setProcessingId(request.id)
      const response = await fetch("/api/permissions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          adminId: user.id || 1,
          adminNotes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Permiso aprobado exitosamente",
          variant: "default",
        })
        closeDialog()
        loadPermissions()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Approve error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al aprobar",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async () => {
    const request = confirmDialog.request
    if (!request) return

    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Debes proporcionar un motivo de rechazo",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessingId(request.id)
      const response = await fetch("/api/permissions/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          adminId: user.id || 1,
          rejectionReason,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Permiso rechazado",
          variant: "default",
        })
        closeDialog()
        loadPermissions()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Reject error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al rechazar",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

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
      label: "No Disponibles",
      path: "/gerencia/inmuebles-no-disponibles",
      icon: <Archive size={20} />,
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
      path: "/gerencia/permisos",
      icon: <AlertCircle size={20} />,
    },
  ]

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  const displayRequests = activeTab === "historial" ? historialRequests : requests

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
        )}
      >
        <div className="px-6 py-4">
          <h1 className="text-2xl font-heading font-bold text-white">Gestión de Permisos</h1>
          <p className="text-gray-400 text-sm">Aprueba o rechaza solicitudes de permisos</p>
        </div>
      </header>

      <main className={cn("transition-all duration-500 p-6", sidebarCollapsed ? "ml-20" : "ml-64")}>
        <div className="flex gap-2 mb-6 border-b border-primary/20">
          <button
            onClick={() => setActiveTab("todos")}
            className={`px-4 py-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
              activeTab === "todos" ? "text-primary border-b-2 border-primary" : "text-gray-400"
            }`}
          >
            <List size={18} />
            Todos
          </button>
          <button
            onClick={() => setActiveTab("alquilados")}
            className={`px-4 py-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
              activeTab === "alquilados" ? "text-primary border-b-2 border-primary" : "text-gray-400"
            }`}
          >
            <Key size={18} />
            Alquilados
          </button>
          <button
            onClick={() => setActiveTab("nuevo_inmueble")}
            className={`px-4 py-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
              activeTab === "nuevo_inmueble" ? "text-primary border-b-2 border-primary" : "text-gray-400"
            }`}
          >
            <Plus size={18} />
            Nuevo Inmueble
          </button>
          <button
            onClick={() => setActiveTab("historial")}
            className={`px-4 py-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
              activeTab === "historial" ? "text-primary border-b-2 border-primary" : "text-gray-400"
            }`}
          >
            <Clock size={18} />
            Historial
          </button>
        </div>

        {/* Permissions/History List */}
        <div
          className={activeTab === "historial" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
        >
          {dataLoading ? (
            <div className="text-center py-8 text-gray-400 col-span-full">Cargando permisos...</div>
          ) : displayRequests.length > 0 ? (
            displayRequests.map((request) => (
              <div
                key={request.id}
                className="bg-neutral-800/50 border border-primary/20 rounded-lg p-4 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{request.title}</h3>
                    <p className="text-sm text-gray-400">{request.asesor_name}</p>
                    <p className="text-xs text-gray-500">{request.asesor_email}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                    {request.request_type === "disponible_request"
                      ? "Cambio a Disponible"
                      : request.request_type === "nuevo_inmueble"
                        ? "Nuevo Inmueble"
                        : "Aprobación"}
                  </span>
                  {activeTab === "historial" && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        request.status === "aprobado" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {request.status === "aprobado" ? (
                        <>
                          <CheckCircle size={14} /> Aprobado
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> Denegado
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Ubicación:</span>{" "}
                    <span className="text-gray-300">{request.location}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Justificación:</span>
                  </p>
                  <p className="text-gray-300 bg-neutral-900/50 p-3 rounded border border-neutral-700 text-xs line-clamp-3">
                    {request.justification}
                  </p>
                  <p className="text-xs text-gray-500">
                    Solicitado: {new Date(request.created_at).toLocaleDateString()}
                  </p>
                  {activeTab === "historial" && request.review_date && (
                    <>
                      <p className="text-xs text-gray-500">Revisado por: {request.reviewer_name}</p>
                      <p className="text-xs text-gray-500">
                        Fecha: {new Date(request.review_date).toLocaleDateString()}
                      </p>
                      {request.admin_notes && (
                        <>
                          <p className="text-gray-500 text-xs">Notas:</p>
                          <p className="text-gray-300 bg-neutral-900/50 p-2 rounded text-xs line-clamp-2">
                            {request.admin_notes}
                          </p>
                        </>
                      )}
                      {request.rejection_reason && (
                        <>
                          <p className="text-gray-500 text-xs">Motivo de rechazo:</p>
                          <p className="text-red-300 bg-neutral-900/50 p-2 rounded text-xs line-clamp-2">
                            {request.rejection_reason}
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>

                {activeTab !== "historial" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openApproveDialog(request)}
                      disabled={processingId === request.id}
                      className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 gap-2"
                    >
                      <CheckCircle size={16} />
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => openRejectDialog(request)}
                      disabled={processingId === request.id}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 gap-2"
                    >
                      <XCircle size={16} />
                      Denegar
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 col-span-full">
              No hay permisos{" "}
              {activeTab === "todos"
                ? "pendientes"
                : activeTab === "alquilados"
                  ? "de alquilados"
                  : activeTab === "nuevo_inmueble"
                    ? "de nuevo inmueble"
                    : "en el historial"}{" "}
              en este momento
            </div>
          )}
        </div>
      </main>

      <AlertDialog
        open={confirmDialog.open && confirmDialog.type === "approve"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <AlertDialogContent className="bg-neutral-900 border border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Aprobación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que deseas aprobar esta solicitud de permiso para "{confirmDialog.request?.title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <textarea
              placeholder="Notas adicionales (opcional)..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-primary/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
              rows={2}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={processingId !== null}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirmDialog.open && confirmDialog.type === "reject"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <AlertDialogContent className="bg-neutral-900 border border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Denegación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que deseas denegar esta solicitud de permiso para "{confirmDialog.request?.title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-3">
            <textarea
              placeholder="Motivo del rechazo (requerido)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-primary/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
              rows={2}
            />
            <textarea
              placeholder="Notas adicionales (opcional)..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-primary/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
              rows={2}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={processingId !== null}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
