import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const properties = await query(`
      SELECT p.* FROM properties p
      JOIN property_approvals pa ON p.id = pa.property_id
      WHERE pa.status = 'aprobado'
      ORDER BY p.created_at DESC
    `)

    return NextResponse.json({ success: true, data: properties })
  } catch (error) {
    console.error("[v0] Fetch approved properties error:", error)
    return NextResponse.json({ error: "Error al obtener propiedades aprobadas" }, { status: 500 })
  }
}
