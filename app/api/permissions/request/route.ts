import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { inmuebleId, asesorId, requestType, justification } = body

    if (!inmuebleId || !asesorId || !requestType || !justification) {
      return NextResponse.json({ error: "Faltan parámetros requeridos", success: false }, { status: 400 })
    }

    // Insert permission request
    await query(
      `INSERT INTO rental_permission_requests (inmueble_id, asesor_id, request_type, justification, status, created_at)
       VALUES (?, ?, ?, ?, 'pendiente', NOW())`,
      [inmuebleId, asesorId, requestType, justification],
    )

    return NextResponse.json({
      success: true,
      message: "Solicitud de permiso creada exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error creating permission request:", error)
    return NextResponse.json({ error: "Error al crear solicitud de permiso", success: false }, { status: 500 })
  }
}
