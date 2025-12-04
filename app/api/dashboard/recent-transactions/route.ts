import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const transactions = (await query(
      `SELECT t.*, p.title as property_title, u.name as buyer_name
       FROM transactions t
       LEFT JOIN properties p ON t.property_id = p.id
       LEFT JOIN users u ON t.buyer_id = u.id
       ORDER BY t.created_at DESC
       LIMIT 5`,
    )) as any[]

    return NextResponse.json({
      transactions: transactions.map((txn) => ({
        id: txn.id,
        property: txn.property_title || "Property",
        amount: `$${(txn.amount || 0).toLocaleString()}`,
        status: txn.transaction_type || "Oferta",
        date: new Date(txn.created_at).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      })),
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
