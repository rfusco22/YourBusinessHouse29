import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching users from database...")
    const users = (await query(
      "SELECT id, email, name, role, phone, is_active, avatar_url, facebook, instagram, twitter, linkedin, tiktok, youtube, whatsapp, created_at FROM users ORDER BY created_at DESC",
    )) as any[]

    console.log("[v0] Successfully fetched users:", users.length)

    return NextResponse.json({
      status: "success",
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        isActive: u.is_active,
        image: u.avatar_url,
        lastLogin: u.created_at,
        facebook: u.facebook,
        instagram: u.instagram,
        twitter: u.twitter,
        linkedin: u.linkedin,
        tiktok: u.tiktok,
        youtube: u.youtube,
        whatsapp: u.whatsapp,
      })),
    })
  } catch (error: any) {
    console.error("[v0] Error fetching users:", error?.message || error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch users",
        detail: error?.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      name,
      email,
      phone,
      role,
      isActive,
      image,
      password,
      facebook,
      instagram,
      twitter,
      linkedin,
      tiktok,
      youtube,
      whatsapp,
    } = data

    console.log("[v0] Creating new user:", { email, name })

    // Check if user already exists
    const existingUsers = (await query("SELECT id FROM users WHERE email = ?", [email])) as any[]
    if (existingUsers.length > 0) {
      return NextResponse.json({ status: "error", message: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = password || "TempPassword123"

    const result = await query(
      "INSERT INTO users (name, email, phone, role, is_active, avatar_url, password, facebook, instagram, twitter, linkedin, tiktok, youtube, whatsapp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        phone || null,
        role || "asesor",
        isActive ? 1 : 0,
        image || null,
        hashedPassword,
        facebook || null,
        instagram || null,
        twitter || null,
        linkedin || null,
        tiktok || null,
        youtube || null,
        whatsapp || null,
      ],
    )

    console.log("[v0] User created successfully")

    return NextResponse.json({
      status: "success",
      message: "User created successfully",
      userId: (result as any).insertId,
    })
  } catch (error: any) {
    console.error("[v0] Error creating user:", error?.message || error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create user",
        detail: error?.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const {
      id,
      name,
      email,
      phone,
      role,
      isActive,
      image,
      facebook,
      instagram,
      twitter,
      linkedin,
      tiktok,
      youtube,
      whatsapp,
    } = data

    console.log("[v0] Updating user:", { id, email })

    await query(
      "UPDATE users SET name = ?, email = ?, phone = ?, role = ?, is_active = ?, avatar_url = ?, facebook = ?, instagram = ?, twitter = ?, linkedin = ?, tiktok = ?, youtube = ?, whatsapp = ? WHERE id = ?",
      [
        name,
        email,
        phone || null,
        role,
        isActive ? 1 : 0,
        image || null,
        facebook || null,
        instagram || null,
        twitter || null,
        linkedin || null,
        tiktok || null,
        youtube || null,
        whatsapp || null,
        id,
      ],
    )

    console.log("[v0] User updated successfully")
    return NextResponse.json({ status: "success", message: "User updated successfully" })
  } catch (error: any) {
    console.error("[v0] Error updating user:", error?.message || error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update user",
        detail: error?.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ status: "error", message: "User ID required" }, { status: 400 })
    }

    console.log("[v0] Deleting user:", userId)
    await query("DELETE FROM users WHERE id = ?", [userId])

    console.log("[v0] User deleted successfully")
    return NextResponse.json({ status: "success", message: "User deleted successfully" })
  } catch (error: any) {
    console.error("[v0] Error deleting user:", error?.message || error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete user",
        detail: error?.message,
      },
      { status: 500 },
    )
  }
}
