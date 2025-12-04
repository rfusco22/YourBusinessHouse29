"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JustificationModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
  propertyId: number
  onSubmit: (justification: string) => Promise<void>
  type: "disponible" | "approval" // Type of request
}

export default function JustificationModal({
  isOpen,
  onClose,
  propertyTitle,
  propertyId,
  onSubmit,
  type,
}: JustificationModalProps) {
  const { toast } = useToast()
  const [justification, setJustification] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!justification.trim()) {
      toast({
        title: "Error",
        description: "La justificación es requerida",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await onSubmit(justification)
      setJustification("")
      onClose()
    } catch (error) {
      console.error("[v0] Justification error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-md bg-neutral-900 border border-primary/30 rounded-lg p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertCircle className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {type === "disponible" ? "Justificación para cambio a disponible" : "Justificación para aprobación"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">Inmueble: {propertyTitle}</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            {type === "disponible"
              ? "Explica por qué este inmueble debe volver a estar disponible:"
              : "Proporciona los detalles de este nuevo inmueble:"}
          </p>

          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder={
              type === "disponible"
                ? "Ej: El inquilino desalojó el inmueble. Se realizó la inspección..."
                : "Ej: Nuevo inmueble en el portafolio, verificado y listo..."
            }
            className="w-full px-3 py-2 bg-neutral-800 border border-primary/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary min-h-32 resize-none"
          />

          <div className="mt-6 flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
              disabled={loading || !justification.trim()}
            >
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
