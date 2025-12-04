import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const propertyId = searchParams.get("propertyId")

    const searchTerm = searchParams.get("searchTerm") || ""
    const type = searchParams.get("type") || ""
    const priceMin = searchParams.get("priceMin") ? Number.parseFloat(searchParams.get("priceMin")!) : null
    const priceMax = searchParams.get("priceMax") ? Number.parseFloat(searchParams.get("priceMax")!) : null
    const bedrooms = searchParams.get("bedrooms") ? Number.parseInt(searchParams.get("bedrooms")!) : null
    const bathrooms = searchParams.get("bathrooms") ? Number.parseInt(searchParams.get("bathrooms")!) : null
    const area = searchParams.get("area") ? Number.parseFloat(searchParams.get("area")!) : null
    const status = searchParams.get("status") || ""
    const operacion = searchParams.get("operacion") || ""

    if (propertyId) {
      console.log("[v0] Fetching property by ID:", propertyId)

      const properties = (await query(`SELECT * FROM inmueble WHERE id = ?`, [Number.parseInt(propertyId)])) as any[]

      if (!properties || properties.length === 0) {
        console.log("[v0] Property not found with ID:", propertyId)
        return NextResponse.json({ error: "Inmueble no encontrado", success: false }, { status: 404 })
      }

      const property = properties[0]
      console.log("[v0] Property found:", property.id)
      console.log("[v0] Property coordinates:", { latitude: property.latitude, longitude: property.longitude })
      console.log("[v0] Property pricing:", {
        price: property.price,
        rental_price: property.rental_price,
        purchase_price: property.purchase_price,
      })

      const imagesResult = (await query(
        `SELECT id, image_url FROM inmueble_images WHERE inmueble_id = ? ORDER BY display_order ASC`,
        [propertyId],
      )) as any[]

      const amenitiesResult = (await query(`SELECT amenity_name FROM inmueble_amenities WHERE inmueble_id = ?`, [
        propertyId,
      ])) as any[]

      const agentResult = (await query(
        `SELECT id, name, email, phone, avatar_url, facebook, instagram, twitter, linkedin, tiktok, youtube, whatsapp FROM users WHERE id = ?`,
        [property.owner_id],
      )) as any[]

      return NextResponse.json({
        success: true,
        data: {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          rental_price: property.rental_price || null,
          purchase_price: property.purchase_price || null,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          parking: property.parking || 0,
          area: property.area,
          description: property.description,
          type: property.type,
          image_url: property.image_url || null,
          operation_type: property.operation_type || "compra",
          latitude: property.latitude,
          longitude: property.longitude,
          images: imagesResult.map((img: any) => ({
            id: img.id,
            url: img.image_url,
          })),
          amenities: amenitiesResult.map((a: any) => a.amenity_name),
          agent: agentResult[0]
            ? {
                id: agentResult[0].id,
                name: agentResult[0].name,
                email: agentResult[0].email,
                phone: agentResult[0].phone,
                image: agentResult[0].avatar_url,
                whatsapp: agentResult[0].whatsapp,
                facebook: agentResult[0].facebook,
                instagram: agentResult[0].instagram,
                twitter: agentResult[0].twitter,
                linkedin: agentResult[0].linkedin,
                tiktok: agentResult[0].tiktok,
                youtube: agentResult[0].youtube,
              }
            : null,
        },
      })
    }

    if (userId) {
      console.log("[v0] Fetching properties for user:", userId)
      const userIdNum = Number.parseInt(userId)

      const properties = (await query(`SELECT * FROM inmueble WHERE owner_id = ? ORDER BY created_at DESC`, [
        userIdNum,
      ])) as any[]

      const mappedProperties = await Promise.all(
        properties.map(async (p: any) => {
          const imagesResult = (await query(
            `SELECT id, image_url FROM inmueble_images WHERE inmueble_id = ? ORDER BY display_order ASC LIMIT 1`,
            [p.id],
          )) as any[]

          return {
            id: p.id,
            title: p.title,
            location: p.location,
            price: p.price,
            rental_price: p.rental_price || null,
            purchase_price: p.purchase_price || null,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            parking: p.parking || 0,
            area: p.area,
            description: p.description,
            image_url: imagesResult.length > 0 ? imagesResult[0].image_url : p.image_url || null,
            type: p.type,
            status: p.status || "disponible",
            operation_type: p.operation_type || "compra",
            latitude: p.latitude || null,
            longitude: p.longitude || null,
          }
        }),
      )

      console.log("[v0] Properties loaded for user:", mappedProperties.length)
      return NextResponse.json({ success: true, data: mappedProperties })
    }

    let sqlQuery = `
      SELECT i.*, u.name as owner_name 
      FROM inmueble i 
      LEFT JOIN users u ON i.owner_id = u.id 
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      sqlQuery += ` AND i.status = ?`
      params.push(status)
    }

    if (operacion && operacion !== "todos") {
      if (operacion === "ambos") {
        sqlQuery += ` AND i.operation_type IN ('compra', 'alquiler')`
      } else {
        sqlQuery += ` AND i.operation_type = ?`
        params.push(operacion)
      }
    }

    if (searchTerm) {
      sqlQuery += ` AND (i.title LIKE ? OR i.location LIKE ?)`
      params.push(`%${searchTerm}%`, `%${searchTerm}%`)
    }

    if (type && type !== "todos") {
      sqlQuery += ` AND i.type = ?`
      params.push(type)
    }

    if (priceMin !== null) {
      sqlQuery += ` AND i.price >= ?`
      params.push(priceMin)
    }

    if (priceMax !== null) {
      sqlQuery += ` AND i.price <= ?`
      params.push(priceMax)
    }

    if (bedrooms !== null) {
      sqlQuery += ` AND i.bedrooms >= ?`
      params.push(bedrooms)
    }

    if (bathrooms !== null) {
      sqlQuery += ` AND i.bathrooms >= ?`
      params.push(bathrooms)
    }

    if (area !== null) {
      sqlQuery += ` AND i.area >= ?`
      params.push(area)
    }

    sqlQuery += ` ORDER BY i.created_at DESC`

    console.log("[v0] Fetching properties with filters:", {
      searchTerm,
      type,
      priceMin,
      priceMax,
      bedrooms,
      bathrooms,
      area,
      status,
      operacion,
    })

    const allProperties = (await query(sqlQuery, params)) as any[]

    const mappedProperties = await Promise.all(
      allProperties.map(async (p: any) => {
        const imagesResult = (await query(
          `SELECT id, image_url FROM inmueble_images WHERE inmueble_id = ? ORDER BY display_order ASC LIMIT 1`,
          [p.id],
        )) as any[]

        return {
          id: p.id,
          title: p.title,
          location: p.location,
          price: p.price,
          rental_price: p.rental_price || null,
          purchase_price: p.purchase_price || null,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          parking: p.parking || 0,
          area: p.area,
          description: p.description,
          image_url: imagesResult.length > 0 ? imagesResult[0].image_url : p.image_url || null,
          type: p.type,
          status: p.status || "disponible",
          ownerName: p.owner_name || null,
          owner_id: p.owner_id,
          operation_type: p.operation_type || "compra",
          latitude: p.latitude,
          longitude: p.longitude,
        }
      }),
    )

    console.log("[v0] Filtered properties count:", mappedProperties.length)
    return NextResponse.json({ success: true, data: mappedProperties })
  } catch (error) {
    console.error("[v0] Error fetching properties:", error)
    return NextResponse.json(
      { error: "Error al obtener inmuebles", success: false, details: String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const {
      propertyId,
      title,
      description,
      type,
      price,
      location,
      bedrooms,
      bathrooms,
      parking,
      area,
      amenities,
      operation_type,
      latitude,
      longitude,
      rental_price,
      purchase_price,
      image_urls, // Add image_urls parameter
    } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "propertyId es requerido", success: false }, { status: 400 })
    }

    console.log("[v0] Updating property:", propertyId)
    console.log("[v0] Pricing info:", { price, rental_price, purchase_price, operation_type })
    console.log("[v0] Image URLs:", image_urls?.length || 0) // Log image count

    const parkingValue =
      parking !== undefined && parking !== null && parking !== "" ? Number.parseInt(String(parking)) : 0
    const areaValue = area !== undefined && area !== null && area !== "" ? Number.parseFloat(String(area)) : 0
    const priceValue = price !== undefined && price !== null && price !== "" ? Number.parseFloat(String(price)) : 0
    const bedroomsValue =
      bedrooms !== undefined && bedrooms !== null && bedrooms !== "" ? Number.parseInt(String(bedrooms)) : 0
    const bathroomsValue =
      bathrooms !== undefined && bathrooms !== null && bathrooms !== "" ? Number.parseInt(String(bathrooms)) : 0

    const rentalPriceValue =
      rental_price !== undefined && rental_price !== null && rental_price !== ""
        ? Number.parseFloat(String(rental_price))
        : null
    const purchasePriceValue =
      purchase_price !== undefined && purchase_price !== null && purchase_price !== ""
        ? Number.parseFloat(String(purchase_price))
        : null

    const latitudeValue = latitude !== undefined && latitude !== null ? Number.parseFloat(String(latitude)) : null
    const longitudeValue = longitude !== undefined && longitude !== null ? Number.parseFloat(String(longitude)) : null

    console.log("[v0] Converted values:", {
      parkingValue,
      rentalPriceValue,
      purchasePriceValue,
    })

    const updateQuery =
      latitude !== null && longitude !== null
        ? `UPDATE inmueble SET title = ?, description = ?, type = ?, price = ?, location = ?, bedrooms = ?, bathrooms = ?, parking = ?, area = ?, operation_type = ?, latitude = ?, longitude = ?, rental_price = ?, purchase_price = ? WHERE id = ?`
        : `UPDATE inmueble SET title = ?, description = ?, type = ?, price = ?, location = ?, bedrooms = ?, bathrooms = ?, parking = ?, area = ?, operation_type = ?, rental_price = ?, purchase_price = ? WHERE id = ?`

    const updateParams =
      latitude !== null && longitude !== null
        ? [
            title,
            description,
            type,
            priceValue,
            location,
            bedroomsValue,
            bathroomsValue,
            parkingValue,
            areaValue,
            operation_type || "compra",
            latitudeValue,
            longitudeValue,
            rentalPriceValue,
            purchasePriceValue,
            propertyId,
          ]
        : [
            title,
            description,
            type,
            priceValue,
            location,
            bedroomsValue,
            bathroomsValue,
            parkingValue,
            areaValue,
            operation_type || "compra",
            rentalPriceValue,
            purchasePriceValue,
            propertyId,
          ]

    await query(updateQuery, updateParams)

    if (image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
      // Delete existing images first
      await query(`DELETE FROM inmueble_images WHERE inmueble_id = ?`, [propertyId])

      // Add new images
      for (let i = 0; i < image_urls.length; i++) {
        await query(`INSERT INTO inmueble_images (inmueble_id, image_url, display_order) VALUES (?, ?, ?)`, [
          propertyId,
          image_urls[i],
          i,
        ])
      }
      console.log("[v0] Images updated:", image_urls.length)
    }

    await query(`DELETE FROM inmueble_amenities WHERE inmueble_id = ?`, [propertyId])
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      for (const amenity of amenities) {
        await query(`INSERT INTO inmueble_amenities (inmueble_id, amenity_name) VALUES (?, ?)`, [propertyId, amenity])
      }
    }

    console.log("[v0] Property updated successfully")
    return NextResponse.json({ success: true, message: "Inmueble actualizado exitosamente" })
  } catch (error) {
    console.error("[v0] Error updating property:", error)
    return NextResponse.json(
      { error: "Error al actualizar el inmueble", success: false, details: String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "propertyId requerido", success: false }, { status: 400 })
    }

    console.log("[v0] Deleting property:", propertyId)

    await query(`DELETE FROM inmueble_images WHERE inmueble_id = ?`, [propertyId])
    await query(`DELETE FROM inmueble_amenities WHERE inmueble_id = ?`, [propertyId])
    await query(`DELETE FROM inmueble WHERE id = ?`, [propertyId])

    console.log("[v0] Property deleted successfully")
    return NextResponse.json({ success: true, message: "Inmueble eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error deleting property:", error)
    return NextResponse.json({ error: "Error al eliminar el inmueble", success: false }, { status: 500 })
  }
}
