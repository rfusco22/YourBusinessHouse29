import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-foreground mb-8">Términos y Condiciones</h1>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Aceptación de términos</h2>
              <p>
                Al utilizar nuestro sitio web, aceptas estos términos y condiciones. Si no estás de acuerdo, no debes usar el sitio.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Uso del sitio</h2>
              <p>
                El contenido de nuestro sitio web es solo para propósitos informativos. No garantizamos la precisión de toda la información.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Propiedades intelectuales</h2>
              <p>
                Todo el contenido del sitio, incluyendo textos, gráficos e imágenes, es propiedad de PremiumHomes y está protegido por ley.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Responsabilidades</h2>
              <p>
                PremiumHomes no se hace responsable por daños indirectos resultantes del uso del sitio. El usuario utiliza el sitio bajo su propio riesgo.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Modificaciones</h2>
              <p>
                PremiumHomes se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Contacto</h2>
              <p>
                Para preguntas sobre estos términos, contacta a info@premiumhomes.ve
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
