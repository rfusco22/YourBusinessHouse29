import { Star, Phone, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SocialMediaSection } from "./social-media-section"

interface AgentCardProps {
  agent: {
    id: number
    name: string
    email: string
    phone?: string
    image?: string
    role: string
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
    tiktok?: string
    youtube?: string
    whatsapp?: string
  }
}

export function AgentCard({ agent }: AgentCardProps) {
  // Mock data for display - in a real app, these would come from the database
  const mockSpecialization = [
    "Venta de viviendas de lujo",
    "Alquileres residenciales",
    "Propiedades comerciales",
    "Desarrollo inmobiliario",
  ][agent.id % 4]
  const mockRating = (4.7 + (agent.id % 3) * 0.1).toFixed(1)
  const mockProperties = 100 + (agent.id % 3) * 30
  const mockExperience = 8 + (agent.id % 4)

  const getSocialLink = (platform: string, value: string | undefined): string | null => {
    if (!value) return null

    switch (platform) {
      case "instagram":
        return `https://instagram.com/${value.replace("@", "").split("/").pop()}`
      case "facebook":
        return value.startsWith("http") ? value : `https://facebook.com/${value}`
      case "twitter":
        return `https://twitter.com/${value.replace("@", "").split("/").pop()}`
      case "linkedin":
        return value.startsWith("http") ? value : `https://linkedin.com/in/${value}`
      case "tiktok":
        return `https://tiktok.com/@${value.replace("@", "").split("/").pop()}`
      case "youtube":
        return value.startsWith("http") ? value : `https://youtube.com/${value}`
      case "whatsapp":
        return `https://wa.me/${value.replace(/\D/g, "")}`
      default:
        return null
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative h-64 bg-muted overflow-hidden">
        {agent.image ? (
          <img src={agent.image || "/placeholder.svg"} alt={agent.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground">{agent.name}</h3>
        <p className="text-sm text-primary font-medium mb-3">{mockSpecialization}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{mockRating}</span>
        </div>

        {/* Experience & Properties */}
        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-border text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{mockProperties}</p>
            <p className="text-xs text-muted-foreground">Propiedades</p>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{mockExperience} años</p>
            <p className="text-xs text-muted-foreground">Experiencia</p>
          </div>
        </div>

        {(agent.instagram || agent.facebook || agent.twitter || agent.linkedin || agent.tiktok || agent.youtube) && (
          <div className="mb-6 pb-6 border-b border-border">
            <SocialMediaSection agent={agent} />
          </div>
        )}

        {/* Contact Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <a href={`tel:${agent.phone}`} aria-label="Call agent">
              <Phone className="w-4 h-4" />
            </a>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <a href={`mailto:${agent.email}`}>
              <Mail className="w-4 h-4 mr-1" />
              Contactar
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}
