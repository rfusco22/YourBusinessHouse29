import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash("demo123", 10)

    const emails = ["asesor@test.com", "admin@test.com", "gerencia@test.com"]

    for (const email of emails) {
      await query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email])
    }

    const users = (await query("SELECT id, email, name, role FROM users WHERE email IN (?, ?, ?)", emails)) as any[]

    return NextResponse.json({
      message: "Contraseñas actualizadas correctamente",
      users: users,
      password: "demo123",
    })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ message: "Error al actualizar contraseñas" }, { status: 500 })
  }
}
