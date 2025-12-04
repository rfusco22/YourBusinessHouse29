"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Heart, Share2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyGallery } from "@/components/property-gallery"
import { RelatedProperties } from "@/components/related-properties"
import { PropertyAgent } from "@/components/property-agent"
import { Button } from "@/components/ui/button"
import { PropertyLocationMap } from "@/components/property-location-map"

interface PropertyImage {
  id?: number
  url: string
}

interface Property {
  id: number
  title: string
  location: string
  price: number
  rental_price?: number
  purchase_price?: number
  bedrooms: number
  bathrooms: number
  parking: number
  area: number
  yearBuilt?: number
  description: string
  amenities: string[]
  owner_id: number
  image_url?: string
  images?: PropertyImage[]
  latitude?: number | null
  longitude?: number | null
  operation_type?: string
}

interface Agent {
  id: number
  name: string
  phone: string
  email: string
  image?: string
  whatsapp?: string
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  tiktok?: string
  youtube?: string
  specialization?: string
  experience?: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log("[v0] Fetching property details for ID:", propertyId)

        const response = await fetch(`/api/properties?propertyId=${propertyId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Inmueble no encontrado")
        }

        const result = await response.json()
        console.log("[v0] Property response:", result)
        console.log("[v0] Property images count:", result.data?.images?.length || 0)

        if (!result.data) {
          throw new Error("No se recibieron datos del inmueble")
        }

        setProperty(result.data)

        if (result.data.agent) {
          setAgent({
            id: result.data.agent.id,
            name: result.data.agent.name,
            phone: result.data.agent.phone,
            email: result.data.agent.email,
            image: result.data.agent.image,
            whatsapp: result.data.agent.whatsapp,
            facebook: result.data.agent.facebook,
            instagram: result.data.agent.instagram,
            twitter: result.data.agent.twitter,
            linkedin: result.data.agent.linkedin,
            tiktok: result.data.agent.tiktok,
            youtube: result.data.agent.youtube,
            specialization: result.data.agent.specialization || "Agente Inmobiliario",
            experience: result.data.agent.experience || "Experiencia profesional",
          })
        }
      } catch (err) {
        console.error("[v0] Error fetching property:", err)
        setError(err instanceof Error ? err.message : "Error al cargar el inmueble")
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Cargando inmueble...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-400">{error || "Inmueble no encontrado"}</p>
        </main>
        <Footer />
      </div>
    )
  }

  const galleryImages =
    property.images && property.images.length > 0
      ? property.images.map((img) => img.url)
      : property.image_url
        ? [property.image_url]
        : []

  const displayImages = galleryImages.length > 0 ? galleryImages : ["/luxury-property-real-estate.jpg"]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <PropertyGallery images={displayImages} title={property.title} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Header Section */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{property.title}</h1>
                  <p className="text-lg text-muted-foreground">{property.location}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Heart className="w-4 h-4" />
                    Guardar
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{property.bedrooms}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Cuartos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{property.bathrooms}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Baños</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{property.parking}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Estacionamientos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{property.area}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">m²</div>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-center justify-between">
                {property.operation_type === "ambos" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Precio de Compra</div>
                        <div className="text-3xl sm:text-4xl font-bold text-primary">
                          ${property.purchase_price ? property.purchase_price.toLocaleString() : "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Precio de Alquiler</div>
                        <div className="text-3xl sm:text-4xl font-bold text-primary">
                          ${property.rental_price ? property.rental_price.toLocaleString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-muted-foreground">Precio</div>
                    <div className="text-3xl sm:text-4xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Amenidades</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-foreground text-sm sm:text-base">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Map */}
              <PropertyLocationMap
                latitude={property.latitude}
                longitude={property.longitude}
                location={property.location}
                title={property.title}
              />
            </div>

            {/* Right Column - Agent Card */}
            <div className="lg:col-span-1">{agent && <PropertyAgent agent={agent} />}</div>
          </div>
        </div>

        {/* Related Properties */}
        <RelatedProperties propertyId={Number.parseInt(propertyId)} />
      </main>
      <Footer />
    </div>
  )
}
