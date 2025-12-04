import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching dashboard stats...")

    // Get total users
    let totalUsers = 0
    try {
      const usersResult = (await query("SELECT COUNT(*) as count FROM users")) as any[]
      totalUsers = usersResult[0]?.count || 0
    } catch (err) {
      console.error("[v0] Error counting users:", err)
    }

    // Get total properties
    let totalProperties = 0
    try {
      const propertiesResult = (await query(
        "SELECT COUNT(*) as count FROM properties WHERE status = 'disponible'",
      )) as any[]
      totalProperties = propertiesResult[0]?.count || 0
    } catch (err) {
      console.error("[v0] Error counting properties:", err)
    }

    // Get total transactions
    let totalTransactions = 0
    try {
      const transactionsResult = (await query("SELECT COUNT(*) as count FROM transactions")) as any[]
      totalTransactions = transactionsResult[0]?.count || 0
    } catch (err) {
      console.error("[v0] Error counting transactions:", err)
    }

    // Get total alerts
    let totalAlerts = 0
    try {
      const alertsResult = (await query("SELECT COUNT(*) as count FROM alerts WHERE status = 'activa'")) as any[]
      totalAlerts = alertsResult[0]?.count || 0
    } catch (err) {
      console.error("[v0] Error counting alerts:", err)
    }

    // Get total revenue
    let totalRevenue = 0
    try {
      const revenueResult = (await query(
        "SELECT SUM(amount) as total FROM transactions WHERE status = 'completada'",
      )) as any[]
      totalRevenue = revenueResult[0]?.total || 0
    } catch (err) {
      console.error("[v0] Error calculating revenue:", err)
    }

    console.log("[v0] Dashboard stats retrieved successfully")
    return NextResponse.json({
      totalUsers,
      totalProperties,
      totalTransactions,
      totalAlerts,
      totalRevenue,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching dashboard stats:", error?.message || error)
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        detail: error?.message,
      },
      { status: 500 },
    )
  }
}
