import { Compass, MapPinned, Search, ShieldCheck, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { goldSkulltulaRewards, type SkulltulaEntry, type SkulltulaRegionType } from '../data/goldSkulltulas'
import { locations } from '../data/locations'

type Props = {
  entries: SkulltulaEntry[]
  onOpenEntry: (entry: SkulltulaEntry) => void
  onFocusLocation: (locationId: string, skulltulaId?: string) => void
}

export default function GoldSkulltulasSection({ entries, onOpenEntry, onFocusLocation }: Props) {
  const [query, setQuery] = useState('')
  const [regionType, setRegionType] = useState<'Todos' | SkulltulaRegionType>('Todos')
  const [area, setArea] = useState('Todas')

  const areas = useMemo(() => ['Todas', ...Array.from(new Set(entries.map(entry => entry.area))).sort((a, b) => a.localeCompare(b, 'pt-BR'))], [entries])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return entries.filter(entry => {
      const matchesType = regionType === 'Todos' || entry.regionType === regionType
      const matchesArea = area === 'Todas' || entry.area === area
      const haystack = `${entry.number} ${entry.area} ${entry.condition} ${entry.description}`.toLocaleLowerCase('pt-BR')
      const matchesQuery = !normalized || haystack.includes(normalized)
      return matchesType && matchesArea && matchesQuery
    })
  }, [area, entries, query, regionType])

  return (
    <section id="skulltulas" className="skulltulas-section">
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">COLECIONÁVEL</span>
          <h2>Mapa completo das Gold Skulltulas</h2>
          <p>
            Reuni as 100 Gold Skulltulas em uma seção dedicada, com descrição resumida, condição de coleta,
            localização no mapa principal e visualização rápida no minimapa geral de Hyrule.
          </p>
        </div>
        <div className="mini-panel glass-panel">
          <Star size={18} />
          <div>
            <strong>{entries.length} tokens</strong>
            <span>espalhados por Hyrule</span>
          </div>
        </div>
      </div>

      <div className="skulltula-rewards-grid">
        {goldSkulltulaRewards.map(reward => (
          <article key={reward.tokens} className="reward-chip-card">
            <b>{reward.tokens}</b>
            <span>tokens</span>
            <small>{reward.reward}</small>
          </article>
        ))}
      </div>

      <div className="directory-toolbar glass-panel skulltula-toolbar">
        <label className="directory-search">
          <Search size={18} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por número, área ou dica..." />
        </label>
        <div className="directory-chips" aria-label="Filtrar tipo de localização">
          {(['Todos', 'Exterior', 'Masmorra', 'Templo'] as const).map(item => (
            <button key={item} className={regionType === item ? 'chip active' : 'chip'} onClick={() => setRegionType(item)}>{item}</button>
          ))}
        </div>
        <label className="skulltula-area-select">
          <span>Área</span>
          <select value={area} onChange={event => setArea(event.target.value)}>
            {areas.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <div className="directory-summary">
        <span>Exibindo <b>{filtered.length}</b> de <b>{entries.length}</b> Gold Skulltulas.</span>
        <span>Clique em qualquer marcador do minimapa ou em qualquer card para abrir a ficha completa.</span>
      </div>

      <div className="skulltula-layout">
        <aside className="skulltula-minimap-panel glass-panel">
          <div className="skulltula-minimap-head">
            <div>
              <span className="eyebrow">MINIMAPA GERAL</span>
              <h3>Visão rápida de Hyrule</h3>
            </div>
            <MapPinned size={20} />
          </div>
          <div className="skulltula-minimap-wrap">
            <img src="/hyrule-minimap.png" alt="Minimapa geral de Hyrule" />
            {filtered.map(entry => (
              <button
                key={entry.id}
                className="skulltula-mini-marker"
                style={{ left: `${entry.miniX}%`, top: `${entry.miniY}%` }}
                onClick={() => onOpenEntry(entry)}
                title={`Gold Skulltula #${entry.number} — ${entry.area}`}
                aria-label={`Abrir Gold Skulltula ${entry.number}`}
              />
            ))}
          </div>
          <div className="skulltula-minimap-note">
            <ShieldCheck size={16} />
            <span>Os pontos foram distribuídos por área para deixar a leitura mais clara no mapa geral.</span>
          </div>
        </aside>

        <div className="skulltula-grid">
          {filtered.map(entry => {
            const parentLocation = locations.find(location => location.id === entry.parentLocationId)
            return (
              <article key={entry.id} className="skulltula-card" onClick={() => onOpenEntry(entry)}>
                <div className="skulltula-card-number">#{String(entry.number).padStart(3, '0')}</div>
                <div className="skulltula-card-body">
                  <div className="entity-tags">
                    <span>{entry.area}</span>
                    <span>{entry.regionType}</span>
                    <span>{entry.era}</span>
                  </div>
                  <h3>{entry.description}</h3>
                  <p>{entry.condition}</p>
                  <div className="skulltula-card-actions">
                    <button
                      type="button"
                      className="skulltula-inline-action"
                      onClick={event => {
                        event.stopPropagation()
                        onOpenEntry(entry)
                      }}
                    >
                      <Star size={15} /> Ver ficha
                    </button>
                    {parentLocation && (
                      <button
                        type="button"
                        className="skulltula-inline-action ghost"
                        onClick={event => {
                          event.stopPropagation()
                          onFocusLocation(parentLocation.id, entry.id)
                        }}
                      >
                        <Compass size={15} /> Ir ao mapa
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
          {!filtered.length && <div className="directory-empty">Nenhuma Gold Skulltula encontrada para o filtro atual.</div>}
        </div>
      </div>
    </section>
  )
}
