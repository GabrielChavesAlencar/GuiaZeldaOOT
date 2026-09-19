import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  checkTranslationAvailability,
  prepareTranslator,
  startDomTranslationObserver,
  translateDom,
  type TranslationStatus,
} from './domTranslator'
import { DEFAULT_LANGUAGE, isSiteLanguage, type SiteLanguage } from './languages'

type LanguageContextValue = {
  language: SiteLanguage
  changeLanguage: (language: SiteLanguage) => void
  activateCurrentLanguage: () => void
  status: TranslationStatus
  downloadProgress: number
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const STORAGE_KEY = 'oot-site-language'

const PAGE_META: Record<SiteLanguage, { title: string; description: string }> = {
  en: {
    title: 'Hyrule Guide — Ocarina of Time',
    description: 'Unofficial multilingual guide to The Legend of Zelda: Ocarina of Time with an interactive map, quests, items, NPCs, enemies and collectibles.',
  },
  'pt-BR': {
    title: 'Guia Hyrule — Ocarina of Time',
    description: 'Guia não oficial de The Legend of Zelda: Ocarina of Time com mapa interativo, quests, itens, NPCs, inimigos e colecionáveis.',
  },
  es: {
    title: 'Guía de Hyrule — Ocarina of Time',
    description: 'Guía multilingüe no oficial de The Legend of Zelda: Ocarina of Time con mapa interactivo, misiones, objetos, NPC, enemigos y coleccionables.',
  },
  'zh-CN': {
    title: '海拉鲁指南 — 时之笛',
    description: '《塞尔达传说：时之笛》非官方多语言指南，包含互动地图、任务、道具、NPC、敌人与收集要素。',
  },
  de: {
    title: 'Hyrule-Guide — Ocarina of Time',
    description: 'Inoffizieller mehrsprachiger Guide zu The Legend of Zelda: Ocarina of Time mit interaktiver Karte, Quests, Items, NPCs, Gegnern und Sammelobjekten.',
  },
  ja: {
    title: 'ハイラルガイド — 時のオカリナ',
    description: '『ゼルダの伝説 時のオカリナ』の非公式多言語ガイド。インタラクティブマップ、クエスト、アイテム、NPC、敵、収集要素を掲載。',
  },
  ru: {
    title: 'Гид по Хайрулу — Ocarina of Time',
    description: 'Неофициальный многоязычный гид по The Legend of Zelda: Ocarina of Time с интерактивной картой, заданиями, предметами, NPC, врагами и коллекционными объектами.',
  },
}

function readInitialLanguage(): SiteLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isSiteLanguage(saved)) return saved
  } catch {
    // Ignore unavailable localStorage and use English by default.
  }
  return DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>(readInitialLanguage)
  const [status, setStatus] = useState<TranslationStatus>('idle')
  const [downloadProgress, setDownloadProgress] = useState(0)

  const persist = useCallback((nextLanguage: SiteLanguage) => {
    try {
      localStorage.setItem(STORAGE_KEY, nextLanguage)
    } catch {
      // Persistence is optional.
    }
  }, [])

  const runTranslation = useCallback(async (targetLanguage = language) => {
    document.documentElement.lang = targetLanguage
    document.documentElement.dir = 'ltr'
    document.title = PAGE_META[targetLanguage].title
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (descriptionMeta) descriptionMeta.content = PAGE_META[targetLanguage].description

    setStatus('translating')
    try {
      await translateDom(targetLanguage)
      setStatus('ready')
      setDownloadProgress(1)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('needs-action')) setStatus('needs-action')
      else if (message.includes('unsupported') || message.includes('unavailable')) setStatus('unsupported')
      else if (message.includes('NotAllowedError')) setStatus('needs-action')
      else setStatus('error')
    }
  }, [language])

  const changeLanguage = useCallback((nextLanguage: SiteLanguage) => {
    persist(nextLanguage)
    setLanguage(nextLanguage)
    setDownloadProgress(0)

    if (nextLanguage === 'pt-BR') {
      setStatus('translating')
      return
    }

    // This call happens directly inside the <select> change event. Chrome
    // therefore allows downloading a missing language pack as a user gesture.
    setStatus('downloading')
    void prepareTranslator(nextLanguage, setDownloadProgress)
      .then(() => runTranslation(nextLanguage))
      .catch(error => {
        const message = error instanceof Error ? error.message : String(error)
        if (message.includes('unsupported') || message.includes('unavailable')) setStatus('unsupported')
        else if (message.includes('NotAllowedError')) setStatus('needs-action')
        else setStatus('error')
      })
  }, [persist, runTranslation])

  const activateCurrentLanguage = useCallback(() => {
    if (language === 'pt-BR') {
      void runTranslation(language)
      return
    }

    setStatus('downloading')
    setDownloadProgress(0)
    // Called directly by the Enable button click, preserving user activation.
    void prepareTranslator(language, setDownloadProgress)
      .then(() => runTranslation(language))
      .catch(error => {
        const message = error instanceof Error ? error.message : String(error)
        if (message.includes('unsupported') || message.includes('unavailable')) setStatus('unsupported')
        else setStatus('error')
      })
  }, [language, runTranslation])

  useEffect(() => {
    document.documentElement.lang = language
    let cancelled = false

    void checkTranslationAvailability(language).then(availability => {
      if (cancelled) return
      if (language === 'pt-BR' || availability === 'available') void runTranslation(language)
      else if (availability === 'downloadable') setStatus('needs-action')
      else if (availability === 'unsupported' || availability === 'unavailable') setStatus('unsupported')
      else setStatus('needs-action')
    })

    return () => {
      cancelled = true
    }
  }, [language, runTranslation])

  useEffect(() => {
    return startDomTranslationObserver(() => {
      if (status === 'ready' || language === 'pt-BR') void runTranslation(language)
    })
  }, [language, runTranslation, status])

  const value = useMemo(
    () => ({ language, changeLanguage, activateCurrentLanguage, status, downloadProgress }),
    [activateCurrentLanguage, changeLanguage, downloadProgress, language, status],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
