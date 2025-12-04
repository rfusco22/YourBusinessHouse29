import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filterType = searchParams.get("type") || "all"

    let sql = `
      SELECT 
        rpr.id,
        rpr.inmueble_id,
        rpr.asesor_id,
        rpr.request_type,
        rpr.status,
        rpr.justification,
        rpr.created_at,
        rpr.reviewed_by,
        rpr.review_date,
        rpr.admin_notes,
        rpr.rejection_reason,
        i.title,
        i.status as property_status,
        i.location,
        u.name as asesor_name,
        u.email as asesor_email,
        reviewer.name as reviewer_name,
        reviewer.email as reviewer_email
      FROM rental_permission_requests rpr
      JOIN inmueble i ON rpr.inmueble_id = i.id
      JOIN users u ON rpr.asesor_id = u.id
      LEFT JOIN users reviewer ON rpr.reviewed_by = reviewer.id
      WHERE rpr.status IN ('aprobado', 'rechazado')
    `

    if (filterType !== "all") {
      sql += ` AND rpr.request_type = ?`
    }

    sql += ` ORDER BY rpr.review_date DESC`

    const params = filterType !== "all" ? [filterType] : []
    const results = await query(sql, params)

    return NextResponse.json({
      success: true,
      data: results || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching permission history:", error)
    return NextResponse.json({ error: "Error al cargar historial de permisos", success: false }, { status: 500 })
  }
}
