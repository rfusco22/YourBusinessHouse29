import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    const results = (await query(`SELECT id, title FROM inmueble WHERE owner_id = ? ORDER BY title ASC`, [
      userId,
    ])) as any[]

    return NextResponse.json(results || [])
  } catch (error: any) {
    console.error("[v0] Error fetching inmuebles:", error?.message || error)
    return NextResponse.json({ error: "Failed to fetch inmuebles" }, { status: 500 })
  }
}
