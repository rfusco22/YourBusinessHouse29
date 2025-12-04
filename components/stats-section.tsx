import { Calendar, Home, BarChart3, MapPin } from "lucide-react"

const STATS = [
  {
    icon: Home,
    label: "Propiedades",
    value: "1,234",
    description: "Inmuebles disponibles",
  },
  {
    icon: Calendar,
    label: "Agregadas Este Mes",
    value: "89",
    description: "Nuevas propiedades",
  },
  {
    icon: BarChart3,
    label: "Tipos de Inmuebles",
    value: "12+",
    description: "Diferentes categorías",
  },
  {
    icon: MapPin,
    label: "Ubicaciones",
    value: "28",
    description: "Ciudades disponibles",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary rounded-lg">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
                <p className="font-semibold text-foreground mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
