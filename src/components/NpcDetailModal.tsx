import { Compass, ExternalLink, ScrollText, ShieldCheck, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { NpcEntry } from '../data/npcs'
import { getSpoilerFreeNpcBio } from '../data/npcProfiles'
import type { QuestEntry } from '../data/quests'

type Props = {
  npc: NpcEntry
  fallbackImage?: string
  relatedQuests: QuestEntry[]
  onClose: () => void
  onOpenQuest: (quest: QuestEntry) => void
}

export default function NpcDetailModal({ npc, fallbackImage, relatedQuests, onClose, onOpenQuest }: Props) {
  const [src, setSrc] = useState(npc.imageUrl || fallbackImage || '')
  const [failed, setFailed] = useState(!(npc.imageUrl || fallbackImage))

  useEffect(() => {
    setSrc(npc.imageUrl || fallbackImage || '')
    setFailed(!(npc.imageUrl || fallbackImage))
  }, [fallbackImage, npc])

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

  const wikiUrl = `https://zelda.fandom.com/wiki/${encodeURIComponent(npc.pageTitle.replaceAll(' ', '_'))}`

  return (
    <div className="detail-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="detail-modal npc-detail-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${npc.name}`}>
        <button className="detail-close" onClick={onClose} aria-label="Fechar"><X size={21} /></button>
        <div className="npc-detail-hero">
          <div className="npc-detail-image">
            {!failed && src ? (
              <img
                src={src}
                alt={npc.name}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage)
                  else setFailed(true)
                }}
              />
            ) : (
              <div className="entity-placeholder">{npc.name.slice(0, 2).toUpperCase()}</div>
            )}
          </div>
          <div className="npc-detail-title">
            <span className="eyebrow"><ShieldCheck size={14} /> PERFIL SEM SPOILERS</span>
            <h2>{npc.name}</h2>
            <div className="entity-tags"><span>{npc.category}</span><span>{npc.era}</span>{npc.visual && <span>{npc.visual}</span>}</div>
          </div>
        </div>

        <div className="detail-content">
          <section className="detail-block">
            <h3><UserRound size={18} /> História do personagem</h3>
            <p>{getSpoilerFreeNpcBio(npc)}</p>
            <div className="spoiler-safe-note">Este texto evita identidades secretas, mudanças de destino, mortes, revelações, chefes e acontecimentos posteriores da campanha.</div>
          </section>

          <section className="detail-facts">
            <div><Compass size={17} /><span><b>Onde encontrar</b>{npc.location}</span></div>
            <div><UserRound size={17} /><span><b>Função</b>{npc.role}</span></div>
          </section>

          <section className="detail-block">
            <h3><ScrollText size={18} /> Quests e subquests relacionadas</h3>
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
              <p className="muted-message">Este NPC não participa diretamente de uma quest opcional catalogada. Ele pode ainda oferecer diálogo, lore ou contexto da região.</p>
            )}
          </section>

          <a className="detail-source-link" href={wikiUrl} target="_blank" rel="noreferrer">Consultar página de referência <ExternalLink size={15} /></a>
        </div>
      </aside>
    </div>
  )
}
