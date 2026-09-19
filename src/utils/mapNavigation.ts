import { locations, type MapLocation } from '../data/locations'

export const MAP_FOCUS_EVENT = 'oot:focus-map-location'

const aliases: Record<string, string[]> = {
  'hyrule-field': ['campo de hyrule', 'hyrule field'],
  market: ['cidade do castelo', 'mercado de hyrule', 'mercado', 'castle town', 'market'],
  'hyrule-castle': ['castelo de hyrule', 'hyrule castle'],
  'temple-time': ['templo do tempo', 'temple of time'],
  'lon-lon': ['rancho lon lon', 'lon lon ranch', 'rancho'],
  kokiri: ['floresta kokiri', 'kokiri forest'],
  'deku-tree': ['interior da grande árvore deku', 'grande árvore deku', 'great deku tree', 'inside the deku tree'],
  'lost-woods': ['bosques perdidos', 'lost woods', 'bosque sagrado', 'sacred forest meadow'],
  'forest-temple': ['templo da floresta', 'forest temple'],
  kakariko: ['vila kakariko', 'kakariko village', 'kakariko'],
  graveyard: ['cemitério de kakariko', 'cemitério', 'kakariko graveyard', 'graveyard'],
  'death-mountain': ['montanha da morte', 'death mountain', 'trilha da montanha da morte', 'death mountain trail', 'cratera da montanha da morte', 'death mountain crater'],
  'goron-city': ['cidade goron', 'goron city'],
  dodongo: ['caverna dos dodongos', "dodongo's cavern", 'dodongo cavern'],
  'fire-temple': ['templo do fogo', 'fire temple'],
  'zora-river': ['rio zora', "zora's river", 'zora river'],
  'zora-domain': ['domínio zora', "zora's domain", 'zora domain'],
  'zora-fountain': ['fonte zora', "zora's fountain", 'zora fountain', 'caverna de gelo', 'ice cavern'],
  jabu: ['interior de jabu-jabu', 'jabu-jabu', "inside jabu-jabu's belly", "jabu-jabu's belly"],
  'lake-hylia': ['lago hylia', 'lake hylia', 'fishing pond', 'laboratório do lago hylia', 'lakeside laboratory'],
  'water-temple': ['templo da água', 'water temple'],
  'gerudo-valley': ['vale gerudo', 'gerudo valley'],
  'gerudo-fortress': ['fortaleza gerudo', 'gerudo fortress'],
  'haunted-wasteland': ['deserto assombrado', 'haunted wasteland'],
  'desert-colossus': ['colosso do deserto', 'desert colossus'],
  'spirit-temple': ['templo do espírito', 'spirit temple'],
  'shadow-temple': ['templo das sombras', 'shadow temple'],
  'ganon-castle': ['castelo de ganon', "ganon's castle", 'ganon castle'],
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')

export function findMapLocationsByText(text: string): MapLocation[] {
  const normalized = normalize(text)
  const matches: MapLocation[] = []

  for (const location of locations) {
    const terms = [location.name, ...(aliases[location.id] ?? [])]
    if (terms.some(term => normalized.includes(normalize(term)))) {
      matches.push(location)
    }
  }

  return matches
}

export function focusMapLocation(locationId: string, skulltulaId?: string) {
  document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  window.setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent<{ locationId: string; skulltulaId?: string }>(MAP_FOCUS_EVENT, {
        detail: { locationId, skulltulaId },
      }),
    )
  }, 220)
}
