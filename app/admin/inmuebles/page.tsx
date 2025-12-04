"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Search, AlertCircle } from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { Home, Bell, BookOpen, Users, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import AddPropertyForm from "@/components/add-property-form"
import { AdvancedPropertyFilters, type PropertyFilters } from "@/components/advanced-property-filters"
import PropertyCardAdmin from "@/components/property-card-admin"
import { useLiveProperties } from "@/hooks/use-live-properties"
import { loadProperties } from "@/utils/loadProperties"

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
  operation_type?: string
}

type StatusTab = "disponible" | "alquilado" | "vendido" | "todos-disponibles" | "todos-no-disponibles" | "todos"

export default function InmueblesAdmin() {
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
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Inmuebles",
      path: "/admin/inmuebles",
      icon: <Home size={20} />,
    },
    {
      label: "Alertas",
      path: "/admin/alertas",
      icon: <Bell size={20} />,
    },
    {
      label: "Bitácora",
      path: "/admin/bitacora",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Usuarios",
      path: "/admin/usuarios",
      icon: <Users size={20} />,
    },
    {
      label: "Permisos",
      path: "/admin/permisos",
      icon: <AlertCircle size={20} />,
    },
  ]

  const { properties: liveUserProps, loading: userPropsLoading } = useLiveProperties({
    interval: 5000,
    shouldFetch: !!user?.id,
  })

  const { properties: liveAllProps, loading: allPropsLoading } = useLiveProperties({
    interval: 5000,
    shouldFetch: true,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (liveUserProps.length > 0) {
      setUserProperties(liveUserProps)
    }
  }, [liveUserProps])

  useEffect(() => {
    if (liveAllProps.length > 0) {
      setAllProperties(liveAllProps)
      filterByTab(userProperties, liveAllProps, activeTab)
    }
  }, [liveAllProps])

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

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab)
    filterByTab(userProperties, allProperties, tab)
    setSearchTerm("")
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

      const { userProperties: newUserProps, allProperties: newAllProps } = await loadProperties(user?.id)
      setUserProperties(newUserProps)
      setAllProperties(newAllProps)
      filterByTab(newUserProps, newAllProps, activeTab)
    } catch (error) {
      console.error("[v0] Toggle property status error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Error al ${actionText} el inmueble`,
        variant: "destructive",
      })
    }
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

  if (isLoading || userPropsLoading || allPropsLoading)
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <PremiumSidebar
        items={navItems}
        onLogout={handleLogout}
        userName={user?.name}
        userRole="ADMIN"
        userImage={user?.avatar_url}
        onCollapsedChange={setSidebarCollapsed}
      />

      <header
        className={cn(
          "bg-neutral-900/95 backdrop-blur border-b border-primary/20 sticky top-0 z-40 transition-all duration-500",
          sidebarCollapsed ? "ml-16 sm:ml-20" : "ml-16 sm:ml-64",
        )}
      >
        <div className="px-3 sm:px-6 py-4 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-heading font-bold text-white">Gestionar Inmuebles</h1>
            <p className="text-gray-400 text-xs sm:text-sm">{user?.name}</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-primary/90 gap-2 text-xs sm:text-sm flex-shrink-0"
          >
            <Plus size={16} className="sm:block hidden" />
            <Plus size={18} className="sm:hidden" />
            Agregar
          </Button>
        </div>
      </header>

      <main
        className={cn(
          "transition-all duration-500 px-3 sm:px-6 py-4 sm:py-8",
          sidebarCollapsed ? "ml-16 sm:ml-20" : "ml-16 sm:ml-64",
        )}
      >
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar inmueble..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-neutral-800 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <AdvancedPropertyFilters onFilterChange={handleFilterChange} onReset={handleResetFilters} />

        <div className="mb-6 sm:mb-8 flex gap-2 border-b border-primary/20 overflow-x-auto pb-2">
          {(["disponible", "alquilado", "vendido", "todos-disponibles", "todos-no-disponibles", "todos"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-3 sm:px-6 py-2 sm:py-3 font-semibold text-xs sm:text-sm transition-colors relative whitespace-nowrap flex-shrink-0",
                  activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-200",
                )}
              >
                {tab === "disponible" && "Disponibles"}
                {tab === "alquilado" && "Alquilados"}
                {tab === "vendido" && "Vendidos"}
                {tab === "todos-disponibles" && "Todos Disponibles"}
                {tab === "todos-no-disponibles" && "Todos No Disponibles"}
                {tab === "todos" && "Todos Los Inmuebles"}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ),
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCardAdmin
                key={property.id}
                property={property}
                activeTab={activeTab}
                onStatusChange={handleStatusChange}
                onEdit={handleEditProperty}
                onToggleStatus={handleTogglePropertyStatus}
                onCopyLink={handleCopyLink}
                onViewDetails={(id) => router.push(`/propiedades/${id}`)}
                copiedId={copiedId}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No hay propiedades para mostrar</p>
            </div>
          )}
        </div>

        {showAddForm && (
          <AddPropertyForm
            onClose={() => setShowAddForm(false)}
            onSuccess={async () => {
              setShowAddForm(false)
              const { userProperties: newUserProps, allProperties: newAllProps } = await loadProperties(user?.id)
              setUserProperties(newUserProps)
              setAllProperties(newAllProps)
              filterByTab(newUserProps, newAllProps, activeTab)
            }}
          />
        )}

        {editingProperty && !isLoadingEdit && (
          <AddPropertyForm
            property={editingProperty}
            onClose={() => setEditingProperty(null)}
            onSuccess={async () => {
              setEditingProperty(null)
              const { userProperties: newUserProps, allProperties: newAllProps } = await loadProperties(user?.id)
              setUserProperties(newUserProps)
              setAllProperties(newAllProps)
              filterByTab(newUserProps, newAllProps, activeTab)
            }}
          />
        )}
      </main>
    </div>
  )
}
