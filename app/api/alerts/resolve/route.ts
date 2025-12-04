import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { alertId, propertyId, actionType } = body

    console.log("[v0] Resolving alert:", alertId, "property:", propertyId, "action:", actionType)

    if (!alertId || !propertyId || !actionType) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Update property based on action type
    if (actionType === "sold") {
      await query(`UPDATE inmueble SET last_sale_date = NOW(), status = 'no_disponible' WHERE id = ?`, [propertyId])
    } else if (actionType === "rented") {
      await query(`UPDATE inmueble SET last_rental_date = NOW() WHERE id = ?`, [propertyId])
    } else if (actionType === "edited") {
      await query(`UPDATE inmueble SET updated_at = NOW() WHERE id = ?`, [propertyId])
    }

    // Mark alert as resolved
    await query(`UPDATE property_alerts SET status = 'resuelta', resolved_at = NOW() WHERE id = ?`, [alertId])

    console.log("[v0] Alert resolved successfully")

    return NextResponse.json({
      success: true,
      message: "Alert resolved successfully",
    })
  } catch (error) {
    console.error("[v0] Error resolving alert:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error resolving alert",
      },
      { status: 500 },
    )
  }
}
