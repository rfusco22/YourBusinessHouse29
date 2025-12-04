"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  onRefresh?: () => void
}

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
}

export default function PermissionsModal({ isOpen, onClose, onRefresh }: PermissionsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<PermissionRequest[]>([])
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [activeTab, setActiveTab] = useState<"disponible" | "approval" | "all">("all")

  useEffect(() => {
    if (isOpen) {
      loadPermissions()
    }
  }, [isOpen, activeTab])

  const loadPermissions = async () => {
    try {
      setLoading(true)
      const typeFilter =
        activeTab === "disponible" ? "disponible_request" : activeTab === "approval" ? "property_approval" : ""
      const url = `/api/permissions/pending${typeFilter ? `?type=${typeFilter}` : ""}`

      console.log("[v0] Fetching permissions from:", url)
      const response = await fetch(url)
      const data = await response.json()

      console.log("[v0] Permissions response:", data)

      if (data.success) {
        setRequests(data.data || [])
      } else {
        throw new Error(data.error || "Error al cargar permisos")
      }
    } catch (error) {
      console.error("[v0] Error loading permissions:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar permisos",
        variant: "destructive",
      })
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (request: PermissionRequest) => {
    try {
      setProcessingId(request.id)
      const user = JSON.parse(localStorage.getItem("user") || "{}")

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
        setAdminNotes("")
        setSelectedRequest(null)
        loadPermissions()
        onRefresh?.()
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

  const handleReject = async (request: PermissionRequest) => {
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
      const user = JSON.parse(localStorage.getItem("user") || "{}")

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
        setRejectionReason("")
        setSelectedRequest(null)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-2xl bg-neutral-900 border border-primary/30 rounded-lg p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-6">Gestión de Permisos</h2>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-primary/20">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-semibold text-sm transition-colors ${
                activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-gray-400"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab("disponible")}
              className={`px-4 py-2 font-semibold text-sm transition-colors ${
                activeTab === "disponible" ? "text-primary border-b-2 border-primary" : "text-gray-400"
              }`}
            >
              Cambio a Disponible
            </button>
            <button
              onClick={() => setActiveTab("approval")}
              className={`px-4 py-2 font-semibold text-sm transition-colors ${
                activeTab === "approval" ? "text-primary border-b-2 border-primary" : "text-gray-400"
              }`}
            >
              Aprobación de Inmuebles
            </button>
          </div>

          {/* Permissions List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Cargando permisos...</div>
            ) : requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-neutral-800/50 border border-primary/20 rounded-lg p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{request.title}</h3>
                      <p className="text-sm text-gray-400">
                        {request.asesor_name} ({request.asesor_email})
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                      {request.request_type === "disponible_request" ? "Cambio a Disponible" : "Aprobación"}
                    </span>
                  </div>

                  <div className="mb-4 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Ubicación:</span>{" "}
                      <span className="text-gray-300">{request.location}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Justificación:</span>
                    </p>
                    <p className="text-gray-300 bg-neutral-900/50 p-3 rounded border border-neutral-700">
                      {request.justification}
                    </p>
                    <p className="text-xs text-gray-500">
                      Solicitado: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {selectedRequest?.id === request.id ? (
                    <div className="space-y-3 mb-4">
                      <textarea
                        placeholder="Motivo del rechazo (si aplica)..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-primary/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                        rows={2}
                      />
                      <textarea
                        placeholder="Notas adicionales del administrador..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-primary/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                        rows={2}
                      />
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        selectedRequest?.id === request.id ? handleApprove(request) : setSelectedRequest(request)
                      }
                      disabled={processingId === request.id}
                      className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 gap-2"
                    >
                      <CheckCircle size={16} />
                      {selectedRequest?.id === request.id ? "Confirmar Aprobación" : "Aprobar"}
                    </Button>
                    <Button
                      onClick={() =>
                        selectedRequest?.id === request.id ? handleReject(request) : setSelectedRequest(request)
                      }
                      disabled={processingId === request.id}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 gap-2"
                    >
                      <XCircle size={16} />
                      {selectedRequest?.id === request.id ? "Confirmar Rechazo" : "Rechazar"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No hay permisos pendientes en este momento</div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
