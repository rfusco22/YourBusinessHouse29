import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendWhatsAppAlert } from "@/lib/twilio"

export async function GET(request: Request) {
  try {
    console.log("[v0] Cron job: Iniciando verificación automática de alertas")

    // Verificar que es una petición autorizada (de Vercel Cron o con token)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log("[v0] Cron job: Acceso no autorizado")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const outdatedPropertiesQuery = `
      SELECT 
        i.id,
        i.title,
        i.owner_id as user_id,
        i.updated_at,
        IFNULL(i.operation_type, 'compra') as operation_type,
        DATEDIFF(CURDATE(), i.updated_at) as days_inactive,
        u.name as asesor_name,
        u.whatsapp as asesor_phone,
        u.role as user_role
      FROM inmueble i
      LEFT JOIN users u ON i.owner_id = u.id
      WHERE i.status = 'disponible'
        AND (
          (IFNULL(i.operation_type, 'compra') IN ('alquiler', 'ambos') AND DATEDIFF(CURDATE(), i.updated_at) > 30)
          OR
          (IFNULL(i.operation_type, 'compra') = 'compra' AND DATEDIFF(CURDATE(), i.updated_at) > 60)
        )
      ORDER BY i.updated_at ASC
    `

    const outdatedProperties = (await query(outdatedPropertiesQuery)) as any[]

    console.log(`[v0] Encontradas ${outdatedProperties.length} propiedades desactualizadas`)

    let notificationsSent = 0

    for (const property of outdatedProperties) {
      const months = Math.floor(property.days_inactive / 30)
      const isRental = property.operation_type === "alquiler" || property.operation_type === "ambos"
      const propertyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://yourbusinesshouse-production.up.railway.app"}/propiedades/${property.id}`

      let messageToAgent = ""
      let messageToManagers = ""

      if (isRental) {
        messageToAgent = `🔔 Alerta de Propiedad\n\n"${property.title}" lleva ${months} mes${months !== 1 ? "es" : ""} sin alquilarse.\n\nConsidera revisar el precio o la publicación.\n\nVer propiedad: ${propertyUrl}`
        messageToManagers = `🔔 Alerta del Sistema\n\nAsesor: ${property.asesor_name}\nPropiedad: "${property.title}"\n\nLleva ${months} mes${months !== 1 ? "es" : ""} sin alquilarse.\n\nVer propiedad: ${propertyUrl}`
      } else {
        messageToAgent = `🔔 Alerta de Propiedad\n\n"${property.title}" lleva ${months} mes${months !== 1 ? "es" : ""} sin venderse.\n\nConsidera revisar el precio o la estrategia de venta.\n\nVer propiedad: ${propertyUrl}`
        messageToManagers = `🔔 Alerta del Sistema\n\nAsesor: ${property.asesor_name}\nPropiedad: "${property.title}"\n\nLleva ${months} mes${months !== 1 ? "es" : ""} sin venderse.\n\nVer propiedad: ${propertyUrl}`
      }

      // Enviar al asesor
      if (property.asesor_phone) {
        const sent = await sendWhatsAppAlert(property.asesor_phone, messageToAgent)
        if (sent) notificationsSent++
      }

      // Enviar a admin y gerencia
      const managers = (await query(
        `SELECT whatsapp, role FROM users WHERE role IN ('admin', 'gerencia') AND whatsapp IS NOT NULL`,
      )) as any[]

      for (const manager of managers) {
        const sent = await sendWhatsAppAlert(manager.whatsapp, messageToManagers)
        if (sent) notificationsSent++
      }
    }

    console.log(
      `[v0] Cron job completado: ${notificationsSent} notificaciones enviadas para ${outdatedProperties.length} propiedades`,
    )

    return NextResponse.json({
      success: true,
      propertiesChecked: outdatedProperties.length,
      notificationsSent,
    })
  } catch (error) {
    console.error("[v0] Error en cron job de alertas:", error)
    return NextResponse.json(
      {
        error: "Error al procesar alertas automáticas",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
