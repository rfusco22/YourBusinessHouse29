"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, BedDouble, Bath, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface RelatedProperty {
  id: number
  title: string
  location: string
  price: number
  image_url?: string
  bedrooms: number
  bathrooms: number
  area: number
}

export function RelatedProperties({ propertyId }: { propertyId: number }) {
  const [properties, setProperties] = useState<RelatedProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProperties = async () => {
      try {
        const response = await fetch("/api/properties")
        if (!response.ok) throw new Error("Failed to fetch properties")

        const result = await response.json()
        // Filter out current property and limit to 3
        const filtered = result.data.filter((p: RelatedProperty) => p.id !== propertyId).slice(0, 3)

        setProperties(filtered)
      } catch (error) {
        console.error("[v0] Error fetching related properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProperties()
  }, [propertyId])

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Cargando propiedades similares...</p>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">No hay propiedades similares disponibles</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Propiedades similares</h2>
          <p className="text-lg text-muted-foreground">Descubre otras propiedades en la zona</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 overflow-hidden bg-muted group">
                <img
                  src={property.image_url || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5 text-foreground" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-bold text-2xl">${property.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-foreground mb-2">{property.title}</h3>

                <div className="flex items-center gap-1 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm">{property.location}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BedDouble className="w-4 h-4 text-primary" />
                      <span className="font-bold text-foreground">{property.bedrooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Cuartos</p>
                  </div>
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

                <Button className="w-full" asChild>
                  <a href={`/propiedades/${property.id}`}>Ver detalles</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
