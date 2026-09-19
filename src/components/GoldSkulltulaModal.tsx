import { Compass, ExternalLink, MapPin, ShieldCheck, Star, X } from 'lucide-react'
import { useEffect } from 'react'
import type { SkulltulaEntry } from '../data/goldSkulltulas'
import { locations } from '../data/locations'

type Props = {
  skulltula: SkulltulaEntry
  onClose: () => void
  onFocusLocation: (locationId: string, skulltulaId?: string) => void
}

export default function GoldSkulltulaModal({ skulltula, onClose, onFocusLocation }: Props) {
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

  const parentLocation = locations.find(location => location.id === skulltula.parentLocationId)

  return (
    <div className="detail-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="detail-modal creature-detail-modal" role="dialog" aria-modal="true" aria-label={`Detalhes da Gold Skulltula ${skulltula.number}`}>
        <button className="detail-close" onClick={onClose} aria-label="Fechar"><X size={21} /></button>

        <div className="creature-detail-hero skulltula-detail-hero">
          <div className="creature-detail-image skulltula-detail-image">
            <img src={skulltula.imageUrl} alt={`Gold Skulltula ${skulltula.number}`} referrerPolicy="no-referrer" />
          </div>

          <div className="creature-detail-title">
            <span className="eyebrow"><Star size={14} /> GOLD SKULLTULA</span>
            <h2>Token #{String(skulltula.number).padStart(3, '0')}</h2>
            <div className="entity-tags">
              <span>{skulltula.area}</span>
              <span>{skulltula.regionType}</span>
              <span>{skulltula.era}</span>
            </div>
          </div>
        </div>

        <div className="detail-content">
          <section className="detail-block">
            <h3><Star size={18} /> Onde está</h3>
            <p>{skulltula.description}</p>
          </section>

          <section className="detail-facts creature-facts">
            <div><Compass size={17} /><span><b>Área</b>{skulltula.area}</span></div>
            <div><ShieldCheck size={17} /><span><b>Condição</b>{skulltula.condition}</span></div>
          </section>

          {parentLocation && (
            <section className="detail-block">
              <h3><MapPin size={18} /> Abrir no mapa</h3>
              <div className="map-jump-list">
                <button onClick={() => onFocusLocation(parentLocation.id, skulltula.id)}>
                  <span><b>{parentLocation.name}</b><small>{parentLocation.category} · {parentLocation.era}</small></span>
                  <MapPin size={17} />
                </button>
              </div>
            </section>
          )}

          <a className="detail-source-link" href="https://www.zeldadungeon.net/wiki/Ocarina_of_Time_Gold_Skulltulas" target="_blank" rel="noreferrer">
            Consultar guia de referência <ExternalLink size={15} />
          </a>
        </div>
      </aside>
    </div>
  )
}
