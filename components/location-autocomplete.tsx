"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import type { google } from "google-maps"

interface Coordinates {
  latitude: number
  longitude: number
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onCoordsChange?: (coords: Coordinates | null) => void
  placeholder?: string
  error?: boolean
}

export function LocationAutocomplete({
  value,
  onChange,
  onCoordsChange,
  placeholder = "Ej: Centro, Altamira",
  error = false,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Array<{ place_id: string; description: string }>>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()

      const mapDiv = document.createElement("div")
      placesServiceRef.current = new window.google.maps.places.PlacesService(mapDiv)
    }
  }, [])

  // Handle input changes
  useEffect(() => {
    if (!isUserTyping || !value || value.length < 2) {
      if (!isUserTyping) {
        setSuggestions([])
        setIsOpen(false)
      }
      return
    }

    const fetchSuggestions = async () => {
      if (!autocompleteServiceRef.current) return

      setLoading(true)
      try {
        const predictions = await autocompleteServiceRef.current.getPlacePredictions({
          input: value,
          componentRestrictions: { country: "ve" },
          sessionToken: sessionTokenRef.current,
        })

        const formattedSuggestions = predictions.predictions.map((prediction) => ({
          place_id: prediction.place_id,
          description: prediction.description,
        }))

        setSuggestions(formattedSuggestions)
        setIsOpen(true)
        setHighlightedIndex(-1)
      } catch (error) {
        console.error("[v0] Error fetching predictions:", error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [value, isUserTyping])

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getPlaceCoordinates = (placeId: string) => {
    if (!placesServiceRef.current || !onCoordsChange) return

    placesServiceRef.current.getDetails(
      {
        placeId: placeId,
        fields: ["geometry"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const coords: Coordinates = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          }
          onCoordsChange(coords)
        } else {
          onCoordsChange(null)
        }
      },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          const selected = suggestions[highlightedIndex]
          onChange(selected.description)
          getPlaceCoordinates(selected.place_id)
          setIsOpen(false)
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  const handleSuggestionClick = (suggestion: { place_id: string; description: string }) => {
    setIsUserTyping(false)
    onChange(suggestion.description)
    getPlaceCoordinates(suggestion.place_id)
    setIsOpen(false)
    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserTyping(true)
    onChange(e.target.value)
    if (onCoordsChange) {
      onCoordsChange(null)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors pr-10 ${
            error ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
          }`}
        />
        {(suggestions.length > 0 || loading) && (
          <ChevronDown
            size={18}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none ${
              loading ? "animate-spin" : ""
            }`}
          />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-primary/30 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-2.5 transition-colors text-sm ${
                index === highlightedIndex ? "bg-primary/20 text-white" : "text-gray-300 hover:bg-primary/10"
              }`}
            >
              {suggestion.description}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
