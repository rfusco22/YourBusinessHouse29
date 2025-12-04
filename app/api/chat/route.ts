import { streamText, tool, convertToModelMessages, type UIMessage } from "ai"
import { z } from "zod"
import { query } from "@/lib/db"

export const maxDuration = 60

const searchPropertiesTool = tool({
  description:
    "Busca propiedades inmobiliarias en toda Venezuela basándose en los criterios del usuario. Usa esta herramienta cuando tengas suficiente información sobre qué busca el cliente (operación, ubicación o presupuesto).",
  inputSchema: z.object({
    operationType: z.enum(["compra", "alquiler"]).optional().describe("Tipo de operación: compra o alquiler"),
    location: z
      .string()
      .optional()
      .describe(
        "Ubicación deseada en cualquier parte de Venezuela (Valencia, Caracas, Maracaibo, Barquisimeto, ciudad, estado, zona, etc.)",
      ),
    maxPrice: z.number().optional().describe("Precio máximo en USD"),
    minPrice: z.number().optional().describe("Precio mínimo en USD"),
    propertyType: z
      .string()
      .optional()
      .describe("Tipo de propiedad: apartamento, casa, local comercial, oficina, terreno, quinta"),
    bedrooms: z.number().optional().describe("Número mínimo de habitaciones"),
    bathrooms: z.number().optional().describe("Número mínimo de baños"),
  }),
  execute: async ({ operationType, location, maxPrice, minPrice, propertyType, bedrooms, bathrooms }) => {
    console.log("[v0] Executing searchProperties tool with:", {
      operationType,
      location,
      maxPrice,
      minPrice,
      propertyType,
      bedrooms,
      bathrooms,
    })

    try {
      let sqlQuery = `
        SELECT i.*, u.name as owner_name, u.phone as owner_phone
        FROM inmueble i 
        LEFT JOIN users u ON i.owner_id = u.id 
        WHERE i.status = 'disponible'
      `
      const params: any[] = []

      if (operationType) {
        sqlQuery += ` AND i.operation_type = ?`
        params.push(operationType)
      }

      if (location) {
        sqlQuery += ` AND i.location LIKE ?`
        params.push(`%${location}%`)
      }

      if (maxPrice) {
        sqlQuery += ` AND i.price <= ?`
        params.push(maxPrice)
      }

      if (minPrice) {
        sqlQuery += ` AND i.price >= ?`
        params.push(minPrice)
      }

      if (propertyType) {
        sqlQuery += ` AND i.type = ?`
        params.push(propertyType)
      }

      if (bedrooms) {
        sqlQuery += ` AND i.bedrooms >= ?`
        params.push(bedrooms)
      }

      if (bathrooms) {
        sqlQuery += ` AND i.bathrooms >= ?`
        params.push(bathrooms)
      }

      sqlQuery += ` ORDER BY i.created_at DESC LIMIT 5`

      const properties = (await query(sqlQuery, params)) as any[]
      console.log("[v0] Found properties:", properties.length)

      const propertiesWithImages = await Promise.all(
        properties.map(async (p: any) => {
          const images = (await query(
            `SELECT image_url FROM inmueble_images WHERE inmueble_id = ? ORDER BY display_order ASC LIMIT 1`,
            [p.id],
          )) as any[]

          return {
            id: p.id,
            title: p.title,
            location: p.location,
            price: p.price,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            area: p.area,
            type: p.type,
            operation_type: p.operation_type,
            image_url: images.length > 0 ? images[0].image_url : p.image_url,
          }
        }),
      )

      return {
        properties: propertiesWithImages,
        count: propertiesWithImages.length,
      }
    } catch (error) {
      console.error("[v0] Database error:", error)
      return {
        properties: [],
        count: 0,
        error: "No se pudo conectar a la base de datos",
      }
    }
  },
})

const tools = {
  searchProperties: searchPropertiesTool,
}

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API called")

    const { messages }: { messages: UIMessage[] } = await req.json()
    console.log("[v0] Received messages:", messages.length)

    const result = streamText({
      model: "openai/gpt-4o-mini",
      messages: convertToModelMessages(messages),
      system: `Eres Hogarcito, un agente inmobiliario virtual profesional y amigable de Your Business House en Venezuela. Hablas como un venezolano cercano y empático.

TU OBJETIVO PRINCIPAL:
Automatizar el proceso de venta/alquiler conversando naturalmente como un humano, guiando al cliente hasta encontrar su propiedad ideal y agendar una cita.

FLUJO DE CONVERSACIÓN (UNA pregunta a la vez, como humano):

1. PRIMER CONTACTO:
   - Si dicen "hola" o saludan → Responde cordialmente y pregunta si buscan comprar o alquilar
   - Si ya mencionan que buscan inmueble → Ve directo a preguntar tipo de operación

2. OPERACIÓN (compra/alquiler):
   - Pregunta: "¿Estás buscando comprar o alquilar?"
   - Una vez sepas, guarda esta info y continúa

3. UBICACIÓN:
   - Pregunta: "¿En qué parte de Venezuela te gustaría tu próximo hogar?"
   - Acepta cualquier ciudad/estado de Venezuela
   - Ejemplos: Caracas, Valencia, Maracaibo, Barquisimeto, etc.

4. PRESUPUESTO:
   - Si es ALQUILER → "¿Cuál es tu tope de canon mensual?" (en USD)
   - Si es COMPRA → "¿Cuál es tu tope de inversión?" (en USD)
   - Si dicen solo "280" → Asume USD y confirma

5. TIPO DE INMUEBLE:
   - Pregunta: "¿Qué tipo de inmueble prefieres? (apartamento, casa, local comercial, oficina, terreno, quinta)"

6. DETALLES (solo para residencial):
   - Si es apartamento/casa → Pregunta habitaciones y baños
   - Ejemplo: "¿Cuántas habitaciones necesitas?"

7. BÚSQUEDA AUTOMÁTICA:
   - EJECUTA searchProperties cuando tengas: operación + (ubicación O presupuesto)
   - Si el usuario CAMBIA de alquiler a compra → NUEVA búsqueda inmediatamente
   - Si cambia ubicación o presupuesto → NUEVA búsqueda

8. DESPUÉS DE MOSTRAR RESULTADOS:
   - Di: "¿Te gustaría que agende una cita con un asesor para visitar alguna?"
   - Ofrece contactar por WhatsApp

RESPONDER OTRAS PREGUNTAS:
- Información de la empresa → CC El Añil, Valencia, Venezuela
- Redes sociales → Instagram: @yourbusinesshouse
- WhatsApp → +58 (424) 429-1541
- Cobertura → Toda Venezuela
- Si preguntan sobre servicios → Compra, venta, alquiler en toda Venezuela

REGLAS IMPORTANTES:
- Habla breve y directo (máximo 2-3 oraciones)
- UNA pregunta a la vez
- NO uses muchos emojis (solo ocasionalmente)
- Adapta la conversación al contexto
- Si cambian de intención (alquiler→compra), reacciona y busca de nuevo
- Siempre busca automatizar el proceso hacia la cita`,
      tools,
      maxSteps: 5,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
