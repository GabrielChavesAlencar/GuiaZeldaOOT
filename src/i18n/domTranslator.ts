import { getLanguageOption, SOURCE_LANGUAGE, type SiteLanguage } from './languages'

export type TranslationStatus = 'idle' | 'needs-action' | 'downloading' | 'translating' | 'ready' | 'unsupported' | 'error'

const TEXT_CACHE_VERSION = 'oot-i18n-v1'
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'PATH'])

const originalText = new WeakMap<Text, string>()
const lastAppliedText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Map<string, string>>()
const lastAppliedAttributes = new WeakMap<Element, Map<string, string>>()

const translatorPromises = new Map<string, Promise<any>>()
const memoryCaches = new Map<string, Map<string, string>>()

let generation = 0
let observer: MutationObserver | null = null
let activeLanguage: SiteLanguage = 'en'
let scheduleTimer: number | null = null

function getCache(language: SiteLanguage) {
  const existing = memoryCaches.get(language)
  if (existing) return existing

  const map = new Map<string, string>()
  try {
    const raw = localStorage.getItem(`${TEXT_CACHE_VERSION}:${language}`)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>
      Object.entries(parsed).forEach(([key, value]) => map.set(key, value))
    }
  } catch {
    // Cache is optional; ignore malformed or unavailable localStorage.
  }

  memoryCaches.set(language, map)
  return map
}

let persistTimer: number | null = null
function schedulePersist(language: SiteLanguage) {
  if (persistTimer) window.clearTimeout(persistTimer)
  persistTimer = window.setTimeout(() => {
    try {
      const cache = getCache(language)
      const limited = Array.from(cache.entries()).slice(-1800)
      localStorage.setItem(`${TEXT_CACHE_VERSION}:${language}`, JSON.stringify(Object.fromEntries(limited)))
    } catch {
      // Storage can be unavailable in private mode; translation still works in memory.
    }
  }, 500)
}

function isInsideNoTranslate(element: Element | null) {
  return Boolean(element?.closest('[data-no-auto-translate="true"]'))
}

