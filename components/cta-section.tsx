"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Home, Users, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
}: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isVisible, target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

const benefits = [
  {
    icon: Home,
    title: "Propiedades Exclusivas",
    description: "Acceso a inmuebles premium antes de publicarse",
  },
  {
    icon: Users,
    title: "Asesoría Personalizada",
    description: "Agentes expertos dedicados a tu búsqueda",
  },
  {
    icon: Shield,
    title: "Transacciones Seguras",
    description: "Proceso legal transparente y protegido",
  },
]

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#1a1a2e] dark:via-[#2d2d44] dark:to-[#1a1a2e]">
        {/* Animated floating orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#C6A86C]/10 dark:bg-[#C6A86C]/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-[#C6A86C]/5 dark:bg-[#C6A86C]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C6A86C]/5 dark:bg-[#C6A86C]/5 rounded-full blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(198, 168, 108, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(198, 168, 108, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Benefits cards */}
        <div
          className={`grid md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-white dark:hover:bg-white/10 hover:border-[#C6A86C]/50 dark:hover:border-[#C6A86C]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C6A86C]/10 shadow-lg dark:shadow-none"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#C6A86C] to-[#9A7B4F] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-white/60 text-sm">{benefit.description}</p>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C6A86C]/0 via-[#C6A86C]/5 to-[#C6A86C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Main CTA content */}
        <div
          className={`text-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C6A86C]/10 dark:bg-[#C6A86C]/20 border border-[#C6A86C]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#C6A86C]" />
            <span className="text-[#C6A86C] dark:text-[#C6A86C] text-sm font-medium">
              Más de <AnimatedCounter target={500} suffix="+" /> familias confían en nosotros
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance leading-tight">
            Tu próximo hogar te está
            <span className="relative mx-3">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#C6A86C] to-[#E8D5A3]">
                esperando
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#C6A86C]/20 -skew-x-6 rounded" />
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-white/70 mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Únete a cientos de familias que encontraron su propiedad ideal con nosotros. Nuestro equipo de expertos te
            guiará en cada paso hacia tu nuevo hogar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/propiedades">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-[#C6A86C] to-[#9A7B4F] hover:from-[#D4B87A] hover:to-[#A8894D] text-white border-0 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-[#C6A86C]/25 hover:shadow-xl hover:shadow-[#C6A86C]/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Explorar Propiedades
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>

            <Link href="/agentes">
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white hover:border-[#C6A86C] hover:bg-[#C6A86C]/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 bg-white/50 dark:bg-transparent"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Hablar con un Asesor
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className={`mt-12 flex flex-wrap justify-center gap-8 text-gray-500 dark:text-white/50 text-sm transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
              <span>Asesoría gratuita</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <span>Respuesta en 24 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <span>Sin compromisos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
