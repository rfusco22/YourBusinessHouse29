import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file provided in upload")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("[v0] File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const filename = `property-${timestamp}-${randomId}-${file.name}`

    console.error("[v0] Uploading file to Blob:", filename)
    const blob = await put(filename, file, {
      access: "public",
    })

    console.error("[v0] File uploaded successfully:", blob.url)
    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed", details: String(error) }, { status: 500 })
  }
}
