"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : "https://yourbusinesshouse.com/contacto"

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          pageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Error al enviar el mensaje. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Ubicación",
      content: "CC El Añil, Valencia, Venezuela",
      color: "from-blue-500 to-cyan-500",
      delay: 0,
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+58 (424) 429-1541",
      href: "tel:+584244291541",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
    },
    {
      icon: Mail,
      title: "Email",
      content: "inmobiliaria businesshouse @gmail.com",
      href: "mailto:inmobiliariabusinesshouse@gmail.com",
      color: "from-orange-500 to-red-500",
      delay: 0.2,
    },
    {
      icon: Clock,
      title: "Horario",
      content: "Lun - Vie: 8:00 AM - 5:00 PM\nSáb - Dom: Cerrado",
      color: "from-green-500 to-emerald-500",
      delay: 0.3,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative w-full h-screen min-h-[600px] max-h-[800px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/images/contact-hero.png)",
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>

          {/* Bottom light gradient for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent opacity-10"></div>

          {/* Content container */}
          <div className="relative h-full flex items-center justify-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl space-y-6">
                {/* Accent badge */}
                <div className="inline-block">
                  <span className="text-sm font-semibold text-white/80 uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    Estamos Aquí Para Ti
                  </span>
                </div>

                {/* Main heading */}
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white text-balance leading-tight drop-shadow-lg">
                  Conecta con
                  <br />
                  nosotros
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-white/90 max-w-xl font-light leading-relaxed drop-shadow">
                  Tu próximo hogar está a un mensaje de distancia. Nuestro equipo experto está listo para hacer realidad
                  tus sueños inmobiliarios.
                </p>

                {/* CTA Button */}
                <div className="pt-4">
                  <a
                    href="#contact-form"
                    className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Enviar Mensaje
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/20 to-transparent blur-3xl pointer-events-none"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                    <div className="flex gap-4">
                      <motion.div className="flex-shrink-0" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <info.icon className="w-7 h-7 text-white" />
                        </div>
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground mb-2">{info.title}</h3>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-primary hover:text-primary/80 transition-colors font-medium hover:underline break-words block"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                            {info.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Social proof badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Respuesta Garantizada</span>
                </div>
                <p className="text-sm text-muted-foreground">Te respondemos en menos de 24 horas hábiles</p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
              id="contact-form"
            >
              <Card className="p-8 lg:p-10 border-0 shadow-2xl bg-card/80 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-0" />

                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl lg:text-4xl font-bold text-foreground mb-3"
                  >
                    Envíanos un Mensaje
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground mb-8"
                  >
                    Completa el formulario y nos pondremos en contacto contigo pronto
                  </motion.p>

                  {isSuccess ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="py-16 text-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">¡Mensaje Enviado!</h3>
                      <p className="text-muted-foreground">Te contactaremos pronto</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-semibold text-foreground mb-2">Nombre completo *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Juan Pérez"
                          className="w-full px-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                        />
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="tu@email.com"
                            className="w-full px-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                          />
                        </motion.div>

                        {/* Phone */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-semibold text-foreground mb-2">Teléfono</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+58 (212) XXX-XXXX"
                            className="w-full px-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                          />
                        </motion.div>
                      </div>

                      {/* Subject */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-semibold text-foreground mb-2">Asunto *</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="consulta">Consulta general</option>
                          <option value="venta">Vender propiedad</option>
                          <option value="compra">Comprar propiedad</option>
                          <option value="alquiler">Alquilar propiedad</option>
                          <option value="valoracion">Valoración de propiedad</option>
                          <option value="otro">Otro</option>
                        </select>
                      </motion.div>

                      {/* Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-semibold text-foreground mb-2">Mensaje *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Cuéntanos cómo podemos ayudarte..."
                          rows={5}
                          className="w-full px-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-none"
                        />
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              Enviar Mensaje
                              <Send className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 lg:mt-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Encuéntranos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Visítanos en nuestra oficina en CC El Añil, Valencia. Estamos listos para atenderte.
              </p>
            </div>

            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.4848484848486!2d-68.0073!3d10.1621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8063edb1e1e1e1%3A0x1e1e1e1e1e1e1e1e!2sCC%20El%20A%C3%B1il%2C%20Valencia%2C%20Carabobo%2C%20Venezuela!5e0!3m2!1ses!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
