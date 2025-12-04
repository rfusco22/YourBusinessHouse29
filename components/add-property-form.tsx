"use client"

import type React from "react"
import { LocationAutocomplete } from "@/components/location-autocomplete"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, AlertCircle, ImageIcon, Upload, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddPropertyFormProps {
  onClose: () => void
  onSuccess: () => void
  userId: number
  property?: any // Added optional property prop for editing
}

interface FormErrors {
  [key: string]: string
}

interface UploadedImage {
  id: string
  preview: string
  file?: File
  uploading?: boolean
  existing?: boolean
}

interface Coordinates {
  latitude: number
  longitude: number
}

const AMENITIES_LIST = [
  "Piscina",
  "Garaje",
  "Terraza",
  "Área de juegos",
  "Lavandería",
  "Despensa",
  "Aire acondicionado",
  "Calentador de agua",
  "Seguridad 24/7",
  "Zona verde",
  "Ascensor",
  "Balcón",
]

export default function AddPropertyForm({ onClose, onSuccess, userId, property }: AddPropertyFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Apartamento",
    price: "",
    rental_price: "",
    purchase_price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    area: "",
    amenities: [] as string[],
    operation_type: "compra" as "compra" | "alquiler" | "ambos",
  })

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        type: property.type || "Apartamento",
        price: property.price?.toString() || "",
        rental_price: property.rental_price?.toString() || "",
        purchase_price: property.purchase_price?.toString() || "",
        location: property.location || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        parking: property.parking?.toString() || "0",
        area: property.area?.toString() || "",
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        operation_type: property.operation_type || "compra",
      })
      if (property.latitude && property.longitude) {
        setCoordinates({
          latitude: property.latitude,
          longitude: property.longitude,
        })
      }
      if (property.images && property.images.length > 0) {
        const existingImages = property.images.map((img: any) => ({
          id: img.id?.toString() || `existing-${Math.random()}`,
          preview: img.url,
          uploading: false,
          existing: true,
        }))
        setImages(existingImages)
      }
    }
  }, [property])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) newErrors.title = "El título es requerido"
    if (!formData.type.trim()) newErrors.type = "El tipo de inmueble es requerido"

    if (formData.operation_type === "compra") {
      if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "El precio debe ser mayor a 0"
    } else if (formData.operation_type === "alquiler") {
      if (!formData.rental_price || Number.parseFloat(formData.rental_price) <= 0)
        newErrors.rental_price = "El precio de alquiler debe ser mayor a 0"
    } else if (formData.operation_type === "ambos") {
      if (!formData.purchase_price || Number.parseFloat(formData.purchase_price) <= 0)
        newErrors.purchase_price = "El precio de compra debe ser mayor a 0"
      if (!formData.rental_price || Number.parseFloat(formData.rental_price) <= 0)
        newErrors.rental_price = "El precio de alquiler debe ser mayor a 0"
    }

    if (!formData.location.trim()) newErrors.location = "La ubicación es requerida"
    if (images.length === 0) newErrors.images = "Se requiere al menos una imagen"

    if (formData.bedrooms && Number.parseInt(formData.bedrooms) < 0) newErrors.bedrooms = "No puede ser negativo"
    if (formData.bathrooms && Number.parseInt(formData.bathrooms) < 0) newErrors.bathrooms = "No puede ser negativo"
    if (formData.parking && Number.parseInt(formData.parking) < 0) newErrors.parking = "No puede ser negativo"
    if (formData.area && Number.parseFloat(formData.area) <= 0) newErrors.area = "El área debe ser mayor a 0"

    if (formData.bedrooms && Number.parseInt(formData.bedrooms) > 50) newErrors.bedrooms = "Número de cuartos inválido"
    if (formData.bathrooms && Number.parseInt(formData.bathrooms) > 50) newErrors.bathrooms = "Número de baños inválido"
    if (formData.parking && Number.parseInt(formData.parking) > 50)
      newErrors.parking = "Número de estacionamientos inválido"
    if (formData.area && Number.parseFloat(formData.area) > 100000) newErrors.area = "Área inválida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: `${file.name} no es una imagen válida`,
          variant: "destructive",
        })
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `${file.name} excede 5MB`,
          variant: "destructive",
        })
        continue
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageId = `${Date.now()}-${i}`
        const preview = e.target?.result as string

        const newImage: UploadedImage = {
          id: imageId,
          preview,
          file,
          uploading: true,
        }

        setImages((prev) => [...prev, newImage])

        try {
          const formDataFile = new FormData()
          formDataFile.append("file", file)

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formDataFile,
          })

          if (!uploadResponse.ok) {
            throw new Error("Error al cargar imagen")
          }

          const uploadedData = await uploadResponse.json()
          const blobUrl = uploadedData.url

          setImages((prev) =>
            prev.map((img) => (img.id === imageId ? { id: imageId, preview: blobUrl, uploading: false } : img)),
          )

          console.log("[v0] Image uploaded to Blob:", blobUrl)
        } catch (error) {
          console.error("[v0] Blob upload error:", error)
          toast({
            title: "Error",
            description: `No se pudo cargar ${file.name}`,
            variant: "destructive",
          })

          setImages((prev) => prev.filter((img) => img.id !== imageId))
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleCoordsChange = (coords: Coordinates | null) => {
    setCoordinates(coords)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos correctamente",
        variant: "destructive",
      })
      return
    }

    if (images.some((img) => img.uploading)) {
      toast({
        title: "Error",
        description: "Por favor espera a que todas las imágenes terminen de cargarse",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const priceData: any = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        bedrooms: formData.bedrooms ? Number.parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number.parseInt(formData.bathrooms) : 0,
        parking: formData.parking ? Number.parseInt(formData.parking) : 0,
        area: formData.area ? Number.parseFloat(formData.area) : 0,
        location: formData.location,
        owner_id: userId,
        amenities: formData.amenities,
        operation_type: formData.operation_type,
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
      }

      const imageUrls = images
        .filter((img) => img.preview && !img.uploading) // Only include uploaded/finished images
        .map((img) => img.preview)

      priceData.image_urls = imageUrls

      if (formData.operation_type === "compra") {
        priceData.price = Number.parseFloat(formData.price)
        priceData.purchase_price = Number.parseFloat(formData.price)
      } else if (formData.operation_type === "alquiler") {
        priceData.price = Number.parseFloat(formData.rental_price)
        priceData.rental_price = Number.parseFloat(formData.rental_price)
      } else if (formData.operation_type === "ambos") {
        priceData.purchase_price = Number.parseFloat(formData.purchase_price)
        priceData.rental_price = Number.parseFloat(formData.rental_price)
        priceData.price = Number.parseFloat(formData.purchase_price) // fallback for compatibility
      }

      let response: Response
      if (property) {
        priceData.propertyId = property.id
        response = await fetch("/api/properties", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(priceData),
        })
      } else {
        response = await fetch("/api/properties/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(priceData),
        })
      }

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] API error:", data)
        throw new Error(data.error || "Error al guardar el inmueble")
      }

      toast({
        title: "Éxito",
        description: property
          ? "Inmueble actualizado exitosamente"
          : data.message || "Inmueble agregado exitosamente y publicado al instante.",
        variant: "default",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("[v0] Form submit error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar el inmueble",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-primary/30 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900/95 border-b border-primary/20 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{property ? "Editar Inmueble" : "Agregar Nuevo Inmueble"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300 mb-2">Por favor corrige los siguientes errores:</p>
                <ul className="text-sm text-red-300 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fotos del Inmueble <span className="text-red-400">*</span>
            </label>
            <div className="space-y-3">
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative rounded-lg overflow-hidden group">
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                      {image.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="animate-spin">
                            <Upload size={20} className="text-primary" />
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        disabled={image.uploading}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/60 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={32} className="text-primary" />
                  <span className="text-sm text-gray-300">Haz clic para agregar más imágenes</span>
                  <span className="text-xs text-gray-500">Puedes agregar ilimitadas fotos - Máximo 5MB cada una</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="hidden"
                />
              </label>

              {images.length === 0 && (
                <p className="text-xs text-gray-500 text-center">Se requiere al menos una imagen</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Inmueble <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Apartamento Moderno en Centro"
                className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.title ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Inmueble <span className="text-red-400">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white focus:outline-none transition-colors ${
                  errors.type ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
              >
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Oficina</option>
                <option>Local Comercial</option>
                <option>Terreno</option>
              </select>
              {errors.type && <p className="text-xs text-red-400 mt-1">{errors.type}</p>}
            </div>

            {/* Tipo de Operación */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Operación <span className="text-red-400">*</span>
              </label>
              <select
                name="operation_type"
                value={formData.operation_type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-neutral-800 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="compra">Para Compra</option>
                <option value="alquiler">Para Alquiler</option>
                <option value="ambos">Para Compra y Alquiler</option>
              </select>
            </div>

            {formData.operation_type === "compra" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio de Compra <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.price ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                />
                {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
              </div>
            )}

            {formData.operation_type === "alquiler" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio de Alquiler <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="rental_price"
                  value={formData.rental_price}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.rental_price
                      ? "border-red-500 focus:border-red-500"
                      : "border-primary/30 focus:border-primary"
                  }`}
                />
                {errors.rental_price && <p className="text-xs text-red-400 mt-1">{errors.rental_price}</p>}
              </div>
            )}

            {formData.operation_type === "ambos" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio de Compra <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      errors.purchase_price
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/30 focus:border-primary"
                    }`}
                  />
                  {errors.purchase_price && <p className="text-xs text-red-400 mt-1">{errors.purchase_price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio de Alquiler <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="rental_price"
                    value={formData.rental_price}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      errors.rental_price
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/30 focus:border-primary"
                    }`}
                  />
                  {errors.rental_price && <p className="text-xs text-red-400 mt-1">{errors.rental_price}</p>}
                </div>
              </>
            )}

            {/* Ubicación */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ubicación <span className="text-red-400">*</span>
              </label>
              <LocationAutocomplete
                value={formData.location}
                onChange={(location) => setFormData((prev) => ({ ...prev, location }))}
                onCoordsChange={handleCoordsChange}
                placeholder="Ej: Centro, Altamira"
                error={!!errors.location}
              />
              {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
              {coordinates && <p className="text-xs text-green-400 mt-1">Ubicación en mapa capturada correctamente</p>}
            </div>

            {/* Cuartos */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cuartos</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="50"
                className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.bedrooms ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
              />
              {errors.bedrooms && <p className="text-xs text-red-400 mt-1">{errors.bedrooms}</p>}
            </div>

            {/* Baños */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Baños</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="50"
                className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.bathrooms ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
              />
              {errors.bathrooms && <p className="text-xs text-red-400 mt-1">{errors.bathrooms}</p>}
            </div>

            {/* Estacionamientos */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estacionamientos</label>
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="50"
                className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.parking ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
              />
              {errors.parking && <p className="text-xs text-red-400 mt-1">{errors.parking}</p>}
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Área (m²)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                max="100000"
                className={`w-full px-4 py-2 bg-neutral-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.area ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
              />
              {errors.area && <p className="text-xs text-red-400 mt-1">{errors.area}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción detallada del inmueble..."
              rows={4}
              className="w-full px-4 py-2 bg-neutral-800 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Amenidades */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Amenidades</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 rounded border-primary/30 bg-neutral-800 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-gray-300">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-primary/10">
            <Button type="button" onClick={onClose} className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-white">
              {loading ? "Guardando..." : property ? "Actualizar Inmueble" : "Crear Inmueble"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
