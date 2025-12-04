import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ChatbotWrapper } from "@/components/chatbot-wrapper"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Your Business House - Agencia Inmobiliaria Premium",
  description: "Descubre propiedades de lujo cuidadosamente seleccionadas. Tu hogar perfecto te espera.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        />
      </head>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <ChatbotWrapper />
        </Providers>
      </body>
    </html>
  )
}
