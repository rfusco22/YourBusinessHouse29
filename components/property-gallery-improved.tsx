"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface PropertyImage {
  id?: number
  url: string
}

interface PropertyGalleryImprovedProps {
  images: PropertyImage[]
  title: string
}

export default function PropertyGalleryImproved({ images, title }: PropertyGalleryImprovedProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-gray-200 h-96 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No hay imágenes disponibles</p>
        </div>
      </div>
    )
  }

  const currentImage = images[currentImageIndex]
  const totalImages = images.length
  const hasPrevious = currentImageIndex > 0
  const hasNext = currentImageIndex < totalImages - 1

  const handlePrevious = () => {
    if (hasPrevious) setCurrentImageIndex(currentImageIndex - 1)
  }

  const handleNext = () => {
    if (hasNext) setCurrentImageIndex(currentImageIndex + 1)
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Image Display */}
      <div className="relative rounded-lg overflow-hidden bg-black mx-auto w-full max-w-4xl h-[500px] flex items-center justify-center">
        <img
          src={currentImage.url || "/placeholder.svg?height=540&width=960&query=property"}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover object-center ${isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"} transition-transform duration-300`}
          style={{
            imageRendering: "-webkit-optimize-contrast",
            WebkitFontSmoothing: "antialiased",
          }}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentImageIndex + 1} / {totalImages}
        </div>

        {/* Navigation Arrows */}
        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Zoom Hint */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
          <ZoomIn size={16} />
          <span>Haz clic para ampliar</span>
        </div>
      </div>

      {/* Thumbnails */}
      {totalImages > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all border-2 ${
                currentImageIndex === index
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <img
                src={image.url || "/placeholder.svg?height=80&width=80&query=thumbnail"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover object-center"
                style={{
                  imageRendering: "-webkit-optimize-contrast",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
