import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id")
    const fetchAll = req.nextUrl.searchParams.get("all")

    if (fetchAll === "true") {
      const results = (await query(
        `SELECT b.id, b.inmueble_id, i.title, b.type, b.description, b.visit_date, b.offer_amount, b.created_at, u.name as asesor_name
         FROM bitacora b 
         JOIN inmueble i ON b.inmueble_id = i.id 
         JOIN users u ON b.user_id = u.id
         ORDER BY b.created_at DESC`,
        [],
      )) as any[]

      return NextResponse.json(results || [])
    }

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    const results = (await query(
      `SELECT b.id, b.inmueble_id, i.title, b.type, b.description, b.visit_date, b.offer_amount, b.created_at 
       FROM bitacora b 
       JOIN inmueble i ON b.inmueble_id = i.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
      [userId],
    )) as any[]

    return NextResponse.json(results || [])
  } catch (error: any) {
    console.error("[v0] Error fetching bitacora:", error?.message || error)
    return NextResponse.json({ error: "Failed to fetch bitacora entries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user_id, inmueble_id, type, description, visit_date, offer_amount } = await req.json()

    if (!user_id || !inmueble_id || !type || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["visita", "contraoferta"].includes(type)) {
      return NextResponse.json({ error: "Invalid type. Must be 'visita' or 'contraoferta'" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO bitacora (user_id, inmueble_id, type, description, visit_date, offer_amount) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, inmueble_id, type, description, visit_date || null, offer_amount || null],
    )

    return NextResponse.json({
      success: true,
      message: "Bitacora entry created successfully",
      id: (result as any).insertId,
    })
  } catch (error: any) {
    console.error("[v0] Error creating bitacora entry:", error?.message || error)
    return NextResponse.json({ error: "Failed to create bitacora entry" }, { status: 500 })
  }
}
