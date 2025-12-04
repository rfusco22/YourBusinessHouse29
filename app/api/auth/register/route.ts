import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password || !name || !role) {
      return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = (await query("SELECT id FROM users WHERE email = ?", [email])) as any[]

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "El email ya está registrado" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    await query("INSERT INTO users (email, password, name, role, is_active) VALUES (?, ?, ?, ?, TRUE)", [
      email,
      hashedPassword,
      name,
      role,
    ])

    return NextResponse.json({ message: "Usuario creado exitosamente" }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
