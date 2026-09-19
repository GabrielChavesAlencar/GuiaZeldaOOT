import { CORE_TRANSLATIONS } from './coreTranslations'
import { getLanguageOption, SOURCE_LANGUAGE, type SiteLanguage } from './languages'

export type TranslationStatus = 'idle' | 'needs-action' | 'downloading' | 'translating' | 'ready' | 'unsupported' | 'error'

const TEXT_CACHE_VERSION = 'oot-i18n-v3'
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'PATH'])
const CONCURRENCY = 18

const originalText = new WeakMap<Text, string>()
const lastAppliedText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Map<string, string>>()
const lastAppliedAttributes = new WeakMap<Element, Map<string, string>>()

const translatorPromises = new Map<string, Promise<any>>()
const inFlightTranslations = new Map<string, Promise<string>>()
const memoryCaches = new Map<string, Map<string, string>>()

let generation = 0
let observer: MutationObserver | null = null
let activeLanguage: SiteLanguage = 'en'
let observerTimer: number | null = null
let pendingRoots = new Set<Node>()

function getCache(language: SiteLanguage) {
  const existing = memoryCaches.get(language)
  if (existing) return existing

  const map = new Map<string, string>()
  const bundled = CORE_TRANSLATIONS[language]
  if (bundled) {
    Object.entries(bundled).forEach(([source, translated]) => map.set(normalizeForTranslation(source), translated))
  }
  try {
    const raw = localStorage.getItem(`${TEXT_CACHE_VERSION}:${language}`)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>
      Object.entries(parsed).forEach(([key, value]) => map.set(key, value))
    }
  } catch {
    // Cache is optional.
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
      const limited = Array.from(cache.entries()).slice(-3500)
      localStorage.setItem(`${TEXT_CACHE_VERSION}:${language}`, JSON.stringify(Object.fromEntries(limited)))
    } catch {
      // Ignore storage failures.
    }
  }, 250)
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

function preserveOuterWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? ''
  const trailing = original.match(/\s*$/)?.[0] ?? ''
  return `${leading}${translated}${trailing}`
}

export async function checkTranslationAvailability(language: SiteLanguage) {
  if (language === 'pt-BR') return 'available'

  const globalObject = globalThis as any
  const targetLanguage = getLanguageOption(language).translatorCode

  if (globalObject.Translator?.availability) {
    return globalObject.Translator.availability({ sourceLanguage: SOURCE_LANGUAGE, targetLanguage })
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
      promise = Promise.resolve(globalObject.ai.translator.create({ sourceLanguage: SOURCE_LANGUAGE, targetLanguage }))
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
    const availability = await globalObject.Translator.availability({ sourceLanguage: SOURCE_LANGUAGE, targetLanguage })
    if (availability === 'unavailable') throw new Error('translator-unavailable')
    if (availability === 'downloadable') throw new Error('translator-needs-action')
  }

  return prepareTranslator(SITE_LANGUAGE_FROM_TRANSLATOR_CODE[targetLanguage] ?? ('en' as SiteLanguage))
}

const SITE_LANGUAGE_FROM_TRANSLATOR_CODE: Record<string, SiteLanguage> = {
  en: 'en', pt: 'pt-BR', es: 'es', zh: 'zh-CN', de: 'de', ja: 'ja', ru: 'ru',
}

async function runWithConcurrency<T>(items: T[], worker: (item: T) => Promise<void>, concurrency = CONCURRENCY) {
  if (!items.length) return
  let index = 0
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index++
      await worker(items[currentIndex])
    }
  })
  await Promise.all(runners)
}

async function translateOne(normalized: string, language: SiteLanguage, translator: any) {
  const cache = getCache(language)
  const cached = cache.get(normalized)
  if (cached) return cached

  const inFlightKey = `${language}\u0000${normalized}`
  const inFlight = inFlightTranslations.get(inFlightKey)
  if (inFlight) return inFlight

  const promise = Promise.resolve(translator.translate(normalized))
    .then((translated: unknown) => {
      const finalText = typeof translated === 'string' ? translated : String(translated ?? normalized)
      cache.set(normalized, finalText)
      schedulePersist(language)
      return finalText
    })
    .finally(() => inFlightTranslations.delete(inFlightKey))

  inFlightTranslations.set(inFlightKey, promise)
  return promise
}