function shouldTranslateTextNode(node: Text) {
  const parent = node.parentElement
  if (!parent || SKIP_TAGS.has(parent.tagName) || isInsideNoTranslate(parent)) return false

  const value = node.nodeValue ?? ''
  const trimmed = value.trim()
  if (!trimmed) return false
  if (/^[\d\s%+\-–—•·|/\\()[\]{}.,:;!?]+$/.test(trimmed)) return false
  if (/^https?:\/\//i.test(trimmed)) return false
  return true
}

function normalizeForTranslation(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export async function checkTranslationAvailability(language: SiteLanguage) {
  if (language === 'pt-BR') return 'available'

  const globalObject = globalThis as any
  const targetLanguage = getLanguageOption(language).translatorCode

  if (globalObject.Translator?.availability) {
    return globalObject.Translator.availability({
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage,
    })
  }

  if (globalObject.ai?.translator?.capabilities) {
    const capabilities = await globalObject.ai.translator.capabilities()
    return capabilities?.languagePairAvailable?.(SOURCE_LANGUAGE, targetLanguage) ?? 'available'
  }

  return 'unsupported'
}

export function prepareTranslator(language: SiteLanguage, onProgress?: (progress: number) => void) {
  if (language === 'pt-BR') return Promise.resolve(null)

  const targetLanguage = getLanguageOption(language).translatorCode
  const key = `${SOURCE_LANGUAGE}:${targetLanguage}`
  const existing = translatorPromises.get(key)
  if (existing) return existing

  const globalObject = globalThis as any
  let promise: Promise<any>

  try {
    if (globalObject.Translator?.create) {
      // IMPORTANT: when the language pack is not present, this function must be
      // called directly from a user gesture. The selector does exactly that.
      promise = Promise.resolve(globalObject.Translator.create({
        sourceLanguage: SOURCE_LANGUAGE,
        targetLanguage,
        monitor(monitor: any) {
          monitor.addEventListener('downloadprogress', (event: any) => {
            const loaded = typeof event.loaded === 'number' ? event.loaded : 0
            const total = typeof event.total === 'number' && event.total > 0 ? event.total : 1
            const ratio = loaded <= 1 && total === 1 ? loaded : loaded / total
            onProgress?.(Math.max(0, Math.min(1, ratio)))
          })
        },
      }))
    } else if (globalObject.ai?.translator?.create) {
      promise = Promise.resolve(globalObject.ai.translator.create({
        sourceLanguage: SOURCE_LANGUAGE,
        targetLanguage,
      }))
    } else {
      promise = Promise.reject(new Error('translator-unsupported'))
    }
  } catch (error) {
    promise = Promise.reject(error)
  }

  translatorPromises.set(key, promise)
  promise.catch(() => translatorPromises.delete(key))
  return promise
}

async function getTranslator(targetLanguage: string) {
  const key = `${SOURCE_LANGUAGE}:${targetLanguage}`
  const existing = translatorPromises.get(key)
  if (existing) return existing

  const globalObject = globalThis as any
  if (!globalObject.Translator?.create && !globalObject.ai?.translator?.create) {
    throw new Error('translator-unsupported')
  }

  if (globalObject.Translator?.availability) {
    const availability = await globalObject.Translator.availability({
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage,
    })

    if (availability === 'unavailable') throw new Error('translator-unavailable')
    if (availability === 'downloadable') throw new Error('translator-needs-action')
  }

  // If it is already available, create() can be called without a new gesture.
  return prepareTranslator(
    SITE_LANGUAGE_FROM_TRANSLATOR_CODE[targetLanguage] ?? ('en' as SiteLanguage),
  )
}

const SITE_LANGUAGE_FROM_TRANSLATOR_CODE: Record<string, SiteLanguage> = {
  en: 'en',
  pt: 'pt-BR',
  es: 'es',
  zh: 'zh-CN',
  de: 'de',
  ja: 'ja',
  ru: 'ru',
}

async function translateString(text: string, language: SiteLanguage) {
  if (language === 'pt-BR') return text

  const normalized = normalizeForTranslation(text)
  if (!normalized) return text

  const cache = getCache(language)
  const cached = cache.get(normalized)
  if (cached) return preserveOuterWhitespace(text, cached)

  const targetLanguage = getLanguageOption(language).translatorCode
  const translator = await getTranslator(targetLanguage)
  const translated = await translator.translate(normalized)
  const finalText = typeof translated === 'string' ? translated : String(translated ?? normalized)

  cache.set(normalized, finalText)
  schedulePersist(language)
  return preserveOuterWhitespace(text, finalText)
}

function preserveOuterWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? ''
  const trailing = original.match(/\s*$/)?.[0] ?? ''
  return `${leading}${translated}${trailing}`
}

function collectTextNodes(root: Node) {
  const textNodes: Text[] = []

  if (root.nodeType === Node.TEXT_NODE) {
    const text = root as Text
    if (shouldTranslateTextNode(text)) textNodes.push(text)
    return textNodes
  }

  if (!(root instanceof Element) && root !== document.documentElement && root !== document.body) return textNodes
  if (root instanceof Element && (SKIP_TAGS.has(root.tagName) || isInsideNoTranslate(root))) return textNodes

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldTranslateTextNode(node as Text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    },
  })

  while (walker.nextNode()) textNodes.push(walker.currentNode as Text)
  return textNodes
}

function collectAttributeTasks(root: Node) {
  const elements: Element[] = []

  if (root instanceof Element) elements.push(root)
  if (root instanceof Element || root === document.documentElement || root === document.body) {
    elements.push(...Array.from((root as Element | Document).querySelectorAll?.('*') ?? []))
  }

  return elements.filter(element => !SKIP_TAGS.has(element.tagName) && !isInsideNoTranslate(element))
}

function getOriginalText(node: Text) {
  const current = node.nodeValue ?? ''
  const lastApplied = lastAppliedText.get(node)
  const saved = originalText.get(node)

  if (!saved || (lastApplied !== undefined && current !== lastApplied)) {
    originalText.set(node, current)
    return current
  }

  return saved
}

