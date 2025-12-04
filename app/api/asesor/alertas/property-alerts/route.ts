import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { sendWhatsAppMessage } from "@/lib/twilio"

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER || "+584244291541"

const sentNotifications = new Map<string, number>()

async function sendAlertNotification(alert: any) {
  const notificationKey = `${alert.propertyId}-${alert.type}`
  const lastSent = sentNotifications.get(notificationKey)
  const now = Date.now()

  console.log("[v0] Checking notification for:", notificationKey)
  console.log("[v0] Last sent timestamp:", lastSent)
  console.log("[v0] Current timestamp:", now)

  // Don't send if we sent this alert in the last 24 hours
  if (lastSent && now - lastSent < 24 * 60 * 60 * 1000) {
    console.log("[v0] Notification already sent within 24h, skipping")
    return { sent: false, reason: "already_notified" }
  }

  const message = `🚨 *ALERTA DE INMUEBLE*

📍 *${alert.propertyTitle}*
📋 Tipo: ${alert.operationType === "alquiler" ? "Alquiler" : "Venta"}
⏰ Días sin movimiento: ${alert.daysInactive} días
👤 Asesor: ${alert.agentName || "No asignado"}

${alert.description}

_Alerta generada automáticamente_`

  console.log("[v0] Sending WhatsApp to admin:", ADMIN_WHATSAPP)
  // Send to admin
  const result = await sendWhatsAppMessage(ADMIN_WHATSAPP, message)
  console.log("[v0] Admin notification result:", result)

  if (result.success) {
    sentNotifications.set(notificationKey, now)
    console.log("[v0] Notification marked as sent")

    // Also notify the agent if they have WhatsApp
    if (alert.agentPhone) {
      console.log("[v0] Sending WhatsApp to agent:", alert.agentPhone)
      const agentResult = await sendWhatsAppMessage(alert.agentPhone, message)
      console.log("[v0] Agent notification result:", agentResult)
    }
  }

  return result
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get("agentId")
    const autoNotify = searchParams.get("autoNotify") !== "false"

    console.log("[v0] Fetching property inactivity alerts...")
    console.log("[v0] Agent ID:", agentId)
    console.log("[v0] Auto notify:", autoNotify)

    let whereClause = "WHERE i.status = 'disponible'"
    if (agentId) {
      whereClause += ` AND i.owner_id = ${agentId}`
    }

    const alertsQuery = `
      SELECT 
        i.id,
        i.title,
        i.status,
        i.operation_type,
        i.created_at,
        i.updated_at,
        i.last_sale_date,
        i.last_rental_date,
        i.owner_id,
        u.name as agent_name,
        u.phone as agent_phone,
        u.whatsapp as agent_whatsapp,
        CASE 
          WHEN i.operation_type = 'compra' AND i.last_sale_date IS NOT NULL 
            THEN DATEDIFF(NOW(), i.last_sale_date)
          WHEN i.operation_type = 'compra' AND i.last_sale_date IS NULL 
            THEN DATEDIFF(NOW(), i.created_at)
          WHEN i.operation_type = 'alquiler' AND i.last_rental_date IS NOT NULL 
            THEN DATEDIFF(NOW(), i.last_rental_date)
          WHEN i.operation_type = 'alquiler' AND i.last_rental_date IS NULL 
            THEN DATEDIFF(NOW(), i.created_at)
          ELSE DATEDIFF(NOW(), i.created_at)
        END as days_inactive
      FROM inmueble i
      LEFT JOIN users u ON i.owner_id = u.id
      ${whereClause}
      ORDER BY days_inactive DESC
    `

    const alerts = await query(alertsQuery)
    console.log("[v0] Total properties checked:", (alerts as any[]).length)

    // Filter and format alerts based on operation type thresholds
    const formattedAlerts = (alerts as any[])
      .filter((alert: any) => {
        if (alert.operation_type === "compra" && alert.days_inactive >= 60) {
          return true
        }
        if (alert.operation_type === "alquiler" && alert.days_inactive >= 30) {
          return true
        }
        if (alert.operation_type === "ambos") {
          return alert.days_inactive >= 30
        }
        return false
      })
      .map((alert: any) => {
        let title = "Alerta de Inactividad"
        let description = ""
        let alertType = ""

        if (alert.operation_type === "compra" && alert.days_inactive >= 60) {
          title = "Propiedad no vendida - 2 meses"
          description = `"${alert.title}" no ha sido vendida en ${alert.days_inactive} días. Considera revisar el precio o la estrategia de venta.`
          alertType = "no_vendido_2m"
        } else if (alert.operation_type === "alquiler" && alert.days_inactive >= 30) {
          title = "Propiedad no alquilada - 1 mes"
          description = `"${alert.title}" no ha sido alquilada en ${alert.days_inactive} días. Considera revisar el precio de alquiler o mejorar la publicación.`
          alertType = "no_alquilado_1m"
        } else if (alert.operation_type === "ambos") {
          if (alert.days_inactive >= 60) {
            title = "Propiedad no vendida - 2 meses"
            description = `"${alert.title}" no ha sido vendida en ${alert.days_inactive} días.`
            alertType = "no_vendido_2m"
          } else if (alert.days_inactive >= 30) {
            title = "Propiedad no alquilada - 1 mes"
            description = `"${alert.title}" no ha sido alquilada en ${alert.days_inactive} días.`
            alertType = "no_alquilado_1m"
          }
        }

        return {
          id: alert.id,
          title,
          description,
          type: alertType,
          status: "activa",
          createdAt: new Date(alert.created_at).toISOString().split("T")[0],
          propertyTitle: alert.title,
          daysInactive: alert.days_inactive,
          agentId: alert.owner_id,
          agentName: alert.agent_name,
          agentPhone: alert.agent_whatsapp || alert.agent_phone,
          propertyId: alert.id,
          operationType: alert.operation_type,
        }
      })

    const notificationResults: any[] = []
    if (autoNotify && formattedAlerts.length > 0) {
      console.log("[v0] Auto-notifying", formattedAlerts.length, "alerts...")
      for (const alert of formattedAlerts) {
        const result = await sendAlertNotification(alert)
        notificationResults.push({
          propertyId: alert.propertyId,
          type: alert.type,
          ...result,
        })
      }
    }

    console.log("[v0] Property alerts generated:", formattedAlerts.length)
    console.log("[v0] WhatsApp notifications sent:", notificationResults.filter((r) => r.success).length)

    return NextResponse.json({
      success: true,
      alerts: formattedAlerts,
      notifications: notificationResults,
    })
  } catch (error) {
    console.error("[v0] Error fetching property alerts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener alertas",
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { propertyId, actionType } = body

    console.log("[v0] POST request - Property ID:", propertyId, "Action:", actionType)

    if (!propertyId || !actionType) {
      return NextResponse.json({ success: false, error: "propertyId and actionType are required" }, { status: 400 })
    }

    let updateQuery = ""
    if (actionType === "sold") {
      updateQuery = `UPDATE inmueble SET last_sale_date = NOW(), status = 'no_disponible' WHERE id = ?`
    } else if (actionType === "rented") {
      updateQuery = `UPDATE inmueble SET last_rental_date = NOW() WHERE id = ?`
    } else if (actionType === "edited") {
      updateQuery = `UPDATE inmueble SET updated_at = NOW() WHERE id = ?`
    }

    if (updateQuery) {
      await query(updateQuery, [propertyId])
      console.log("[v0] Alert resolved for property:", propertyId, "Action:", actionType)
    }

    return NextResponse.json({
      success: true,
      message: "Alert resolved successfully",
    })
  } catch (error) {
    console.error("[v0] Error resolving alert:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al resolver la alerta",
      },
      { status: 500 },
    )
  }
}