async function translateUniqueStrings(values: string[], language: SiteLanguage) {
  const normalizedValues = Array.from(new Set(values.map(normalizeForTranslation).filter(Boolean)))
  const result = new Map<string, string>()

  if (language === 'pt-BR') {
    normalizedValues.forEach(value => result.set(value, value))
    return result
  }

  const cache = getCache(language)
  const missing = normalizedValues.filter(value => {
    const cached = cache.get(value)
    if (cached) result.set(value, cached)
    return !cached
  })

  if (!missing.length) return result

  const targetLanguage = getLanguageOption(language).translatorCode
  const translator = await getTranslator(targetLanguage)

  await runWithConcurrency(missing, async value => {
    const translated = await translateOne(value, language, translator)
    result.set(value, translated)
  })

  return result
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

function collectAttributeElements(root: Node) {
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

  if (saved === undefined) {
    originalText.set(node, current)
    return current
  }

  if (lastApplied !== undefined && current !== lastApplied) {
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

  if (saved === undefined || (lastApplied !== undefined && current !== lastApplied)) {
    originals.set(attribute, current)
    return current
  }

  return saved
}

function applyAttribute(element: Element, attribute: string, value: string) {
  element.setAttribute(attribute, value)
  let lastMap = lastAppliedAttributes.get(element)
  if (!lastMap) {
    lastMap = new Map()
    lastAppliedAttributes.set(element, lastMap)
  }
  lastMap.set(attribute, value)
}

/**
 * Applies a small bundled dictionary synchronously. This runs in a layout effect,
 * so navigation and key headings switch before the browser paints the page.
 * The Portuguese source is still preserved for full Translator API translation.
 */
export function applyImmediateLanguage(language: SiteLanguage, root: Node = document.body) {
  if (language === 'pt-BR') return
  const dictionary = CORE_TRANSLATIONS[language]
  if (!dictionary) return

  for (const node of collectTextNodes(root)) {
    const original = getOriginalText(node)
    const normalized = normalizeForTranslation(original)
    const replacement = dictionary[normalized]
    if (!replacement) continue
    const translated = preserveOuterWhitespace(original, replacement)
    node.nodeValue = translated
    lastAppliedText.set(node, translated)
  }

  for (const element of collectAttributeElements(root)) {
    for (const attribute of TRANSLATABLE_ATTRIBUTES) {
      const original = getOriginalAttribute(element, attribute)
      if (!original) continue
      const replacement = dictionary[normalizeForTranslation(original)]
      if (replacement) applyAttribute(element, attribute, replacement)
    }
  }
}

export async function translateDom(language: SiteLanguage, root: Node = document.body, startNewGeneration = true) {
  activeLanguage = language
  const currentGeneration = startNewGeneration ? ++generation : generation

  const textNodes = collectTextNodes(root)
  const elements = collectAttributeElements(root)
  const textTasks = textNodes.map(node => ({ node, original: getOriginalText(node) }))
  const attributeTasks: Array<{ element: Element; attribute: string; original: string }> = []

  for (const element of elements) {
    for (const attribute of TRANSLATABLE_ATTRIBUTES) {
      const original = getOriginalAttribute(element, attribute)
      if (original && normalizeForTranslation(original)) attributeTasks.push({ element, attribute, original })
    }
  }

  if (language === 'pt-BR') {
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        if (currentGeneration !== generation) {
          resolve()
          return
        }
        textTasks.forEach(({ node, original }) => {
          if (!node.isConnected) return
          node.nodeValue = original
          lastAppliedText.set(node, original)
        })
        attributeTasks.forEach(task => {
          if (task.element.isConnected) applyAttribute(task.element, task.attribute, task.original)
        })
        resolve()
      })
    })
    return
  }

  const translations = await translateUniqueStrings(
    [...textTasks.map(task => task.original), ...attributeTasks.map(task => task.original)],
    language,
  )

  if (currentGeneration !== generation) return

  await new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      if (currentGeneration !== generation) {
        resolve()
        return
      }

      textTasks.forEach(({ node, original }) => {
        if (!node.isConnected) return
        const normalized = normalizeForTranslation(original)
        const replacement = translations.get(normalized)
        if (!replacement) return
        const translated = preserveOuterWhitespace(original, replacement)
        node.nodeValue = translated
        lastAppliedText.set(node, translated)
      })

      attributeTasks.forEach(task => {
        if (!task.element.isConnected) return
        const replacement = translations.get(normalizeForTranslation(task.original))
        if (replacement) applyAttribute(task.element, task.attribute, replacement)
      })
      resolve()
    })
  })
}

export function startDomTranslationObserver(onMutation: (roots: Node[]) => void) {
  observer?.disconnect()
  pendingRoots.clear()

  observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        const node = mutation.target as Text
        const current = node.nodeValue ?? ''
        if (lastAppliedText.get(node) === current) continue
        originalText.set(node, current)
        pendingRoots.add(node.parentElement ?? node)
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
        pendingRoots.add(mutation.target)
      }

      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => pendingRoots.add(node))
      }
    }

    if (!pendingRoots.size) return
    if (observerTimer) window.clearTimeout(observerTimer)
    observerTimer = window.setTimeout(() => {
      const roots = Array.from(pendingRoots)
      pendingRoots.clear()
      onMutation(roots)
    }, 48)
  })

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
  })

  return () => {
    if (observerTimer) window.clearTimeout(observerTimer)
    observer?.disconnect()
    pendingRoots.clear()
  }
}

export function getActiveLanguage() {
  return activeLanguage
}
