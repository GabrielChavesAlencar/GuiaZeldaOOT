import { Check, Compass, ExternalLink, Gift, ScrollText, ShieldCheck, Users, X } from 'lucide-react'
import { useEffect } from 'react'
import type { NpcEntry } from '../data/npcs'
import type { QuestEntry } from '../data/quests'

type Props = {
  quest: QuestEntry
  npcs: NpcEntry[]
  completed: boolean
  onToggleComplete: () => void
  onClose: () => void
  onOpenNpc: (npc: NpcEntry) => void
}

export default function QuestDetailModal({ quest, npcs, completed, onToggleComplete, onClose, onOpenNpc }: Props) {
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

  const relatedNpcs = quest.npcIds.map(id => npcs.find(npc => npc.id === id)).filter((npc): npc is NpcEntry => Boolean(npc))

  return (
    <div className="detail-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="detail-modal quest-detail-modal" role="dialog" aria-modal="true" aria-label={`Quest ${quest.title}`}>
        <button className="detail-close" onClick={onClose} aria-label="Fechar"><X size={21} /></button>
        <div className="quest-detail-head">
          <span className="eyebrow"><ShieldCheck size={14} /> GUIA SPOILER-LIGHT</span>
          <h2>{quest.title}</h2>
          <div className="entity-tags"><span>{quest.kind}</span><span>{quest.era}</span></div>
          <p>{quest.summary}</p>
        </div>

        <div className="detail-content">
          <section className="detail-facts quest-detail-facts">
            <div><Compass size={17} /><span><b>Região</b>{quest.region}</span></div>
            <div><Gift size={17} /><span><b>Recompensa</b>{quest.reward}</span></div>
          </section>

          <section className="detail-block">
            <h3><ScrollText size={18} /> Como começar</h3>
            <p>{quest.startHint}</p>
          </section>

          <section className="detail-block">
            <h3><Check size={18} /> Passos sem spoiler de história</h3>
            <ol className="quest-steps">
              {quest.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
            </ol>
          </section>

          <section className="detail-block">
            <h3><Users size={18} /> NPCs envolvidos</h3>
            {relatedNpcs.length ? (
              <div className="quest-npc-chips">
                {relatedNpcs.map(npc => <button key={npc.id} onClick={() => onOpenNpc(npc)}>{npc.name}</button>)}
              </div>
            ) : <p className="muted-message">Esta atividade não depende de um NPC específico.</p>}
          </section>

          <div className="quest-modal-actions">
            <button className={completed ? 'primary-button compact quest-complete-action completed' : 'primary-button compact quest-complete-action'} onClick={onToggleComplete}>
              <Check size={17} /> {completed ? 'Concluída — desmarcar' : 'Marcar como concluída'}
            </button>
            <a className="detail-source-link" href={quest.sourceUrl} target="_blank" rel="noreferrer">{quest.sourceLabel} <ExternalLink size={15} /></a>
          </div>
        </div>
      </aside>
    </div>
  )
}
