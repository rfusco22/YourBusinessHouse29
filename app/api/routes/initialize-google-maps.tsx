// This route handler helps load the Google Maps API with the correct API key

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Google Maps API key not configured" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Return the script tag that should be injected
  return new Response(
    JSON.stringify({
      scriptTag: `<script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"></script>`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  )
}
