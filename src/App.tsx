import { useEffect, useMemo, useState } from 'react'
import {
  BadgeInfo,
  Check,
  ChevronRight,
  Compass,
  ExternalLink,
  Map,
  Search,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react'
import GoldSkulltulaModal from './components/GoldSkulltulaModal'
import GoldSkulltulasSection from './components/GoldSkulltulasSection'
import HeartPieceModal from './components/HeartPieceModal'
import HeartPiecesSection from './components/HeartPiecesSection'
import ItemDetailModal from './components/ItemDetailModal'
import ItemsSection from './components/ItemsSection'
import InteractiveMap from './components/InteractiveMap'
import LanguageSelector from './components/LanguageSelector'
import CreatureDetailModal from './components/CreatureDetailModal'
import NpcDetailModal from './components/NpcDetailModal'
import QuestDetailModal from './components/QuestDetailModal'
import QuestsSection from './components/QuestsSection'
import { bestiaryEntries, type BestiaryCategory, type BestiaryEntry } from './data/bestiary'
import { goldSkulltulas, type SkulltulaEntry } from './data/goldSkulltulas'
import { heartPieces, type HeartPieceEntry } from './data/heartPieces'
import { itemEntries, type ItemEntry } from './data/items'
import { guideSteps } from './data/guide'
import { locations } from './data/locations'
import { npcEntries, type NpcCategory, type NpcEntry } from './data/npcs'
import { officialMediaCards, officialJapanPageUrl, officialSectionBanners } from './data/officialSite'
import { officialScreenshots, remakeFeatures } from './data/remake'
import { questEntries, type QuestEntry } from './data/quests'
import { focusMapLocation } from './utils/mapNavigation'

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
  { label: 'Zelda Central — Bestiário de Ocarina of Time', url: 'https://pt.zeldacentral.com/games/ocarina-of-time/enemies/' },
  { label: 'Zelda Wiki — Characters in Ocarina of Time', url: 'https://zelda.fandom.com/wiki/Characters_in_Ocarina_of_Time' },
  { label: 'Nintendo Brasil — Ocarina of Time (Switch 2)', url: 'https://www.nintendo.com/pt-br/store/products/the-legend-of-zelda-ocarina-of-time-switch-2/' },
  { label: 'Nintendo Portugal — Ocarina of Time (Switch 2)', url: 'https://www.nintendo.com/pt-pt/Jogos/Jogos-para-a-Nintendo-Switch-2/The-Legend-of-Zelda-Ocarina-of-Time-3115664.html' },
  { label: 'Nintendo Japão — página oficial completa do remake', url: officialJapanPageUrl },
  { label: 'Nintendo Japão — Triforce', url: 'https://www.nintendo.com/jp/games/switch2/aa9ja/triforce/index.html' },
  { label: 'Nintendo Japão — Story', url: 'https://www.nintendo.com/jp/games/switch2/aa9ja/story/index.html' },
  { label: 'Nintendo Japão — Hyrule', url: 'https://www.nintendo.com/jp/games/switch2/aa9ja/hyrule/index.html' },
  { label: 'Nintendo Japão — Dungeon', url: 'https://www.nintendo.com/jp/games/switch2/aa9ja/dungeon/index.html' },
  { label: 'Nintendo Japão — Action', url: 'https://www.nintendo.com/jp/games/switch2/aa9ja/action/index.html' },
  { label: 'Trailer do remake — YouTube', url: 'https://www.youtube.com/watch?v=Cm8DKgjHMV4' },
  { label: 'Gameplay com Eiji Aonuma — YouTube', url: 'https://www.youtube.com/watch?v=PQvD3p2yGwc' },
  { label: 'Z64Central — capturas e análise do trailer/gameplay', url: 'https://z64central.com/switch-2/' },
  { label: 'IGN — Side Quests & Mini-Games', url: 'https://www.ign.com/wikis/the-legend-of-zelda-ocarina-of-time-3d/Side_Quests_%26_Mini-Games' },
  { label: 'Jegged — Ocarina of Time Side Quests', url: 'https://jegged.com/Games/Legend-of-Zelda-Ocarina-of-Time/Side-Quests/' },
  { label: 'Zelda Dungeon — Ocarina of Time Gold Skulltulas', url: 'https://www.zeldadungeon.net/wiki/Ocarina_of_Time_Gold_Skulltulas' },
  { label: 'Zelda Central — Gold Skulltula Locations', url: 'https://pt.zeldacentral.com/games/ocarina-of-time/gold-skulltula-locations/' },
  { label: 'IGN — Gold Skulltulas', url: 'https://www.ign.com/wikis/the-legend-of-zelda-ocarina-of-time-3d/Gold_Skulltulas' },
  { label: 'Zelda Dungeon — Ocarina of Time Heart Pieces', url: 'https://www.zeldadungeon.net/wiki/Ocarina_of_Time_Heart_Pieces' },
  { label: 'Zelda Central — Heart Piece Locations', url: 'https://pt.zeldacentral.com/games/ocarina-of-time/heart-pieces/' },
  { label: 'IGN — Heart Pieces', url: 'https://www.ign.com/wikis/the-legend-of-zelda-ocarina-of-time-3d/Heart_Pieces' },
  { label: 'Zelda Dungeon — Ocarina of Time Items', url: 'https://www.zeldadungeon.net/wiki/Ocarina_of_Time_Items' },
  { label: 'Zelda Wiki — Items in Ocarina of Time', url: 'https://zelda.fandom.com/wiki/Items_in_Ocarina_of_Time' },
  { label: 'Eternal Players — Database de Itens', url: 'https://eternalplayers.wordpress.com/2012/12/11/n64-the-legend-of-zelda-ocarina-of-time-itens/' },
]

