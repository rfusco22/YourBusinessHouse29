"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, Send, Loader2 } from "lucide-react"
import Image from "next/image"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        d="M6.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 .5 0 1-.2 1.5L16 18l-4-1.2c-.5.2-1 .2-1.5.2-2.5 0-4.5-2-4.5-4.5z"
        fill="white"
      />
      <g fill="white">
        <path d="M8.2 10.8c.8 1.6 2.1 2.9 3.7 3.7l1.2-1.2c.15-.15.38-.2.58-.14.6.2 1.25.32 1.9.32.3 0 .55.25.55.55v2.5c0 .3-.25.55-.55.55-5.05 0-9.2-4.15-9.2-9.2 0-.3.25-.55.55-.55h2.5c.3 0 .55.25.55.55 0 .65.12 1.3.32 1.9.06.2 0 .43-.14.58l-1.2 1.2z" />
      </g>
    </svg>
  )
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hasShownQuickReplies, setHasShownQuickReplies] = useState(false)

  const { messages, input, setInput, handleSubmit, append, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "¡Hola! Soy Hogarcito, tu agente inmobiliario virtual. Estoy aquí para ayudarte a encontrar tu próximo hogar en cualquier parte de Venezuela. ¿Estás buscando comprar o alquilar?",
      },
    ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setHasShownQuickReplies(true)
    handleSubmit(e)
  }

  const handleQuickReply = (text: string) => {
    setHasShownQuickReplies(true)
    append({ role: "user", content: text })
  }

  const handlePropertyClick = (propertyId: number) => {
    window.open(`/propiedades/${propertyId}`, "_blank")
  }

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Hola, me gustaría agendar una visita para ver una propiedad.")
    window.open(`https://wa.me/584244291541?text=${message}`, "_blank")
  }

  const getPropertiesFromMessages = () => {
    const properties: any[] = []
    for (const message of messages) {
      if (message.toolInvocations) {
        for (const tool of message.toolInvocations) {
          if (tool.toolName === "searchProperties" && tool.state === "result" && tool.result?.properties) {
            properties.push(...tool.result.properties)
          }
        }
      }
    }
    return properties
  }

  const properties = getPropertiesFromMessages()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
        aria-label="Abrir chatbot"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-2 rounded-full border-2 border-primary-foreground/30 animate-pulse group-hover:border-primary-foreground/50"></div>
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </div>
      </button>

      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] lg:w-[420px] max-w-[calc(100vw-2rem)] h-[70vh] sm:h-[60vh] lg:h-[600px] max-h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-400 bg-background">
          <div className="relative bg-gradient-to-r from-primary via-accent to-primary p-3 sm:p-5 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-2 left-2 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute bottom-2 right-2 w-16 h-16 bg-accent/20 rounded-full blur-lg animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 flex items-center justify-center text-xl sm:text-2xl shadow-md flex-shrink-0">
                  🏠
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-primary-foreground font-heading truncate">
                    Hogarcito
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-300 animate-pulse flex-shrink-0"></span>
                    <p className="text-xs text-primary-foreground/90 whitespace-nowrap">En línea con IA</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-primary-foreground/85 line-clamp-2">
                Tu Agente Inmobiliario Virtual Inteligente
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1 hover:bg-white/20 rounded-full"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gradient-to-b from-background via-background to-accent/5 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
            {messages.map((msg, idx) => {
              if (!msg.content) return null

              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl rounded-br-sm shadow-lg"
                        : "bg-card text-foreground border border-border/50 rounded-2xl rounded-bl-sm shadow-sm"
                    } px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm`}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>

                    {idx === 0 && msg.role === "assistant" && !hasShownQuickReplies && (
                      <div className="flex gap-2 mt-2 sm:mt-3 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 text-xs sm:text-sm py-1 sm:py-2"
                          onClick={() => handleQuickReply("Quiero alquilar")}
                        >
                          Alquilar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 text-xs sm:text-sm py-1 sm:py-2"
                          onClick={() => handleQuickReply("Quiero comprar")}
                        >
                          Comprar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {properties.length > 0 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {properties.map((property: any) => (
                  <div
                    key={property.id}
                    className="bg-card rounded-lg p-2 cursor-pointer hover:bg-accent/10 transition-colors border border-border/50"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    {property.image_url && (
                      <div className="relative w-full h-20 sm:h-24 mb-2 rounded overflow-hidden">
                        <Image
                          src={property.image_url || "/placeholder.svg"}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 420px) 100vw, 420px"
                        />
                      </div>
                    )}
                    <p className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">{property.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{property.location}</p>
                    <p className="text-sm sm:text-base font-bold text-primary mt-1">${property.price}</p>
                    <p className="text-xs text-muted-foreground">
                      {property.bedrooms} hab • {property.bathrooms} baños • {property.area}m²
                    </p>
                  </div>
                ))}

                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full mt-2 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm py-2 sm:py-2.5"
                  size="sm"
                >
                  <WhatsAppIcon />
                  <span className="ml-1 sm:ml-2 truncate">Agendar visita</span>
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-card border border-border/50 rounded-2xl rounded-bl-sm shadow-sm">
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 border-t border-border/30 p-2 sm:p-3 bg-background/95 backdrop-blur-sm">
            <form onSubmit={onSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full bg-white dark:bg-slate-800 border border-primary/20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/40 disabled:opacity-50"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !input.trim()}
                className="px-2 sm:px-3 py-2 sm:py-2.5 h-auto bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all rounded-full flex items-center justify-center gap-1 sm:gap-2 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
                ) : (
                  <Send className="w-3 sm:w-4 h-3 sm:h-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
