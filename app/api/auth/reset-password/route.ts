import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, passwordConfirm } = body

    if (!token || !password || !passwordConfirm) {
      return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ message: "Las contraseñas no coinciden" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    console.log("[v0] Reset password attempt with token")

    // Hash the token to match what's in the database
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    // Get the reset token record
    const tokens = (await query(
      "SELECT user_id, expires_at FROM password_reset_tokens WHERE token_hash = ? AND expires_at > NOW()",
      [tokenHash],
    )) as any[]

    if (tokens.length === 0) {
      console.log("[v0] Invalid or expired token")
      return NextResponse.json({ message: "El enlace de restablecimiento es inválido o ha expirado" }, { status: 400 })
    }

    const resetToken = tokens[0]
    const userId = resetToken.user_id

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId])

    // Delete the used token
    await query("DELETE FROM password_reset_tokens WHERE token_hash = ?", [tokenHash])

    console.log("[v0] Password reset successful for user:", userId)

    return NextResponse.json({ message: "Contraseña actualizada exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
