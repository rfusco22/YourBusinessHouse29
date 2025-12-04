import { NextResponse } from "next/server"
import { query } from "@/lib/db" // Usamos tu conexión MySQL existente
import { sendWhatsAppMessage } from "@/lib/twilio"

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER || "+584244291541"

export async function GET(request: Request) {
  // Verificar clave secreta para proteger el endpoint (Cron Job)
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // --- 1. BUSCAR ALERTAS DE ALQUILER (MySQL) ---
    // Nota: Usamos '?' para los parámetros seguros
    const rentAlerts = (await query(
      `SELECT 
        i.id,
        i.title,
        i.location,
        i.price,
        i.created_at,
        i.last_rental_date,
        u.name as agent_name,
        u.whatsapp as agent_whatsapp
      FROM inmueble i
      LEFT JOIN users u ON i.owner_id = u.id
      WHERE i.operation_type IN ('alquiler', 'ambos')
        AND i.status = 'disponible'
        AND (i.last_rental_date IS NULL OR i.last_rental_date < ?)
        AND i.created_at < ?
        AND NOT EXISTS (
          SELECT 1 FROM alert_notifications an 
          WHERE an.property_id = i.id 
          AND an.alert_type = 'alquiler_sin_movimiento'
          AND an.notified_at > ?
        )`,
      [oneMonthAgo, oneMonthAgo, oneMonthAgo],
    )) as any[]

    // --- 2. BUSCAR ALERTAS DE VENTA (MySQL) ---
    const saleAlerts = (await query(
      `SELECT 
        i.id,
        i.title,
        i.location,
        i.price,
        i.created_at,
        i.last_sale_date,
        u.name as agent_name,
        u.whatsapp as agent_whatsapp
      FROM inmueble i
      LEFT JOIN users u ON i.owner_id = u.id
      WHERE i.operation_type IN ('compra', 'ambos')
        AND i.status = 'disponible'
        AND (i.last_sale_date IS NULL OR i.last_sale_date < ?)
        AND i.created_at < ?
        AND NOT EXISTS (
          SELECT 1 FROM alert_notifications an 
          WHERE an.property_id = i.id 
          AND an.alert_type = 'venta_sin_movimiento'
          AND an.notified_at > ?
        )`,
      [twoMonthsAgo, twoMonthsAgo, twoMonthsAgo],
    )) as any[]

    const notifications: Array<{
      propertyId: number
      type: string
      sent: boolean
      messageSid?: string
      error?: string
    }> = []

    // --- 3. PROCESAR ALERTAS DE ALQUILER ---
    for (const property of rentAlerts) {
      const daysSinceCreated = Math.floor(
        (now.getTime() - new Date(property.created_at).getTime()) / (1000 * 60 * 60 * 24),
      )

      const message = `🚨 *ALERTA DE INMUEBLE*

📍 *${property.title}*
📌 Ubicación: ${property.location || "No especificada"}
💰 Precio: $${Number(property.price).toLocaleString()}
📋 Tipo: Alquiler
⏰ Días sin alquilar: ${daysSinceCreated} días
👤 Asesor: ${property.agent_name || "No asignado"}

Este inmueble lleva más de 30 días sin alquilarse. Se requiere atención.`

      // Enviar WhatsApp al Admin
      const adminResult = await sendWhatsAppMessage(ADMIN_WHATSAPP, message)

      // Registrar notificación en la base de datos (MySQL Upsert)
      await query(
        `INSERT INTO alert_notifications (property_id, alert_type, whatsapp_sent, message_sid, notified_at)
         VALUES (?, 'alquiler_sin_movimiento', ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
            notified_at = NOW(),
            whatsapp_sent = VALUES(whatsapp_sent),
            message_sid = VALUES(message_sid)`,
        [property.id, adminResult.success, adminResult.messageSid || null],
      )

      notifications.push({
        propertyId: property.id,
        type: "alquiler_sin_movimiento",
        sent: adminResult.success,
        messageSid: adminResult.messageSid,
        error: adminResult.error,
      })

      // Notificar al asesor si aplica
      if (property.agent_whatsapp) {
        await sendWhatsAppMessage(property.agent_whatsapp, message)
      }
    }

    // --- 4. PROCESAR ALERTAS DE VENTA ---
    for (const property of saleAlerts) {
      const daysSinceCreated = Math.floor(
        (now.getTime() - new Date(property.created_at).getTime()) / (1000 * 60 * 60 * 24),
      )

      const message = `🚨 *ALERTA DE INMUEBLE*

📍 *${property.title}*
📌 Ubicación: ${property.location || "No especificada"}
💰 Precio: $${Number(property.price).toLocaleString()}
📋 Tipo: Venta
⏰ Días sin vender: ${daysSinceCreated} días
👤 Asesor: ${property.agent_name || "No asignado"}

Este inmueble lleva más de 60 días sin venderse. Se requiere atención.`

      // Enviar WhatsApp al Admin
      const adminResult = await sendWhatsAppMessage(ADMIN_WHATSAPP, message)

      // Registrar notificación en la base de datos (MySQL Upsert)
      await query(
        `INSERT INTO alert_notifications (property_id, alert_type, whatsapp_sent, message_sid, notified_at)
         VALUES (?, 'venta_sin_movimiento', ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
            notified_at = NOW(),
            whatsapp_sent = VALUES(whatsapp_sent),
            message_sid = VALUES(message_sid)`,
        [property.id, adminResult.success, adminResult.messageSid || null],
      )

      notifications.push({
        propertyId: property.id,
        type: "venta_sin_movimiento",
        sent: adminResult.success,
        messageSid: adminResult.messageSid,
        error: adminResult.error,
      })

      // Notificar al asesor si aplica
      if (property.agent_whatsapp) {
        await sendWhatsAppMessage(property.agent_whatsapp, message)
      }
    }

    return NextResponse.json({
      success: true,
      totalAlerts: rentAlerts.length + saleAlerts.length,
      rentAlerts: rentAlerts.length,
      saleAlerts: saleAlerts.length,
      notifications,
    })
  } catch (error) {
    console.error("[v0] Error checking alerts:", error)
    return NextResponse.json(
      { error: "Error checking alerts", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
