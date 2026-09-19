import { Check, Compass, ExternalLink, Heart, MapPin, ShieldCheck, X } from 'lucide-react'
import { useEffect } from 'react'
import type { HeartPieceEntry } from '../data/heartPieces'
import { locations } from '../data/locations'

type Props = {
  piece: HeartPieceEntry
  completed: boolean
  onToggleComplete: () => void
  onClose: () => void
  onFocusLocation: (locationId: string, skulltulaId?: string, heartPieceId?: string) => void
}

export default function HeartPieceModal({ piece, completed, onToggleComplete, onClose, onFocusLocation }: Props) {
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

  const parentLocation = locations.find(location => location.id === piece.parentLocationId)

  return (
    <div className="detail-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="detail-modal creature-detail-modal" role="dialog" aria-modal="true" aria-label={`Pedaço de Coração ${piece.number}`}>
        <button className="detail-close" onClick={onClose} aria-label="Fechar"><X size={21} /></button>

        <div className="creature-detail-hero heart-piece-detail-hero">
          <div className="creature-detail-image heart-piece-detail-image">
            <img src={piece.imageUrl} alt={`Pedaço de Coração ${piece.number}`} referrerPolicy="no-referrer" />
          </div>
          <div className="creature-detail-title">
            <span className="eyebrow"><Heart size={14} /> PEDAÇO DE CORAÇÃO</span>
            <h2>Piece #{String(piece.number).padStart(2, '0')}</h2>
            <div className="entity-tags"><span>{piece.area}</span><span>{piece.kind}</span><span>{piece.era}</span></div>
          </div>
        </div>

        <div className="detail-content">
          <section className="detail-block">
            <h3><Heart size={18} /> Como obter</h3>
            <p>{piece.description}</p>
          </section>

          <section className="detail-facts creature-facts">
            <div><Compass size={17} /><span><b>Área</b>{piece.area}</span></div>
            <div><ShieldCheck size={17} /><span><b>Requisito</b>{piece.condition}</span></div>
          </section>

          {parentLocation && (
            <section className="detail-block">
              <h3><MapPin size={18} /> Abrir no mapa</h3>
              <div className="map-jump-list">
                <button onClick={() => onFocusLocation(parentLocation.id, undefined, piece.id)}>
                  <span><b>{parentLocation.name}</b><small>{parentLocation.category} · {parentLocation.era}</small></span>
                  <MapPin size={17} />
                </button>
              </div>
            </section>
          )}

          <div className="heart-piece-modal-actions">
            <button className={completed ? 'heart-complete-button completed' : 'heart-complete-button'} onClick={onToggleComplete}>
              <Check size={17} /> {completed ? 'Coletado' : 'Marcar como coletado'}
            </button>
            <a className="detail-source-link" href="https://www.zeldadungeon.net/wiki/Ocarina_of_Time_Heart_Pieces" target="_blank" rel="noreferrer">
              Consultar guia de referência <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}
