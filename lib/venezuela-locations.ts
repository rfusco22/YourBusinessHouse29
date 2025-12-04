export const VENEZUELA_LOCATIONS = [
  // Distrito Capital
  "Caracas",
  "Centro, Caracas",
  "Altamira, Caracas",
  "Las Mercedes, Caracas",
  "Chacao, Caracas",
  "Baruta, Caracas",
  "El Hatillo, Caracas",

  // Aragua
  "Maracay",
  "La Victoria",
  "Turmero",
  "Cagua",
  "Barbacoas",
  "Choroní",
  "Ocumare de la Costa",

  // Carabobo
  "Valencia",
  "Puerto Cabello",
  "San Diego",
  "Morón",
  "Naguanagua",
  "Los Guayos",
  "Barloven",

  // Anzoátegui
  "Barcelona",
  "Lechería",
  "Puerto La Cruz",
  "Cantaura",
  "Pariaguán",
  "Anaco",

  // Sucre
  "Cumaná",
  "Carúpano",
  "Güiria",
  "Cariaco",
  "Araya",

  // Nueva Esparta
  "Porlamar",
  "Pampatar",
  "Juangriego",
  "El Valle del Espíritu Santo",
  "Macanao",

  // Bolívar
  "Ciudad Bolívar",
  "Ciudad Guayana",
  "San Félix",
  "Upata",
  "Tumeremo",
  "Caicara del Orinoco",

  // Amazonas
  "Puerto Ayacucho",
  "Samariapo",
  "Atabapo",

  // Apure
  "San Fernando de Apure",
  "Achaguas",
  "Guasdualito",
  "Elorza",

  // Barinas
  "Barinas",
  "Barinitas",
  "Socopo",
  "Arismendi",

  // Guárico
  "San Juan de los Morros",
  "Calabozo",
  "Camaguán",
  "Zaraza",
  "Ortiz",

  // Lara
  "Barquisimeto",
  "Quíbor",
  "Carora",
  "Duaca",
  "Sanare",

  // Falcón
  "Coro",
  "Punto Fijo",
  "Chichiriviche",
  "Judibana",
  "Moruy",

  // Yaracuy
  "San Felipe",
  "Yaritagua",
  "Aroa",
  "Chivacoa",

  // Carabobo
  "Puerto Cabello",
  "Valencia",
  "San Diego",

  // Miranda
  "Los Teques",
  "Guarenas",
  "Guatire",
  "Cúa",
  "Carrizal",
  "Ocumare del Tuy",
  "Río Chico",

  // Mérida
  "Mérida",
  "Ejido",
  "Tabay",
  "La Azulita",
  "Jajó",

  // Tachira
  "San Cristóbal",
  "La Fría",
  "Rubio",
  "San Antonio del Táchira",
  "El Tigre",

  // Zulia
  "Maracaibo",
  "Ciudad de Ojeda",
  "Cabimas",
  "Lagunillas",
  "La Cañada de Urdaneta",
  "Santa Bárbara del Zulia",
  "Machiques",
  "Encontrados",
]

export function filterLocations(input: string): string[] {
  if (!input.trim()) return []

  const query = input.toLowerCase()
  return VENEZUELA_LOCATIONS.filter((location) => location.toLowerCase().includes(query)).slice(0, 10) // Return top 10 matches
}
