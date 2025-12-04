"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Search, Eye, Link2, Check, Power, PowerOff, AlertCircle } from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { Home, Bell, BookOpen, Users, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import AddPropertyForm from "@/components/add-property-form"
import { AdvancedPropertyFilters, type PropertyFilters } from "@/components/advanced-property-filters"

interface Property {
  id: number
  title: string
  description: string
  type: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  status: string
  ownerName?: string
  owner_id?: number
  amenities?: string[]
  operation_type?: string // Assuming operation_type is a new field
}

type StatusTab = "disponible" | "alquilado" | "vendido" | "todos-disponibles" | "todos-no-disponibles" | "todos"

export default function GerenciaInmuebles() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userProperties, setUserProperties] = useState<Property[]>([])
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<StatusTab>("disponible")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isLoadingEdit, setIsLoadingEdit] = useState(false)
  const [activeFilters, setActiveFilters] = useState<PropertyFilters>({})
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const navItems = [
    { label: "Dashboard", path: "/gerencia/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Inmuebles", path: "/gerencia/inmuebles", icon: <Home size={20} /> },
    { label: "Alertas", path: "/gerencia/alertas", icon: <Bell size={20} /> },
    { label: "Bitácora", path: "/gerencia/bitacora", icon: <BookOpen size={20} /> },
    { label: "Usuarios", path: "/gerencia/usuarios", icon: <Users size={20} /> },
    { label: "Permisos", path: "/gerencia/permisos", icon: <AlertCircle size={20} /> },
  ]

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    loadProperties(parsedUser.id)
    setIsLoading(false)
  }, [router])

  const loadProperties = async (userId: number) => {
    try {
      // Fetch user's own properties
      const userResponse = await fetch(`/api/properties?userId=${userId}`)
      if (!userResponse.ok) {
        throw new Error("Error loading user properties")
      }
      const userResult = await userResponse.json()
      setUserProperties(userResult.data || [])

      // Fetch all properties globally
      const allResponse = await fetch("/api/properties")
      if (!allResponse.ok) {
        throw new Error("Error loading all properties")
      }
      const allResult = await allResponse.json()
      setAllProperties(allResult.data || [])

      // Filter based on current tab
      filterByTab(userResult.data || [], allResult.data || [], "disponible")
    } catch (error) {
      console.error("[v0] Error loading properties:", error)
      toast({
        title: "Error",
        description: "Error al cargar inmuebles",
        variant: "destructive",
      })
    }
  }

  const applyFilters = (properties: Property[], filters: PropertyFilters) => {
    return properties.filter((property) => {
      if (filters.operationType) {
        if (filters.operationType === "ambos" && property.operation_type !== "ambos") {
          return false
        } else if (
          filters.operationType !== "ambos" &&
          property.operation_type !== filters.operationType &&
          property.operation_type !== "ambos"
        ) {
          return false
        }
      }
      if (filters.minPrice && property.price < filters.minPrice) return false
      if (filters.maxPrice && property.price > filters.maxPrice) return false
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.minArea && property.area < filters.minArea) return false
      if (filters.maxArea && property.area > filters.maxArea) return false
      if (filters.propertyType && property.type.toLowerCase() !== filters.propertyType.toLowerCase()) return false
      if (filters.minBedrooms && property.bedrooms < filters.minBedrooms) return false
      if (filters.maxBedrooms && property.bedrooms > filters.maxBedrooms) return false
      if (filters.minBathrooms && property.bathrooms < filters.minBathrooms) return false
      if (filters.maxBathrooms && property.bathrooms > filters.maxBathrooms) return false
      return true
    })
  }

  const filterByTab = (userProps: Property[], allProps: Property[], tab: StatusTab) => {
    let baseProperties: Property[]
    if (tab === "todos-disponibles") {
      baseProperties = allProps.filter((p) => p.status === "disponible")
    } else if (tab === "todos-no-disponibles") {
      baseProperties = allProps.filter((p) => p.status === "alquilado" || p.status === "vendido")
    } else if (tab === "todos") {
      baseProperties = allProps
    } else {
      baseProperties = userProps.filter((p) => p.status === tab)
    }
    const filtered = applyFilters(baseProperties, activeFilters)
    setFilteredProperties(filtered)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    let sourceProperties: Property[]

    if (activeTab === "todos" || activeTab === "todos-disponibles" || activeTab === "todos-no-disponibles") {
      sourceProperties = allProperties
    } else {
      sourceProperties = userProperties
    }

    let filtered = sourceProperties.filter((p) => {
      let matchesTab = false

      if (activeTab === "todos-disponibles") {
        matchesTab = p.status === "disponible"
      } else if (activeTab === "todos-no-disponibles") {
        matchesTab = p.status === "alquilado" || p.status === "vendido"
      } else if (activeTab === "todos") {
        matchesTab = true
      } else {
        matchesTab = p.status === activeTab
      }

      return (
        matchesTab &&
        (p.title.toLowerCase().includes(term.toLowerCase()) ||
          p.location.toLowerCase().includes(term.toLowerCase()) ||
          p.type.toLowerCase().includes(term.toLowerCase()))
      )
    })
    filtered = applyFilters(filtered, activeFilters)
    setFilteredProperties(filtered)
  }

  const handleFilterChange = (filters: PropertyFilters) => {
    setActiveFilters(filters)
    let sourceProperties: Property[]

    if (activeTab === "todos" || activeTab === "todos-disponibles" || activeTab === "todos-no-disponibles") {
      sourceProperties = allProperties
    } else {
      sourceProperties = userProperties
    }

    let baseFiltered = sourceProperties.filter((p) => {
      if (activeTab === "todos") return true
      if (activeTab === "todos-disponibles") return p.status === "disponible"
      if (activeTab === "todos-no-disponibles") return p.status === "alquilado" || p.status === "vendido"
      return p.status === activeTab
    })
    if (searchTerm) {
      baseFiltered = baseFiltered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    const finalFiltered = applyFilters(baseFiltered, filters)
    setFilteredProperties(finalFiltered)
  }

  const handleResetFilters = () => {
    setActiveFilters({})
    filterByTab(userProperties, allProperties, activeTab)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleStatusChange = async (propertyId: number, newStatus: "disponible" | "alquilado" | "vendido") => {
    try {
      const response = await fetch("/api/properties/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId, status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el estado")
      }

      // Update both property lists
      const updatedUserProps = userProperties.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      const updatedAllProps = allProperties.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))

      setUserProperties(updatedUserProps)
      setAllProperties(updatedAllProps)

      toast({
        title: "Éxito",
        description: `Inmueble marcado como ${newStatus}`,
        variant: "default",
      })

      filterByTab(updatedUserProps, updatedAllProps, activeTab)
    } catch (error) {
      console.error("[v0] Status change error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el estado del inmueble",
        variant: "destructive",
      })
    }
  }

  const handleEditProperty = async (property: Property) => {
    setIsLoadingEdit(true)
    try {
      const response = await fetch(`/api/properties?propertyId=${property.id}`)
      const result = await response.json()
      if (result.success && result.data) {
        setEditingProperty(result.data)
      } else {
        setEditingProperty(property)
      }
    } catch (error) {
      console.error("[v0] Error fetching property details:", error)
      setEditingProperty(property)
    } finally {
      setIsLoadingEdit(false)
    }
  }

  const handleTogglePropertyStatus = async (property: Property) => {
    const newStatus = property.status === "disponible" ? "deshabilitado" : "disponible"
    const actionText = newStatus === "deshabilitado" ? "deshabilitar" : "habilitar"

    if (!window.confirm(`¿Estás seguro que deseas ${actionText} el inmueble "${property.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/properties?propertyId=${property.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error al ${actionText} el inmueble`)
      }

      toast({
        title: "Éxito",
        description: `Inmueble ${newStatus === "deshabilitado" ? "deshabilitado" : "habilitado"} exitosamente`,
        variant: "default",
      })

      loadProperties(user?.id)
    } catch (error) {
      console.error("[v0] Toggle property status error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Error al ${actionText} el inmueble`,
        variant: "destructive",
      })
    }
  }

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab)
    filterByTab(userProperties, allProperties, tab)
  }

  const handleCopyLink = async (propertyId: number) => {
    const url = `${window.location.origin}/propiedades/${propertyId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(propertyId)
      toast({
        title: "Enlace copiado",
        description: "El enlace del inmueble se ha copiado al portapapeles",
      })
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <PremiumSidebar
        items={navItems}
        onLogout={handleLogout}
        userName={user?.name}
        userRole="GERENCIA"
        userImage={user?.avatar_url}
        onCollapsedChange={setSidebarCollapsed}
      />

      <header
        className={cn(
          "bg-neutral-900/95 backdrop-blur border-b border-primary/20 sticky top-0 z-40 transition-all duration-500",
          sidebarCollapsed ? "ml-20" : "ml-64",
        )}
      >
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">Gestionar Inmuebles</h1>
            <p className="text-gray-400 text-sm">{user?.name}</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={18} />
            Agregar Inmueble
          </Button>
        </div>
      </header>

      <main className={cn("transition-all duration-500 px-6 py-8", sidebarCollapsed ? "ml-20" : "ml-64")}>
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
        </div>

        <AdvancedPropertyFilters onFilterChange={handleFilterChange} onReset={handleResetFilters} />

        <div className="mb-8 flex gap-4 border-b border-primary/20">
          <button
            onClick={() => handleTabChange("disponible")}
            className={cn(
              "px-6 py-3 font-semibold text-sm transition-colors relative",
              activeTab === "disponible" ? "text-primary" : "text-gray-400 hover:text-gray-200",
            )}
          >
            Disponibles
            {activeTab === "disponible" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            onClick={() => handleTabChange("alquilado")}
            className={cn(
              "px-6 py-3 font-semibold text-sm transition-colors relative",
              activeTab === "alquilado" ? "text-blue-400" : "text-gray-400 hover:text-gray-200",
            )}
          >
            Alquilados
            {activeTab === "alquilado" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
          </button>
          <button
            onClick={() => handleTabChange("vendido")}
            className={cn(
              "px-6 py-3 font-semibold text-sm transition-colors relative",
              activeTab === "vendido" ? "text-red-400" : "text-gray-400 hover:text-gray-200",
            )}
          >
            Vendidos
            {activeTab === "vendido" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400" />}
          </button>
          <button
            onClick={() => handleTabChange("todos-disponibles")}
            className={cn(
              "px-6 py-3 font-semibold text-sm transition-colors relative",
              activeTab === "todos-disponibles" ? "text-green-400" : "text-gray-400 hover:text-gray-200",
            )}
          >
            Todos Inmuebles Disponibles
            {activeTab === "todos-disponibles" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("todos-no-disponibles")}
            className={cn(
              "px-6 py-3 font-semibold text-sm transition-colors relative",
              activeTab === "todos-no-disponibles" ? "text-orange-400" : "text-gray-400 hover:text-gray-200",
            )}
          >
            Todos Inmuebles No Disponibles
            {activeTab === "todos-no-disponibles" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("todos")}
            className={cn(
              "px-6 py-3 font-semibold text-sm transition-colors relative",
              activeTab === "todos" ? "text-purple-400" : "text-gray-400 hover:text-gray-200",
            )}
          >
            Todos Los Inmuebles
            {activeTab === "todos" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-neutral-800/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-bold text-white">{property.title}</h3>
                    <p className="text-sm text-gray-400">{property.type}</p>
                    {activeTab === "todos" && property.ownerName && (
                      <p className="text-xs text-purple-400 mt-1">Por: {property.ownerName}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      property.status === "disponible"
                        ? "bg-green-500/20 text-green-400"
                        : property.status === "vendido"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-3">{property.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                  <div>
                    <span className="text-gray-500">Ubicación:</span> {property.location}
                  </div>
                  <div>
                    <span className="text-gray-500">Área:</span> {property.area} m²
                  </div>
                  <div>
                    <span className="text-gray-500">Cuartos:</span> {property.bedrooms}
                  </div>
                  <div>
                    <span className="text-gray-500">Baños:</span> {property.bathrooms}
                  </div>
                </div>

                <div className="border-t border-primary/10 pt-4 mb-4">
                  <p className="text-xl font-bold text-primary">${property.price.toLocaleString()}</p>
                </div>

                {activeTab !== "todos" && (
                  <>
                    <div className="flex gap-2 mb-3">
                      {property.status === "disponible" && (
                        <>
                          {(property.operation_type === "venta" || property.operation_type === "ambos") && (
                            <Button
                              onClick={() => handleStatusChange(property.id, "vendido")}
                              className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-sm"
                            >
                              Marcar Vendido
                            </Button>
                          )}
                          {(property.operation_type === "alquiler" || property.operation_type === "ambos") && (
                            <Button
                              onClick={() => handleStatusChange(property.id, "alquilado")}
                              className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-sm"
                            >
                              Marcar Alquilado
                            </Button>
                          )}
                        </>
                      )}
                      {(property.status === "alquilado" || property.status === "vendido") && (
                        <Button
                          onClick={() => handleStatusChange(property.id, "disponible")}
                          className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 text-sm"
                        >
                          Regresar a Disponible
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/propiedades/${property.id}`)}
                        className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2"
                      >
                        <Eye size={16} />
                        Ver Detalles
                      </Button>
                      <Button
                        onClick={() => handleCopyLink(property.id)}
                        className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 px-3"
                        title="Copiar enlace"
                      >
                        {copiedId === property.id ? <Check size={16} /> : <Link2 size={16} />}
                      </Button>
                      {(activeTab === "disponible" ||
                        activeTab === "alquilado" ||
                        activeTab === "vendido" ||
                        property.owner_id === user?.id) && (
                        <>
                          <Button
                            onClick={() => handleEditProperty(property)}
                            className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2"
                          >
                            <Edit2 size={16} />
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleTogglePropertyStatus(property)}
                            className={`flex-1 ${
                              property.status === "deshabilitado"
                                ? "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30"
                                : "bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30"
                            } gap-2`}
                          >
                            {property.status === "deshabilitado" ? (
                              <>
                                <Power size={16} />
                                Habilitar
                              </>
                            ) : (
                              <>
                                <PowerOff size={16} />
                                Deshabilitar
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "todos" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/propiedades/${property.id}`)}
                      className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2"
                    >
                      <Eye size={16} />
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={() => handleCopyLink(property.id)}
                      className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 px-3"
                      title="Copiar enlace"
                    >
                      {copiedId === property.id ? <Check size={16} /> : <Link2 size={16} />}
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                {activeTab === "disponible" && "No hay inmuebles disponibles"}
                {activeTab === "alquilado" && "No hay inmuebles alquilados"}
                {activeTab === "vendido" && "No hay inmuebles vendidos"}
                {activeTab === "todos-disponibles" && "No hay inmuebles disponibles en el sistema"}
                {activeTab === "todos-no-disponibles" && "No hay inmuebles no disponibles en el sistema"}
                {activeTab === "todos" && "No hay inmuebles en el sistema"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add Property Form Modal */}
      {showAddForm && (
        <AddPropertyForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => loadProperties(user?.id)}
          userId={user?.id}
        />
      )}

      {/* Edit Property Form Modal */}
      {editingProperty && (
        <AddPropertyForm
          onClose={() => setEditingProperty(null)}
          onSuccess={() => {
            setEditingProperty(null)
            loadProperties(user?.id)
          }}
          userId={user?.id}
          property={editingProperty}
        />
      )}

      {isLoadingEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-neutral-800 p-6 rounded-lg">
            <p className="text-white">Cargando datos del inmueble...</p>
          </div>
        </div>
      )}
    </div>
  )
}
