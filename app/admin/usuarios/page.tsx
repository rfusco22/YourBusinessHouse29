"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Search, Plus, AlertCircle } from "lucide-react"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { UserManagementModal } from "@/components/user-management-modal"
import { Home, Bell, BookOpen, Users, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils" // Updated import path

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  lastLogin?: string
  isActive: boolean
  image?: string
}

export default function AdminUsuarios() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))
    loadUsers()
  }, [router])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (data.status === "success") {
        setUsers(data.users)
        setFilteredUsers(data.users)
      }
    } catch (error) {
      console.error("[v0] Error loading users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase()) ||
        u.phone?.includes(term),
    )
    setFilteredUsers(filtered)
  }

  const handleSaveUser = async (newUser: AdminUser) => {
    try {
      const method = editingUser ? "PUT" : "POST"
      const response = await fetch("/api/admin/users", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        if (editingUser) {
          const updated = users.map((u) => (u.id === newUser.id ? newUser : u))
          setUsers(updated)
          setFilteredUsers(
            updated.filter(
              (u) =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
          )
        } else {
          const updated = [...users, newUser]
          setUsers(updated)
          setFilteredUsers(updated)
        }
        setEditingUser(null)
      }
    } catch (error) {
      console.error("[v0] Error saving user:", error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updated = users.filter((u) => u.id !== userId)
        setUsers(updated)
        setFilteredUsers(updated)
      }
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Inmuebles", path: "/admin/inmuebles", icon: <Home size={20} /> },
    { label: "Alertas", path: "/admin/alertas", icon: <Bell size={20} /> },
    { label: "Bitácora", path: "/admin/bitacora", icon: <BookOpen size={20} /> },
    { label: "Usuarios", path: "/admin/usuarios", icon: <Users size={20} /> },
    { label: "Permisos", path: "/admin/permisos", icon: <AlertCircle size={20} /> },
  ]

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

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
          sidebarCollapsed ? "ml-20" : "ml-64",
        )}
      >
        <div className="px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Gestionar Usuarios</h1>
              <p className="text-gray-400 text-sm">Total: {users.length} usuarios en el sistema</p>
            </div>
            <Button
              onClick={() => {
                setEditingUser(null)
                setIsModalOpen(true)
              }}
              className="bg-primary hover:bg-primary/90 text-white gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Agregar Usuario
            </Button>
          </div>
        </div>
      </header>

      <main className={cn("transition-all duration-500 p-8", sidebarCollapsed ? "ml-20" : "ml-64")}>
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-800 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">No se encontraron usuarios</div>
            <Button
              onClick={() => {
                setEditingUser(null)
                setIsModalOpen(true)
              }}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            >
              Crear primer usuario
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Foto</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Nombre</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Email</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Teléfono</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Rol</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Estado</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="border-b border-primary/10 hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={userItem.image || "/placeholder.svg"}
                        alt={userItem.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{userItem.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{userItem.email}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{userItem.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          userItem.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {userItem.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingUser(userItem)
                            setIsModalOpen(true)
                          }}
                          size="sm"
                          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(userItem.id)}
                          size="sm"
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <UserManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </div>
  )
}
