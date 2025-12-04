"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AgentCard } from "@/components/agent-card"
import { AgentsHero } from "@/components/agents-hero"

interface Agent {
  id: number
  name: string
  email: string
  phone: string
  image?: string
  role: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents")
        if (!response.ok) throw new Error("Failed to fetch agents")

        const result = await response.json()
        setAgents(result.data || [])
      } catch (error) {
        console.error("[v0] Error fetching agents:", error)
        setAgents([])
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AgentsHero />

        {/* Agents Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <div className="text-center text-muted-foreground">
              <p>Cargando agentes...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No hay agentes disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
