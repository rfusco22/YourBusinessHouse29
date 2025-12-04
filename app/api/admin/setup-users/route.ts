import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('asesor', 'admin', 'gerencia') NOT NULL DEFAULT 'asesor',
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    await query(`DELETE FROM users WHERE email IN (?, ?, ?)`, [
      "asesor@test.com",
      "admin@test.com",
      "gerencia@test.com",
    ])

    const hashedPassword = "$2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i" // demo123

    const users = [
      {
        email: "asesor@test.com",
        password: hashedPassword,
        name: "Carlos Asesor",
        role: "asesor",
        phone: "+58-212-555-0101",
      },
      {
        email: "admin@test.com",
        password: hashedPassword,
        name: "María Admin",
        role: "admin",
        phone: "+58-212-555-0102",
      },
      {
        email: "gerencia@test.com",
        password: hashedPassword,
        name: "Juan Gerencia",
        role: "gerencia",
        phone: "+58-212-555-0103",
      },
    ]

    for (const user of users) {
      await query(`INSERT INTO users (email, password, name, role, phone, is_active) VALUES (?, ?, ?, ?, ?, TRUE)`, [
        user.email,
        user.password,
        user.name,
        user.role,
        user.phone,
      ])
    }

    const allUsers = (await query("SELECT id, email, name, role FROM users")) as any[]

    return NextResponse.json({
      message: "Users setup completed successfully",
      users: allUsers,
    })
  } catch (error) {
    console.error("[v0] Setup error:", error)
    return NextResponse.json(
      { message: "Error during setup", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const users = (await query("SELECT id, email, name, role FROM users LIMIT 5")) as any[]

    return NextResponse.json({
      status: "connected",
      userCount: users.length,
      users: users,
    })
  } catch (error) {
    console.error("[v0] Connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    )
  }
}
