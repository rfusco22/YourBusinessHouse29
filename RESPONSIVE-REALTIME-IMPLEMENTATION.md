# Guía de Implementación: Diseño Responsive + Actualizaciones en Vivo

## Resumen

Se ha implementado una infraestructura completa para:
- **Actualizaciones en vivo**: Datos que se actualizan automáticamente cada 5 segundos sin recargar la página
- **Diseño responsive**: Optimizado para móvil, tablet y desktop
- **Mejor UX**: Componentes reutilizables y modernas

## Componentes Creados

### 1. Hooks para Actualizaciones en Vivo

#### `hooks/use-live-data.ts`
Hook genérico para obtener datos con polling automático.

\`\`\`tsx
import { useLiveData } from '@/hooks/use-live-data'

const { data, loading, error, refetch } = useLiveData({
  endpoint: '/api/tu-endpoint',
  interval: 5000, // Actualizar cada 5 segundos
  shouldFetch: true
})
\`\`\`

#### `hooks/use-live-properties.ts`
Hook especializado para propiedades.

\`\`\`tsx
import { useLiveProperties } from '@/hooks/use-live-properties'

const { properties, total, loading, error, refetch } = useLiveProperties({
  userId: 123,
  status: 'disponible',
  interval: 5000
})
\`\`\`

#### `hooks/use-live-stats.ts`
Hook especializado para estadísticas.

\`\`\`tsx
import { useLiveStats } from '@/hooks/use-live-stats'

const { stats, loading, error, refetch } = useLiveStats({
  endpoint: '/api/admin/dashboard/stats',
  interval: 5000
})
\`\`\`

## Páginas Actualizadas

### 1. ✅ Home Page (`app/page.tsx`)
- **Featured Properties**: Ahora muestra propiedades con actualizaciones en vivo
- **Hero Section**: Completamente responsive para móvil

### 2. ✅ Admin Dashboard (`app/admin/dashboard/page.tsx`)
- **Stats Cards**: Responsive grid (2 cols en móvil, 5 en desktop)
- **Live Updates**: Se actualizan cada 5 segundos
- **Charts**: Responsive y con scroll en móvil

### 3. ✅ Admin Properties (`app/admin/inmuebles/page.tsx`)
- **PropertyCardAdmin**: Componente responsivo reutilizable
- **Tabs**: Con scroll horizontal en móvil
- **Grid**: 1 col móvil, 2 cols tablet, 3 cols desktop
- **Live Updates**: Propiedades se actualizan en tiempo real

## Cómo Aplicar a Otras Páginas

### Para páginas de Asesor (`app/asesor/*`)

1. Reemplaza `useEffect` + `useState` con el hook correspondiente:

\`\`\`tsx
// ANTES
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('/api/asesor/inmuebles')
    setProperties(await res.json())
  }
  fetchData()
}, [])

// DESPUÉS
const { properties, loading, error, refetch } = useLiveProperties({
  userId: user?.id,
  interval: 5000
})
\`\`\`

2. Actualiza el layout a clases responsive:
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Padding: `p-4 sm:p-6`
- Text: `text-sm sm:text-base lg:text-lg`

3. Usa el componente `PropertyCardAdmin` o crea uno similar.

### Para páginas de Gerencia (`app/gerencia/*`)

Aplica el mismo patrón que para Asesor. Los hooks funcionan de la misma manera.

### Ejemplo Completo para Asesor Dashboard

\`\`\`tsx
'use client'

import { useEffect, useState } from 'react'
import { useLiveStats } from '@/hooks/use-live-stats'

export default function AsesorDashboard() {
  const [user, setUser] = useState(null)
  
  const { stats, loading } = useLiveStats({
    endpoint: '/api/asesor/dashboard/stats',
    interval: 5000
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      {/* Grid responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {/* Cards */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-6">
          <p className="text-2xl sm:text-4xl font-bold">
            {loading ? '...' : stats.totalVisitas || 0}
          </p>
        </div>
      </div>
    </div>
  )
}
\`\`\`

## Clases Tailwind Clave

### Responsive Padding
\`\`\`
p-3 sm:p-6       // padding: 12px móvil, 24px desktop
px-4 sm:px-6     // horizontal padding
py-2 sm:py-3     // vertical padding
\`\`\`

### Responsive Text
\`\`\`
text-sm sm:text-base lg:text-lg    // font sizes
text-xs sm:text-sm                 // smaller sizes
\`\`\`

### Responsive Grid
\`\`\`
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3    // columns
gap-2 sm:gap-4 lg:gap-6                      // spacing
\`\`\`

### Responsive Icons
\`\`\`tsx
<IconName size={14} className="sm:block hidden" />  // Hidden en móvil
<IconName size={16} className="sm:hidden" />        // Hidden en desktop
\`\`\`

### Responsive Sidebar Margin
\`\`\`
ml-16 sm:ml-20                    // sin sidebar colapsado
ml-16 sm:ml-64                    // con sidebar expandido
\`\`\`

## Configuración de Polling

El intervalo default es **5 segundos**. Puedes personalizarlo:

\`\`\`tsx
// Actualizar cada 10 segundos
const { properties, loading } = useLiveProperties({
  interval: 10000
})

// Actualizar cada 3 segundos
const { stats, loading } = useLiveStats({
  endpoint: '/api/stats',
  interval: 3000
})

// Desactivar polling
const { data, loading } = useLiveData({
  endpoint: '/api/data',
  shouldFetch: false  // No fetch hasta que cambies a true
})
\`\`\`

## Beneficios de Esta Implementación

✅ **Sin recargas de página** - Datos actualizados automáticamente
✅ **Responsive automático** - Funciona en cualquier tamaño de pantalla
✅ **Reutilizable** - Componentes y hooks listos para usar
✅ **Escalable** - Fácil agregar a nuevas páginas
✅ **Performante** - Polling eficiente cada 5 segundos
✅ **Accesible** - Clases Tailwind semánticas

## Próximos Pasos

1. Aplica `useLiveProperties` a `app/asesor/inmuebles/page.tsx`
2. Aplica `useLiveStats` a `app/asesor/dashboard/page.tsx`
3. Repite el patrón para todas las páginas de `app/gerencia/*`
4. Prueba en dispositivos reales (móvil, tablet, desktop)
5. Ajusta el intervalo de polling si es necesario

## Troubleshooting

**P: Las actualizaciones son muy lentas**
R: Reduce el intervalo: `interval: 3000` (3 segundos)

**P: ¿Afecta el rendimiento?**
R: No, los endpoints se cachean. Revisa que tus APIs sean eficientes.

**P: ¿Cómo deshabilitar polling temporalmente?**
R: Usa `shouldFetch: false` o usa el `refetch` manual cuando lo necesites.

**P: ¿Funciona en background tabs?**
R: Sí, pero considera agregar un visibility listener si lo necesitas.
