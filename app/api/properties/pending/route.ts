import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const properties = await query(`
      SELECT 
        p.*,
        u.name as asesor_name,
        u.email as asesor_email,
        pa.status,
        pa.id as approval_id,
        pa.created_at as submission_date
      FROM properties p
      JOIN property_approvals pa ON p.id = pa.property_id
      JOIN users u ON pa.asesor_id = u.id
      WHERE pa.status = 'pendiente'
      ORDER BY pa.created_at DESC
    `)

    return NextResponse.json({ success: true, data: properties })
  } catch (error) {
    console.error("[v0] Fetch pending properties error:", error)
    return NextResponse.json({ error: "Error al obtener propiedades pendientes" }, { status: 500 })
  }
}
