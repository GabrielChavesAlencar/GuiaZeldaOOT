import { Backpack, Compass, ExternalLink, MapPin, ScrollText, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ItemEntry } from '../data/items'
import type { QuestEntry } from '../data/quests'
import { locations, type MapLocation } from '../data/locations'

type Props = {
  item: ItemEntry
  fallbackImage?: string
  relatedQuests: QuestEntry[]
  onClose: () => void
  onOpenQuest: (quest: QuestEntry) => void
  onFocusLocation: (locationId: string) => void
}

export default function ItemDetailModal({ item, fallbackImage, relatedQuests, onClose, onOpenQuest, onFocusLocation }: Props) {
  const [src, setSrc] = useState(item.imageUrl || fallbackImage || '')
  const [failed, setFailed] = useState(!(item.imageUrl || fallbackImage))

  useEffect(() => {
    setSrc(item.imageUrl || fallbackImage || '')
    setFailed(!(item.imageUrl || fallbackImage))
  }, [fallbackImage, item])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  const mappedLocations = item.locationIds
    .map(id => locations.find(location => location.id === id))
    .filter((location): location is MapLocation => Boolean(location))

  const zeldaDungeonUrl = `https://www.zeldadungeon.net/wiki/${encodeURIComponent(item.pageTitle.replaceAll(' ', '_'))}`
  const fandomUrl = `https://zelda.fandom.com/wiki/${encodeURIComponent(item.pageTitle.replaceAll(' ', '_'))}`

  return (
    <div className="detail-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="detail-modal item-detail-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${item.name}`}>
        <button className="detail-close" onClick={onClose} aria-label="Fechar"><X size={21} /></button>

        <div className="item-detail-hero">
          <div className="item-detail-image">
            {!failed && src ? (
              <img
                src={src}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage)
                  else setFailed(true)
                }}
              />
            ) : <div className="entity-placeholder">{item.name.slice(0, 2).toUpperCase()}</div>}
          </div>
          <div className="item-detail-title">
            <span className="eyebrow"><Backpack size={14} /> FICHA DO ITEM</span>
            <h2>{item.name}</h2>
            <div className="entity-tags"><span>{item.category}</span><span>{item.era}</span><span>{item.visual}</span></div>
          </div>
        </div>

        <div className="detail-content">
          {item.visual === 'Remake 2026' && (
            <div className="item-remake-callout"><Sparkles size={17} /><div><b>Visual atualizado confirmado</b><span>{item.visualNote || 'Este item já apareceu no material oficial do remake de 2026.'}</span></div></div>
          )}

          <section className="detail-block">
            <h3><Backpack size={18} /> O que é</h3>
            <p>{item.description}</p>
          </section>

          <section className="detail-facts item-detail-facts">
            <div><Compass size={17} /><span><b>Onde conseguir</b>{item.obtainedAt}</span></div>
            <div><ScrollText size={17} /><span><b>Quest / etapa</b>{item.questName}</span></div>
          </section>

          <section className="detail-block">
            <h3><Compass size={18} /> Como obter</h3>
            <p>{item.acquisition}</p>
          </section>

          <section className="detail-block">
            <h3><MapPin size={18} /> Locais no mapa</h3>
            {mappedLocations.length ? (
              <div className="map-jump-list">
                {mappedLocations.map(location => (
                  <button key={location.id} onClick={() => onFocusLocation(location.id)}>
                    <span><b>{location.name}</b><small>{location.category} · {location.era}</small></span>
                    <MapPin size={17} />
                  </button>
                ))}
              </div>
            ) : <p className="muted-message">Este item é obtido por inventário inicial, drops genéricos ou em um interior sem pin próprio.</p>}
          </section>

          <section className="detail-block">
            <h3><ScrollText size={18} /> Quests relacionadas</h3>
            {relatedQuests.length ? (
              <div className="related-quest-list">
                {relatedQuests.map(quest => (
                  <button key={quest.id} onClick={() => onOpenQuest(quest)}>
                    <span><b>{quest.title}</b><small>{quest.kind} · {quest.era}</small></span>
                    <ScrollText size={17} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="muted-message">Este item está ligado principalmente à campanha principal ou à exploração normal, não a uma side quest cadastrada.</p>
            )}
          </section>

          <div className="item-reference-links">
            <a href={zeldaDungeonUrl} target="_blank" rel="noreferrer">Zelda Dungeon <ExternalLink size={14} /></a>
            <a href={fandomUrl} target="_blank" rel="noreferrer">Zelda Wiki <ExternalLink size={14} /></a>
            {item.visual === 'Remake 2026' && <a href="https://www.nintendo.com/jp/games/switch2/aa9ja/index.html" target="_blank" rel="noreferrer">Nintendo Japão <ExternalLink size={14} /></a>}
          </div>
        </div>
      </aside>
    </div>
  )
}
