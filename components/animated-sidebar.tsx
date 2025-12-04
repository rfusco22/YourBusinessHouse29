"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

interface AnimatedSidebarProps {
  items: NavItem[]
  onLogout: () => void
  userName?: string
  userRole?: string
}

export function AnimatedSidebar({ items, onLogout, userName = "User", userRole = "admin" }: AnimatedSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) setIsOpen(false)
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-neutral-900 border-r border-primary/20 transition-all duration-300 ease-out z-40",
          isOpen ? "w-64" : "w-20",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-primary/20">
          {isOpen && (
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">{userRole}</p>
              <p className="text-white font-bold truncate">{userName}</p>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto p-2 hover:bg-primary/20 rounded-lg transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              size={20}
              className={cn("text-primary transition-transform duration-300", !isOpen && "rotate-180")}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          {items.map((item) => {
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setIsHovering(item.path)}
                onMouseLeave={() => setIsHovering(null)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 relative group",
                  active ? "bg-primary/20 text-primary" : "text-gray-400 hover:text-gray-300 hover:bg-neutral-800/50",
                )}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/50 rounded-r-lg" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    isHovering === item.path && !isOpen && "scale-110",
                    active && "text-primary",
                  )}
                >
                  {item.icon}
                </div>

                {/* Label */}
                {isOpen && (
                  <span
                    className={cn(
                      "flex-1 text-left font-medium transition-opacity duration-200",
                      !isOpen && "opacity-0",
                    )}
                  >
                    {item.label}
                  </span>
                )}

                {/* Hover effect indicator for collapsed state */}
                {!isOpen && isHovering === item.path && (
                  <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-neutral-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {item.label}
                    <div className="absolute right-full w-2 h-2 bg-neutral-800 transform rotate-45" />
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-primary/20 p-2">
          <button
            onClick={onLogout}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-red-500/10",
            )}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isOpen && <span className="flex-1 text-left font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}

      {/* Main content offset */}
      <div className={cn("transition-all duration-300 ease-out", isOpen ? "ml-64" : "ml-20")}>
        {/* This div should wrap the main content */}
      </div>
    </>
  )
}
