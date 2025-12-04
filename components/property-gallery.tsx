"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const currentImage = images[currentImageIndex]

  return (
    <div className="relative bg-gray-100 dark:bg-neutral-900">
      {/* Main Image Container */}
      <div className="relative h-96 sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-neutral-800">
        {images.length > 0 ? (
          <img
            src={currentImage || "/placeholder.svg"}
            alt={`${title} - Imagen ${currentImageIndex + 1}`}
            className="w-auto h-full max-w-full object-contain object-center transition-opacity duration-300"
            onError={() => {
              console.log("[v0] Image failed to load:", currentImage)
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Sin imágenes disponibles</p>
          </div>
        )}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 transition-colors z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 transition-colors z-10"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70 dark:bg-gray-950/70 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="bg-gray-100 dark:bg-neutral-800 px-4 sm:px-6 lg:px-8 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index)
              }}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index ? "border-primary" : "border-gray-300 dark:border-neutral-600"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover object-center"
                onError={() => {
                  console.log("[v0] Thumbnail failed:", image)
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