function getOriginalAttribute(element: Element, attribute: string) {
  const current = element.getAttribute(attribute)
  if (current === null) return null

  let originals = originalAttributes.get(element)
  if (!originals) {
    originals = new Map()
    originalAttributes.set(element, originals)
  }

  const lastMap = lastAppliedAttributes.get(element)
  const lastApplied = lastMap?.get(attribute)
  const saved = originals.get(attribute)

  if (!saved || (lastApplied !== undefined && current !== lastApplied)) {
    originals.set(attribute, current)
    return current
  }

  return saved
}

async function runWithConcurrency<T>(items: T[], worker: (item: T) => Promise<void>, concurrency = 6) {
  let index = 0
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index++
      await worker(items[currentIndex])
    }
  })
  await Promise.all(runners)
}

export async function translateDom(language: SiteLanguage, root: Node = document.body) {
  activeLanguage = language
  const currentGeneration = ++generation

  if (language !== 'pt-BR') {
    await getTranslator(getLanguageOption(language).translatorCode)
  }

  const textNodes = collectTextNodes(root)
  const elements = collectAttributeTasks(root)

  await runWithConcurrency(textNodes, async node => {
    if (currentGeneration !== generation || !node.isConnected) return
    const original = getOriginalText(node)
    const translated = language === 'pt-BR' ? original : await translateString(original, language)
    if (currentGeneration !== generation || !node.isConnected) return
    node.nodeValue = translated
    lastAppliedText.set(node, translated)
  })

  const attributeTasks: Array<{ element: Element; attribute: string; original: string }> = []
  for (const element of elements) {
    for (const attribute of TRANSLATABLE_ATTRIBUTES) {
      const original = getOriginalAttribute(element, attribute)
      if (original && normalizeForTranslation(original)) attributeTasks.push({ element, attribute, original })
    }

    if (element instanceof HTMLMetaElement && element.name === 'description') {
      const original = getOriginalAttribute(element, 'content')
      if (original) attributeTasks.push({ element, attribute: 'content', original })
    }
  }

  await runWithConcurrency(attributeTasks, async task => {
    if (currentGeneration !== generation || !task.element.isConnected) return
    const translated = language === 'pt-BR' ? task.original : await translateString(task.original, language)
    if (currentGeneration !== generation || !task.element.isConnected) return
    task.element.setAttribute(task.attribute, translated)

    let lastMap = lastAppliedAttributes.get(task.element)
    if (!lastMap) {
      lastMap = new Map()
      lastAppliedAttributes.set(task.element, lastMap)
    }
    lastMap.set(task.attribute, translated)
  })
}

export function startDomTranslationObserver(onMutation: () => void) {
  observer?.disconnect()
  observer = new MutationObserver(mutations => {
    let shouldSchedule = false

    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        const node = mutation.target as Text
        const current = node.nodeValue ?? ''
        if (lastAppliedText.get(node) === current) continue
        originalText.set(node, current)
        shouldSchedule = true
      }

      if (mutation.type === 'attributes' && mutation.target instanceof Element && mutation.attributeName) {
        const current = mutation.target.getAttribute(mutation.attributeName)
        const last = lastAppliedAttributes.get(mutation.target)?.get(mutation.attributeName)
        if (current === last) continue

        let map = originalAttributes.get(mutation.target)
        if (!map) {
          map = new Map()
          originalAttributes.set(mutation.target, map)
        }
        if (current !== null) map.set(mutation.attributeName, current)
        shouldSchedule = true
      }

      if (mutation.type === 'childList' && mutation.addedNodes.length) shouldSchedule = true
    }

    if (!shouldSchedule) return
    if (scheduleTimer) window.clearTimeout(scheduleTimer)
    scheduleTimer = window.setTimeout(() => {
      onMutation()
    }, 160)
  })

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TRANSLATABLE_ATTRIBUTES, 'content'],
  })

  return () => observer?.disconnect()
}

export function getActiveLanguage() {
  return activeLanguage
}
