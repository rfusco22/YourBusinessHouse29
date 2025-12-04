"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Calendar } from "lucide-react"

interface BitacoraFormModalProps {
  isOpen: boolean
  onClose: () => void
  userId: number
  onSuccess: () => void
}

interface Property {
  id: number
  title: string
}

export function BitacoraFormModal({ isOpen, onClose, userId, onSuccess }: BitacoraFormModalProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [formData, setFormData] = useState({
    inmueble_id: "",
    type: "visita",
    description: "",
    visit_date: "",
    offer_amount: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dateError, setDateError] = useState("")

  useEffect(() => {
    if (isOpen) {
      loadProperties()
    }
  }, [isOpen])

  const loadProperties = async () => {
    try {
      const response = await fetch(`/api/inmuebles-by-user?user_id=${userId}`)
      const data = await response.json()
      setProperties(data || [])
    } catch (err) {
      console.error("Error loading properties:", err)
      setError("Error al cargar inmuebles")
    }
  }

  const validateDate = (dateString: string): boolean => {
    if (!dateString) {
      setDateError("")
      return true
    }

    const selectedDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const fifteenDaysAgo = new Date(today)
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

    if (selectedDate > today) {
      setDateError("No se puede seleccionar una fecha futura")
      return false
    }

    if (selectedDate < fifteenDaysAgo) {
      setDateError("La fecha debe estar dentro de los últimos 15 días")
      return false
    }

    setDateError("")
    return true
  }

  const getDateLimits = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const fifteenDaysAgo = new Date(today)
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

    return {
      max: today.toISOString().split("T")[0],
      min: fifteenDaysAgo.toISOString().split("T")[0],
    }
  }

  const dateLimits = getDateLimits()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setFormData({ ...formData, visit_date: newDate })
    validateDate(newDate)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.type === "visita" && formData.visit_date) {
      if (!validateDate(formData.visit_date)) {
        setLoading(false)
        return
      }
    }

    try {
      if (!formData.inmueble_id || !formData.description) {
        setError("Por favor completa los campos requeridos")
        setLoading(false)
        return
      }

      const payload = {
        user_id: userId,
        inmueble_id: Number.parseInt(formData.inmueble_id),
        type: formData.type,
        description: formData.description,
        visit_date: formData.type === "visita" ? formData.visit_date : null,
        offer_amount: formData.type === "contraoferta" ? Number.parseFloat(formData.offer_amount) : null,
      }

      const response = await fetch("/api/bitacora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create bitacora entry")
      }

      setFormData({
        inmueble_id: "",
        type: "visita",
        description: "",
        visit_date: "",
        offer_amount: "",
      })
      onSuccess()
      onClose()
    } catch (err) {
      console.error("Error creating bitacora entry:", err)
      setError("Error al crear la entrada de bitácora")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-neutral-900 border border-primary/20 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-heading font-bold text-white">Añadir Entrada</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Inmueble *</label>
            <Select
              value={formData.inmueble_id}
              onValueChange={(value) => setFormData({ ...formData, inmueble_id: value })}
            >
              <SelectTrigger className="w-full bg-neutral-800/80 border-primary/40 text-white">
                <SelectValue placeholder="Selecciona un inmueble" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-primary/40 w-full" align="start" sideOffset={0}>
                {properties.map((prop) => (
                  <SelectItem
                    key={prop.id}
                    value={String(prop.id)}
                    className="text-white hover:bg-primary/20 focus:bg-primary/20 cursor-pointer"
                  >
                    {prop.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Tipo de Bitácora *</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as "visita" | "contraoferta" })}
            >
              <SelectTrigger className="w-full bg-neutral-800/80 border-primary/40 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-primary/40 w-full" align="start" sideOffset={0}>
                <SelectItem
                  value="visita"
                  className="text-white hover:bg-primary/20 focus:bg-primary/20 cursor-pointer"
                >
                  Visita
                </SelectItem>
                <SelectItem
                  value="contraoferta"
                  className="text-white hover:bg-primary/20 focus:bg-primary/20 cursor-pointer"
                >
                  Contraoferta
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ingresa los detalles de la visita o contraoferta"
              rows={4}
              className="w-full bg-neutral-800/80 border border-primary/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all hover:border-primary/60 resize-none placeholder-gray-400 font-medium"
            />
          </div>

          {formData.type === "visita" && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Fecha de Visita</label>
              <div className="relative w-full">
                <input
                  type="date"
                  value={formData.visit_date}
                  onChange={handleDateChange}
                  min={dateLimits.min}
                  max={dateLimits.max}
                  className="w-full bg-neutral-800/80 border border-primary/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all hover:border-primary/60 placeholder-gray-400 font-medium"
                />
                <Calendar
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none"
                  size={20}
                />
              </div>
              {dateError && <p className="text-red-400 text-xs mt-2 flex items-center gap-1">⚠️ {dateError}</p>}
            </div>
          )}

          {formData.type === "contraoferta" && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Monto Ofrecido</label>
              <input
                type="number"
                value={formData.offer_amount}
                onChange={(e) => setFormData({ ...formData, offer_amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-neutral-800/80 border border-primary/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all hover:border-primary/60 placeholder-gray-400 font-medium"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-black hover:bg-gray-100 font-medium transition-colors"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
