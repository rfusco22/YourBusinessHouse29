import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching growth data...")

    // Get monthly growth data
    let monthlyData: any[] = []
    try {
      monthlyData = (await query(
        `SELECT 
          DATE_FORMAT(created_at, '%b') as mes,
          COUNT(*) as propiedades
         FROM inmueble
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 4 MONTH)
         GROUP BY YEAR(created_at), MONTH(created_at)
         ORDER BY created_at ASC`,
      )) as any[]
    } catch (err) {
      console.error("[v0] Error fetching monthly data:", err)
      monthlyData = []
    }

    // Get property distribution
    let propertyDistribution: any[] = []
    try {
      propertyDistribution = (await query(
        `SELECT 
          CASE 
            WHEN property_type = 'casa' THEN 'casa'
            WHEN property_type = 'apartamento' THEN 'apartamento'
            WHEN property_type = 'oficina' THEN 'oficina'
            WHEN property_type = 'terreno' THEN 'terreno'
            ELSE 'otro'
          END as nombre,
          COUNT(*) as valor
         FROM inmueble
         GROUP BY property_type`,
      )) as any[]
    } catch (err) {
      console.error("[v0] Error fetching property distribution:", err)
      propertyDistribution = []
    }

    console.log("[v0] Growth data retrieved successfully")
    return NextResponse.json({
      monthlyData: monthlyData || [],
      propertyDistribution: propertyDistribution || [],
    })
  } catch (error: any) {
    console.error("Error fetching growth data:", error?.message || error)
    // Return default data to prevent UI crashes
    return NextResponse.json({
      monthlyData: [],
      propertyDistribution: [],
    })
  }
}
