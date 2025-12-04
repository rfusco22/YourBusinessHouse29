/**
 * Utility para cargar propiedades del usuario
 * Se usa para refrescar datos después de cambios
 */
export async function loadProperties(userId: number) {
  try {
    // Fetch user's own properties
    const userResponse = await fetch(`/api/properties?userId=${userId}`)
    if (!userResponse.ok) {
      throw new Error("Error loading user properties")
    }
    const userResult = await userResponse.json()

    // Fetch all properties globally
    const allResponse = await fetch("/api/properties")
    if (!allResponse.ok) {
      throw new Error("Error loading all properties")
    }
    const allResult = await allResponse.json()

    return {
      userProperties: userResult.data || [],
      allProperties: allResult.data || [],
    }
  } catch (error) {
    console.error("[v0] Error loading properties:", error)
    throw error
  }
}
