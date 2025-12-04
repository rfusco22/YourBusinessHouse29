"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface PropertyLocationMapProps {
  latitude?: number | null
  longitude?: number | null
  location: string
  title: string
}

export function PropertyLocationMap({ latitude, longitude, location, title }: PropertyLocationMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const hasValidCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude))

  useEffect(() => {
    // Fix Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    })
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current || !hasValidCoordinates) return

    const lat = Number(latitude)
    const lng = Number(longitude)

    // Prevent duplicate map initialization
    if (mapRef.current) {
      mapRef.current.remove()
    }

    const map = L.map(mapContainerRef.current).setView([lat, lng], 15)
    mapRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${title}</strong><br>${location}`).openPopup()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [hasValidCoordinates, latitude, longitude, title, location])

  if (!hasValidCoordinates) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Ubicación</h2>
        <p className="text-muted-foreground">Las coordenadas de ubicación no están disponibles para este inmueble.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Ubicación</h2>
      <div ref={mapContainerRef} className="w-full h-96 rounded-lg border border-border" />
    </div>
  )
}