function useWikiThumbnails(titles: string[]) {
  const [thumbs, setThumbs] = useState<ThumbMap>({})

  useEffect(() => {
    if (!titles.length) return

    const controller = new AbortController()
    const uniqueTitles = [...new Set(titles)]
    const batches: string[][] = []

    for (let index = 0; index < uniqueTitles.length; index += 25) {
      batches.push(uniqueTitles.slice(index, index + 25))
    }

    const load = async () => {
      const merged: ThumbMap = {}

      await Promise.all(
        batches.map(async batch => {
          const endpoint = `https://zelda.fandom.com/api.php?action=query&prop=pageimages&format=json&origin=*&pithumbsize=640&titles=${encodeURIComponent(batch.join('|'))}`
          const response = await fetch(endpoint, { signal: controller.signal })
          const data: { query?: { pages?: Record<string, WikiPage> } } = await response.json()
          const pages = data.query?.pages ?? {}

          Object.values(pages).forEach(page => {
            if (page.title && page.thumbnail?.source) {
              merged[page.title] = page.thumbnail.source
            }
          })
        }),
      )

      setThumbs(merged)
    }

    load().catch(() => {
      // Mantém placeholders quando a API externa não responder.
    })

    return () => controller.abort()
  }, [titles])

  return thumbs
}

