"use client"
import { Heart, MapPin, BedDouble, Bath, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLiveProperties } from "@/hooks/use-live-properties"

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

export function FeaturedProperties() {
  const { properties, loading } = useLiveProperties({
    limit: 3,
    interval: 5000, // Actualizar cada 5 segundos
  })

  if (loading && properties.length === 0) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Cargando propiedades...</p>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">No hay propiedades disponibles</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-foreground mb-6 text-pretty">
            Propiedades destacadas
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto mb-8" />
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Descubre nuestras selecciones más exclusivas. Cada propiedad ha sido cuidadosamente elegida por nuestros
            expertos en inmuebles de lujo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 md:h-72 overflow-hidden bg-muted group">
                <img
                  src={property.image_url || "/placeholder.svg?height=300&width=450&query=luxury real estate property"}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white rounded-full p-2 hover:bg-primary hover:text-white transition-all shadow-lg">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-4 sm:p-6">
                  <p className="text-white font-light text-xl sm:text-2xl md:text-3xl">
                    ${property.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="font-light text-lg sm:text-xl text-foreground mb-3 line-clamp-2">{property.title}</h3>

                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs sm:text-sm line-clamp-1">{property.location}</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 py-4 sm:py-6 border-t border-b border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                      <BedDouble className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm sm:text-base text-foreground">{property.bedrooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Cuartos</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                      <Bath className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm sm:text-base text-foreground">{property.bathrooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Baños</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                      <Ruler className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm sm:text-base text-foreground">{property.area}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">m²</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                    asChild
                  >
                    <a href={`/propiedades/${property.id}`}>Ver detalles</a>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-border hover:bg-muted bg-transparent text-xs sm:text-sm"
                  >
                    Consultar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Button
            variant="outline"
            size="lg"
            className="border-foreground/20 text-foreground hover:bg-muted px-6 sm:px-8 bg-transparent text-sm sm:text-base"
            asChild
          >
            <a href="/propiedades">Ver todas las propiedades</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
