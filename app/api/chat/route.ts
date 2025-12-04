import { streamText, tool, convertToModelMessages, stepCountIs } from "ai"
import { z } from "zod"
import { query } from "@/lib/db"

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    console.log("[v0] Chat API called")

    const { messages } = await request.json()
    console.log("[v0] Received messages:", messages.length)

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
      },
    })

    console.log("[v0] Calling AI model via Vercel AI Gateway...")

    const result = streamText({
      model: "openai/gpt-4o-mini", // Vercel AI Gateway handles this automatically
      messages: convertToModelMessages(
        messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ),
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
      tools: {
        searchProperties: searchPropertiesTool,
      },
      stopWhen: stepCountIs(5), // AI SDK v5 uses stopWhen instead of maxSteps
    })

    console.log("[v0] AI model responded, creating stream...")

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("[v0] Starting to stream text...")
          let textChunks = 0

          // Stream text chunks
          for await (const chunk of result.textStream) {
            textChunks++
            console.log(`[v0] Streaming text chunk #${textChunks}:`, chunk.substring(0, 50))
            const data = JSON.stringify({ type: "text", content: chunk })
            controller.enqueue(encoder.encode(`${data}\n`))
          }

          console.log("[v0] Finished streaming text, total chunks:", textChunks)

          // Send property results if any
          const response = await result.response
          if (response.messages && response.messages.length > 0) {
            for (const message of response.messages) {
              if (message.role === "assistant" && message.content) {
                for (const part of message.content) {
                  if (part.type === "tool-call" && part.toolName === "searchProperties") {
                    // Find the corresponding tool result
                    const toolResultMessage = response.messages.find(
                      (m: any) => m.role === "tool" && m.content?.some((c: any) => c.toolCallId === part.toolCallId),
                    )
                    if (toolResultMessage) {
                      const toolResult = toolResultMessage.content?.find((c: any) => c.toolCallId === part.toolCallId)
                      if (toolResult?.result?.properties) {
                        console.log("[v0] Sending property results:", toolResult.result.properties.length)
                        const data = JSON.stringify({ type: "properties", properties: toolResult.result.properties })
                        controller.enqueue(encoder.encode(`${data}\n`))
                      }
                    }
                  }
                }
              }
            }
          }

          console.log("[v0] Stream complete, closing")
          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
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
    console.error("[v0] Error in chat API:", error)
    if (error instanceof Error) {
      console.error("[v0] Error name:", error.name)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido"
        const data = JSON.stringify({
          type: "text",
          content: `Disculpa, hubo un problema técnico. Por favor intenta de nuevo en unos segundos.`,
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
