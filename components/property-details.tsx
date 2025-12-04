import { BedDouble, Bath, Ruler, Calendar, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PropertyDetailsProps {
  property: any
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{property.title}</h1>
            <p className="text-lg text-muted-foreground">{property.location}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">{property.price}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="gap-2">
            <Heart className="w-4 h-4" />
            Guardar
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BedDouble className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{property.bedrooms}</span>
            </div>
            <p className="text-sm text-muted-foreground">Cuartos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bath className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{property.bathrooms}</span>
            </div>
            <p className="text-sm text-muted-foreground">Baños</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Ruler className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{property.area}</span>
            </div>
            <p className="text-sm text-muted-foreground">m²</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{property.yearBuilt}</span>
            </div>
            <p className="text-sm text-muted-foreground">Año</p>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Descripción</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{property.description}</p>
      </Card>

      {/* Amenities */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Amenidades</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.amenities.map((amenity: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <p className="text-foreground">{amenity}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
