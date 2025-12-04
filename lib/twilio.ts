// Configuración de Twilio para WhatsApp
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"

interface SendWhatsAppResult {
  success: boolean
  messageSid?: string
  error?: string
}

export async function sendWhatsAppMessage(to: string, message: string): Promise<SendWhatsAppResult> {
  console.log("[v0] Attempting to send WhatsApp message...")
  console.log("[v0] TWILIO_ACCOUNT_SID exists:", !!TWILIO_ACCOUNT_SID)
  console.log("[v0] TWILIO_AUTH_TOKEN exists:", !!TWILIO_AUTH_TOKEN)
  console.log("[v0] TWILIO_WHATSAPP_FROM:", TWILIO_WHATSAPP_FROM)
  console.log("[v0] Recipient:", to)

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.error("[v0] Twilio credentials not configured")
    return { success: false, error: "Twilio credentials not configured" }
  }

  // Formatear número para WhatsApp
  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to.startsWith("+") ? to : "+" + to}`
  console.log("[v0] Formatted recipient:", formattedTo)

  try {
    console.log("[v0] Sending request to Twilio API...")
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_WHATSAPP_FROM,
        To: formattedTo,
        Body: message,
      }),
    })

    const data = await response.json()
    console.log("[v0] Twilio response status:", response.status)
    console.log("[v0] Twilio response data:", data)

    if (response.ok) {
      console.log("[v0] WhatsApp message sent successfully! SID:", data.sid)
      return { success: true, messageSid: data.sid }
    } else {
      console.error("[v0] Twilio error:", data)
      return { success: false, error: data.message || "Failed to send message" }
    }
  } catch (error) {
    console.error("[v0] WhatsApp send error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export const sendWhatsAppAlert = sendWhatsAppMessage
