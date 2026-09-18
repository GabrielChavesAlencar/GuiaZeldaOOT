import { useEffect, useMemo, useState } from 'react'
import {
  BadgeInfo,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  ExternalLink,
  Map,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react'
import InteractiveMap from './components/InteractiveMap'
import { bestiaryEntries } from './data/bestiary'
import { guideSteps } from './data/guide'
import { locations } from './data/locations'
import { npcEntries } from './data/npcs'
import { officialScreenshots, remakeFeatures } from './data/remake'

type ThumbMap = Record<string, string>

type WikiPage = {
  title?: string
  thumbnail?: {
    source?: string
  }
}

const sources = [
  { label: 'OoT Interactive Map', url: 'https://ootmap.com/' },
  { label: 'Zelda Wiki — Ocarina of Time', url: 'https://zelda.fandom.com/wiki/The_Legend_of_Zelda:_Ocarina_of_Time' },
  { label: 'Zelda Wiki — Locations in Ocarina of Time', url: 'https://zelda.fandom.com/wiki/Locations_in_Ocarina_of_Time' },
  { label: 'Nintendo Brasil — Ocarina of Time (Switch 2)', url: 'https://www.nintendo.com/pt-br/store/products/the-legend-of-zelda-ocarina-of-time-switch-2/' },
  { label: 'Nintendo Portugal — Ocarina of Time (Switch 2)', url: 'https://www.nintendo.com/pt-pt/Jogos/Jogos-para-a-Nintendo-Switch-2/The-Legend-of-Zelda-Ocarina-of-Time-3115664.html' },
]

function useWikiThumbnails(titles: string[]) {
  const [thumbs, setThumbs] = useState<ThumbMap>({})

  useEffect(() => {
    if (!titles.length) return

    const controller = new AbortController()
    const uniqueTitles = [...new Set(titles)]
    const endpoint = `https://zelda.fandom.com/api.php?action=query&prop=pageimages&format=json&origin=*&pithumbsize=640&titles=${encodeURIComponent(uniqueTitles.join('|'))}`

    fetch(endpoint, { signal: controller.signal })
      .then(response => response.json())
      .then((data: { query?: { pages?: Record<string, WikiPage> } }) => {
        const pages = data.query?.pages ?? {}
        const next: ThumbMap = {}

        Object.values(pages).forEach(page => {
          if (page.title && page.thumbnail?.source) {
            next[page.title] = page.thumbnail.source
          }
        })

        setThumbs(next)
      })
      .catch(() => {
        // Mantém placeholders quando a API externa não responder.
      })

    return () => controller.abort()
  }, [titles])

  return thumbs
}

function App() {
  const [done, setDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('oot-guide-progress') || '[]')
    } catch {
      return []
    }
  })
  const [era, setEra] = useState<'Todas' | 'Criança' | 'Adulto'>('Todas')

  useEffect(() => {
    localStorage.setItem('oot-guide-progress', JSON.stringify(done))
  }, [done])

  const wikiTitles = useMemo(
    () => [...bestiaryEntries.map(entry => entry.pageTitle), ...npcEntries.map(entry => entry.pageTitle)],
    [],
  )
  const thumbnails = useWikiThumbnails(wikiTitles)

  const filteredSteps = useMemo(
    () => guideSteps.filter(step => era === 'Todas' || step.era === era),
    [era],
  )

  const completion = Math.round((done.length / guideSteps.length) * 100)

  const toggleDone = (id: string) => {
    setDone((current: string[]) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir para o início">
          <img className="brand-mark-image" src="/triforce-icon.png" alt="Triforce dourada" />
          <span>
            <b>GUIA HYRULE</b>
            <small>OCARINA OF TIME</small>
          </span>
        </a>
        <nav>
          <a href="#mapa">Mapa</a>
          <a href="#guia">Guia</a>
          <a href="#locais">Locais</a>
          <a href="#bestiario">Bestiário</a>
          <a href="#npcs">NPCs</a>
          <a href="#remake">Remake</a>
          <a href="#fontes">Fontes</a>
        </nav>
        <a className="progress-pill" href="#guia">
          <span>{completion}%</span> progresso
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={14} /> GUIA NÃO OFICIAL · PT-BR
            </span>
            <h1>
              Uma jornada completa por <em>Ocarina of Time</em>
            </h1>
            <p>
              Agora com o mapa em alta resolução, favicon em forma de Triforce, guia principal, bestiário e uma
              galeria de NPCs para consultar Hyrule inteira em um só lugar.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#mapa">
                <Map size={18} /> Abrir mapa
              </a>
              <a className="secondary-button" href="#bestiario">
                <Swords size={18} /> Ver bestiário
              </a>
            </div>
            <div className="hero-stats">
              <span>
                <b>{locations.length}</b> pontos no mapa
              </span>
              <span>
                <b>{bestiaryEntries.length}</b> monstros catalogados
              </span>
              <span>
                <b>{npcEntries.length}</b> NPCs listados
              </span>
            </div>
          </div>
        </section>

        <div className="content-wrap">
          <InteractiveMap />

          <section id="guia" className="guide-section">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">ROTEIRO PRINCIPAL</span>
                <h2>Guia de progresso</h2>
                <p>Marque as etapas concluídas. O progresso fica salvo no seu navegador.</p>
              </div>
              <div className="progress-card glass-panel">
                <span>Progresso da aventura</span>
                <strong>{completion}%</strong>
                <div className="progress-track">
                  <i style={{ width: `${completion}%` }} />
                </div>
              </div>
            </div>

            <div className="era-tabs">
              {(['Todas', 'Criança', 'Adulto'] as const).map(item => (
                <button key={item} className={era === item ? 'active' : ''} onClick={() => setEra(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="guide-grid">
              {filteredSteps.map(step => {
                const checked = done.includes(step.id)
                return (
                  <article className={checked ? 'guide-card done' : 'guide-card'} key={step.id}>
                    <div className="guide-number">{String(guideSteps.indexOf(step) + 1).padStart(2, '0')}</div>
                    <div className="guide-card-main">
                      <div className="card-meta">
                        <span>{step.era}</span>
                        <span>•</span>
                        <span>{step.place}</span>
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.summary}</p>
                      <ul>
                        {step.objectives.map(item => (
                          <li key={item}>
                            <ChevronRight size={15} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="check-button"
                      onClick={() => toggleDone(step.id)}
                      aria-label={checked ? 'Marcar como pendente' : 'Marcar como concluído'}
                    >
                      <Check size={18} />
                      <span>{checked ? 'Concluído' : 'Marcar'}</span>
                    </button>
                  </article>
                )
              })}
            </div>
          </section>

          <section id="locais" className="locations-section">
            <div className="section-heading">
              <span className="eyebrow">ENCICLOPÉDIA</span>
              <h2>Locais essenciais de Hyrule</h2>
              <p>Uma visão rápida das regiões, cidades e templos para consulta durante a exploração.</p>
            </div>
            <div className="location-cards">
              {locations
                .filter(item => ['Cidade', 'Região', 'Templo'].includes(item.category))
                .slice(0, 12)
                .map(location => (
                  <article className="location-card" key={location.id}>
                    <div className="location-icon">
                      <Compass size={20} />
                    </div>
                    <span>
                      {location.category} · {location.era}
                    </span>
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                    <a href="#mapa">
                      Ver no mapa <ChevronRight size={15} />
                    </a>
                  </article>
                ))}
            </div>
          </section>

          <section id="bestiario" className="encyclopedia-section">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">BESTIÁRIO</span>
                <h2>Monstros e criaturas importantes</h2>
                <p>
                  A seção abaixo reúne inimigos clássicos do jogo e, quando possível, prioriza o visual mais novo
                  ligado a OOT 3D / remake.
                </p>
              </div>
              <div className="mini-panel glass-panel">
                <Swords size={18} />
                <div>
                  <strong>{bestiaryEntries.length} entradas</strong>
                  <span>criaturas da aventura</span>
                </div>
              </div>
            </div>
            <div className="encyclopedia-grid">
              {bestiaryEntries.map(entry => (
                <article className="entity-card" key={entry.id}>
                  <div className="entity-media">
                    {thumbnails[entry.pageTitle] ? (
                      <img src={thumbnails[entry.pageTitle]} alt={entry.name} loading="lazy" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="entity-placeholder">{entry.name.slice(0, 2).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="entity-body">
                    <div className="entity-tags">
                      <span>{entry.group}</span>
                      <span>{entry.visual}</span>
                    </div>
                    <h3>{entry.name}</h3>
                    <p>{entry.description}</p>
                    <ul className="entity-list">
                      <li>
                        <BadgeInfo size={15} />
                        <b>Onde aparece:</b> {entry.location}
                      </li>
                      <li>
                        <ShieldCheck size={15} />
                        <b>Fraqueza:</b> {entry.weakness}
                      </li>
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="npcs" className="encyclopedia-section npc-section">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">PERSONAGENS</span>
                <h2>Todos os NPCs importantes em um lugar</h2>
                <p>
                  Personagens centrais, aliados e figuras marcantes para você lembrar rapidamente quem é quem em
                  Hyrule.
                </p>
              </div>
              <div className="mini-panel glass-panel">
                <Users size={18} />
                <div>
                  <strong>{npcEntries.length} NPCs</strong>
                  <span>personagens relevantes</span>
                </div>
              </div>
            </div>
            <div className="encyclopedia-grid npc-grid">
              {npcEntries.map(entry => (
                <article className="entity-card npc-card" key={entry.id}>
                  <div className="entity-media npc-media">
                    {thumbnails[entry.pageTitle] ? (
                      <img src={thumbnails[entry.pageTitle]} alt={entry.name} loading="lazy" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="entity-placeholder">{entry.name.slice(0, 2).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="entity-body">
                    <div className="entity-tags">
                      <span>{entry.era}</span>
                      <span>{entry.visual}</span>
                    </div>
                    <h3>{entry.name}</h3>
                    <p>{entry.description}</p>
                    <ul className="entity-list">
                      <li>
                        <Users size={15} />
                        <b>Função:</b> {entry.role}
                      </li>
                      <li>
                        <Compass size={15} />
                        <b>Onde encontrar:</b> {entry.location}
                      </li>
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="remake" className="remake-section">
            <div className="remake-copy">
              <span className="eyebrow">NINTENDO SWITCH 2</span>
              <h2>Preparado para o remake</h2>
              <p>
                O site foi estruturado para separar o que pertence ao jogo clássico do que for confirmado na nova
                versão. Assim, o conteúdo pode ser atualizado sem quebrar o guia original.
              </p>
              <div className="feature-list">
                {remakeFeatures.map(item => (
                  <div key={item}>
                    <ShieldCheck size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="remake-warning">
                Como o lançamento está marcado para 5 de novembro de 2026, diferenças de puzzles, rotas, itens e
                posicionamentos devem ser confirmadas após o lançamento antes de serem tratadas como definitivas.
              </div>
            </div>
            <div className="screenshot-stack">
              {officialScreenshots.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Imagem oficial do remake de Ocarina of Time ${index + 1}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={event => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ))}
              <div className="screenshot-credit">Imagens carregadas da página oficial da Nintendo.</div>
            </div>
          </section>

          <section id="fontes" className="sources-section">
            <div className="section-heading">
              <span className="eyebrow">REFERÊNCIAS</span>
              <h2>Fontes usadas no projeto</h2>
              <p>
                Os textos do guia são resumos próprios. As fontes abaixo servem para conferência de locais, estrutura
                do jogo e informações oficiais da nova versão.
              </p>
            </div>
            <div className="source-list">
              {sources.map(source => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.label}</span>
                  <ExternalLink size={17} />
                </a>
              ))}
              <a href="https://zelda.fandom.com" target="_blank" rel="noreferrer">
                <span>Zelda Wiki / Fandom — thumbnails de bestiário e NPCs</span>
                <ExternalLink size={17} />
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div>
          <b>GUIA HYRULE</b>
          <span>Projeto de fã, não afiliado à Nintendo.</span>
        </div>
        <p>The Legend of Zelda, Ocarina of Time e marcas relacionadas pertencem aos seus respectivos detentores.</p>
      </footer>
    </div>
  )
}

export default App
