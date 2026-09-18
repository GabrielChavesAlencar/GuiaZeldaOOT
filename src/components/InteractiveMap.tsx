import { useMemo, useState } from 'react'
import { MapPin, Minus, Plus, RotateCcw, Search, X } from 'lucide-react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { locations, type LocationCategory, type MapLocation } from '../data/locations'

const categories: Array<'Todos' | LocationCategory> = ['Todos', 'Cidade', 'Região', 'Masmorra', 'Templo', 'Ponto de interesse']

const markerClass: Record<LocationCategory, string> = {
  Cidade: 'marker-city',
  Região: 'marker-region',
  Masmorra: 'marker-dungeon',
  Templo: 'marker-temple',
  'Ponto de interesse': 'marker-poi',
}

export default function InteractiveMap() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('Todos')
  const [selected, setSelected] = useState<MapLocation | null>(null)

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return locations.filter(location => {
      const matchesCategory = category === 'Todos' || location.category === category
      const matchesSearch = !normalized || location.name.toLocaleLowerCase('pt-BR').includes(normalized)
      return matchesCategory && matchesSearch
    })
  }, [query, category])

  return (
    <section className="map-section" id="mapa">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MAPA INTERATIVO</span>
          <h2>Explore Hyrule sem perder o rumo</h2>
          <p>Use zoom, arraste o mapa e selecione os pontos. A base está separada dos pins para você poder trocar pela versão final do mapa do remake depois.</p>
        </div>
      </div>

      <div className="map-toolbar glass-panel">
        <label className="searchbox">
          <Search size={18} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar local..." />
        </label>
        <div className="chips" aria-label="Filtrar locais">
          {categories.map(item => <button key={item} className={category === item ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </div>

      <div className="map-shell">
        <TransformWrapper minScale={0.85} maxScale={5} initialScale={1} centerOnInit wheel={{ step: 0.18 }} doubleClick={{ disabled: true }}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="map-controls glass-panel">
                <button onClick={() => zoomIn()} title="Aproximar"><Plus size={18}/></button>
                <button onClick={() => zoomOut()} title="Afastar"><Minus size={18}/></button>
                <button onClick={() => resetTransform()} title="Centralizar"><RotateCcw size={18}/></button>
              </div>
              <TransformComponent wrapperClass="map-viewport" contentClass="map-transform-content">
                <div className="map-canvas">
                  <img src="/hyrule-map.png" alt="Mapa ilustrado de Hyrule usado como base do guia" draggable={false} />
                  {visible.map(location => (
                    <button
                      key={location.id}
                      className={`map-marker ${markerClass[location.category]} ${selected?.id === location.id ? 'selected' : ''}`}
                      style={{ left: `${location.x}%`, top: `${location.y}%` }}
                      onClick={(event) => { event.stopPropagation(); setSelected(location) }}
                      title={location.name}
                      aria-label={`Abrir ${location.name}`}
                    >
                      <MapPin size={20} strokeWidth={2.5}/>
                      <span>{location.shortName}</span>
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
              <button className="drawer-close" onClick={() => setSelected(null)} aria-label="Fechar detalhes"><X size={20}/></button>
              <span className="drawer-type">{selected.category} · {selected.era}</span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
              <div className="drawer-block">
                <strong>O que conferir aqui</strong>
                <ul>{selected.highlights.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
              <button className="primary-button compact" onClick={() => document.getElementById('guia')?.scrollIntoView({ behavior:'smooth' })}>Ver no guia</button>
            </>
          ) : (
            <div className="drawer-empty">
              <MapPin size={32}/>
              <h3>Selecione um ponto</h3>
              <p>Os detalhes do local aparecem aqui sem tirar você do mapa.</p>
            </div>
          )}
        </aside>
      </div>

      <div className="legend">
        <span><i className="dot marker-city"/>Cidade</span>
        <span><i className="dot marker-region"/>Região</span>
        <span><i className="dot marker-dungeon"/>Masmorra</span>
        <span><i className="dot marker-temple"/>Templo</span>
        <span><i className="dot marker-poi"/>Ponto de interesse</span>
      </div>
    </section>
  )
}
