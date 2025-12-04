import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { requestId, adminId, rejectionReason } = body

    if (!requestId || !adminId || !rejectionReason) {
      return NextResponse.json({ error: "Faltan parámetros requeridos", success: false }, { status: 400 })
    }

    // Update permission request status
    await query(
      `UPDATE rental_permission_requests 
       SET status = 'rechazado', reviewed_by = ?, review_date = NOW(), rejection_reason = ?
       WHERE id = ?`,
      [adminId, rejectionReason, requestId],
    )

    return NextResponse.json({
      success: true,
      message: "Permiso rechazado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error rejecting permission:", error)
    return NextResponse.json({ error: "Error al rechazar permiso", success: false }, { status: 500 })
  }
}
