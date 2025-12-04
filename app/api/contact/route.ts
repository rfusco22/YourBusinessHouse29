import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// HTML template for the email
function generateEmailHTML(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  pageUrl: string
}) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
      .header { background: linear-gradient(135deg, #a27622 0%, #bea244 100%); padding: 40px 20px; text-align: center; color: white; }
      .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 10px; }
      .header p { font-size: 14px; opacity: 0.9; }
      .content { padding: 40px 20px; }
      .section { margin-bottom: 30px; }
      .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #a27622; letter-spacing: 1px; margin-bottom: 10px; }
      .field { margin-bottom: 15px; }
      .field-label { font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
      .field-value { font-size: 14px; color: #333; padding: 10px 15px; background: #f5f5f5; border-left: 3px solid #a27622; border-radius: 4px; }
      .message-box { background: linear-gradient(135deg, rgba(162, 118, 34, 0.05) 0%, rgba(190, 162, 68, 0.05) 100%); padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 20px; }
      .message-box p { font-size: 14px; line-height: 1.6; color: #333; white-space: pre-wrap; word-wrap: break-word; }
      .source { background: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 12px; color: #666; }
      .source-link { color: #a27622; text-decoration: none; font-weight: 600; }
      .footer { background: #f5f5f5; padding: 30px 20px; text-align: center; border-top: 1px solid #e0e0e0; }
      .footer p { font-size: 12px; color: #999; line-height: 1.8; }
      .footer-badge { display: inline-block; background: #a27622; color: white; padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-top: 15px; }
      .divider { height: 1px; background: linear-gradient(90deg, transparent, #e0e0e0, transparent); margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Nueva Consulta Recibida</h1>
        <p>Your Business House - Agencia Inmobiliaria Premium</p>
      </div>

      <!-- Content -->
      <div class="content">
        <p style="font-size: 15px; color: #333; margin-bottom: 20px;">
          Hola equipo,
        </p>
        <p style="font-size: 15px; color: #666; margin-bottom: 30px;">
          Has recibido una nueva consulta del formulario de contacto. Aquí están los detalles:
        </p>

        <!-- Contact Information Section -->
        <div class="section">
          <div class="section-title">Información de Contacto</div>
          <div class="field">
            <div class="field-label">Nombre</div>
            <div class="field-value">${data.name}</div>
          </div>
          <div class="field">
            <div class="field-label">Correo Electrónico</div>
            <div class="field-value"><a href="mailto:${data.email}" style="color: #a27622; text-decoration: none;">${data.email}</a></div>
          </div>
          ${
            data.phone
              ? `
          <div class="field">
            <div class="field-label">Teléfono</div>
            <div class="field-value"><a href="tel:${data.phone}" style="color: #a27622; text-decoration: none;">${data.phone}</a></div>
          </div>
          `
              : ""
          }
        </div>

        <div class="divider"></div>

        <!-- Message Section -->
        <div class="section">
          <div class="section-title">Asunto</div>
          <div class="field-value">${data.subject}</div>
        </div>

        <!-- Message Content -->
        <div class="section">
          <div class="section-title">Mensaje</div>
          <div class="message-box">
            <p>${data.message}</p>
          </div>
        </div>

        <!-- Source Information -->
        <div class="source">
          <strong>Fuente:</strong> Formulario de contacto<br>
          <strong>Página:</strong> <a href="${data.pageUrl}" class="source-link">${data.pageUrl}</a><br>
          <strong>Fecha:</strong> ${new Date().toLocaleString("es-ES", { timeZone: "America/Caracas" })}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          Este correo fue enviado automáticamente desde tu formulario de contacto.<br>
          <strong>Your Business House</strong> - Agencia Inmobiliaria Premium
        </p>
        <div class="footer-badge">Formulario de Contacto</div>
      </div>
    </div>
  </body>
</html>
  `.trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, pageUrl } = body

    console.log("[v0] Contact form submission received:", { name, email, subject })

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailHTML = generateEmailHTML({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      pageUrl: pageUrl || "https://yourbusinesshouse.com/contacto",
    })

    console.log("[v0] Attempting to send email via Resend...")
    console.log("[v0] Email API Key exists:", !!process.env.RESEND_API_KEY)

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // Using Resend's default domain for testing
      to: "inmobiliariabusinesshouse@gmail.com",
      subject: `Nueva Consulta: ${subject}`,
      html: emailHTML,
      replyTo: email,
    })

    console.log("[v0] Email sent successfully:", response)

    if (response.error) {
      console.error("[v0] Resend error:", response.error)
      return NextResponse.json({ error: "Failed to send email", details: response.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Message sent successfully", id: response.data?.id })
  } catch (error) {
    console.error("[v0] Error processing contact form:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 })
  }
}
