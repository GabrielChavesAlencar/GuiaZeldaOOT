import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/LanguageProvider'
import { preloadLanguage } from './i18n/domTranslator'
import { PRELOADED_LANGUAGE } from './i18n/languages'
import './styles.css'

// English is the primary site language, so initialize its bundled cache and
// warm the browser translator before React mounts. This does not block render.
void preloadLanguage(PRELOADED_LANGUAGE)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
