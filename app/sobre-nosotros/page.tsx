import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Users, Award, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary to-secondary py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Sobre PremiumHomes
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
              Tu agencia inmobiliaria de confianza desde 2009
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Nuestra historia</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                PremiumHomes fue fundada en 2009 con la visión de revolucionar el mercado inmobiliario venezolano. Durante más de 15 años, hemos ayudado a miles de clientes a encontrar sus hogares ideales y a realizar inversiones inmobiliarias exitosas.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nuestro compromiso es proporcionar un servicio de excelencia, combinando profesionalismo, transparencia y dedicación en cada transacción inmobiliaria. Cada miembro de nuestro equipo trabaja con la misión de hacer que el proceso de compra, venta o alquiler sea la mejor experiencia posible.
              </p>
            </div>
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Oficina de PremiumHomes"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-border">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">2,850+</p>
              <p className="text-lg text-muted-foreground">Transacciones exitosas</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">45+</p>
              <p className="text-lg text-muted-foreground">Agentes profesionales</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">1,234</p>
              <p className="text-lg text-muted-foreground">Propiedades disponibles</p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Nuestros valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8">
                <Award className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Excelencia</h3>
                <p className="text-muted-foreground">
                  Nos comprometemos a ofrecer los mejores servicios y soluciones inmobiliarias en el mercado.
                </p>
              </Card>
              <Card className="p-8">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Confianza</h3>
                <p className="text-muted-foreground">
                  La transparencia y la honestidad son la base de todas nuestras relaciones comerciales.
                </p>
              </Card>
              <Card className="p-8">
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Innovación</h3>
                <p className="text-muted-foreground">
                  Utilizamos tecnología de punta para mejorar la experiencia de nuestros clientes.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
