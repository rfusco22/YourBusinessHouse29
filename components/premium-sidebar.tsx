"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  onClick?: () => void
}

interface PremiumSidebarProps {
  items: NavItem[]
  onLogout: () => void
  userName?: string
  userRole?: string
  userImage?: string
  onCollapsedChange?: (isCollapsed: boolean) => void
}

export function PremiumSidebar({
  items,
  onLogout,
  userName,
  userRole,
  userImage,
  onCollapsedChange,
}: PremiumSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isMobile || window.innerWidth < 1024) {
      setIsCollapsed(true)
    }
  }, [isMobile])

  useEffect(() => {
    onCollapsedChange?.(isCollapsed)
  }, [isCollapsed, onCollapsedChange])

  if (!mounted) return null

  const isActive = (path: string) => pathname === path

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black border-r border-primary/10 transition-all duration-500 ease-out z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex flex-col items-center justify-center gap-3 p-4 border-b border-primary/10">
        {/* User Photo/Avatar - Always visible */}
        <div className="flex items-center justify-between w-full gap-2">
          {/* User Photo/Avatar */}
          <div className="flex items-center justify-center flex-shrink-0">
            {userImage ? (
              <img
                src={userImage || "/placeholder.svg"}
                alt={userName || "User"}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary/30 flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(userName)}
              </div>
            )}
          </div>

          {/* User Info - Role and Name - Only when expanded */}
          {!isCollapsed && (
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{userRole || "Panel"}</p>
              {userName && <p className="text-xs text-gray-400 truncate">{userName}</p>}
            </div>
          )}

          {/* Toggle Button - Always on the right */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-primary/10 rounded-md transition-colors duration-200 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight size={18} className="text-primary" />
            ) : (
              <ChevronLeft size={18} className="text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2 scrollbar-hide">
        {items.map((item) => {
          const active = isActive(item.path)
          const isDashboard = item.label === "Dashboard"

          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => {
                  if (item.onClick) {
                    item.onClick()
                  } else {
                    router.push(item.path)
                  }
                }}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group",
                  active && isDashboard
                    ? "bg-gradient-to-r from-primary/40 to-primary/20 border-2 border-primary/60 text-white shadow-lg shadow-primary/20"
                    : active
                      ? "bg-gradient-to-r from-primary/25 to-primary/10 border border-primary/40 text-white"
                      : "text-gray-300 hover:text-white border border-transparent hover:border-primary/30",
                )}
              >
                {/* Background animation on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300",
                    hoveredItem === item.path && !active ? "opacity-100" : "opacity-0",
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 transition-all duration-300 transform group-hover:scale-110",
                    active ? "text-primary" : "text-gray-400 group-hover:text-primary",
                  )}
                >
                  {item.icon}
                </div>

                {/* Label - Only when not collapsed */}
                {!isCollapsed && (
                  <span className="relative z-10 text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}

                {/* Active indicator - left border animation */}
                {active && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary via-primary to-primary/50 rounded-r-full animate-pulse" />
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-neutral-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-primary/20 shadow-lg z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-800" />
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-primary/10 p-3">
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 group",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut size={18} className="transition-transform group-hover:scale-110" />
          {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  )
}
