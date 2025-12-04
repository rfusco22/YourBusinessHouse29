import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Logo and Brand Section - Left Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex flex-col items-start gap-2 w-fit">
              <Image
                src="/logo-icon-gold.png"
                alt="Your Business House Logo Icon"
                width={80}
                height={80}
                className="h-12 w-auto flex-shrink-0"
              />
              <div className="flex flex-col gap-0">
                <span className="text-sm font-bold tracking-wide" style={{ color: "#a27622" }}>
                  YOUR BUSINESS HOUSE
                </span>
                <span className="text-xs font-light italic text-gray-400">Tu Casa de Negocio</span>
              </div>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "#a27622" }}>
              Explorar
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/propiedades" className="opacity-80 hover:opacity-100 transition-opacity">
                  Inmuebles
                </Link>
              </li>
              <li>
                <Link href="/agentes" className="opacity-80 hover:opacity-100 transition-opacity">
                  Agentes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="opacity-80 hover:opacity-100 transition-opacity">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="opacity-80 hover:opacity-100 transition-opacity">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "#a27622" }}>
              Empresa
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre-nosotros" className="opacity-80 hover:opacity-100 transition-opacity">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="opacity-80 hover:opacity-100 transition-opacity">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="opacity-80 hover:opacity-100 transition-opacity">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="opacity-80 hover:opacity-100 transition-opacity">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "#a27622" }}>
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>CC El Añil, Valencia, Venezuela</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <a href="tel:+584244291541" className="opacity-80 hover:opacity-100 transition-opacity">
                  +58 (424) 429-1541
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:inmobiliariabusinesshouse@gmail.com"
                  className="opacity-80 hover:opacity-100 transition-opacity break-all"
                >
                  inmobiliariabusinesshouse@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm opacity-80">&copy; 2025 YourBusinessHouse. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/yourbusinesshouse"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/yourbusinesshouse"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/584244291541"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/yourbusinesshouse"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
