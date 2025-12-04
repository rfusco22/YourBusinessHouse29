import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching recent alerts...")
    const alerts = (await query(
      `SELECT a.*, p.title as property_title 
       FROM alerts a 
       LEFT JOIN properties p ON a.property_id = p.id 
       WHERE a.status = 'activa' 
       ORDER BY a.created_at DESC 
       LIMIT 5`,
    )) as any[]

    console.log("[v0] Alerts retrieved:", alerts.length)
    return NextResponse.json({
      alerts: alerts.map((alert) => ({
        id: alert.id,
        title: alert.alert_type || "Alert",
        description: alert.description || alert.property_title || "Sin descripción",
        type: alert.severity || "alerta",
        timestamp: alert.created_at,
      })),
    })
  } catch (error: any) {
    console.error("[v0] Error fetching alerts:", error?.message || error)
    // Return empty alerts array instead of error to prevent UI crashes
    return NextResponse.json({
      alerts: [],
    })
  }
}
