"use client"

import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { useState } from "react"

interface SocialMediaSectionProps {
  agent: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
    tiktok?: string
    youtube?: string
    whatsapp?: string
  }
}

export function SocialMediaSection({ agent }: SocialMediaSectionProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

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

  const socialPlatforms = [
    {
      name: "Instagram",
      icon: Instagram,
      value: agent.instagram,
      gradient: "from-pink-500 via-red-500 to-purple-600",
      shadowColor: "shadow-pink-500/50",
    },
    {
      name: "Facebook",
      icon: Facebook,
      value: agent.facebook,
      gradient: "from-blue-600 to-blue-700",
      shadowColor: "shadow-blue-500/50",
    },
    {
      name: "Twitter",
      icon: Twitter,
      value: agent.twitter,
      gradient: "from-cyan-400 to-cyan-500",
      shadowColor: "shadow-cyan-400/50",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      value: agent.linkedin,
      gradient: "from-blue-500 to-blue-700",
      shadowColor: "shadow-blue-500/50",
    },
  ]

  const activePlatforms = socialPlatforms.filter((p) => p.value)

  if (agent.tiktok) {
    activePlatforms.push({
      name: "TikTok",
      icon: null,
      value: agent.tiktok,
      gradient: "from-black to-gray-900",
      shadowColor: "shadow-gray-800/50",
    } as any)
  }

  if (agent.youtube) {
    activePlatforms.push({
      name: "YouTube",
      icon: null,
      value: agent.youtube,
      gradient: "from-red-600 to-red-700",
      shadowColor: "shadow-red-500/50",
    } as any)
  }

  if (activePlatforms.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-semibold text-foreground tracking-wide">
        Conecta con {agent.whatsapp ? "nosotros" : "él"}
      </h3>

      <div className="flex flex-wrap gap-5">
        {activePlatforms.map((platform) => {
          const Icon = platform.icon
          const link = getSocialLink(platform.name.toLowerCase(), platform.value)

          return (
            <a
              key={platform.name}
              href={link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.name}
              onMouseEnter={() => setHoveredIcon(platform.name)}
              onMouseLeave={() => setHoveredIcon(null)}
              className={`
                relative w-16 h-16 rounded-full flex items-center justify-center
                bg-gradient-to-br ${platform.gradient}
                text-white shadow-2xl ${platform.shadowColor}
                transition-all duration-300 ease-out
                hover:scale-110 hover:shadow-2xl hover:-translate-y-2
                active:scale-95 active:translate-y-1
                group
                flex-shrink-0
              `}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 rounded-full bg-black/30 blur-md -z-10 translate-y-2 opacity-60" />

              {Icon ? (
                <Icon className="w-6 h-6 relative z-10" />
              ) : (
                <span className="text-sm font-bold relative z-10">{platform.name === "TikTok" ? "TK" : "YT"}</span>
              )}

              {hoveredIcon === platform.name && (
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none">
                  {platform.name}
                </div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
