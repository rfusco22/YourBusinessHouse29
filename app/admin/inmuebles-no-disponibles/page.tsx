"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Search, CheckCircle } from "lucide-react"

interface Property {
  id: number
  title: string
  type: string
  price: number
  location: string
  status: string
  ownerName: string
  soldDate?: string
}

export default function AdminInmueblesNoDisponibles() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))
    loadProperties()
    setIsLoading(false)
  }, [router])

  const loadProperties = () => {
    const mockProperties: Property[] = [
      {
        id: 3,
        title: "Oficina Ejecutiva",
        type: "Oficina",
        price: 150000,
        location: "Los Palos Grandes",
        status: "vendido",
        ownerName: "Carlos Asesor",
        soldDate: "2024-01-10",
      },
      {
        id: 4,
        title: "Apartamento Alquilado",
        type: "Apartamento",
        price: 180000,
        location: "Sabana Grande",
        status: "alquilado",
        ownerName: "Carlos Asesor",
        soldDate: "2024-01-05",
      },
    ]
    setProperties(mockProperties)
    filterProperties(mockProperties, searchTerm, statusFilter)
  }

  const filterProperties = (props: Property[], search: string, status: string) => {
    let filtered = props
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()),
      )
    }
    if (status !== "todos") {
      filtered = filtered.filter((p) => p.status === status)
    }
    setFilteredProperties(filtered)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterProperties(properties, term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterProperties(properties, searchTerm, status)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <header className="bg-neutral-900/95 backdrop-blur border-b border-primary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">Inmuebles No Disponibles</h1>
            <p className="text-gray-400 text-sm">{user?.name}</p>
          </div>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <LogOut size={18} />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar inmueble..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="todos">Todos</option>
            <option value="vendido">Vendido</option>
            <option value="alquilado">Alquilado</option>
          </select>
        </div>

        {/* Properties Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-neutral-800/50 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{property.title}</h3>
                  <p className="text-sm text-gray-400">{property.type}</p>
                </div>
                <CheckCircle
                  size={24}
                  className={`${property.status === "vendido" ? "text-green-500" : "text-blue-500"}`}
                />
              </div>

              <p className="text-sm text-gray-300 mb-3">{property.location}</p>

              <div className="border-t border-primary/10 pt-3 mb-3">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Estado:</span>{" "}
                  {property.status === "vendido" ? "Vendido" : "Alquilado"}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Fecha:</span> {property.soldDate}
                </p>
              </div>

              <p className="text-xl font-bold text-primary">${property.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="bg-neutral-800/50 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-gray-400">No hay inmuebles no disponibles</p>
          </div>
        )}
      </main>
    </div>
  )
}
