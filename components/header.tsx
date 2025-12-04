"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Instagram, Moon, Sun } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo-icon-gold.png"
              alt="Your Business House Logo Icon"
              width={80}
              height={80}
              className="h-12 sm:h-16 w-auto flex-shrink-0"
            />
            <div className="flex flex-col justify-center gap-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-lg font-bold tracking-wide text-foreground">
                  YOUR BUSINESS <span className="hidden sm:inline">HOUSE</span>
                </span>
              </div>
              <span className="text-xs font-light italic text-primary">Tu Casa de Negocio</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/propiedades"
              className="text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Inmuebles
            </Link>
            <Link href="/agentes" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Agentes
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Blog
            </Link>
            <Link href="/contacto" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Contacto
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.instagram.com/yourbusinesshouse"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a
              href="https://wa.me/584244291541"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-border pt-4">
            <Link
              href="/propiedades"
              className="block text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Inmuebles
            </Link>
            <Link
              href="/agentes"
              className="block text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Agentes
            </Link>
            <Link
              href="/blog"
              className="block text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              href="/contacto"
              className="block text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Contacto
            </Link>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <a
                href="https://www.instagram.com/yourbusinesshouse"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
              </a>
              <a
                href="https://wa.me/584244291541"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
              </a>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
