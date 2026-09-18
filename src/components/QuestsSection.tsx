import { Check, Circle, Compass, Search, ScrollText, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { questEntries, questKinds, type QuestEntry, type QuestKind } from '../data/quests'

export type QuestsSectionProps = {
  completed: string[]
  onToggleComplete: (questId: string) => void
  onOpenQuest: (quest: QuestEntry) => void
}

export default function QuestsSection({ completed, onToggleComplete, onOpenQuest }: QuestsSectionProps) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'Todos' | QuestKind>('Todos')
  const [era, setEra] = useState<'Todas' | 'Criança' | 'Adulto'>('Todas')

  const visibleQuests = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return questEntries.filter(quest => {
      const matchesKind = kind === 'Todos' || quest.kind === kind
      const matchesEra = era === 'Todas' || quest.era === 'Ambas' || quest.era === era
      const haystack = `${quest.title} ${quest.region} ${quest.summary} ${quest.tags.join(' ')}`.toLocaleLowerCase('pt-BR')
      return matchesKind && matchesEra && (!normalized || haystack.includes(normalized))
    })
  }, [era, kind, query])

  const completion = Math.round((completed.length / questEntries.length) * 100)

  return (
    <section id="quests" className="quests-section">
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">QUESTS & SUBQUESTS</span>
          <h2>Conteúdo opcional de Hyrule</h2>
          <p>
            Side quests, subquests, minijogos e colecionáveis em uma tela própria. Os resumos evitam spoilers de
            história e focam apenas em como encontrar e acompanhar cada atividade.
          </p>
        </div>
        <div className="quest-progress-card glass-panel">
          <ScrollText size={20} />
          <div>
            <span>Progresso opcional</span>
            <strong>{completion}%</strong>
            <small>{completed.length} de {questEntries.length} concluídas</small>
          </div>
        </div>
      </div>

      <div className="quest-toolbar glass-panel">
        <label className="directory-search quest-search">
          <Search size={17} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar quest, região ou recompensa..." />
        </label>
        <div className="directory-chips">
          {questKinds.map(item => (
            <button key={item} className={kind === item ? 'chip active' : 'chip'} onClick={() => setKind(item)}>{item}</button>
          ))}
        </div>
        <div className="quest-era-tabs">
          {(['Todas', 'Criança', 'Adulto'] as const).map(item => (
            <button key={item} className={era === item ? 'active' : ''} onClick={() => setEra(item)}>{item}</button>
          ))}
        </div>
      </div>

      <div className="directory-summary">
        <span>{visibleQuests.length} atividades encontradas</span>
        <span>Baseado nas referências de IGN e Jegged, reescrito em formato spoiler-light.</span>
      </div>

      <div className="quest-grid">
        {visibleQuests.map(quest => {
          const isDone = completed.includes(quest.id)
          return (
            <article
              key={quest.id}
              className={isDone ? 'quest-card done' : 'quest-card'}
              role="button"
              tabIndex={0}
              onClick={() => onOpenQuest(quest)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') onOpenQuest(quest)
              }}
            >
              <div className="quest-card-top">
                <div className="quest-kind-icon"><ScrollText size={19} /></div>
                <div className="quest-badges"><span>{quest.kind}</span><span>{quest.era}</span></div>
              </div>
              <h3>{quest.title}</h3>
              <p>{quest.summary}</p>
              <div className="quest-meta-row"><Compass size={15} /><span>{quest.region}</span></div>
              <div className="quest-meta-row"><Users size={15} /><span>{quest.npcIds.length} NPCs relacionados</span></div>
              <div className="quest-card-footer">
                <span>Ver detalhes</span>
                <button
                  className={isDone ? 'quest-done-button checked' : 'quest-done-button'}
                  onClick={event => {
                    event.stopPropagation()
                    onToggleComplete(quest.id)
                  }}
                  aria-label={isDone ? `Desmarcar ${quest.title}` : `Marcar ${quest.title} como concluída`}
                >
                  {isDone ? <Check size={16} /> : <Circle size={16} />}
                  {isDone ? 'Concluída' : 'Marcar'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {visibleQuests.length === 0 && <div className="directory-empty">Nenhuma quest encontrada com esses filtros.</div>}
    </section>
  )
}
