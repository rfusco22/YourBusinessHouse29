import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import crypto from "crypto"
import nodemailer from "nodemailer"
import { APP_URL } from "@/lib/constants"

// Configure email (usando servicio de ejemplo)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: "El email es requerido" }, { status: 400 })
    }

    console.log("[v0] Forgot password request for email:", email)

    // Check if user exists
    const users = (await query("SELECT id, email, name FROM users WHERE email = ?", [email])) as any[]

    if (users.length === 0) {
      // Return error if email does not exist
      return NextResponse.json(
        { message: "No encontramos una cuenta con este correo electrónico. Por favor verifica e intenta de nuevo." },
        { status: 404 },
      )
    }

    const user = users[0]

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token_hash = ?, expires_at = ?",
      [user.id, tokenHash, expiresAt, tokenHash, expiresAt],
    )

    const resetLink = `${APP_URL}/auth/reset-password/${resetToken}`
    console.log("[v0] Reset link generated:", resetLink)

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "Your Business House <noreply@yourBusinessHouse.com>",
        to: user.email,
        subject: "Restablece tu contraseña - Your Business House",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #a27622 0%, #8b6319 100%); padding: 30px; border-radius: 8px; text-align: center; color: white;">
              <h1 style="margin: 0;">Your Business House</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border: 1px solid #e0e0e0;">
              <h2 style="color: #333; margin-top: 0;">Restablecer Contraseña</h2>
              
              <p style="color: #666; line-height: 1.6;">Hola ${user.name},</p>
              
              <p style="color: #666; line-height: 1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
                Haz clic en el botón de abajo para proceder:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; background: #a27622; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Cambiar Contraseña
                </a>
              </div>
              
              <p style="color: #999; font-size: 12px; line-height: 1.6;">
                Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este correo.
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 0;">
                Si tienes problemas, copia y pega este enlace en tu navegador:<br/>
                <span style="color: #999; font-size: 11px; word-break: break-all;">${resetLink}</span>
              </p>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
              <p>© 2025 Your Business House. Todos los derechos reservados.</p>
            </div>
          </div>
        `,
      })
      console.log("[v0] Password reset email sent to:", user.email)
    } catch (emailError) {
      console.error("[v0] Email sending error:", emailError)
      return NextResponse.json(
        { message: "Si el email existe en nuestro sistema, recibirás un correo de restablecimiento" },
        { status: 200 },
      )
    }

    return NextResponse.json(
      { message: "Se ha enviado un correo con instrucciones para restablecer tu contraseña" },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
