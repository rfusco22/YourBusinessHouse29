"use client"

import { useState } from "react"
import { X, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdvancedPropertyFiltersProps {
  onFilterChange: (filters: PropertyFilters) => void
  onReset: () => void
}

export interface PropertyFilters {
  operationType?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  minArea?: number
  maxArea?: number
  propertyType?: string
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
}

export function AdvancedPropertyFilters({ onFilterChange, onReset }: AdvancedPropertyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({})

  const propertyTypes = ["casa", "apartamento", "oficina", "terreno", "local comercial", "quinta"]
  const operationTypes = [
    { value: "compra", label: "Compra" },
    { value: "alquiler", label: "Alquiler" },
    { value: "ambos", label: "Ambos" },
  ]

  const handleFilterUpdate = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value === "" ? undefined : value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    onReset()
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length

  return (
    <div className="mb-6">
      <Button
        onClick={() => setShowFilters(!showFilters)}
        className="bg-neutral-800 hover:bg-neutral-700 border border-primary/30 gap-2"
      >
        <Filter size={18} />
        Filtros Avanzados
        {activeFiltersCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">{activeFiltersCount}</span>
        )}
        <ChevronDown size={18} className={cn("transition-transform", showFilters && "rotate-180")} />
      </Button>

      {showFilters && (
        <div className="mt-4 p-6 bg-neutral-800/50 border border-primary/20 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Operación</label>
              <select
                value={filters.operationType || ""}
                onChange={(e) => handleFilterUpdate("operationType", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="">Todos</option>
                {operationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Propiedad</label>
              <select
                value={filters.propertyType || ""}
                onChange={(e) => handleFilterUpdate("propertyType", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="">Todos</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
              <input
                type="text"
                value={filters.location || ""}
                onChange={(e) => handleFilterUpdate("location", e.target.value)}
                placeholder="Ciudad, zona..."
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Precio Mínimo ($)</label>
              <input
                type="number"
                value={filters.minPrice || ""}
                onChange={(e) => handleFilterUpdate("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Precio Máximo ($)</label>
              <input
                type="number"
                value={filters.maxPrice || ""}
                onChange={(e) => handleFilterUpdate("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Sin límite"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Área Mínima (m²)</label>
              <input
                type="number"
                value={filters.minArea || ""}
                onChange={(e) => handleFilterUpdate("minArea", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Área Máxima (m²)</label>
              <input
                type="number"
                value={filters.maxArea || ""}
                onChange={(e) => handleFilterUpdate("maxArea", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Sin límite"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Habitaciones Mín.</label>
              <input
                type="number"
                value={filters.minBedrooms || ""}
                onChange={(e) => handleFilterUpdate("minBedrooms", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Habitaciones Máx.</label>
              <input
                type="number"
                value={filters.maxBedrooms || ""}
                onChange={(e) => handleFilterUpdate("maxBedrooms", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Sin límite"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Baños Mín.</label>
              <input
                type="number"
                value={filters.minBathrooms || ""}
                onChange={(e) =>
                  handleFilterUpdate("minBathrooms", e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="0"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Baños Máx.</label>
              <input
                type="number"
                value={filters.maxBathrooms || ""}
                onChange={(e) =>
                  handleFilterUpdate("maxBathrooms", e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="Sin límite"
                className="w-full px-3 py-2 bg-neutral-900 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-transparent border-primary/30 text-gray-300 hover:bg-neutral-700 gap-2"
            >
              <X size={16} />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
