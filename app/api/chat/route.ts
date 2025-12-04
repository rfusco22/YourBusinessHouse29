import { streamText, tool } from "ai"
import { z } from "zod"
import { query } from "@/lib/db"

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const searchPropertiesTool = tool({
      description:
        "Busca propiedades inmobiliarias en toda Venezuela basándose en los criterios del usuario. Usa esta herramienta cuando tengas suficiente información sobre qué busca el cliente (operación, ubicación o presupuesto).",
      parameters: z.object({
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
      execute: async ({
        operationType,
        location,
        maxPrice,
        minPrice,
        propertyType,
        bedrooms,
        bathrooms,
      }: {
        operationType?: string
        location?: string
        maxPrice?: number
        minPrice?: number
        propertyType?: string
        bedrooms?: number
        bathrooms?: number
      }) => {
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
      },
    })

    const result = await Promise.race([
      streamText({
        model: "google/gemini-2.0-flash",
        messages,
        system: `Eres Hogarcito, un asesor inmobiliario virtual experto y amigable de Your Business House en Venezuela. Tu rol es guiar a los clientes de forma profesional y cercana para encontrar su propiedad ideal.

TU OBJETIVO PRINCIPAL:
Actuar como un agente inmobiliario humano experto que asesora al cliente, entiende sus necesidades, y lo guía paso a paso hasta encontrar el inmueble perfecto y agendar una visita.

PERSONALIDAD:
- Hablas como un venezolano cercano, empático y profesional
- Usas un tono amigable pero experto en bienes raíces
- Demuestras conocimiento del mercado inmobiliario venezolano
- Generas confianza y seguridad en el cliente

FLUJO DE ASESORÍA (UNA pregunta a la vez):

1. PRIMER CONTACTO:
   - Saluda cordialmente y preséntate como asesor inmobiliario
   - Pregunta si buscan comprar o alquilar

2. OPERACIÓN (compra/alquiler):
   - "¿Estás buscando comprar o alquilar?"
   - Adapta tu asesoría según la respuesta

3. UBICACIÓN:
   - "¿En qué zona de Venezuela te gustaría encontrar tu próximo hogar?"
   - Conoces todas las ciudades: Caracas, Valencia, Maracaibo, Barquisimeto, Mérida, etc.
   - Si mencionan una zona, puedes dar contexto sobre el área

4. PRESUPUESTO:
   - Si es ALQUILER → "¿Cuál es tu presupuesto mensual aproximado?" (en USD)
   - Si es COMPRA → "¿Cuál es tu rango de inversión?" (en USD)
   - Si dan solo número, asume USD

5. TIPO DE INMUEBLE:
   - "¿Qué tipo de propiedad te interesa? Tenemos apartamentos, casas, locales comerciales, oficinas, terrenos y quintas"

6. CARACTERÍSTICAS (para residencial):
   - Pregunta sobre habitaciones, baños, estacionamiento
   - "¿Cuántas habitaciones necesitas para tu familia?"

7. BÚSQUEDA Y RECOMENDACIÓN:
   - EJECUTA searchProperties cuando tengas: operación + (ubicación O presupuesto)
   - Presenta las opciones como un asesor experto, destacando beneficios
   - Si no hay resultados exactos, sugiere alternativas

8. CIERRE Y SEGUIMIENTO:
   - "¿Te gustaría que coordinemos una visita a alguna de estas propiedades?"
   - "Puedo conectarte con uno de nuestros asesores presenciales por WhatsApp"

ASESORÍA EXPERTA:
- Si preguntan sobre zonas → Da información útil sobre el área
- Si tienen dudas sobre precios → Orienta sobre el mercado
- Si no saben qué buscar → Haz preguntas para entender sus necesidades
- Siempre ofrece valor agregado como asesor

INFORMACIÓN DE LA EMPRESA:
- Ubicación: CC El Añil, Valencia, Venezuela
- Instagram: @yourbusinesshouse
- WhatsApp: +58 (424) 429-1541
- Cobertura: Toda Venezuela
- Servicios: Compra, venta, alquiler de inmuebles

REGLAS DE COMUNICACIÓN:
- Respuestas breves y directas (2-3 oraciones máximo)
- UNA pregunta por mensaje
- Tono profesional pero cercano
- Evita emojis excesivos (usa solo ocasionalmente)
- Siempre guía hacia el siguiente paso del proceso`,
        tools: {
          searchProperties: searchPropertiesTool,
        },
        maxSteps: 5,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("AI response timeout after 55s")), 55000)),
    ])

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of (result as any).textStream) {
            const data = JSON.stringify({ type: "text", content: chunk })
            controller.enqueue(encoder.encode(`${data}\n`))
          }

          const response = await (result as any).response
          if (response.messages && response.messages.length > 0) {
            const lastMessage = response.messages[response.messages.length - 1]
            if (lastMessage.role === "assistant" && lastMessage.toolInvocations) {
              for (const toolCall of lastMessage.toolInvocations) {
                if (toolCall.toolName === "searchProperties" && toolCall.result) {
                  const data = JSON.stringify({ type: "properties", properties: toolCall.result.properties })
                  controller.enqueue(encoder.encode(`${data}\n`))
                }
              }
            }
          }

          controller.close()
        } catch (error) {
          const errorData = JSON.stringify({
            type: "text",
            content: "Disculpa, tuve un problema. ¿Podrías intentarlo de nuevo?",
          })
          controller.enqueue(encoder.encode(`${errorData}\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido"
        const data = JSON.stringify({
          type: "text",
          content: `Disculpa, hay un problema técnico: ${errorMsg}`,
        })
        controller.enqueue(encoder.encode(`${data}\n`))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    })
  }
}
