"use client"

import { Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SocialMediaSection } from "./social-media-section"

interface PropertyAgentProps {
  agent: any
}

export function PropertyAgent({ agent }: PropertyAgentProps) {
  const whatsappNumber = agent.whatsapp?.replace(/\D/g, "") || agent.phone?.replace(/\D/g, "")
  const propertyName = agent.propertyName || "esta propiedad"
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20${encodeURIComponent(propertyName)}`

  return (
    <Card className="p-6 sticky top-20">
      <div className="space-y-6">
        {/* Agent Info */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary">
            <img src={agent.image || "/placeholder.svg"} alt={agent.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{agent.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{agent.specialization}</p>
          <p className="text-xs text-muted-foreground">{agent.experience} de experiencia</p>
        </div>

        {/* Contact Buttons */}
        <div className="space-y-3">
          <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" size="lg" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 bg-primary/10 hover:bg-primary/20 border-primary text-primary"
            size="lg"
            asChild
          >
            <a href={`mailto:${agent.email}`}>
              <Mail className="w-4 h-4" />
              Enviar email
            </a>
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Contact Details */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
            <a href={`tel:${agent.phone}`} className="text-foreground font-medium hover:text-primary transition-colors">
              {agent.phone}
            </a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <a
              href={`mailto:${agent.email}`}
              className="text-foreground font-medium hover:text-primary transition-colors break-all"
            >
              {agent.email}
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Social Media Section */}
        {(agent.instagram || agent.facebook || agent.twitter || agent.linkedin || agent.tiktok || agent.youtube) && (
          <div className="bg-gradient-to-br from-background to-muted p-6 rounded-xl border border-primary/10">
            <SocialMediaSection agent={agent} />
          </div>
        )}

        {/* Info Box */}
        <div className="bg-muted p-4 rounded-lg text-sm">
          <p className="text-foreground font-medium mb-2">¿Tienes preguntas?</p>
          <p className="text-muted-foreground text-xs">
            Contacta directamente con el agente para más información sobre esta propiedad.
          </p>
        </div>
      </div>
    </Card>
  )
}
