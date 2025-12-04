"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, Send, Loader2, Instagram } from "lucide-react"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      {/* Green circle background */}
      <circle cx="12" cy="12" r="12" fill="#25D366" />

      {/* White speech bubble background */}
      <path
        d="M6.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 .5 0 1-.2 1.5L16 18l-4-1.2c-.5.2-1 .2-1.5.2-2.5 0-4.5-2-4.5-4.5z"
        fill="white"
      />

      {/* Phone icon inside */}
      <path
        d="M10.5 10c0 .3.2.5.5.5s.5-.2.5-.5v-1c0-.3-.2-.5-.5-.5s-.5.2-.5.5v1m3 0c0 .3.2.5.5.5s.5-.2.5-.5v-1c0-.3-.2-.5-.5-.5s-.5.2-.5.5v1m-1.5 3.5c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5z"
        fill="#25D366"
      />

      {/* Better phone icon using a curved phone shape */}
      <g fill="white">
        <path d="M8.2 10.8c.8 1.6 2.1 2.9 3.7 3.7l1.2-1.2c.15-.15.38-.2.58-.14.6.2 1.25.32 1.9.32.3 0 .55.25.55.55v2.5c0 .3-.25.55-.55.55-5.05 0-9.2-4.15-9.2-9.2 0-.3.25-.55.55-.55h2.5c.3 0 .55.25.55.55 0 .65.12 1.3.32 1.9.06.2 0 .43-.14.58l-1.2 1.2z" />
      </g>
    </svg>
  )
}

interface FAQItem {
  id: number
  question: string
  answer: string
  renderAnswer?: (answer: string) => React.ReactNode
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "¿Qué es una persona jurídica?",
    answer:
      "Una persona jurídica es una empresa, organización o institución con identidad legal propia. Puede comprar, vender o alquilar propiedades igual que una persona natural, pero actúa a través de sus representantes legales.",
  },
  {
    id: 2,
    question: "¿Cuánto debo tener para comprar un apartamento?",
    answer:
      "El monto depende del tipo de inmueble, la zona, el estado de la propiedad y las condiciones del vendedor. En Valencia, suelen existir opciones desde precios accesibles hasta propiedades de alta gama.",
  },
  {
    id: 3,
    question: "Tienen propiedades con financiamiento?",
    answer:
      "Sí, contamos con propiedades donde el propietario ofrece financiamiento directo. Esto depende de cada inmueble y de las condiciones del dueño. Podemos mostrártelas y ayudarte a evaluar cuál se adapta mejor a ti.",
  },
  {
    id: 4,
    question: "¿Qué necesito para alquilar un apartamento?",
    answer:
      "Generalmente los requisitos son: Cédula o pasaporte, Constancia de trabajo o certificación de ingresos, Depósito de garantía, Fiador en caso de que el propietario lo solicite.",
  },
  {
    id: 5,
    question: "¿El depósito de un alquiler me lo regresan?",
    answer:
      "Sí. El depósito de garantía se devuelve al finalizar el contrato, siempre que la propiedad se entregue en las mismas condiciones en las que fue recibida, sin daños y con pagos al día.",
  },
  {
    id: 6,
    question: "¿Dónde están ubicados?",
    answer:
      "Estamos ubicados en el C.C El Añil, Valencia, Estado Carabobo. Si deseas visitarnos, Contáctanos al WhatsApp 0424-4291541 ",
  },
  {
    id: 7,
    question: "¿Cómo puedo seguir sus redes sociales?",
    answer: "¡Nos encantaría estar conectados contigo! Síguenos en nuestras redes sociales:",
    renderAnswer: () => (
      <div className="space-y-3">
        <p>¡Nos encantaría estar conectados contigo! Síguenos en nuestras redes sociales:</p>
        <div className="flex gap-6 mt-4 justify-center">
          <a
            href="https://www.instagram.com/yourbusinesshouse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-110 transition-all duration-200 flex-shrink-0"
            aria-label="Síguenos en Instagram @yourbusinesshouse"
            title="@yourbusinesshouse"
          >
            <Instagram className="w-8 h-8" />
          </a>
          <a
            href="https://wa.me/584244291541?text=Hola%20Your%20Business%20House"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-16 h-16 rounded-full hover:shadow-lg hover:scale-110 transition-all duration-200 flex-shrink-0"
            aria-label="Contáctanos por WhatsApp 0424-4291541"
            title="0424-4291541"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-16 h-16">
              <circle cx="256" cy="256" r="256" fill="#45d354"></circle>
              <path
                fill="#fff"
                d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"
              ></path>
              <path
                fill="#fff"
                d="M264 384c-41 0-72-22-72-22l-49 13 12-48s-20-31-20-70c0-72 59-132 132-132 68 0 126 53 126 127 0 72-58 131-129 132m-159 29l83-23a158 158 0 0 0 230-140c0-86-68-155-154-155a158 158 0 0 0-137 236"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    ),
  },
]

