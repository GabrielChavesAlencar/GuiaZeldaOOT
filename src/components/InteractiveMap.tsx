import { useEffect, useMemo, useState } from 'react'
import {
  ExternalLink,
  Heart,
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
import { heartPieces, type HeartPieceEntry } from '../data/heartPieces'
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

type GalleryImage = { url: string; title: string }
type WikiImagePage = { title?: string; imageinfo?: Array<{ url?: string; thumburl?: string }> }

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
  setShowHeartPieces: (value: boolean) => void
  setSelectedHeartPiece: (value: HeartPieceEntry | null) => void
  zoomToElement: (...args: any[]) => void
}

function MapFocusBridge({
  setSelected,
  setQuery,
  setCategory,
  setShowSkulltulas,
  setSelectedSkulltula,
  setShowHeartPieces,
  setSelectedHeartPiece,
  zoomToElement,
}: MapFocusBridgeProps) {
  useEffect(() => {
    const onFocus = (event: Event) => {
      const customEvent = event as CustomEvent<{ locationId?: string; skulltulaId?: string; heartPieceId?: string }>
      const location = locations.find(item => item.id === customEvent.detail?.locationId)
      if (!location) return

      setQuery('')
      setCategory('Todos')
      setSelected(location)

      if (customEvent.detail?.skulltulaId) {
        setShowSkulltulas(true)
        setSelectedSkulltula(goldSkulltulas.find(item => item.id === customEvent.detail?.skulltulaId) ?? null)
      } else {
        setSelectedSkulltula(null)
      }

      if (customEvent.detail?.heartPieceId) {
        setShowHeartPieces(true)
        setSelectedHeartPiece(heartPieces.find(item => item.id === customEvent.detail?.heartPieceId) ?? null)
      } else {
        setSelectedHeartPiece(null)
      }

      window.setTimeout(() => {
        const targetId = customEvent.detail?.heartPieceId
          ? `map-heart-${customEvent.detail.heartPieceId}`
          : customEvent.detail?.skulltulaId
            ? `map-skulltula-${customEvent.detail.skulltulaId}`
            : `map-location-${location.id}`
        const marker = document.getElementById(targetId) || document.getElementById(`map-location-${location.id}`)
        const detailZoom = customEvent.detail?.heartPieceId || customEvent.detail?.skulltulaId ? 3.15 : 2.7
        if (marker) zoomToElement(marker, detailZoom, 550)
      }, 80)
    }

    window.addEventListener(MAP_FOCUS_EVENT, onFocus)
    return () => window.removeEventListener(MAP_FOCUS_EVENT, onFocus)
  }, [setCategory, setQuery, setSelected, setSelectedHeartPiece, setSelectedSkulltula, setShowHeartPieces, setShowSkulltulas, zoomToElement])

  return null
}

