"use client"

import { Button } from "@/components/ui/button"
import { Edit2, Eye, Link2, Check, Power, PowerOff } from "lucide-react"
import type { Property } from "@/types"

interface PropertyCardAdminProps {
  property: Property
  activeTab: string
  onStatusChange: (id: number, status: "disponible" | "alquilado" | "vendido") => void
  onEdit: (property: Property) => void
  onToggleStatus: (property: Property) => void
  onCopyLink: (id: number) => void
  onViewDetails: (id: number) => void
  copiedId?: number | null
}

/**
 * Componente tarjeta responsive para propiedades en admin
 * Optimizado para móvil, tablet y desktop
 */
const PropertyCardAdmin = ({
  property,
  activeTab,
  onStatusChange,
  onEdit,
  onToggleStatus,
  onCopyLink,
  onViewDetails,
  copiedId,
}: PropertyCardAdminProps) => {
  return (
    <div className="bg-neutral-800/50 border border-primary/20 rounded-lg p-3 sm:p-6 hover:border-primary/50 transition-all relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">{property.title}</h3>
          <p className="text-xs sm:text-sm text-gray-400">{property.type}</p>
          {activeTab === "todos" && property.ownerName && (
            <p className="text-xs text-purple-400 mt-1">Por: {property.ownerName}</p>
          )}
        </div>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
            property.status === "disponible"
              ? "bg-green-500/20 text-green-400"
              : property.status === "vendido"
                ? "bg-red-500/20 text-red-400"
                : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {property.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-2">{property.description}</p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-400">
        <div>
          <span className="text-gray-500 text-xs">Ubicación:</span>
          <p className="line-clamp-1">{property.location}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Área:</span>
          <p>{property.area} m²</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Cuartos:</span>
          <p>{property.bedrooms}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Baños:</span>
          <p>{property.bathrooms}</p>
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-primary/10 pt-3 sm:pt-4 mb-3 sm:mb-4">
        <p className="text-lg sm:text-xl font-bold text-primary">${property.price.toLocaleString()}</p>
      </div>

      {/* Status Change Buttons */}
      {activeTab !== "todos" && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            {property.status === "disponible" && (
              <>
                {(property.operation_type === "venta" || property.operation_type === "ambos") && (
                  <Button
                    onClick={() => onStatusChange(property.id, "vendido")}
                    className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs sm:text-sm"
                  >
                    Marcar Vendido
                  </Button>
                )}
                {(property.operation_type === "alquiler" || property.operation_type === "ambos") && (
                  <Button
                    onClick={() => onStatusChange(property.id, "alquilado")}
                    className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs sm:text-sm"
                  >
                    Marcar Alquilado
                  </Button>
                )}
              </>
            )}
            {(property.status === "alquilado" || property.status === "vendido") && (
              <Button
                onClick={() => onStatusChange(property.id, "disponible")}
                className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 text-xs sm:text-sm"
              >
                Regresar a Disponible
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onViewDetails(property.id)}
              className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 text-xs sm:text-sm"
            >
              <Eye size={14} className="sm:block hidden" />
              <Eye size={16} className="sm:hidden" />
              Ver Detalles
            </Button>
            <Button
              onClick={() => onCopyLink(property.id)}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 px-2 sm:px-3 text-xs sm:text-sm"
              title="Copiar enlace"
            >
              {copiedId === property.id ? <Check size={14} /> : <Link2 size={14} />}
            </Button>
            {(activeTab === "disponible" ||
              activeTab === "alquilado" ||
              activeTab === "vendido" ||
              property.owner_id === property.owner_id) && (
              <>
                <Button
                  onClick={() => onEdit(property)}
                  className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 text-xs sm:text-sm"
                >
                  <Edit2 size={14} className="sm:block hidden" />
                  <Edit2 size={16} className="sm:hidden" />
                  Editar
                </Button>
                <Button
                  onClick={() => onToggleStatus(property)}
                  className={`flex-1 gap-2 text-xs sm:text-sm ${
                    property.status === "deshabilitado"
                      ? "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30"
                      : "bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {property.status === "deshabilitado" ? (
                    <>
                      <Power size={14} className="sm:block hidden" />
                      <Power size={16} className="sm:hidden" />
                      Habilitar
                    </>
                  ) : (
                    <>
                      <PowerOff size={14} className="sm:block hidden" />
                      <PowerOff size={16} className="sm:hidden" />
                      Deshabilitar
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </>
      )}

      {activeTab === "todos" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => onViewDetails(property.id)}
            className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 text-xs sm:text-sm"
          >
            <Eye size={14} className="sm:block hidden" />
            <Eye size={16} className="sm:hidden" />
            Ver Detalles
          </Button>
          <Button
            onClick={() => onCopyLink(property.id)}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 px-2 sm:px-3 text-xs sm:text-sm"
            title="Copiar enlace"
          >
            {copiedId === property.id ? <Check size={14} /> : <Link2 size={14} />}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PropertyCardAdmin