interface Message {
  type: "bot" | "user"
  content: string
  isQuestion?: boolean
  renderContent?: React.ReactNode
}

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const welcomeMessage = `¡Hola! Soy Hogarcito 🏠, tu asistente de propiedades. ¿En qué puedo ayudarte hoy?\n\nPuedes preguntarme:\n1. ¿Qué es una persona jurídica?\n2. ¿Cuánto debo tener para comprar un apartamento?\n3. Tienen propiedades con financiamiento?\n4. ¿Qué necesito para alquilar un apartamento?\n5. ¿El depósito de un alquiler me lo regresan?\n6. ¿Dónde están ubicados?\n7. ¿Cómo puedo seguir sus redes sociales?\n\n✅ Solo ingresa el NÚMERO de la pregunta (1-7)`
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: welcomeMessage,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickReply = (questionId: number) => {
    const faq = faqData.find((f) => f.id === questionId)
    if (faq) {
      setIsLoading(true)
      setMessages((prev) => [
        ...prev,
        { type: "user", content: faq.question, isQuestion: true },
        { type: "bot", content: "typing" },
      ])

      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            type: "bot",
            content: faq.answer,
            renderContent: faq.renderAnswer ? faq.renderAnswer() : undefined,
          }
          return newMessages
        })
        setIsLoading(false)
      }, 800)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const num = Number.parseInt(input.trim())
    const faq = faqData.find((f) => f.id === num)

    if (faq) {
      handleQuickReply(num)
    } else if (input.trim() === "limpiar" || input.trim() === "clear") {
      setMessages([
        {
          type: "bot",
          content: welcomeMessage,
        },
      ])
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: input.trim(), isQuestion: true },
        {
          type: "bot",
          content: "Disculpa, no reconozco ese número. Por favor, escribe un número del 1 al 7.",
        },
      ])
    }

    setInput("")
  }

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
        <div className="fixed bottom-16 sm:bottom-24 right-4 sm:right-6 z-40 w-full sm:w-[420px] max-w-[calc(100vw-2rem)] h-[70vh] sm:h-[600px] max-h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-400 bg-background">
          {/* Header - Responsive padding and text sizing */}
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
                    <p className="text-xs text-primary-foreground/90 whitespace-nowrap">En línea</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-primary-foreground/85 line-clamp-2">Tu Agente Inmobiliario Virtual</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1 hover:bg-white/20 rounded-full"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area - Responsive padding for mobile */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gradient-to-b from-background via-background to-accent/5 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-message-in`}
                style={
                  {
                    animationDelay: `${idx * 0.08}s`,
                    "--animation-delay": `${idx * 0.08}s`,
                  } as React.CSSProperties
                }
              >
                {msg.type === "bot" && msg.content === "typing" ? (
                  <div className="flex gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-card border border-border/50 rounded-2xl rounded-bl-sm shadow-sm">
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                ) : (
                  <div
                    className={`max-w-xs sm:max-w-sm px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-2xl transition-all duration-300 ${
                      msg.type === "user"
                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-sm shadow-lg hover:shadow-primary/50"
                        : "bg-card text-foreground border border-border/50 rounded-bl-sm shadow-sm hover:shadow-md hover:border-primary/30"
                    }`}
                  >
                    {msg.renderContent || <div className="whitespace-pre-wrap break-words">{msg.content}</div>}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area - Responsive padding and input styling */}
          <div className="flex-shrink-0 border-t border-border/30 p-2 sm:p-3 bg-background/95 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                max="7"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ingresa (1-7)..."
                disabled={isLoading}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full bg-white dark:bg-slate-800 border border-primary/20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/40 disabled:opacity-50"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
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
