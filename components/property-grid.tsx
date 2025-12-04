"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, BedDouble, Bath, Ruler } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Property {
  id: number
  title: string
  location: string
  price: number
  image_url?: string
  bedrooms: number
  bathrooms: number
  area: number
}

const PROPERTIES_PER_PAGE = 8

interface PropertyGridProps {
  filters: any
  currentPage: number
  onPageChange: (page: number) => void
  onPropertyCountChange: (count: number) => void
}

export function PropertyGrid({ filters, currentPage, onPageChange, onPropertyCountChange }: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        queryParams.append("status", "disponible") // Only fetch available properties

        if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm)
        if (filters.type && filters.type !== "todos") queryParams.append("type", filters.type)
        if (filters.priceMin) queryParams.append("priceMin", filters.priceMin)
        if (filters.priceMax) queryParams.append("priceMax", filters.priceMax)
        if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms)
        if (filters.bathrooms) queryParams.append("bathrooms", filters.bathrooms)
        if (filters.area) queryParams.append("area", filters.area)
        if (filters.operacion) queryParams.append("operacion", filters.operacion) // Added operation type filter

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <p className="text-center col-span-full text-muted-foreground">Cargando propiedades...</p>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <p className="text-center col-span-full text-muted-foreground">No hay propiedades disponibles</p>
      </div>
    )
  }

  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE)
  const startIdx = (currentPage - 1) * PROPERTIES_PER_PAGE
  const paginatedProperties = properties.slice(startIdx, startIdx + PROPERTIES_PER_PAGE)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {paginatedProperties.map((property) => (
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden bg-muted group">
            <img
              src={property.image_url || "/placeholder.svg?height=280&width=400&query=property"}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "/luxury-property.png"
              }}
            />
            <button className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5 text-foreground" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white font-bold text-2xl">${property.price.toLocaleString()}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-lg text-foreground mb-2">{property.title}</h3>

            <div className="flex items-center gap-1 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{property.location}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-border">
              {property.bedrooms > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BedDouble className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground">{property.bedrooms}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Cuartos</p>
                </div>
              )}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Bath className="w-4 h-4 text-primary" />
                  <span className="font-bold text-foreground">{property.bathrooms}</span>
                </div>
                <p className="text-xs text-muted-foreground">Baños</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Ruler className="w-4 h-4 text-primary" />
                  <span className="font-bold text-foreground">{property.area}</span>
                </div>
                <p className="text-xs text-muted-foreground">m²</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1" asChild>
                <a href={`/propiedades/${property.id}`}>Ver detalles</a>
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Consultar
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
