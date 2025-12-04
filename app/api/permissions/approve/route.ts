import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { requestId, adminId, adminNotes } = body

    if (!requestId || !adminId) {
      return NextResponse.json({ error: "Faltan parámetros requeridos", success: false }, { status: 400 })
    }

    // Get the request details
    const requests = await query(`SELECT * FROM rental_permission_requests WHERE id = ?`, [requestId])

    if (!Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json({ error: "Permiso no encontrado", success: false }, { status: 404 })
    }

    const request = requests[0] as any

    // Update permission request status
    await query(
      `UPDATE rental_permission_requests 
       SET status = 'aprobado', reviewed_by = ?, review_date = NOW(), admin_notes = ?
       WHERE id = ?`,
      [adminId, adminNotes || null, requestId],
    )

    // If it's a disponible_request, update property status to disponible
    if (request.request_type === "disponible_request") {
      await query(`UPDATE inmueble SET status = 'disponible' WHERE id = ?`, [request.inmueble_id])
    }

    // If it's property_approval, update property to active
    if (request.request_type === "property_approval") {
      await query(`UPDATE inmueble SET status = 'disponible' WHERE id = ?`, [request.inmueble_id])
    }

    return NextResponse.json({
      success: true,
      message: "Permiso aprobado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error approving permission:", error)
    return NextResponse.json({ error: "Error al aprobar permiso", success: false }, { status: 500 })
  }
}
