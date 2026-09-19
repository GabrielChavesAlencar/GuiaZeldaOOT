import { useEffect, useMemo, useState } from 'react'
import {
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Star,
  X,
} from 'lucide-react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { goldSkulltulas, type SkulltulaEntry } from '../data/goldSkulltulas'
import { locations, type LocationCategory, type MapLocation } from '../data/locations'
import { MAP_FOCUS_EVENT } from '../utils/mapNavigation'

const categories: Array<'Todos' | LocationCategory> = ['Todos', 'Cidade', 'Região', 'Masmorra', 'Templo', 'Ponto de interesse']

const markerClass: Record<LocationCategory, string> = {
  Cidade: 'marker-city',
  Região: 'marker-region',
  Masmorra: 'marker-dungeon',
  Templo: 'marker-temple',
  'Ponto de interesse': 'marker-poi',
}

type GalleryImage = {
  url: string
  title: string
}

type WikiImagePage = {
  title?: string
  imageinfo?: Array<{
    url?: string
    thumburl?: string
  }>
}

const excludedImageTerms = [
  'icon', 'logo', 'symbol', 'sprite', 'texture', 'button', 'menu', 'map', 'triforce', 'item', 'stamp', 'badge', 'font', 'wordmark',
]

function useLocationGallery(location: MapLocation | null) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!location) {
      setImages([])
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setImages([])

    const endpoint = `https://zelda.fandom.com/api.php?action=query&generator=images&titles=${encodeURIComponent(location.wikiTitle)}&gimlimit=24&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json&origin=*`

    fetch(endpoint, { signal: controller.signal })
      .then(response => response.json())
      .then((data: { query?: { pages?: Record<string, WikiImagePage> } }) => {
        const pages = Object.values(data.query?.pages ?? {})
        const candidates = pages
          .map(page => {
            const info = page.imageinfo?.[0]
            const url = info?.thumburl || info?.url
            return url && page.title ? { url, title: page.title.replace(/^File:/, '') } : null
          })
          .filter((item): item is GalleryImage => Boolean(item))
          .filter(item => {
            const normalized = item.title.toLocaleLowerCase('en-US')
            return !excludedImageTerms.some(term => normalized.includes(term))
          })
          .slice(0, 4)

        setImages(candidates)
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [location])

  return { images, loading }
}

type MapFocusBridgeProps = {
  setSelected: (location: MapLocation | null) => void
  setQuery: (value: string) => void
  setCategory: (value: 'Todos' | LocationCategory) => void
  setShowSkulltulas: (value: boolean) => void
  setSelectedSkulltula: (value: SkulltulaEntry | null) => void
  zoomToElement: (...args: any[]) => void
}

function MapFocusBridge({ setSelected, setQuery, setCategory, setShowSkulltulas, setSelectedSkulltula, zoomToElement }: MapFocusBridgeProps) {
  useEffect(() => {
    const onFocus = (event: Event) => {
      const customEvent = event as CustomEvent<{ locationId?: string; skulltulaId?: string }>
      const location = locations.find(item => item.id === customEvent.detail?.locationId)
      if (!location) return

      setQuery('')
      setCategory('Todos')
      setSelected(location)

      if (customEvent.detail?.skulltulaId) {
        setShowSkulltulas(true)
        const skulltula = goldSkulltulas.find(item => item.id === customEvent.detail?.skulltulaId) ?? null
        setSelectedSkulltula(skulltula)
      } else {
        setSelectedSkulltula(null)
      }

      window.setTimeout(() => {
        const targetId = customEvent.detail?.skulltulaId ? `map-skulltula-${customEvent.detail.skulltulaId}` : `map-location-${location.id}`
        const marker = document.getElementById(targetId) || document.getElementById(`map-location-${location.id}`)
        if (marker) zoomToElement(marker, customEvent.detail?.skulltulaId ? 3.15 : 2.7, 550)
      }, 80)
    }

    window.addEventListener(MAP_FOCUS_EVENT, onFocus)
    return () => window.removeEventListener(MAP_FOCUS_EVENT, onFocus)
  }, [setCategory, setQuery, setSelected, setSelectedSkulltula, setShowSkulltulas, zoomToElement])

  return null
}

export default function InteractiveMap() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('Todos')
  const [selected, setSelected] = useState<MapLocation | null>(null)
  const [showSkulltulas, setShowSkulltulas] = useState(false)
  const [selectedSkulltula, setSelectedSkulltula] = useState<SkulltulaEntry | null>(null)
  const { images, loading } = useLocationGallery(selected)

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return locations.filter(location => {
      const matchesCategory = category === 'Todos' || location.category === category
      const matchesSearch = !normalized || location.name.toLocaleLowerCase('pt-BR').includes(normalized)
      return matchesCategory && matchesSearch
    })
  }, [query, category])

  const visibleSkulltulas = useMemo(() => {
    if (!showSkulltulas) return []
    if (!query.trim()) return goldSkulltulas
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return goldSkulltulas.filter(item => {
      const parent = locations.find(location => location.id === item.parentLocationId)
      const areaText = `${item.area} ${item.description} ${item.condition} ${parent?.name ?? ''}`.toLocaleLowerCase('pt-BR')
      return areaText.includes(normalized)
    })
  }, [query, showSkulltulas])

  const wikiUrl = selected
    ? `https://zelda.fandom.com/wiki/${encodeURIComponent(selected.wikiTitle.replaceAll(' ', '_'))}`
    : ''

  const relatedSkulltulas = selected
    ? goldSkulltulas.filter(item => item.parentLocationId === selected.id)
    : []

  return (
    <section className="map-section" id="mapa">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MAPA INTERATIVO</span>
          <h2>Explore Hyrule sem perder o rumo</h2>
          <p>Use zoom, arraste o mapa e selecione os pontos. Cada local exibe descrição, destaques, galeria de fotos e agora também mostra as Gold Skulltulas ligadas àquela região.</p>
        </div>
      </div>

      <div className="map-toolbar glass-panel">
        <label className="searchbox">
          <Search size={18} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar local ou Gold Skulltula..." />
        </label>
        <div className="chips" aria-label="Filtrar locais">
          {categories.map(item => (
            <button key={item} className={category === item ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <button className={showSkulltulas ? 'chip active skulltula-chip-toggle' : 'chip skulltula-chip-toggle'} onClick={() => setShowSkulltulas(value => !value)}>
          <Star size={16} /> Gold Skulltulas
        </button>
      </div>

      <div className="map-shell">
        <TransformWrapper minScale={0.85} maxScale={5} initialScale={1} centerOnInit wheel={{ step: 0.18 }} doubleClick={{ disabled: true }}>
          {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
            <>
              <MapFocusBridge
                setSelected={setSelected}
                setQuery={setQuery}
                setCategory={setCategory}
                setShowSkulltulas={setShowSkulltulas}
                setSelectedSkulltula={setSelectedSkulltula}
                zoomToElement={zoomToElement}
              />
              <div className="map-controls glass-panel">
                <button onClick={() => zoomIn()} title="Aproximar"><Plus size={18} /></button>
                <button onClick={() => zoomOut()} title="Afastar"><Minus size={18} /></button>
                <button onClick={() => resetTransform()} title="Centralizar"><RotateCcw size={18} /></button>
              </div>
              <TransformComponent wrapperClass="map-viewport" contentClass="map-transform-content">
                <div className="map-canvas">
                  <img src="/hyrule-map.png" alt="Mapa ilustrado de Hyrule usado como base do guia" draggable={false} />
                  {visible.map(location => (
                    <button
                      id={`map-location-${location.id}`}
                      key={location.id}
                      className={`map-marker ${markerClass[location.category]} ${selected?.id === location.id ? 'selected' : ''}`}
                      style={{ left: `${location.x}%`, top: `${location.y}%` }}
                      onClick={event => {
                        event.stopPropagation()
                        setSelected(location)
                        setSelectedSkulltula(null)
                      }}
                      title={location.name}
                      aria-label={`Abrir ${location.name}`}
                    >
                      <MapPin size={20} strokeWidth={2.5} />
                      <span>{location.shortName}</span>
                    </button>
                  ))}
                  {visibleSkulltulas.map(skulltula => (
                    <button
                      id={`map-skulltula-${skulltula.id}`}
                      key={skulltula.id}
                      className={`map-skulltula-marker ${selectedSkulltula?.id === skulltula.id ? 'selected' : ''}`}
                      style={{ left: `${skulltula.x}%`, top: `${skulltula.y}%` }}
                      onClick={event => {
                        event.stopPropagation()
                        setSelectedSkulltula(skulltula)
                        setSelected(locations.find(location => location.id === skulltula.parentLocationId) ?? null)
                      }}
                      title={`Gold Skulltula #${skulltula.number} — ${skulltula.area}`}
                      aria-label={`Abrir Gold Skulltula ${skulltula.number}`}
                    >
                      <Star size={12} strokeWidth={2.2} />
                      <i>{skulltula.number}</i>
                    </button>
                  ))}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        <aside className={selected ? 'map-drawer open' : 'map-drawer'} aria-live="polite">
          {selected ? (
            <>
              <button className="drawer-close" onClick={() => { setSelected(null); setSelectedSkulltula(null) }} aria-label="Fechar detalhes"><X size={20} /></button>
              <span className="drawer-type">{selected.category} · {selected.era}</span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>

              {selectedSkulltula && selectedSkulltula.parentLocationId === selected.id && (
                <div className="selected-skulltula-highlight">
                  <div>
                    <span>Gold Skulltula em foco</span>
                    <strong>#{String(selectedSkulltula.number).padStart(3, '0')}</strong>
                    <p>{selectedSkulltula.description}</p>
                  </div>
                  <small>{selectedSkulltula.condition}</small>
                </div>
              )}

              <div className="location-gallery-block">
                <div className="location-gallery-heading"><ImageIcon size={16} /><strong>Fotos do local</strong></div>
                {loading ? (
                  <div className="location-gallery loading"><span /><span /><span /></div>
                ) : images.length ? (
                  <div className="location-gallery">
                    {images.map(image => (
                      <a href={image.url} target="_blank" rel="noreferrer" key={image.url} title={image.title}>
                        <img src={image.url} alt={`${selected.name} — ${image.title}`} loading="lazy" referrerPolicy="no-referrer" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="location-gallery-empty">Nenhuma foto foi carregada para este local.</div>
                )}
              </div>

              <div className="drawer-block">
                <strong>O que conferir aqui</strong>
                <ul>{selected.highlights.map(item => <li key={item}>{item}</li>)}</ul>
              </div>

              <div className="drawer-block skulltula-drawer-block">
                <strong>Gold Skulltulas desta área</strong>
                {relatedSkulltulas.length ? (
                  <div className="drawer-skulltula-list">
                    {relatedSkulltulas.slice(0, 8).map(item => (
                      <button key={item.id} onClick={() => setSelectedSkulltula(item)} className={selectedSkulltula?.id === item.id ? 'active' : ''}>
                        <span>#{String(item.number).padStart(3, '0')}</span>
                        <small>{item.description}</small>
                      </button>
                    ))}
                    {relatedSkulltulas.length > 8 && <p className="drawer-footnote">Há mais Skulltulas nesta área. Use a seção dedicada abaixo para ver a lista completa.</p>}
                  </div>
                ) : (
                  <p className="drawer-footnote">Nenhuma Gold Skulltula foi vinculada a este pin do mapa.</p>
                )}
              </div>

              <a className="map-source-link" href={wikiUrl} target="_blank" rel="noreferrer">
                Ver mais imagens e informações <ExternalLink size={14} />
              </a>
            </>
          ) : (
            <div className="drawer-empty">
              <MapPin size={32} />
              <h3>Selecione um ponto</h3>
              <p>Os detalhes, as fotos do local e as Gold Skulltulas relacionadas aparecem aqui sem tirar você do mapa.</p>
            </div>
          )}
        </aside>
      </div>

      <div className="legend">
        <span><i className="dot marker-city" />Cidade</span>
        <span><i className="dot marker-region" />Região</span>
        <span><i className="dot marker-dungeon" />Masmorra</span>
        <span><i className="dot marker-temple" />Templo</span>
        <span><i className="dot marker-poi" />Ponto de interesse</span>
        <span><i className="dot marker-skulltula" />Gold Skulltula</span>
      </div>
    </section>
  )
}
