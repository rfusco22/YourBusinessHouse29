import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const agents = (await query(
      `SELECT id, name, email, phone, avatar_url as image, role, instagram, facebook, twitter, linkedin, tiktok, youtube, whatsapp FROM users WHERE role = 'asesor' AND is_active = TRUE ORDER BY created_at DESC`,
    )) as any[]

    return NextResponse.json({ success: true, data: agents })
  } catch (error) {
    console.error("[v0] Fetch agents error:", error)
    return NextResponse.json({ error: "Error al obtener agentes" }, { status: 500 })
  }
}
