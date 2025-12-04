import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { property_id, admin_id, admin_notes } = body

    if (!property_id || !admin_id) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 })
    }

    // Actualizar estado de aprobación
    await query(
      `UPDATE property_approvals 
       SET status = 'aprobado', approved_by = ?, approval_date = NOW(), admin_notes = ?
       WHERE property_id = ?`,
      [admin_id, admin_notes || null, property_id],
    )

    // Actualizar approval_status en properties
    await query(`UPDATE properties SET approval_status = 'aprobado' WHERE id = ?`, [property_id])

    return NextResponse.json({
      success: true,
      message: "Inmueble aprobado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Approve property error:", error)
    return NextResponse.json({ error: "Error al aprobar inmueble" }, { status: 500 })
  }
}
