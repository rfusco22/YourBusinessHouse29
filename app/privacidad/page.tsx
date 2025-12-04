import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-foreground mb-8">Política de Privacidad</h1>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introducción</h2>
              <p>
                En PremiumHomes, la privacidad de nuestros usuarios es fundamental. Esta política describe cómo recopilamos, utilizamos y protegemos tu información personal.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Información que recopilamos</h2>
              <p>
                Recopilamos información que proporcionas voluntariamente, como nombre, correo electrónico, teléfono y datos sobre tu búsqueda inmobiliaria.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Cómo usamos tu información</h2>
              <p>
                Utilizamos tu información para:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Proporcionar servicios inmobiliarios</li>
                <li>Comunicarnos contigo sobre propiedades</li>
                <li>Mejorar nuestros servicios</li>
                <li>Cumplir con requisitos legales</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Protección de datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta política, puedes contactarnos en info@premiumhomes.ve
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
