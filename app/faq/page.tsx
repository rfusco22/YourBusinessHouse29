'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'

const FAQS = [
  {
    id: 1,
    question: '¿Cuál es el proceso para comprar una propiedad?',
    answer: 'El proceso comienza con la búsqueda de la propiedad ideal, seguido de inspecciones, evaluación de la propiedad, trámites legales y finalmente la escrituración. Nuestro equipo te guiará en cada paso del camino.',
  },
  {
    id: 2,
    question: '¿Cómo puedo alquilar una propiedad?',
    answer: 'Ofrecemos un catálogo completo de propiedades para alquilar. Puedes filtrar por ubicación, tipo, precio y otras características. Nuestros agentes están disponibles para mostrar las propiedades.',
  },
  {
    id: 3,
    question: '¿Necesito un agente para vender mi propiedad?',
    answer: 'Aunque no es obligatorio, recomendamos trabajar con nuestros agentes especializados para obtener los mejores resultados y asegurar un proceso fluido en la venta.',
  },
  {
    id: 4,
    question: '¿Qué documentos necesito para vender mi propiedad?',
    answer: 'Necesitarás la escritura de propiedad, documento de identidad, recibos de servicios, y otros documentos según el tipo de propiedad. Nuestro equipo te informará exactamente qué necesitas.',
  },
  {
    id: 5,
    question: '¿Realizan evaluaciones de propiedades?',
    answer: 'Sí, contamos con evaluadores certificados que pueden hacer tasaciones profesionales de tu propiedad para determinar su valor en el mercado actual.',
  },
  {
    id: 6,
    question: '¿Cómo me pongo en contacto con un agente?',
    answer: 'Puedes contactar a nuestros agentes a través de la página de agentes, correo electrónico, teléfono o usando el formulario de contacto en nuestro sitio web.',
  },
]

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary to-secondary py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Preguntas frecuentes
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
              Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <Card key={faq.id} className="p-6">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <h3 className="text-lg font-bold text-foreground">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openId === faq.id && (
                  <p className="text-muted-foreground mt-4 leading-relaxed">{faq.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
