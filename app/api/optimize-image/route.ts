import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")
    const width = searchParams.get("width") || "80"
    const height = searchParams.get("height") || "80"
    const quality = searchParams.get("quality") || "85"

    if (!url) {
      return NextResponse.json({ error: "URL parameter required" }, { status: 400 })
    }

    // Append quality parameter to Vercel Blob URL for optimization
    const optimizedUrl = new URL(url)
    optimizedUrl.searchParams.set("width", width)
    optimizedUrl.searchParams.set("height", height)
    optimizedUrl.searchParams.set("quality", quality)

    const response = await fetch(optimizedUrl.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("[v0] Image optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize image" }, { status: 500 })
  }
}
