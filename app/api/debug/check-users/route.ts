import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = (await query("SELECT id, email, name, role FROM users")) as any[]
    return NextResponse.json({ success: true, users, count: users.length })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database error",
        hint: "Make sure to run the SQL scripts in Railway first",
      },
      { status: 500 },
    )
  }
}
