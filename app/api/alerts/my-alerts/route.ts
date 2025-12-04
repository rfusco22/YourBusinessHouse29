import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const userRole = searchParams.get("userRole")

    console.log("[v0] === INICIO DEBUG ALERTAS ===")
    console.log("[v0] userId:", userId, "userRole:", userRole)

    if (!userId || !userRole) {
      return NextResponse.json({ success: false, error: "userId and userRole required" }, { status: 400 })
    }

    let alertsQuery = ""
    let queryParams: any[] = []

    if (userRole === "asesor") {
      alertsQuery = `
        SELECT 
          i.id as property_id,
          i.title as property_title,
          i.operation_type,
          i.updated_at,
          i.status,
          i.owner_id,
          DATEDIFF(CURDATE(), i.updated_at) as days_inactive,
          u.name as asesor_name,
          u.whatsapp as asesor_phone
        FROM inmueble i
        LEFT JOIN users u ON i.owner_id = u.id
        WHERE i.owner_id = ?
          AND (
            (IFNULL(i.operation_type, 'compra') IN ('alquiler', 'ambos') AND DATEDIFF(CURDATE(), i.updated_at) > 30)
            OR
            (IFNULL(i.operation_type, 'compra') = 'compra' AND DATEDIFF(CURDATE(), i.updated_at) > 60)
          )
        ORDER BY i.updated_at ASC
      `
      queryParams = [userId]
    } else if (userRole === "admin") {
      alertsQuery = `
        SELECT 
          i.id as property_id,
          i.title as property_title,
          i.operation_type,
          i.updated_at,
          i.status,
          i.owner_id,
          DATEDIFF(CURDATE(), i.updated_at) as days_inactive,
          u.name as asesor_name,
          u.whatsapp as asesor_phone,
          u.role as asesor_role
        FROM inmueble i
        LEFT JOIN users u ON i.owner_id = u.id
        WHERE u.role IN ('asesor', 'admin')
          AND (
            (IFNULL(i.operation_type, 'compra') IN ('alquiler', 'ambos') AND DATEDIFF(CURDATE(), i.updated_at) > 30)
            OR
            (IFNULL(i.operation_type, 'compra') = 'compra' AND DATEDIFF(CURDATE(), i.updated_at) > 60)
          )
        ORDER BY i.updated_at ASC
      `
      queryParams = []
    } else if (userRole === "gerencia") {
      alertsQuery = `
        SELECT 
          i.id as property_id,
          i.title as property_title,
          i.operation_type,
          i.updated_at,
          i.status,
          i.owner_id,
          DATEDIFF(CURDATE(), i.updated_at) as days_inactive,
          u.name as asesor_name,
          u.whatsapp as asesor_phone,
          u.role as asesor_role
        FROM inmueble i
        LEFT JOIN users u ON i.owner_id = u.id
        WHERE (
            (IFNULL(i.operation_type, 'compra') IN ('alquiler', 'ambos') AND DATEDIFF(CURDATE(), i.updated_at) > 30)
            OR
            (IFNULL(i.operation_type, 'compra') = 'compra' AND DATEDIFF(CURDATE(), i.updated_at) > 60)
          )
        ORDER BY i.updated_at ASC
      `
      queryParams = []
    }

    console.log("[v0] Ejecutando query con params:", queryParams)
    const properties = await query(alertsQuery, queryParams)

    console.log("[v0] Propiedades encontradas:", (properties as any[]).length)
    console.log("[v0] Primeras 3 propiedades:", JSON.stringify((properties as any[]).slice(0, 3), null, 2))

    const alerts = (properties as any[]).map((prop) => {
      const months = Math.floor(prop.days_inactive / 30)
      const operationType = prop.operation_type || "compra"
      const isRental = operationType === "alquiler" || operationType === "ambos"
      const isSale = operationType === "compra"

      console.log("[v0] Procesando propiedad:", {
        id: prop.property_id,
        title: prop.property_title,
        operation_type: operationType,
        days_inactive: prop.days_inactive,
        isRental,
        isSale,
      })

      let alertType = ""
      let title = ""
      let description = ""

      if (isRental && prop.days_inactive > 30) {
        alertType = "no_rental"
        title = "Propiedad no alquilada"
        description = `"${prop.property_title}" no ha sido alquilada en ${months} mes${months !== 1 ? "es" : ""}. Considera revisar el precio de alquiler o mejorar la publicación.`
      } else if (isSale && prop.days_inactive > 60) {
        alertType = "no_sale"
        title = "Propiedad no vendida"
        description = `"${prop.property_title}" no ha sido vendida en ${months} mes${months !== 1 ? "es" : ""}. Considera revisar el precio de venta o la estrategia de venta.`
      }

      return {
        id: `alert-${prop.property_id}`,
        propertyId: prop.property_id,
        type: alertType,
        title,
        description,
        daysInactive: prop.days_inactive,
        status: "activa",
        createdAt: prop.updated_at,
        propertyTitle: prop.property_title,
        operationType: operationType,
        agentName: prop.asesor_name,
        agentPhone: prop.asesor_phone,
        agentRole: prop.asesor_role,
      }
    })

    console.log("[v0] Alertas generadas:", alerts.length)
    console.log("[v0] === FIN DEBUG ALERTAS ===")

    return NextResponse.json({
      success: true,
      alerts,
    })
  } catch (error) {
    console.error("[v0] Error fetching alerts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching alerts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
