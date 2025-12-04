import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { sendWhatsAppMessage } from "@/lib/twilio"

export async function POST(req: Request) {
  try {
    console.log("[v0] Starting automatic alert generation and notification...")

    try {
      await query("SELECT 1 FROM property_alerts LIMIT 1")
    } catch (tableError) {
      console.error("[v0] property_alerts table does not exist. Please run script 12_create_alerts_system.sql")
      return NextResponse.json(
        {
          success: false,
          error: "Alerts system not initialized. Please run database migration script 12_create_alerts_system.sql",
        },
        { status: 500 },
      )
    }

    // 1. Find properties that need alerts
    const propertiesQuery = `
      SELECT 
        i.id as property_id,
        i.title,
        i.operation_type,
        i.created_at,
        i.last_sale_date,
        i.last_rental_date,
        i.owner_id as asesor_id,
        u.name as asesor_name,
        u.whatsapp as asesor_whatsapp,
        u.phone as asesor_phone,
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
      WHERE i.status = 'disponible'
      ORDER BY days_inactive DESC
    `

    const properties = (await query(propertiesQuery)) as any[]
    console.log("[v0] Total properties checked:", properties.length)

    // 2. Filter properties that meet alert criteria
    const alertsToCreate = properties.filter((prop) => {
      if (prop.operation_type === "compra" && prop.days_inactive >= 60) return true
      if (prop.operation_type === "alquiler" && prop.days_inactive >= 30) return true
      if (prop.operation_type === "ambos" && prop.days_inactive >= 30) return true
      return false
    })

    console.log("[v0] Properties requiring alerts:", alertsToCreate.length)

    const results = []

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourbusinesshouse-production.up.railway.app"

    // 3. For each property, create or update alert
    for (const prop of alertsToCreate) {
      let alertType: "no_vendido_2m" | "no_alquilado_1m" = "no_vendido_2m"
      let title = ""
      let description = ""
      const monthsInactive = Math.floor(prop.days_inactive / 30)

      if (prop.operation_type === "alquiler" && prop.days_inactive >= 30) {
        alertType = "no_alquilado_1m"
        title = `Propiedad no alquilada - ${monthsInactive} ${monthsInactive === 1 ? "mes" : "meses"}`
        description = `"${prop.title}" no ha sido alquilada en ${prop.days_inactive} días. Considera revisar el precio de alquiler o mejorar la publicación.`
      } else if (prop.operation_type === "compra" && prop.days_inactive >= 60) {
        alertType = "no_vendido_2m"
        title = `Propiedad no vendida - ${monthsInactive} ${monthsInactive === 1 ? "mes" : "meses"}`
        description = `"${prop.title}" no ha sido vendida en ${prop.days_inactive} días. Considera revisar el precio o la estrategia de venta.`
      } else if (prop.operation_type === "ambos") {
        if (prop.days_inactive >= 60) {
          alertType = "no_vendido_2m"
          title = `Propiedad no vendida - ${monthsInactive} ${monthsInactive === 1 ? "mes" : "meses"}`
          description = `"${prop.title}" no ha sido vendida en ${prop.days_inactive} días.`
        } else if (prop.days_inactive >= 30) {
          alertType = "no_alquilado_1m"
          title = `Propiedad no alquilada - ${monthsInactive} ${monthsInactive === 1 ? "mes" : "meses"}`
          description = `"${prop.title}" no ha sido alquilada en ${prop.days_inactive} días.`
        }
      }

      // Check if alert already exists and is active
      const existingAlert = await query(
        `SELECT id, notified_at FROM property_alerts 
         WHERE property_id = ? AND alert_type = ? AND status = 'activa'`,
        [prop.property_id, alertType],
      )

      let alertId: number

      if ((existingAlert as any[]).length > 0) {
        alertId = (existingAlert as any[])[0].id
        const alreadyNotified = (existingAlert as any[])[0].notified_at

        await query(
          `UPDATE property_alerts 
           SET days_inactive = ?, description = ?, title = ?
           WHERE id = ?`,
          [prop.days_inactive, description, title, alertId],
        )

        console.log("[v0] Updated existing alert:", alertId)

        if (alreadyNotified) {
          console.log("[v0] Alert already notified, skipping WhatsApp")
          results.push({ alertId, action: "updated", notified: false, reason: "already_notified" })
          continue
        }
      } else {
        const insertResult = await query(
          `INSERT INTO property_alerts (property_id, asesor_id, alert_type, title, description, days_inactive, status)
           VALUES (?, ?, ?, ?, ?, ?, 'activa')`,
          [prop.property_id, prop.asesor_id, alertType, title, description, prop.days_inactive],
        )

        alertId = (insertResult as any).insertId
        console.log("[v0] Created new alert:", alertId)
      }

      // 4. Get all users to notify (asesor, admins, gerencia)
      const usersToNotify = await query(
        `SELECT id, name, role, whatsapp, phone 
         FROM users 
         WHERE (id = ? OR role = 'admin' OR role = 'gerencia') AND is_active = TRUE`,
        [prop.asesor_id],
      )

      console.log("[v0] Users to notify:", (usersToNotify as any[]).length)

      // 5. Send WhatsApp notifications
      const notificationResults = []

      for (const user of usersToNotify as any[]) {
        const phoneNumber = user.whatsapp || user.phone

        if (!phoneNumber) {
          console.log(`[v0] User ${user.name} (${user.role}) has no phone number, skipping`)
          continue
        }

        const propertyUrl = `${baseUrl}/propiedades/${prop.property_id}`

        const alertMessage =
          alertType === "no_alquilado_1m"
            ? `Este inmueble tiene ${monthsInactive} ${monthsInactive === 1 ? "mes" : "meses"} sin alquilarse`
            : `Este inmueble tiene ${monthsInactive} ${monthsInactive === 1 ? "mes" : "meses"} sin venderse`

        const message = `🚨 *ALERTA DE INMUEBLE - Your Business House*

📍 *${prop.title}*

${alertMessage}

🔗 Ver inmueble: ${propertyUrl}

📋 Tipo: ${prop.operation_type === "alquiler" ? "Alquiler" : prop.operation_type === "compra" ? "Venta" : "Ambos"}
⏰ Días inactivo: ${prop.days_inactive} días (${monthsInactive} ${monthsInactive === 1 ? "mes" : "meses"})
👤 Asesor: ${prop.asesor_name}

💡 ${description}

_Alerta generada automáticamente_`

        const whatsappResult = await sendWhatsAppMessage(phoneNumber, message)

        await query(
          `INSERT INTO notification_log (alert_id, recipient_id, recipient_role, phone_number, message, status, error_message, sent_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            alertId,
            user.id,
            user.role,
            phoneNumber,
            message,
            whatsappResult.success ? "sent" : "failed",
            whatsappResult.error || null,
            whatsappResult.success ? new Date() : null,
          ],
        )

        notificationResults.push({
          userId: user.id,
          userName: user.name,
          role: user.role,
          phone: phoneNumber,
          success: whatsappResult.success,
          error: whatsappResult.error,
        })

        console.log(
          `[v0] WhatsApp to ${user.name} (${user.role}):`,
          whatsappResult.success ? "✓ sent" : `✗ failed - ${whatsappResult.error}`,
        )
      }

      await query(`UPDATE property_alerts SET notified_at = NOW() WHERE id = ?`, [alertId])

      results.push({
        alertId,
        propertyId: prop.property_id,
        propertyTitle: prop.title,
        action: (existingAlert as any[]).length > 0 ? "updated" : "created",
        notified: true,
        notifications: notificationResults,
      })
    }

    console.log("[v0] Alert generation and notification complete")
    console.log("[v0] Total alerts processed:", results.length)

    return NextResponse.json({
      success: true,
      message: "Alerts generated and notifications sent",
      alertsProcessed: results.length,
      results,
    })
  } catch (error) {
    console.error("[v0] Error in alert generation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error generating alerts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return POST(new Request("http://localhost/api/alerts/generate-and-notify", { method: "POST" }))
}
