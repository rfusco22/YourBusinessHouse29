import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      type,
      price,
      location,
      bedrooms,
      bathrooms,
      parking,
      owner_id,
      amenities,
      image_urls,
      area,
      operation_type,
      latitude,
      longitude,
      rental_price,
      purchase_price,
    } = body

    console.log("[v0] Creating property with data:", {
      title,
      location,
      price,
      rental_price,
      purchase_price,
      owner_id,
      images: image_urls?.length,
      latitude,
      longitude,
    })

    const errors: string[] = []

    if (!title || title.trim().length === 0) errors.push("El título es requerido")
    if (!type || type.trim().length === 0) errors.push("El tipo de inmueble es requerido")
    if (!location || location.trim().length === 0) errors.push("La ubicación es requerida")
    if (!owner_id) errors.push("El propietario es requerido")

    if (operation_type === "compra") {
      if (!price || price <= 0) errors.push("El precio de compra debe ser mayor a 0")
    } else if (operation_type === "alquiler") {
      if (!price || price <= 0) errors.push("El precio de alquiler debe ser mayor a 0")
    } else if (operation_type === "ambos") {
      if (!purchase_price || purchase_price <= 0) errors.push("El precio de compra debe ser mayor a 0")
      if (!rental_price || rental_price <= 0) errors.push("El precio de alquiler debe ser mayor a 0")
    }

    if (bedrooms !== undefined && bedrooms < 0) errors.push("Los cuartos no pueden ser negativos")
    if (bathrooms !== undefined && bathrooms < 0) errors.push("Los baños no pueden ser negativos")
    if (parking !== undefined && parking < 0) errors.push("Los estacionamientos no pueden ser negativos")
    if (area !== undefined && area <= 0) errors.push("El área debe ser mayor a 0")

    if (bedrooms > 50) errors.push("El número de cuartos no es válido")
    if (bathrooms > 50) errors.push("El número de baños no es válido")
    if (parking > 50) errors.push("El número de estacionamientos no es válido")
    if (area > 5000) errors.push("El área es demasiado grande")

    if (errors.length > 0) {
      console.error("[v0] Validation errors:", errors)
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }

    const firstImage = image_urls && image_urls.length > 0 ? image_urls[0] : null

    const latitudeValue = latitude !== undefined && latitude !== null ? Number(latitude) : null
    const longitudeValue = longitude !== undefined && longitude !== null ? Number(longitude) : null

    const result = (await query(
      `INSERT INTO inmueble 
       (title, description, type, price, location, bedrooms, bathrooms, parking, area, owner_id, image_url, operation_type, latitude, longitude, rental_price, purchase_price) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        type,
        price || 0,
        location,
        bedrooms || 0,
        bathrooms || 0,
        parking || 0,
        area || 0,
        owner_id,
        firstImage || null,
        operation_type || "compra",
        latitudeValue,
        longitudeValue,
        rental_price || null,
        purchase_price || null,
      ],
    )) as any

    const propertyId = result.insertId
    console.log("[v0] Property created with ID:", propertyId)

    if (image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
      for (let i = 0; i < image_urls.length; i++) {
        await query(`INSERT INTO inmueble_images (inmueble_id, image_url, display_order) VALUES (?, ?, ?)`, [
          propertyId,
          image_urls[i],
          i,
        ])
      }
      console.log("[v0] Images saved:", image_urls.length)
    }

    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      for (const amenity of amenities) {
        await query(`INSERT INTO inmueble_amenities (inmueble_id, amenity_name) VALUES (?, ?)`, [propertyId, amenity])
      }
      console.log("[v0] Amenities added:", amenities)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inmueble creado exitosamente y publicado al instante.",
        property_id: propertyId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Property creation error:", error)
    return NextResponse.json({ error: "Error al crear el inmueble", details: String(error) }, { status: 500 })
  }
}