export default function InteractiveMap() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('Todos')
  const [selected, setSelected] = useState<MapLocation | null>(null)
  const [showSkulltulas, setShowSkulltulas] = useState(false)
  const [selectedSkulltula, setSelectedSkulltula] = useState<SkulltulaEntry | null>(null)
  const [showHeartPieces, setShowHeartPieces] = useState(false)
  const [selectedHeartPiece, setSelectedHeartPiece] = useState<HeartPieceEntry | null>(null)
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
    return goldSkulltulas.filter(item => `${item.area} ${item.description} ${item.condition}`.toLocaleLowerCase('pt-BR').includes(normalized))
  }, [query, showSkulltulas])

  const visibleHeartPieces = useMemo(() => {
    if (!showHeartPieces) return []
    if (!query.trim()) return heartPieces
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return heartPieces.filter(item => `${item.area} ${item.description} ${item.condition}`.toLocaleLowerCase('pt-BR').includes(normalized))
  }, [query, showHeartPieces])

  const wikiUrl = selected ? `https://zelda.fandom.com/wiki/${encodeURIComponent(selected.wikiTitle.replaceAll(' ', '_'))}` : ''
  const relatedSkulltulas = selected ? goldSkulltulas.filter(item => item.parentLocationId === selected.id) : []
  const relatedHeartPieces = selected ? heartPieces.filter(item => item.parentLocationId === selected.id) : []

  return (
    <section className="map-section" id="mapa">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MAPA INTERATIVO</span>
          <h2>Explore Hyrule sem perder o rumo</h2>
          <p>Ative Gold Skulltulas e Pedaços de Coração separadamente. Cada local também mostra fotos, descrição e os colecionáveis vinculados à região.</p>
        </div>
      </div>

      <div className="map-toolbar glass-panel">
        <label className="searchbox">
          <Search size={18} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar local ou colecionável..." />
        </label>
        <div className="chips" aria-label="Filtrar locais">
          {categories.map(item => <button key={item} className={category === item ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="map-collectible-toggles">
          <button className={showSkulltulas ? 'chip active skulltula-chip-toggle' : 'chip skulltula-chip-toggle'} onClick={() => setShowSkulltulas(value => !value)}>
            <Star size={16} /> Skulltulas
          </button>
          <button className={showHeartPieces ? 'chip active heart-chip-toggle' : 'chip heart-chip-toggle'} onClick={() => setShowHeartPieces(value => !value)}>
            <Heart size={16} fill={showHeartPieces ? 'currentColor' : 'none'} /> Corações
          </button>
        </div>
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
                setShowHeartPieces={setShowHeartPieces}
                setSelectedHeartPiece={setSelectedHeartPiece}
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
                        setSelectedHeartPiece(null)
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
                        setSelectedHeartPiece(null)
                        setSelected(locations.find(location => location.id === skulltula.parentLocationId) ?? null)
                      }}
                      title={`Gold Skulltula #${skulltula.number} — ${skulltula.area}`}
                    >
                      <Star size={12} strokeWidth={2.2} />
                      <i>{skulltula.number}</i>
                    </button>
                  ))}

                  {visibleHeartPieces.map(piece => (
                    <button
                      id={`map-heart-${piece.id}`}
                      key={piece.id}
                      className={`map-heart-marker ${selectedHeartPiece?.id === piece.id ? 'selected' : ''}`}
                      style={{ left: `${piece.x}%`, top: `${piece.y}%` }}
                      onClick={event => {
                        event.stopPropagation()
                        setSelectedHeartPiece(piece)
                        setSelectedSkulltula(null)
                        setSelected(locations.find(location => location.id === piece.parentLocationId) ?? null)
                      }}
                      title={`Piece of Heart #${piece.number} — ${piece.area}`}
                    >
                      <Heart size={13} fill="currentColor" />
                      <i>{piece.number}</i>
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
              <button className="drawer-close" onClick={() => { setSelected(null); setSelectedSkulltula(null); setSelectedHeartPiece(null) }} aria-label="Fechar detalhes"><X size={20} /></button>
              <span className="drawer-type">{selected.category} · {selected.era}</span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>

              {selectedSkulltula && selectedSkulltula.parentLocationId === selected.id && (
                <div className="selected-skulltula-highlight">
                  <div><span>Gold Skulltula em foco</span><strong>#{String(selectedSkulltula.number).padStart(3, '0')}</strong><p>{selectedSkulltula.description}</p></div>
                  <small>{selectedSkulltula.condition}</small>
                </div>
              )}

              {selectedHeartPiece && selectedHeartPiece.parentLocationId === selected.id && (
                <div className="selected-heart-highlight">
                  <div><span>Piece of Heart em foco</span><strong>#{String(selectedHeartPiece.number).padStart(2, '0')}</strong><p>{selectedHeartPiece.description}</p></div>
                  <small>{selectedHeartPiece.condition}</small>
                </div>
              )}

              <div className="location-gallery-block">
                <div className="location-gallery-heading"><ImageIcon size={16} /><strong>Fotos do local</strong></div>
                {loading ? (
                  <div className="location-gallery loading"><span /><span /><span /></div>
                ) : images.length ? (
                  <div className="location-gallery">
                    {images.map(image => <a href={image.url} target="_blank" rel="noreferrer" key={image.url} title={image.title}><img src={image.url} alt={`${selected.name} — ${image.title}`} loading="lazy" referrerPolicy="no-referrer" /></a>)}
                  </div>
                ) : <div className="location-gallery-empty">Nenhuma foto foi carregada para este local.</div>}
              </div>

              <div className="drawer-block"><strong>O que conferir aqui</strong><ul>{selected.highlights.map(item => <li key={item}>{item}</li>)}</ul></div>

              <div className="drawer-block skulltula-drawer-block">
                <strong>Gold Skulltulas desta área</strong>
                {relatedSkulltulas.length ? (
                  <div className="drawer-skulltula-list">
                    {relatedSkulltulas.slice(0, 8).map(item => (
                      <button key={item.id} onClick={() => { setSelectedSkulltula(item); setSelectedHeartPiece(null) }} className={selectedSkulltula?.id === item.id ? 'active' : ''}>
                        <span>#{String(item.number).padStart(3, '0')}</span><small>{item.description}</small>
                      </button>
                    ))}
                    {relatedSkulltulas.length > 8 && <p className="drawer-footnote">Há mais Skulltulas nesta área. Veja a seção dedicada para a lista completa.</p>}
                  </div>
                ) : <p className="drawer-footnote">Nenhuma Gold Skulltula vinculada a este pin.</p>}
              </div>

              <div className="drawer-block heart-drawer-block">
                <strong>Pedaços de Coração desta área</strong>
                {relatedHeartPieces.length ? (
                  <div className="drawer-heart-list">
                    {relatedHeartPieces.map(item => (
                      <button key={item.id} onClick={() => { setSelectedHeartPiece(item); setSelectedSkulltula(null) }} className={selectedHeartPiece?.id === item.id ? 'active' : ''}>
                        <span>#{String(item.number).padStart(2, '0')}</span><small>{item.description}</small>
                      </button>
                    ))}
                  </div>
                ) : <p className="drawer-footnote">Nenhum Pedaço de Coração vinculado a este pin.</p>}
              </div>

              <a className="map-source-link" href={wikiUrl} target="_blank" rel="noreferrer">Ver mais imagens e informações <ExternalLink size={14} /></a>
            </>
          ) : (
            <div className="drawer-empty"><MapPin size={32} /><h3>Selecione um ponto</h3><p>Fotos, descrição, Skulltulas e Pedaços de Coração aparecem aqui sem tirar você do mapa.</p></div>
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
        <span><i className="dot marker-heart" />Pedaço de Coração</span>
      </div>
    </section>
  )
}
