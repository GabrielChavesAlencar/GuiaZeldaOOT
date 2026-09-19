import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  applyImmediateLanguage,
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
const STORAGE_KEY = 'oot-site-language-v3'
const LEGACY_STORAGE_KEYS = ['oot-site-language', 'oot-site-language-v2']

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

    // Older builds stored Portuguese as the active/default language. Do not
    // inherit that stale preference after switching the site default to English.
    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = localStorage.getItem(key)
      if (isSiteLanguage(legacy) && legacy !== 'pt-BR') return legacy
    }
  } catch {
    // Ignore unavailable localStorage.
  }
  return DEFAULT_LANGUAGE
}

function updatePageMeta(language: SiteLanguage) {
  document.documentElement.lang = language
  document.documentElement.dir = 'ltr'
  document.title = PAGE_META[language].title
  const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (descriptionMeta) descriptionMeta.content = PAGE_META[language].description
}

function classifyError(error: unknown): TranslationStatus {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error)
  if (message.includes('needs-action') || message.includes('NotAllowedError')) return 'needs-action'
  if (message.includes('unsupported') || message.includes('unavailable')) return 'unsupported'
  return 'error'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>(readInitialLanguage)
  const [status, setStatus] = useState<TranslationStatus>('idle')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const gesturePreparation = useRef<Partial<Record<SiteLanguage, Promise<any>>>>({})
  const runId = useRef(0)

  const persist = useCallback((nextLanguage: SiteLanguage) => {
    try {
      localStorage.setItem(STORAGE_KEY, nextLanguage)
    } catch {
      // Persistence is optional.
    }
  }, [])

  const finishTranslation = useCallback(async (targetLanguage: SiteLanguage) => {
    const id = ++runId.current
    setStatus('translating')

    try {
      await translateDom(targetLanguage)
      if (id !== runId.current) return
      setStatus('ready')
      setDownloadProgress(1)
      document.documentElement.dataset.i18nReady = 'true'
    } catch (error) {
      if (id !== runId.current) return
      setStatus(classifyError(error))
      document.documentElement.dataset.i18nReady = 'fallback'
    }
  }, [])

  // The bundled core dictionary is synchronous and runs before paint. This
  // removes the Portuguese flash from the header/hero while the full page is
  // translated in the background.
  useLayoutEffect(() => {
    updatePageMeta(language)
    applyImmediateLanguage(language)
  }, [language])

  const changeLanguage = useCallback((nextLanguage: SiteLanguage) => {
    if (nextLanguage === language) return

    persist(nextLanguage)
    setDownloadProgress(0)
    document.documentElement.dataset.i18nReady = 'switching'

    if (nextLanguage !== 'pt-BR') {
      // Called directly from the select change event so a missing Chrome
      // language pack can start downloading while user activation is present.
      setStatus('downloading')
      gesturePreparation.current[nextLanguage] = prepareTranslator(nextLanguage, setDownloadProgress)
    }

    setLanguage(nextLanguage)
  }, [language, persist])

  const activateCurrentLanguage = useCallback(() => {
    if (language === 'pt-BR') {
      void finishTranslation(language)
      return
    }

    setStatus('downloading')
    setDownloadProgress(0)
    const promise = prepareTranslator(language, setDownloadProgress)
    gesturePreparation.current[language] = promise
    void promise
      .then(() => finishTranslation(language))
      .catch(error => setStatus(classifyError(error)))
  }, [finishTranslation, language])

  useEffect(() => {
    let cancelled = false

    if (language === 'pt-BR') {
      void finishTranslation(language)
      return () => { cancelled = true }
    }

    const preparedByGesture = gesturePreparation.current[language]
    if (preparedByGesture) {
      delete gesturePreparation.current[language]
      void preparedByGesture
        .then(() => {
          if (!cancelled) return finishTranslation(language)
        })
        .catch(error => {
          if (!cancelled) setStatus(classifyError(error))
        })
      return () => { cancelled = true }
    }

    // Initial page load: try an already available pack immediately. If the
    // browser allows background creation we use it; otherwise the core English
    // dictionary is already visible and the selector can enable the full pack.
    void checkTranslationAvailability(language)
      .then(async availability => {
        if (cancelled) return

        if (availability === 'available') {
          await finishTranslation(language)
          return
        }

        if (availability === 'downloadable') {
          setStatus('downloading')
          try {
            await prepareTranslator(language, setDownloadProgress)
            if (!cancelled) await finishTranslation(language)
          } catch (error) {
            if (!cancelled) setStatus(classifyError(error))
          }
          return
        }

        if (availability === 'unsupported' || availability === 'unavailable') {
          setStatus('unsupported')
          document.documentElement.dataset.i18nReady = 'fallback'
          return
        }

        setStatus('needs-action')
      })
      .catch(error => {
        if (!cancelled) setStatus(classifyError(error))
      })

    return () => { cancelled = true }
  }, [finishTranslation, language])

  // Only translate nodes that React has just added/changed instead of rescanning
  // the entire site after every modal, filter or progress update.
  useEffect(() => {
    return startDomTranslationObserver(roots => {
      roots.forEach(root => applyImmediateLanguage(language, root))
      if (status !== 'ready') return
      roots.forEach(root => void translateDom(language, root, false))
    })
  }, [language, status])

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
