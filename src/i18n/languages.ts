export type SiteLanguage = 'en' | 'pt-BR' | 'es' | 'zh-CN' | 'de' | 'ja' | 'ru'

export type SiteLanguageOption = {
  code: SiteLanguage
  translatorCode: string
  shortLabel: string
  nativeLabel: string
  englishLabel: string
}

export const SITE_LANGUAGES: SiteLanguageOption[] = [
  { code: 'en', translatorCode: 'en', shortLabel: 'EN', nativeLabel: 'English', englishLabel: 'English' },
  { code: 'pt-BR', translatorCode: 'pt', shortLabel: 'PT', nativeLabel: 'Português', englishLabel: 'Portuguese' },
  { code: 'es', translatorCode: 'es', shortLabel: 'ES', nativeLabel: 'Español', englishLabel: 'Spanish' },
  { code: 'zh-CN', translatorCode: 'zh', shortLabel: '中文', nativeLabel: '简体中文', englishLabel: 'Chinese' },
  { code: 'de', translatorCode: 'de', shortLabel: 'DE', nativeLabel: 'Deutsch', englishLabel: 'German' },
  { code: 'ja', translatorCode: 'ja', shortLabel: '日本語', nativeLabel: '日本語', englishLabel: 'Japanese' },
  { code: 'ru', translatorCode: 'ru', shortLabel: 'RU', nativeLabel: 'Русский', englishLabel: 'Russian' },
]

export const DEFAULT_LANGUAGE: SiteLanguage = 'en'
export const PRELOADED_LANGUAGE: SiteLanguage = 'en'
export const SOURCE_LANGUAGE = 'pt'

export function getLanguageOption(code: SiteLanguage) {
  return SITE_LANGUAGES.find(language => language.code === code) ?? SITE_LANGUAGES[0]
}

export function isSiteLanguage(value: string | null): value is SiteLanguage {
  return Boolean(value && SITE_LANGUAGES.some(language => language.code === value))
}
