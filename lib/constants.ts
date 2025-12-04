export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NODE_ENV === "production"
      ? "https://yourbusinesshouse-production.up.railway.app"
      : "http://localhost:3000"

console.log("[v0] APP_URL configured as:", APP_URL)
