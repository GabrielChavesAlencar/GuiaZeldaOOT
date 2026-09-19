import { Compass, ExternalLink, MapPin, ShieldCheck, Sparkles, Swords, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { BestiaryEntry } from '../data/bestiary'
import { findMapLocationsByText } from '../utils/mapNavigation'

type Props = {
  creature: BestiaryEntry
  fallbackImage?: string
  onClose: () => void
  onFocusLocation: (locationId: string) => void
}

export default function CreatureDetailModal({ creature, fallbackImage, onClose, onFocusLocation }: Props) {
  const [src, setSrc] = useState(creature.imageUrl || fallbackImage || '')
  const [failed, setFailed] = useState(!(creature.imageUrl || fallbackImage))
  const mapLocations = useMemo(() => findMapLocationsByText(creature.location), [creature.location])

  useEffect(() => {
    setSrc(creature.imageUrl || fallbackImage || '')
    setFailed(!(creature.imageUrl || fallbackImage))
  }, [creature, fallbackImage])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  const wikiUrl = `https://zelda.fandom.com/wiki/${encodeURIComponent(creature.pageTitle.replaceAll(' ', '_'))}`

  return (
    <div className="detail-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="detail-modal creature-detail-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${creature.name}`}>
        <button className="detail-close" onClick={onClose} aria-label="Fechar"><X size={21} /></button>

        <div className="creature-detail-hero">
          <div className="creature-detail-image">
            {!failed && src ? (
              <img
                src={src}
                alt={creature.name}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage)
                  else setFailed(true)
                }}
              />
            ) : (
              <div className="entity-placeholder">{creature.name.slice(0, 2).toUpperCase()}</div>
            )}
          </div>

          <div className="creature-detail-title">
            <span className="eyebrow"><Swords size={14} /> FICHA DA CRIATURA</span>
            <h2>{creature.name}</h2>
            <div className="entity-tags"><span>{creature.category}</span><span>{creature.visual}</span></div>
          </div>
        </div>

        <div className="detail-content">
          <section className="detail-block">
            <h3><Swords size={18} /> Descrição</h3>
            <p>{creature.description}</p>
          </section>

          {creature.visualDescription && (
            <section className="detail-block visual-analysis-block">
              <h3><Sparkles size={18} /> Visual no remake</h3>
              <p>{creature.visualDescription}</p>
              {creature.visualSourceUrl && <a href={creature.visualSourceUrl} target="_blank" rel="noreferrer">Ver referência visual <ExternalLink size={14} /></a>}
            </section>
          )}

          <section className="detail-facts creature-facts">
            <div><Compass size={17} /><span><b>Onde encontrar</b>{creature.location}</span></div>
            <div><ShieldCheck size={17} /><span><b>Como lidar</b>{creature.weakness}</span></div>
          </section>

          <section className="detail-block">
            <h3><MapPin size={18} /> Locais no mapa</h3>
            {mapLocations.length ? (
              <div className="map-jump-list">
                {mapLocations.map(location => (
                  <button key={location.id} onClick={() => onFocusLocation(location.id)}>
                    <span><b>{location.name}</b><small>{location.category} · {location.era}</small></span>
                    <MapPin size={17} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="muted-message">Esta criatura aparece em áreas genéricas ou em locais que ainda não possuem um pin específico no mapa.</p>
            )}
          </section>

          <a className="detail-source-link" href={wikiUrl} target="_blank" rel="noreferrer">
            Consultar página de referência <ExternalLink size={15} />
          </a>
        </div>
      </aside>
    </div>
  )
}
