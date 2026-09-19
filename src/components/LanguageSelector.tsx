import { Check, Download, Globe2, LoaderCircle, TriangleAlert } from 'lucide-react'
import { SITE_LANGUAGES } from '../i18n/languages'
import { useLanguage } from '../i18n/LanguageProvider'

export default function LanguageSelector() {
  const { language, changeLanguage, activateCurrentLanguage, status, downloadProgress } = useLanguage()
  const current = SITE_LANGUAGES.find(option => option.code === language) ?? SITE_LANGUAGES[0]

  return (
    <div className="language-selector" data-no-auto-translate="true">
      <Globe2 size={16} aria-hidden="true" />
      <select
        value={language}
        onChange={event => changeLanguage(event.target.value as typeof language)}
        aria-label="Language"
        title="Language"
      >
        {SITE_LANGUAGES.map(option => (
          <option key={option.code} value={option.code}>{option.nativeLabel}</option>
        ))}
      </select>

      {status === 'needs-action' ? (
        <button className="language-enable" onClick={activateCurrentLanguage} title={`Enable ${current.englishLabel}`} aria-label={`Enable ${current.englishLabel}`}>
          <Download size={13} />
          <span>Enable</span>
        </button>
      ) : (
        <span className={`language-status ${status}`} title={status === 'unsupported' ? 'Built-in translation is not supported by this browser.' : undefined}>
          {(status === 'downloading' || status === 'translating') && (
            <>
              <LoaderCircle size={14} className="language-spinner" aria-label="Translating" />
              {status === 'downloading' && downloadProgress > 0 && downloadProgress < 1 && <small>{Math.round(downloadProgress * 100)}%</small>}
            </>
          )}
          {status === 'ready' && <Check size={14} aria-label="Ready" />}
          {(status === 'unsupported' || status === 'error') && <TriangleAlert size={14} aria-label="Translation unavailable" />}
        </span>
      )}
    </div>
  )
}
