import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filterType = searchParams.get("type") || "all" // "all", "disponible_request", "property_approval"

    let sql = `
      SELECT 
        rpr.id,
        rpr.inmueble_id,
        rpr.asesor_id,
        rpr.request_type,
        rpr.status,
        rpr.justification,
        rpr.created_at,
        i.title,
        i.status as property_status,
        i.location,
        u.name as asesor_name,
        u.email as asesor_email
      FROM rental_permission_requests rpr
      JOIN inmueble i ON rpr.inmueble_id = i.id
      JOIN users u ON rpr.asesor_id = u.id
      WHERE rpr.status = 'pendiente'
    `

    if (filterType !== "all") {
      sql += ` AND rpr.request_type = ?`
    }

    sql += ` ORDER BY rpr.created_at DESC`

    const params = filterType !== "all" ? [filterType] : []
    const results = await query(sql, params)

    return NextResponse.json({
      success: true,
      data: results || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching pending permissions:", error)
    return NextResponse.json({ error: "Error al cargar permisos pendientes", success: false }, { status: 500 })
  }
}
