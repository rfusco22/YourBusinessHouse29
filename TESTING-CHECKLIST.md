# Checklist de Testing - Diseño Responsive + Actualizaciones en Vivo

## Antes de Publicar

Prueba tu aplicación en estos dispositivos y navegadores:

### Mobile (375px - 425px)
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro (393px)
- [ ] Samsung S20 (360px)
- [ ] Pixel 4 (412px)

### Tablet (768px - 1024px)
- [ ] iPad Mini (768px)
- [ ] iPad Air (820px)
- [ ] iPad Pro 11" (834px)
- [ ] iPad Pro 12.9" (1024px)

### Desktop (1024px+)
- [ ] 1366x768 (laptop común)
- [ ] 1920x1080 (Full HD)
- [ ] 2560x1440 (4K)

---

## Páginas Públicas

### Home (`/`)
- [ ] **Hero Section**
  - [ ] Texto responsive (ajusta tamaño)
  - [ ] Formulario de búsqueda funcional
  - [ ] Botones tocables en móvil (mín. 44x44px)
  - [ ] Imagen de fondo se carga correctamente

- [ ] **Featured Properties**
  - [ ] Grid: 1 col móvil, 2 cols tablet, 3 cols desktop
  - [ ] Tarjetas no se cortan o superponen
  - [ ] Imágenes se cargan bien
  - [ ] Botones accesibles en móvil
  - [ ] Los datos se actualizan sin recargar página

- [ ] **Header**
  - [ ] Logo visible en móvil
  - [ ] Menú mobile se abre/cierra
  - [ ] Links funcionales
  - [ ] Icons de redes sociales visibles

---

## Páginas Admin (`/admin/*`)

### Admin Dashboard (`/admin/dashboard`)
- [ ] **Stats Cards**
  - [ ] Móvil: 2 columnas
  - [ ] Tablet: 2-3 columnas
  - [ ] Desktop: 5 columnas
  - [ ] Valores se actualizan en vivo (cada 5s)
  - [ ] No hay overflow o corte de texto

- [ ] **Alerts Section**
  - [ ] Alerta visible completamente
  - [ ] Scroll funcionando si hay muchas
  - [ ] Responsive padding

- [ ] **Activity Chart**
  - [ ] Gráfico es readable en móvil
  - [ ] Scroll horizontal si es necesario
  - [ ] Leyenda visible

### Admin Properties (`/admin/inmuebles`)
- [ ] **Search Bar**
  - [ ] Funciona en móvil
  - [ ] Icon visible
  - [ ] Placeholder claro

- [ ] **Tabs**
  - [ ] Scroll horizontal en móvil
  - [ ] Tabs seleccionado destacado
  - [ ] No hay overflow

- [ ] **Property Cards**
  - [ ] Información completa y readable
  - [ ] Botones accesibles (tamaño mínimo)
  - [ ] Status badge visible
  - [ ] Precio legible
  - [ ] Descripción truncada correctamente

- [ ] **Action Buttons**
  - [ ] "Ver Detalles" funciona
  - [ ] "Marcar Vendido/Alquilado" funciona
  - [ ] "Copiar Enlace" funciona
  - [ ] "Editar" funciona
  - [ ] Tooltips visibles en hover (si aplica)

---

## Páginas Asesor (`/asesor/*`)

### Asesor Dashboard (`/asesor/dashboard`)
- [ ] **Sidebar**
  - [ ] Se colapsa en móvil
  - [ ] Links navegables
  - [ ] Icons claros

- [ ] **Main Content**
  - [ ] Stats responsive
  - [ ] Data se actualiza en vivo
  - [ ] No hay layout breaks

### Asesor Properties (`/asesor/inmuebles`)
- [ ] **Grid Layout**
  - [ ] Cards responsive
  - [ ] No overlap en móvil
  - [ ] Gap de spacing correcto

- [ ] **Property Card**
  - [ ] Información visible
  - [ ] Botones accesibles
  - [ ] Hover effects funcionan

