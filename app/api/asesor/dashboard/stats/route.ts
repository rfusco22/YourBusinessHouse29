import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    console.log("[v0] Fetching dashboard stats for user:", userId)

    const activePropertiesResult = (await query(`SELECT COUNT(*) as count FROM inmueble WHERE owner_id = ?`, [
      userId,
    ])) as any[]
    const activeProperties = activePropertiesResult[0]?.count || 0
    console.log("[v0] Active properties:", activeProperties)

    const thisMonthResult = (await query(
      `SELECT COUNT(*) as count FROM inmueble 
       WHERE owner_id = ? 
       AND MONTH(created_at) = MONTH(CURDATE()) 
       AND YEAR(created_at) = YEAR(CURDATE())`,
      [userId],
    )) as any[]
    const addedThisMonth = thisMonthResult[0]?.count || 0
    console.log("[v0] Added this month:", addedThisMonth)

    const locationsResult = (await query(
      `SELECT COUNT(DISTINCT location) as count 
       FROM inmueble 
       WHERE owner_id = ? 
       AND location IS NOT NULL 
       AND location != ''
       AND latitude IS NOT NULL
       AND longitude IS NOT NULL`,
      [userId],
    )) as any[]
    const uniqueLocations = locationsResult[0]?.count || 0
    console.log("[v0] Unique locations:", uniqueLocations)

    // Alquileres: más de 30 días sin update, Ventas: más de 60 días sin update
    const alertsResult = (await query(
      `SELECT 
        i.id,
        i.title,
        IFNULL(i.operation_type, 'compra') as operation_type,
        i.updated_at,
        DATEDIFF(CURDATE(), i.updated_at) as days_inactive
      FROM inmueble i
      WHERE i.owner_id = ?
      HAVING (
        (operation_type = 'alquiler' AND days_inactive > 30) OR
        (operation_type = 'compra' AND days_inactive > 60) OR
        (operation_type = 'ambos' AND days_inactive > 30)
      )
      ORDER BY i.updated_at ASC
      LIMIT 2`,
      [userId],
    )) as any[]

    const activeAlerts = alertsResult.length
    console.log("[v0] Active alerts found:", activeAlerts, alertsResult)

    const recentAlerts = alertsResult.map((prop: any) => {
      const monthsInactive = Math.floor(prop.days_inactive / 30)
      const isRental = prop.operation_type === "alquiler" || prop.operation_type === "ambos"

      return {
        id: prop.id,
        alert_type: isRental ? "no_alquilado" : "no_vendido",
        title: isRental
          ? `Propiedad no alquilada - ${monthsInactive} mes${monthsInactive !== 1 ? "es" : ""}`
          : `Propiedad no vendida - ${monthsInactive} mes${monthsInactive !== 1 ? "es" : ""}`,
        message: `"${prop.title}" no ha sido ${isRental ? "alquilada" : "vendida"} en ${monthsInactive} mes${monthsInactive !== 1 ? "es" : ""}. Considera revisar el precio ${isRental ? "de alquiler" : "de venta"} o la estrategia ${isRental ? "de alquiler" : "venta"}.`,
        created_at: prop.updated_at,
        property_title: prop.title,
        days_inactive: prop.days_inactive,
      }
    })

    let recentActivity: any[] = []
    try {
      recentActivity = (await query(
        `SELECT 
          b.id,
          b.type as event_type,
          b.description as details,
          b.created_at,
          i.title as property_title
         FROM bitacora b
         INNER JOIN inmueble i ON b.inmueble_id = i.id
         WHERE i.owner_id = ?
         ORDER BY b.created_at DESC
         LIMIT 2`,
        [userId],
      )) as any[]
      console.log("[v0] Recent activity from bitacora:", recentActivity.length, recentActivity)
    } catch (bitacoraError: any) {
      console.warn("[v0] Could not fetch bitacora:", bitacoraError?.message)
    }

    const monthlyStats = (await query(
      `SELECT 
        DATE_FORMAT(created_at, '%b') as mes,
        COUNT(*) as propiedades,
        COUNT(DISTINCT location) as ubicaciones
       FROM inmueble
       WHERE owner_id = ?
       AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b')
       ORDER BY YEAR(created_at), MONTH(created_at)`,
      [userId],
    )) as any[]
    console.log("[v0] Monthly stats:", monthlyStats.length)

    return NextResponse.json({
      stats: {
        activeProperties,
        addedThisMonth,
        uniqueLocations,
        activeAlerts,
      },
      recentAlerts,
      recentActivity,
      monthlyStats,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching dashboard stats:", error?.message || error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard stats",
        details: error?.message,
      },
      { status: 500 },
    )
  }
}
