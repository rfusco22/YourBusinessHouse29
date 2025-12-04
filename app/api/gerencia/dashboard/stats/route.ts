import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Total users
    const usersResult = (await query("SELECT COUNT(*) as count FROM users")) as any[]
    const totalUsers = usersResult[0]?.count || 0

    // Total properties
    const propertiesResult = (await query("SELECT COUNT(*) as count FROM inmueble")) as any[]
    const totalProperties = propertiesResult[0]?.count || 0

    // Properties added this month
    const thisMonthResult = (await query(`
      SELECT COUNT(*) as count 
      FROM inmueble 
      WHERE MONTH(created_at) = MONTH(CURDATE()) 
      AND YEAR(created_at) = YEAR(CURDATE())
    `)) as any[]
    const propertiesThisMonth = thisMonthResult[0]?.count || 0

    // Total movements
    const movementsResult = (await query(`
      SELECT COUNT(*) as count FROM bitacora
    `)) as any[]
    const totalMovements = movementsResult[0]?.count || 0

    // Active alerts (properties inactive for more than 30 days)
    const alertsResult = (await query(`
      SELECT 
        i.id,
        i.title as name,
        i.operation_type as type,
        i.updated_at,
        DATEDIFF(CURDATE(), i.updated_at) as days_inactive,
        u.name as owner_name
      FROM inmueble i
      LEFT JOIN users u ON i.owner_id = u.id
      WHERE DATEDIFF(CURDATE(), i.updated_at) > 30
      ORDER BY i.updated_at ASC
      LIMIT 2
    `)) as any[]

    const alerts = alertsResult.map((row: any) => {
      const monthsInactive = Math.floor(row.days_inactive / 30)
      const isRental = row.type === "alquiler" || row.type === "ambos"

      let alertType = "Propiedad no vendida"
      let alertMessage = `"${row.name}" no ha sido vendida en ${monthsInactive} meses. Considera revisar el precio de venta o la estrategia de venta.`

      if (isRental) {
        alertType = "Propiedad no alquilada"
        alertMessage = `"${row.name}" no ha sido alquilada en ${monthsInactive} meses. Considera revisar el precio de alquiler o mejorar la publicación.`
      }

      return {
        id: row.id,
        title: alertType,
        message: alertMessage,
        property_name: row.name,
        days_inactive: row.days_inactive,
        updated_at: row.updated_at,
        owner_name: row.owner_name,
        type: "alerta",
      }
    })

    // Recent activity from bitacora
    const activityResult = (await query(`
      SELECT 
        b.id,
        b.type,
        b.description,
        b.visit_date,
        b.offer_amount,
        b.created_at,
        i.title as property_title,
        u.name as user_name
      FROM bitacora b
      INNER JOIN inmueble i ON b.inmueble_id = i.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 2
    `)) as any[]

    const recentActivity = activityResult.map((row: any) => ({
      id: row.id,
      type: row.type,
      description: row.description,
      created_at: row.created_at,
      visit_date: row.visit_date,
      offer_amount: row.offer_amount,
      property_name: row.property_title,
      user_name: row.user_name,
    }))

    // User activity stats (movements per user this month)
    const activityByUserResult = (await query(`
      SELECT 
        u.name as usuario,
        COUNT(b.id) as movimientos
      FROM users u
      INNER JOIN bitacora b ON u.id = b.user_id
      WHERE MONTH(b.created_at) = MONTH(CURDATE())
        AND YEAR(b.created_at) = YEAR(CURDATE())
      GROUP BY u.id, u.name
      HAVING movimientos > 0
      ORDER BY movimientos DESC
      LIMIT 15
    `)) as any[]

    // Total active users this month
    const totalActiveUsersResult = (await query(`
      SELECT COUNT(DISTINCT b.user_id) as count
      FROM bitacora b
      WHERE MONTH(b.created_at) = MONTH(CURDATE())
        AND YEAR(b.created_at) = YEAR(CURDATE())
    `)) as any[]
    const totalActiveUsers = totalActiveUsersResult[0]?.count || 0

    return NextResponse.json({
      totalUsers,
      totalProperties,
      propertiesThisMonth,
      totalMovements,
      alerts,
      recentActivity,
      activityByUser: activityByUserResult,
      totalActiveUsers,
    })
  } catch (error) {
    console.error("Error fetching gerencia dashboard stats:", error)
    return NextResponse.json({ error: "Error al cargar las estadísticas" }, { status: 500 })
  }
}