---

## Páginas Gerencia (`/gerencia/*`)

Aplica los mismos tests que Asesor (misma estructura)

---

## Pruebas de Actualizaciones en Vivo

### Tests de Polling

1. **Dashboard Stats**
   - [ ] Abre Admin Dashboard
   - [ ] Espera 5 segundos
   - [ ] Verifica que los números cambien (si hay cambios en BD)
   - [ ] No hay console errors

2. **Properties Updates**
   - [ ] Abre Admin Properties
   - [ ] Abre otra pestaña y crea una nueva propiedad
   - [ ] Regresa a la primera pestaña
   - [ ] Verifica que la nueva propiedad aparezca sin recargar
   - [ ] Sin recargar la página

3. **Live Changes**
   - [ ] Abre dashboard en dos monitores
   - [ ] Realiza cambios en uno
   - [ ] Verifica que se refleje en el otro después de 5 segundos
   - [ ] Sin que el usuario haga nada

---

## Performance & Optimización

### Desktop
- [ ] Carga rápida (< 3 segundos)
- [ ] No hay jank o stuttering
- [ ] Transiciones smooth
- [ ] Animations fluidas

### Mobile
- [ ] Carga rápida (< 5 segundos)
- [ ] Scroll smooth
- [ ] No freeze cuando scrollea
- [ ] Botones responden rápido (< 100ms)

### Network
- [ ] Throttle 3G - ¿Funciona?
- [ ] Throttle 4G - ¿Funciona?
- [ ] Offline - ¿Hay error handling?
- [ ] Slow connection - ¿Hay loading states?

---

## Accesibilidad

- [ ] Todos los inputs tienen labels
- [ ] Contraste de color suficiente
- [ ] Links visibles y diferenciados
- [ ] Botones son 44x44px mínimo (móvil)
- [ ] Focus states claros
- [ ] Screen reader friendly
- [ ] Keyboard navigation funciona

---

## Browser Compatibility

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari (iOS)
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Desktop Browsers
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

---

## Responsiveness Breakpoints

| Dispositivo | Ancho | Breakpoint |
|-----------|-------|-----------|
| Móvil | 320-425px | Default (mobile-first) |
| Tablet | 768-1024px | `sm:` (640px) |
| Desktop | 1024px+ | `lg:` (1024px) |

Verifica que:
- [ ] Transiciones suave entre breakpoints
- [ ] No hay "dead zones"
- [ ] Layouts no saltan entre tamaños

---

## Errores Comunes a Evitar

- [ ] Overflow horizontal (revisar con `overflow-x-hidden` si es necesario)
- [ ] Imágenes que se cortan
- [ ] Texto que se trunca sin intención
- [ ] Botones que no se tocan en móvil (< 44px)
- [ ] Padding inconsistente
- [ ] Fonts muy pequeñas (< 12px en móvil)
- [ ] Colors sin suficiente contraste
- [ ] Modals que no se cierran en móvil

---

## Checklist Final Antes de Deploy

- [ ] Todas las páginas testeadas en móvil
- [ ] Todas las páginas testeadas en tablet
- [ ] Todas las páginas testeadas en desktop
- [ ] Actualizaciones en vivo funcionando (5s polling)
- [ ] No hay console errors
- [ ] No hay network errors
- [ ] Performance aceptable (Lighthouse score > 80)
- [ ] Accesibilidad funciona
- [ ] Responsive en todos los breakpoints

---

## Comandos Útiles

### Dev Tools Chrome
1. Abre DevTools (F12)
2. Presiona Ctrl+Shift+M (mobile mode)
3. Selecciona diferentes dispositivos
4. Abre la consola para ver errores

### Test Local
\`\`\`bash
npm run dev

# Accede a:
# Móvil: http://localhost:3000 (en mobile mode)
# Tablet: Resize a 768px
# Desktop: Resize a 1920px
\`\`\`

---

**Última actualización**: 12/2/2025
**Versión**: 1.0
