"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyGrid } from "@/components/property-grid"
import { PropertyListView } from "@/components/property-list-view"
import { LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PropertiesHero } from "@/components/properties-hero"

const PROPERTIES_PER_PAGE = 8

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "todos",
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    operacion: "", // Added operation filter for compra/alquiler
  })
  const [propertyCount, setPropertyCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const operacion = searchParams.get("operacion") || ""
    const ubicacion = searchParams.get("ubicacion") || ""
    const tipo = searchParams.get("tipo") || "todos"
    const precioMin = searchParams.get("precioMin") || ""
    const precioMax = searchParams.get("precioMax") || ""
    const habitaciones = searchParams.get("habitaciones") || ""
    const banos = searchParams.get("banos") || ""

    setFilters({
      searchTerm: ubicacion,
      type: tipo,
      priceMin: precioMin,
      priceMax: precioMax,
      bedrooms: habitaciones,
      bathrooms: banos,
      area: "",
      operacion: operacion,
    })
  }, [searchParams])

  const handleApplyFilters = (appliedFilters: any) => {
    setFilters(appliedFilters)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(propertyCount / PROPERTIES_PER_PAGE)

  const getPaginationItems = () => {
    const items = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      items.push(1)
      if (currentPage > 3) items.push("...")

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!items.includes(i)) items.push(i)
      }

      if (currentPage < totalPages - 2) items.push("...")
      items.push(totalPages)
    }

    return items
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PropertiesHero />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <PropertyFilters filters={filters} onFiltersChange={setFilters} onApplyFilters={handleApplyFilters} />
            </div>

            {/* Properties Grid/List */}
            <div className="lg:col-span-3">
              {/* View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Mostrando <span className="font-bold text-foreground">{propertyCount}</span> propiedades
                </p>
                <div className="flex gap-2 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewType === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewType("grid")}
                    className="gap-2"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </Button>
                  <Button
                    variant={viewType === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewType("list")}
                    className="gap-2"
                  >
                    <LayoutList className="w-4 h-4" />
                    <span className="hidden sm:inline">Lista</span>
                  </Button>
                </div>
              </div>

              {/* Properties Display */}
              {viewType === "grid" ? (
                <PropertyGrid
                  filters={filters}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onPropertyCountChange={setPropertyCount}
                />
              ) : (
                <PropertyListView
                  filters={filters}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onPropertyCountChange={setPropertyCount}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        >
                          Anterior
                        </PaginationPrevious>
                      </PaginationItem>

                      {getPaginationItems().map((page, idx) => (
                        <PaginationItem key={idx}>
                          {page === "..." ? (
                            <span className="px-2 py-1">...</span>
                          ) : (
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page as number)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        >
                          Siguiente
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
