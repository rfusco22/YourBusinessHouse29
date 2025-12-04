"use client"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchType, setSearchType] = useState("comprar")
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("todos")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [videoError, setVideoError] = useState(false)
  const router = useRouter()

  const locationInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)

  useEffect(() => {
    const initAutocomplete = () => {
      if (locationInputRef.current && !autocompleteRef.current && window.google?.maps?.places) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          componentRestrictions: { country: "ve" },
          fields: ["address_components", "formatted_address", "geometry", "name"],
        })

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace()
          if (place?.formatted_address) {
            setLocation(place.formatted_address)
          }
        })
      }
    }

    if (window.google?.maps?.places) {
      initAutocomplete()
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google?.maps?.places) {
          initAutocomplete()
          clearInterval(checkGoogleMaps)
        }
      }, 100)

      return () => clearInterval(checkGoogleMaps)
    }
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchType === "comprar") {
      params.append("operacion", "compra")
    } else {
      params.append("operacion", "alquiler")
    }

    if (location) params.append("ubicacion", location)
    if (propertyType !== "todos") params.append("tipo", propertyType)
    if (minPrice) params.append("precioMin", minPrice)
    if (maxPrice) params.append("precioMax", maxPrice)
    if (bedrooms) params.append("habitaciones", bedrooms)
    if (bathrooms) params.append("banos", bathrooms)

    router.push(`/propiedades?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src="/herohome.mp4" type="video/mp4" />
          </video>
        ) : null}
        {/* Fallback image - always shown as background layer */}
        <img
          src="/agents-hero-patio.png"
          alt="Fondo de inmuebles modernos"
          className={`absolute inset-0 w-full h-full object-cover ${!videoError ? "hidden" : ""}`}
        />
        {/* Show image if video fails */}
        {videoError && (
          <img src="/agents-hero-patio.png" alt="Fondo de inmuebles modernos" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* Left Side - Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start py-8 sm:py-12">
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 order-1 lg:order-none pt-4 sm:pt-0">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white text-balance leading-tight">
                Your Business House
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 font-light leading-relaxed max-w-sm">
                Encuentra la propiedad perfecta para tu negocio o tu hogar
              </p>
            </div>
          </div>

          {/* Right Side - Dark Filter Form */}
          <div className="flex items-start justify-center lg:justify-end order-2 lg:order-none pt-4 sm:pt-0">
            <div className="w-full max-w-md bg-black/95 backdrop-blur-sm rounded-lg sm:rounded-2xl p-5 sm:p-8 lg:p-10 shadow-2xl border border-white/10">
              <div className="mb-5 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">Busca tu propiedad</h2>
                <div className="h-1 w-16 bg-primary rounded" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Toggle Buttons */}
                <div className="flex gap-2 border border-white/20 rounded-lg p-1 w-full bg-white/5">
                  {["comprar", "alquilar"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSearchType(type)}
                      className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded transition-all capitalize font-bold text-xs sm:text-sm ${
                        searchType === type
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-white/60 hover:text-white/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Search Fields */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Location Input */}
                  <div className="relative">
                    <MapPin className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                    <input
                      ref={locationInputRef}
                      type="text"
                      placeholder="Ubicación"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Property Type Select */}
                  <select
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-white/20 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer transition-all text-sm sm:text-base"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="todos" className="bg-black">
                      Tipo de inmueble
                    </option>
                    <option value="casa" className="bg-black">
                      Casa
                    </option>
                    <option value="apartamento" className="bg-black">
                      Apartamento
                    </option>
                    <option value="oficina" className="bg-black">
                      Oficina
                    </option>
                    <option value="terreno" className="bg-black">
                      Terreno
                    </option>
                  </select>

                  {/* Price Range */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <input
                      type="number"
                      placeholder="Precio mín."
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm sm:text-base"
                    />
                    <input
                      type="number"
                      placeholder="Precio máx."
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Bedrooms and Bathrooms */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <select
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-white/20 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer transition-all text-xs sm:text-sm"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    >
                      <option value="" className="bg-black">
                        Cuartos
                      </option>
                      <option value="1" className="bg-black">
                        1+
                      </option>
                      <option value="2" className="bg-black">
                        2+
                      </option>
                      <option value="3" className="bg-black">
                        3+
                      </option>
                      <option value="4" className="bg-black">
                        4+
                      </option>
                    </select>
                    <select
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-white/20 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer transition-all text-xs sm:text-sm"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                    >
                      <option value="" className="bg-black">
                        Baños
                      </option>
                      <option value="1" className="bg-black">
                        1+
                      </option>
                      <option value="2" className="bg-black">
                        2+
                      </option>
                      <option value="3" className="bg-black">
                        3+
                      </option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold transition-all"
                  size="lg"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Buscar inmuebles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
