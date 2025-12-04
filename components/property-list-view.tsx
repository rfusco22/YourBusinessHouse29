"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, BedDouble, Bath, Ruler, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Property {
  id: number
  title: string
  location: string
  price: number
  image_url?: string | null
  bedrooms: number
  bathrooms: number
  area: number
  description?: string
}

const PROPERTIES_PER_PAGE = 8

interface PropertyListViewProps {
  filters: any
  currentPage: number
  onPageChange: (page: number) => void
  onPropertyCountChange: (count: number) => void
}

export function PropertyListView({ filters, currentPage, onPageChange, onPropertyCountChange }: PropertyListViewProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        queryParams.append("status", "disponible")

        if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm)
        if (filters.type && filters.type !== "todos") queryParams.append("type", filters.type)
        if (filters.priceMin) queryParams.append("priceMin", filters.priceMin)
        if (filters.priceMax) queryParams.append("priceMax", filters.priceMax)
        if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms)
        if (filters.bathrooms) queryParams.append("bathrooms", filters.bathrooms)
        if (filters.area) queryParams.append("area", filters.area)
        if (filters.operacion) queryParams.append("operacion", filters.operacion)

        const response = await fetch(`/api/properties?${queryParams.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch properties")

        const result = await response.json()
        setProperties(result.data || [])
        onPropertyCountChange(result.data?.length || 0)
        onPageChange(1)
      } catch (error) {
        console.error("[v0] Error fetching properties:", error)
        setProperties([])
        onPropertyCountChange(0)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filters, onPageChange, onPropertyCountChange])

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-center text-muted-foreground">Cargando propiedades...</p>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-center text-muted-foreground">No hay propiedades disponibles</p>
      </div>
    )
  }

  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE)
  const startIdx = (currentPage - 1) * PROPERTIES_PER_PAGE
  const paginatedProperties = properties.slice(startIdx, startIdx + PROPERTIES_PER_PAGE)

  return (
    <div className="space-y-4">
      {paginatedProperties.map((property) => (
        <div
          key={property.id}
          className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card"
        >
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="hidden sm:block flex-shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
              <img
                src={property.image_url || "/placeholder.svg?height=120&width=200&query=property"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2 gap-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground hover:text-primary cursor-pointer transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">{property.location}</p>
                  </div>
                </div>
                <button className="flex-shrink-0">
                  <Heart className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                {property.description || "Sin descripción disponible"}
              </p>

              {/* Features */}
              <div className="flex items-center gap-6 mb-3 text-sm">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">{property.bedrooms}</span>
                    <span className="text-muted-foreground">Cuartos</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">{property.bathrooms}</span>
                  <span className="text-muted-foreground">Baños</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">{property.area}</span>
                  <span className="text-muted-foreground">m²</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <p className="text-2xl font-bold text-primary">${Number(property.price).toLocaleString()}</p>
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href={`/propiedades/${property.id}`}>
                    Ver detalles
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
