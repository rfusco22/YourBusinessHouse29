import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: "Email y contraseña son requeridos" }, { status: 400 })
    }

    console.log("[v0] Login attempt for email:", email)

    const users = (await query(
      "SELECT id, email, password, name, role, avatar_url, phone, facebook, instagram, twitter, linkedin, tiktok, youtube, whatsapp FROM users WHERE email = ?",
      [email],
    )) as any[]

    console.log("[v0] User found:", users.length > 0 ? "YES" : "NO")

    if (users.length === 0) {
      console.log("[v0] User not found in database")
      return NextResponse.json({ message: "Email o contraseña incorrectos" }, { status: 401 })
    }

    const user = users[0]
    console.log("[v0] Comparing password for user:", user.email)

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("[v0] Password match:", passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Email o contraseña incorrectos" }, { status: 401 })
    }

    const token = Buffer.from(`${user.id}:${user.role}:${user.email}`).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        phone: user.phone,
        facebook: user.facebook,
        instagram: user.instagram,
        twitter: user.twitter,
        linkedin: user.linkedin,
        tiktok: user.tiktok,
        youtube: user.youtube,
        whatsapp: user.whatsapp,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
