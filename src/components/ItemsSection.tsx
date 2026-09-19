import { Backpack, Compass, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { itemCategories, type ItemCategory, type ItemEntry } from '../data/items'

type Props = {
  entries: ItemEntry[]
  thumbnails: Record<string, string>
  onOpenItem: (item: ItemEntry) => void
}

function ItemImage({ item, fallback }: { item: ItemEntry; fallback?: string }) {
  const primary = item.imageUrl || fallback
  if (!primary) return <div className="item-image-placeholder">{item.name.slice(0, 2).toUpperCase()}</div>

  return (
    <img
      src={primary}
      alt={item.name}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={event => {
        if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback
        else event.currentTarget.style.display = 'none'
      }}
    />
  )
}

export default function ItemsSection({ entries, thumbnails, onOpenItem }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'Todos' | ItemCategory>('Todos')
  const [era, setEra] = useState<'Todas' | 'Criança' | 'Adulto'>('Todas')
  const [visual, setVisual] = useState<'Todos' | 'Remake 2026' | 'OOT 3D'>('Todos')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return entries.filter(item => {
      const matchesCategory = category === 'Todos' || item.category === category
      const matchesEra = era === 'Todas' || item.era === 'Ambas' || item.era === era
      const matchesVisual = visual === 'Todos' || item.visual === visual
      const haystack = `${item.name} ${item.description} ${item.obtainedAt} ${item.acquisition} ${item.questName}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && matchesEra && matchesVisual && (!normalized || haystack.includes(normalized))
    })
  }, [category, entries, era, query, visual])

  const remakeCount = entries.filter(item => item.visual === 'Remake 2026').length

  return (
    <section id="itens" className="items-section">
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">INVENTÁRIO E EQUIPAMENTO</span>
          <h2>Itens de Ocarina of Time</h2>
          <p>
            Catálogo de armas, equipamentos, ferramentas, magias, garrafas, máscaras, itens de quest e objetos de dungeon.
            Ao abrir um item, você vê onde conseguir, em qual parte da aventura ou side quest ele entra e pode saltar direto para o mapa.
          </p>
        </div>
        <div className="item-summary-panel glass-panel">
          <Backpack size={21} />
          <div><strong>{entries.length}</strong><span>itens catalogados</span></div>
          <div><strong>{remakeCount}</strong><span>com visual 2026 confirmado</span></div>
        </div>
      </div>

      <div className="remake-item-note">
        <Sparkles size={17} />
        <div>
          <strong>Imagens mais novas primeiro</strong>
          <p>Quando Nintendo já mostrou o item no remake, o card prioriza a captura do material oficial de 2026. Para itens ainda não revelados claramente, o guia mantém a referência de Ocarina of Time 3D até existir um visual novo confirmado.</p>
        </div>
      </div>

      <div className="directory-toolbar glass-panel item-toolbar">
        <label className="directory-search">
          <Search size={18} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar item, local ou quest..." />
        </label>
        <div className="directory-chips item-category-chips">
          {itemCategories.map(item => (
            <button key={item} className={category === item ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <select className="item-filter-select" value={era} onChange={event => setEra(event.target.value as typeof era)}>
          <option>Todas</option><option>Criança</option><option>Adulto</option>
        </select>
        <select className="item-filter-select" value={visual} onChange={event => setVisual(event.target.value as typeof visual)}>
          <option>Todos</option><option>Remake 2026</option><option>OOT 3D</option>
        </select>
      </div>

      <div className="directory-summary">
        <span>Exibindo <b>{filtered.length}</b> de <b>{entries.length}</b> itens.</span>
        <span>Filtros por categoria, era e versão visual.</span>
      </div>

      <div className="items-grid">
        {filtered.map(item => (
          <article
            key={item.id}
            className="item-card"
            role="button"
            tabIndex={0}
            onClick={() => onOpenItem(item)}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') onOpenItem(item) }}
          >
            <div className="item-card-media">
              <ItemImage item={item} fallback={thumbnails[item.pageTitle]} />
              {item.visual === 'Remake 2026' && <span className="remake-image-badge"><Sparkles size={12} /> Remake 2026</span>}
            </div>
            <div className="item-card-body">
              <div className="entity-tags"><span>{item.category}</span><span>{item.era}</span></div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="item-card-location"><Compass size={14} /><span><b>Onde conseguir</b>{item.obtainedAt}</span></div>
              <button className="item-more-button" onClick={event => { event.stopPropagation(); onOpenItem(item) }}>Ver item, local e quest</button>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && <div className="directory-empty">Nenhum item encontrado com esses filtros.</div>}
    </section>
  )
}
