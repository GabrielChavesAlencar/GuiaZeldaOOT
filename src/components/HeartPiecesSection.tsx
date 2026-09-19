import { Check, Compass, Heart, MapPinned, Search, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { heartPieceSummary, type HeartPieceEntry, type HeartPieceKind } from '../data/heartPieces'
import { locations } from '../data/locations'

type Props = {
  entries: HeartPieceEntry[]
  completed: string[]
  onToggleComplete: (id: string) => void
  onOpenEntry: (entry: HeartPieceEntry) => void
  onFocusLocation: (locationId: string, skulltulaId?: string, heartPieceId?: string) => void
}

export default function HeartPiecesSection({ entries, completed, onToggleComplete, onOpenEntry, onFocusLocation }: Props) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'Todos' | HeartPieceKind>('Todos')
  const [era, setEra] = useState<'Todas' | 'Criança' | 'Adulto' | 'Ambas'>('Todas')
  const [area, setArea] = useState('Todas')

  const areas = useMemo(() => ['Todas', ...Array.from(new Set(entries.map(entry => entry.area))).sort((a, b) => a.localeCompare(b, 'pt-BR'))], [entries])
  const kinds: Array<'Todos' | HeartPieceKind> = ['Todos', 'Exploração', 'Minijogo', 'Segredo', 'Puzzle', 'Subquest', 'Interação', 'Colecionável', 'Magic Bean']

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return entries.filter(entry => {
      const matchesKind = kind === 'Todos' || entry.kind === kind
      const matchesEra = era === 'Todas' || entry.era === era || (era !== 'Ambas' && entry.era === 'Ambas')
      const matchesArea = area === 'Todas' || entry.area === area
      const haystack = `${entry.number} ${entry.area} ${entry.condition} ${entry.description}`.toLocaleLowerCase('pt-BR')
      return matchesKind && matchesEra && matchesArea && (!normalized || haystack.includes(normalized))
    })
  }, [area, entries, era, kind, query])

  const completion = Math.round((completed.length / entries.length) * 100)
  const fullContainers = Math.floor(completed.length / heartPieceSummary.perContainer)

  return (
    <section id="heart-pieces" className="heart-pieces-section">
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">COLECIONÁVEL</span>
          <h2>Todos os Pedaços de Coração</h2>
          <p>
            Ocarina of Time possui 36 Pieces of Heart. A cada quatro coletados, Link ganha um Heart Container completo;
            encontrar todos os 36 rende nove corações extras.
          </p>
        </div>
        <div className="heart-progress-card glass-panel">
          <div className="heart-progress-top"><Heart size={19} /><strong>{completed.length}/{entries.length}</strong><span>{completion}%</span></div>
          <div className="progress-track"><i style={{ width: `${completion}%` }} /></div>
          <small>{fullContainers} de {heartPieceSummary.totalContainers} Heart Containers montados</small>
        </div>
      </div>

      <div className="heart-stat-grid">
        <article><Heart size={22} /><b>36</b><span>Pieces of Heart</span></article>
        <article><Heart size={22} /><b>4</b><span>peças por coração</span></article>
        <article><Heart size={22} /><b>9</b><span>Heart Containers extras</span></article>
        <article><ShieldCheck size={22} /><b>20</b><span>corações máximos com bosses</span></article>
      </div>

      <div className="directory-toolbar glass-panel heart-toolbar">
        <label className="directory-search">
          <Search size={18} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por número, área, requisito..." />
        </label>
        <div className="directory-chips">
          {kinds.map(item => <button key={item} className={kind === item ? 'chip active' : 'chip'} onClick={() => setKind(item)}>{item}</button>)}
        </div>
        <select className="heart-filter-select" value={era} onChange={event => setEra(event.target.value as typeof era)}>
          <option value="Todas">Todas as eras</option>
          <option value="Criança">Criança</option>
          <option value="Adulto">Adulto</option>
          <option value="Ambas">Ambas</option>
        </select>
        <select className="heart-filter-select" value={area} onChange={event => setArea(event.target.value)}>
          {areas.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      <div className="directory-summary">
        <span>Exibindo <b>{filtered.length}</b> de <b>{entries.length}</b> Pedaços de Coração.</span>
        <span>Os marcadores vermelhos do minimapa correspondem aos cards visíveis.</span>
      </div>

      <div className="heart-pieces-layout">
        <aside className="heart-minimap-panel glass-panel">
          <div className="skulltula-minimap-head">
            <div><span className="eyebrow">MINIMAPA GERAL</span><h3>Onde estão os corações</h3></div>
            <MapPinned size={20} />
          </div>
          <div className="heart-minimap-wrap">
            <img src="/hyrule-map.png" alt="Minimapa geral de Hyrule com os Pedaços de Coração" />
            {filtered.map(entry => (
              <button
                key={entry.id}
                className={completed.includes(entry.id) ? 'heart-mini-marker collected' : 'heart-mini-marker'}
                style={{ left: `${entry.miniX}%`, top: `${entry.miniY}%` }}
                onClick={() => onOpenEntry(entry)}
                title={`Piece of Heart #${entry.number} — ${entry.area}`}
                aria-label={`Abrir Pedaço de Coração ${entry.number}`}
              ><Heart size={10} fill="currentColor" /></button>
            ))}
          </div>
          <div className="skulltula-minimap-note"><ShieldCheck size={16} /><span>Marcadores apagados indicam peças já marcadas como coletadas.</span></div>
        </aside>

        <div className="heart-piece-grid">
          {filtered.map(entry => {
            const parentLocation = locations.find(location => location.id === entry.parentLocationId)
            const isDone = completed.includes(entry.id)
            return (
              <article key={entry.id} className={isDone ? 'heart-piece-card collected' : 'heart-piece-card'} onClick={() => onOpenEntry(entry)}>
                <div className="heart-piece-number"><Heart size={21} fill="currentColor" /><span>#{String(entry.number).padStart(2, '0')}</span></div>
                <div className="heart-piece-card-body">
                  <div className="entity-tags"><span>{entry.area}</span><span>{entry.kind}</span><span>{entry.era}</span></div>
                  <h3>{entry.description}</h3>
                  <p>{entry.condition}</p>
                  <div className="heart-piece-card-actions">
                    <button type="button" className={isDone ? 'heart-inline-action collected' : 'heart-inline-action'} onClick={event => { event.stopPropagation(); onToggleComplete(entry.id) }}>
                      <Check size={15} /> {isDone ? 'Coletado' : 'Marcar coletado'}
                    </button>
                    {parentLocation && (
                      <button type="button" className="heart-inline-action ghost" onClick={event => { event.stopPropagation(); onFocusLocation(parentLocation.id, undefined, entry.id) }}>
                        <Compass size={15} /> Ir ao mapa
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
          {!filtered.length && <div className="directory-empty">Nenhum Pedaço de Coração encontrado para os filtros atuais.</div>}
        </div>
      </div>
    </section>
  )
}
