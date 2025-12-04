import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { property_id, admin_id, rejection_reason } = body

    if (!property_id || !admin_id || !rejection_reason) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 })
    }

    // Actualizar estado de rechazo
    await query(
      `UPDATE property_approvals 
       SET status = 'rechazado', approved_by = ?, approval_date = NOW(), rejection_reason = ?
       WHERE property_id = ?`,
      [admin_id, rejection_reason, property_id],
    )

    // Actualizar approval_status en properties
    await query(`UPDATE properties SET approval_status = 'rechazado' WHERE id = ?`, [property_id])

    return NextResponse.json({
      success: true,
      message: "Inmueble rechazado",
    })
  } catch (error) {
    console.error("[v0] Reject property error:", error)
    return NextResponse.json({ error: "Error al rechazar inmueble" }, { status: 500 })
  }
}
