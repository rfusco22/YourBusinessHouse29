"use client"

import { usePathname } from "next/navigation"
import { AIChatbot } from "./ai-chatbot"

export function ChatbotWrapper() {
  const pathname = usePathname()

  // Rutas donde el chatbot NO debe mostrarse
  const hiddenRoutes = [
    "/login",
    "/forgot-password",
    "/auth/forgot-password",
    "/reset-password",
    "/auth/reset-password",
    "/admin",
    "/asesor",
    "/gerencia",
  ]

  // Verificar si la ruta actual está en la lista de rutas ocultas
  const isHidden = hiddenRoutes.some((route) => pathname.startsWith(route))

  if (isHidden) return null

  return <AIChatbot />
}