function EntityImage({ primary, fallback, alt }: { primary?: string; fallback?: string; alt: string }) {
  const [src, setSrc] = useState(primary || fallback || '')
  const [failed, setFailed] = useState(!(primary || fallback))

  useEffect(() => {
    setSrc(primary || fallback || '')
    setFailed(!(primary || fallback))
  }, [primary, fallback])

  if (failed || !src) {
    return <div className="entity-placeholder">{alt.slice(0, 2).toUpperCase()}</div>
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (fallback && src !== fallback) {
          setSrc(fallback)
        } else {
          setFailed(true)
        }
      }}
    />
  )
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
  const [bestiaryQuery, setBestiaryQuery] = useState('')
  const [bestiaryCategory, setBestiaryCategory] = useState<'Todos' | BestiaryCategory>('Todos')
  const [npcQuery, setNpcQuery] = useState('')
  const [npcCategory, setNpcCategory] = useState<'Todos' | NpcCategory>('Todos')
  const [selectedNpc, setSelectedNpc] = useState<NpcEntry | null>(null)
  const [selectedCreature, setSelectedCreature] = useState<BestiaryEntry | null>(null)
  const [selectedQuest, setSelectedQuest] = useState<QuestEntry | null>(null)
  const [selectedSkulltula, setSelectedSkulltula] = useState<SkulltulaEntry | null>(null)
  const [selectedHeartPiece, setSelectedHeartPiece] = useState<HeartPieceEntry | null>(null)
  const [selectedItem, setSelectedItem] = useState<ItemEntry | null>(null)
  const [heartPieceDone, setHeartPieceDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('oot-heart-piece-progress') || '[]')
    } catch {
      return []
    }
  })
  const [questDone, setQuestDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('oot-optional-progress') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('oot-guide-progress', JSON.stringify(done))
  }, [done])

  useEffect(() => {
    localStorage.setItem('oot-optional-progress', JSON.stringify(questDone))
  }, [questDone])

  useEffect(() => {
    localStorage.setItem('oot-heart-piece-progress', JSON.stringify(heartPieceDone))
  }, [heartPieceDone])

  const wikiTitles = useMemo(
    () => [...bestiaryEntries.map(entry => entry.pageTitle), ...npcEntries.map(entry => entry.pageTitle), ...itemEntries.map(entry => entry.pageTitle)],
    [],
  )
  const thumbnails = useWikiThumbnails(wikiTitles)

  const filteredSteps = useMemo(
    () => guideSteps.filter(step => era === 'Todas' || step.era === era),
    [era],
  )

  const bestiaryCategories: Array<'Todos' | BestiaryCategory> = ['Todos', 'Inimigo comum', 'Minichefe', 'Chefe de masmorra', 'Chefe final']
  const npcCategories: Array<'Todos' | NpcCategory> = ['Todos', 'Principal', 'Aliado', 'Antagonista', 'Comerciante', 'Morador', 'Minijogo', 'Divindade', 'Animal', 'Grupo']

  const filteredBestiary = useMemo(() => {
    const query = bestiaryQuery.trim().toLocaleLowerCase('pt-BR')
    return bestiaryEntries.filter(entry => {
      const matchesCategory = bestiaryCategory === 'Todos' || entry.category === bestiaryCategory
      const matchesQuery = !query || `${entry.name} ${entry.location} ${entry.description}`.toLocaleLowerCase('pt-BR').includes(query)
      return matchesCategory && matchesQuery
    })
  }, [bestiaryCategory, bestiaryQuery])

  const filteredNpcs = useMemo(() => {
    const query = npcQuery.trim().toLocaleLowerCase('pt-BR')
    return npcEntries.filter(entry => {
      const matchesCategory = npcCategory === 'Todos' || entry.category === npcCategory
      const matchesQuery = !query || `${entry.name} ${entry.role} ${entry.location} ${entry.description}`.toLocaleLowerCase('pt-BR').includes(query)
      return matchesCategory && matchesQuery
    })
  }, [npcCategory, npcQuery])

  const completion = Math.round((done.length / guideSteps.length) * 100)

  const toggleDone = (id: string) => {
    setDone((current: string[]) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]))
  }

  const toggleQuestDone = (id: string) => {
    setQuestDone((current: string[]) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]))
  }

  const toggleHeartPieceDone = (id: string) => {
    setHeartPieceDone((current: string[]) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]))
  }

  const openQuestFromNpc = (quest: QuestEntry) => {
    setSelectedNpc(null)
    setSelectedQuest(quest)
  }

  const openNpcFromQuest = (npc: NpcEntry) => {
    setSelectedQuest(null)
    setSelectedNpc(npc)
  }

  const openQuestFromItem = (quest: QuestEntry) => {
    setSelectedItem(null)
    setSelectedQuest(quest)
  }

  const openMapLocation = (locationId: string, skulltulaId?: string, heartPieceId?: string) => {
    setSelectedNpc(null)
    setSelectedCreature(null)
    setSelectedQuest(null)
    setSelectedSkulltula(null)
    setSelectedHeartPiece(null)
    setSelectedItem(null)
    focusMapLocation(locationId, skulltulaId, heartPieceId)
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
          <a href="#quests">Quests</a>
          <a href="#skulltulas">Skulltulas</a>
          <a href="#heart-pieces">Corações</a>
          <a href="#itens">Itens</a>
          <a href="#locais">Locais</a>
          <a href="#bestiario">Bestiário</a>
          <a href="#npcs">NPCs</a>
          <a href="#galeria-oficial">Galeria oficial</a>
          <a href="#remake">Remake</a>
          <a href="#fontes">Fontes</a>
        </nav>
        <div className="topbar-actions">
          <LanguageSelector />
          <a className="progress-pill" href="#guia">
            <span>{completion}%</span> progresso
          </a>
        </div>
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
              Agora com o mapa em alta resolução, favicon em forma de Triforce, guia principal, bestiário, galeria
              de NPCs e uma seleção de artes oficiais do site japonês do remake para mostrar os designs mais novos.
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

          <QuestsSection completed={questDone} onToggleComplete={toggleQuestDone} onOpenQuest={setSelectedQuest} />

          <GoldSkulltulasSection
            entries={goldSkulltulas}
            onOpenEntry={setSelectedSkulltula}
            onFocusLocation={openMapLocation}
          />

          <HeartPiecesSection
            entries={heartPieces}
            completed={heartPieceDone}
            onToggleComplete={toggleHeartPieceDone}
            onOpenEntry={setSelectedHeartPiece}
            onFocusLocation={openMapLocation}
          />

          <ItemsSection
            entries={itemEntries}
            thumbnails={thumbnails}
            onOpenItem={setSelectedItem}
          />

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
                    <a href="#mapa" onClick={event => { event.preventDefault(); focusMapLocation(location.id) }}>
                      Ver no mapa <ChevronRight size={15} />
                    </a>
                  </article>
                ))}
            </div>
          </section>

          <section id="galeria-oficial" className="official-gallery-section">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">SITE OFICIAL DO REMAKE</span>
                <h2>Galeria oficial da página japonesa</h2>
                <p>
                  Analisei a página oficial japonesa do remake e adicionei aqui uma seleção das artes e imagens mais
                  interessantes para destacar os novos designs de personagens, combate e cenários de Hyrule.
                </p>
              </div>
              <div className="mini-panel glass-panel">
                <Sparkles size={18} />
                <div>
                  <strong>{officialMediaCards.length} artes</strong>
                  <span>imagens oficiais da Nintendo</span>
                </div>
              </div>
            </div>

            <div className="official-gallery-grid">
              {officialMediaCards.map(card => (
                <article className="official-card" key={card.id}>
                  <img src={card.image} alt={card.title} loading="lazy" referrerPolicy="no-referrer" />
                  <div className="official-card-body">
                    <span>{card.subtitle}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="bestiario" className="encyclopedia-section">
            <div className="section-banner bestiary-banner">
              <div className="section-banner-copy">
                <span>Novos visuais oficiais</span>
                <strong>Combate, ação e inimigos</strong>
                <p>Usei a página japonesa para reforçar o clima visual da seção com artes oficiais do remake.</p>
              </div>
              <img className="section-banner-figure" src={officialSectionBanners.bestiaryFigure} alt="Arte oficial de combate de Ocarina of Time" loading="lazy" referrerPolicy="no-referrer" />
            </div>
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">BESTIÁRIO COMPLETO</span>
                <h2>Inimigos, minichefes e chefes</h2>
                <p>
                  Agora o bestiário cobre a lista completa da referência da Zelda Central e também prioriza capturas
                  do trailer e do gameplay do remake quando o inimigo já apareceu oficialmente. Quando ainda não há
                  visual novo confirmado, o card continua usando a melhor arte disponível do jogo clássico/OOT 3D.
                </p>
              </div>
              <div className="mini-panel glass-panel">
                <Swords size={18} />
                <div>
                  <strong>{bestiaryEntries.length} entradas</strong>
                  <span>{filteredBestiary.length} visíveis com os filtros</span>
                </div>
              </div>
            </div>

            <div className="directory-toolbar glass-panel">
              <label className="directory-search">
                <Search size={17} />
                <input
                  value={bestiaryQuery}
                  onChange={event => setBestiaryQuery(event.target.value)}
                  placeholder="Buscar monstro, local ou descrição..."
                />
              </label>
              <div className="directory-chips">
                {bestiaryCategories.map(category => (
                  <button
                    key={category}
                    className={bestiaryCategory === category ? 'chip active' : 'chip'}
                    onClick={() => setBestiaryCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="directory-summary">
              <span>{filteredBestiary.length} de {bestiaryEntries.length} criaturas</span>
              <span>Fonte de referência: Zelda Central — Ocarina of Time Enemies</span>
            </div>

            <div className="encyclopedia-grid">
              {filteredBestiary.map(entry => (
                <article
                  className="entity-card entity-card-clickable"
                  key={entry.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelectedCreature(entry)}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setSelectedCreature(entry) }}
                >
                  <div className="entity-media">
                    <EntityImage primary={entry.imageUrl} fallback={thumbnails[entry.pageTitle]} alt={entry.name} />
                  </div>
                  <div className="entity-body">
                    <div className="entity-tags">
                      <span>{entry.category}</span>
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
                        <b>Como lidar:</b> {entry.weakness}
                      </li>
                    </ul>
                    <button className="npc-more-button" onClick={event => { event.stopPropagation(); setSelectedCreature(entry) }}>Ver ficha e locais</button>
                  </div>
                </article>
              ))}
            </div>

            {filteredBestiary.length === 0 && (
              <div className="directory-empty">Nenhuma criatura encontrada com esses filtros.</div>
            )}
          </section>

          <section id="npcs" className="encyclopedia-section npc-section">
            <div className="section-banner npcs-banner">
              <div className="section-banner-copy">
                <span>Novos visuais oficiais</span>
                <strong>Povos, personagens e Hyrule</strong>
                <p>Esta área agora aproveita artes promocionais da Nintendo para contextualizar os personagens do remake.</p>
              </div>
              <img className="section-banner-figure" src={officialSectionBanners.npcsFigure} alt="Arte oficial de personagens de Hyrule" loading="lazy" referrerPolicy="no-referrer" />
            </div>
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">NPCs E PERSONAGENS</span>
                <h2>O elenco de Ocarina of Time</h2>
                <p>
                  A lista foi ampliada com base no catálogo de personagens de Ocarina of Time. Para Zelda, Sheik,
                  Ganondorf, Impa, Saria, Darunia, Ruto, Grande Árvore Deku, Kaepora Gaebora, Jabu-Jabu, Epona,
                  Grandes Fadas e outros personagens já mostrados, o site agora prioriza capturas do remake.
                </p>
              </div>
              <div className="mini-panel glass-panel">
                <Users size={18} />
                <div>
                  <strong>{npcEntries.length} personagens</strong>
                  <span>{filteredNpcs.length} visíveis com os filtros</span>
                </div>
              </div>
            </div>

            <div className="directory-toolbar glass-panel">
              <label className="directory-search">
                <Search size={17} />
                <input
                  value={npcQuery}
                  onChange={event => setNpcQuery(event.target.value)}
                  placeholder="Buscar NPC, função ou local..."
                />
              </label>
              <div className="directory-chips">
                {npcCategories.map(category => (
                  <button
                    key={category}
                    className={npcCategory === category ? 'chip active' : 'chip'}
                    onClick={() => setNpcCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="directory-summary">
              <span>{filteredNpcs.length} de {npcEntries.length} personagens</span>
              <span>Inclui personagens principais e NPCs secundários/obscuros da lista de referência.</span>
            </div>

            <div className="encyclopedia-grid npc-grid">
              {filteredNpcs.map(entry => (
                <article
                  className="entity-card npc-card npc-card-clickable"
                  key={entry.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedNpc(entry)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') setSelectedNpc(entry)
                  }}
                >
                  <div className="entity-media npc-media">
                    <EntityImage primary={entry.imageUrl} fallback={thumbnails[entry.pageTitle]} alt={entry.name} />
                  </div>
                  <div className="entity-body">
                    <div className="entity-tags">
                      <span>{entry.category}</span>
                      <span>{entry.era}</span>
                      {entry.visual && <span>{entry.visual}</span>}
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
                    <button className="npc-more-button" onClick={event => { event.stopPropagation(); setSelectedNpc(entry) }}>Ver história e quests</button>
                  </div>
                </article>
              ))}
            </div>

            {filteredNpcs.length === 0 && (
              <div className="directory-empty">Nenhum personagem encontrado com esses filtros.</div>
            )}
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
                <span>Zelda Wiki / Fandom — thumbnails de bestiário, NPCs e itens sem visual novo confirmado</span>
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

      {selectedNpc && (
        <NpcDetailModal
          npc={selectedNpc}
          fallbackImage={thumbnails[selectedNpc.pageTitle]}
          relatedQuests={questEntries.filter(quest => quest.npcIds.includes(selectedNpc.id))}
          onClose={() => setSelectedNpc(null)}
          onOpenQuest={openQuestFromNpc}
          onFocusLocation={openMapLocation}
        />
      )}

      {selectedCreature && (
        <CreatureDetailModal
          creature={selectedCreature}
          fallbackImage={thumbnails[selectedCreature.pageTitle]}
          onClose={() => setSelectedCreature(null)}
          onFocusLocation={openMapLocation}
        />
      )}

      {selectedSkulltula && (
        <GoldSkulltulaModal
          skulltula={selectedSkulltula}
          onClose={() => setSelectedSkulltula(null)}
          onFocusLocation={openMapLocation}
        />
      )}

      {selectedHeartPiece && (
        <HeartPieceModal
          piece={selectedHeartPiece}
          completed={heartPieceDone.includes(selectedHeartPiece.id)}
          onToggleComplete={() => toggleHeartPieceDone(selectedHeartPiece.id)}
          onClose={() => setSelectedHeartPiece(null)}
          onFocusLocation={openMapLocation}
        />
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          fallbackImage={thumbnails[selectedItem.pageTitle]}
          relatedQuests={questEntries.filter(quest => selectedItem.questIds.includes(quest.id))}
          onClose={() => setSelectedItem(null)}
          onOpenQuest={openQuestFromItem}
          onFocusLocation={locationId => openMapLocation(locationId)}
        />
      )}

      {selectedQuest && (
        <QuestDetailModal
          quest={selectedQuest}
          npcs={npcEntries}
          completed={questDone.includes(selectedQuest.id)}
          onToggleComplete={() => toggleQuestDone(selectedQuest.id)}
          onClose={() => setSelectedQuest(null)}
          onOpenNpc={openNpcFromQuest}
        />
      )}
    </div>
  )
}

export default App
