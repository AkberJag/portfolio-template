import { createI18n } from 'vue-i18n'
import languages from './languages.json'

// Common translations
const commonTranslations = {}
const commonModules = import.meta.glob('./locales/*.json', { eager: true })
for (const path in commonModules) {
  const locale = path.split('/').pop().split('.')[0]
  commonTranslations[locale] = commonModules[path].default
}

export const SUPPORTED_LOCALES = languages.map(lang => lang.code)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: commonTranslations,
  availableLocales: SUPPORTED_LOCALES,
  globalInjection: true,
  missingWarn: process.env.NODE_ENV === 'development',
  fallbackWarn: process.env.NODE_ENV === 'development',
})

// Track loading states and cache paths
i18n.featureLoadStates = new Map()
i18n.modulePaths = new Map()

// glob pattern for nested locales
const featureModules = import.meta.glob('../features/**/locales/*.json')

// Map module paths for faster lookup
Object.keys(featureModules).forEach(path => {
  const pathParts = path.split('/')
  const locale = pathParts.pop().split('.')[0]

  // Extract feature path from the full path
  const featureParts = pathParts.slice(
    pathParts.indexOf('features') + 1,
    pathParts.indexOf('locales'),
  )
  const feature = featureParts.join('/')

  // Create an index for efficient lookups
  const key = `${feature}/${locale}`
  i18n.modulePaths.set(key, path)
})

i18n.loadFeatureMessages = async function (
  feature,
  locale = this.global.locale.value,
) {
  const featureKey = `${feature}-${locale}`

  // Check if already loaded or loading
  if (this.featureLoadStates.has(featureKey)) {
    const state = this.featureLoadStates.get(featureKey)
    if (state === 'loaded') return true
    return state // Return promise if loading
  }

  const loadPromise = (async () => {
    try {
      // Find module path using the pre-computed index
      const modulePath = this.modulePaths.get(`${feature}/${locale}`)

      if (!modulePath) {
        console.warn(`Translation file not found: ${feature}/${locale}`)
        this.featureLoadStates.set(featureKey, 'missing')
        return false
      }

      // Load the module
      const module = await featureModules[modulePath]()

      // Merge the loaded messages
      this.global.mergeLocaleMessage(locale, {
        [feature]: module.default,
      })

      this.featureLoadStates.set(featureKey, 'loaded')
      return true
    } catch (error) {
      console.error(`Failed loading ${feature}/${locale}:`, error)
      this.featureLoadStates.set(featureKey, 'error')
      return false
    }
  })()

  this.featureLoadStates.set(featureKey, loadPromise)
  return loadPromise
}

// Implement debouncing for missing handler to prevent request flooding
let pendingAutoloads = new Set()
let autoloadTimer = null

const processPendingAutoloads = () => {
  const toProcess = [...pendingAutoloads]
  pendingAutoloads.clear()

  toProcess.forEach(({ feature, locale }) => {
    if (!i18n.featureLoadStates.has(`${feature}-${locale}`)) {
      i18n.loadFeatureMessages(feature, locale)
    }
  })
}

const originalMissingHandler = i18n.global.missing
i18n.global.missing = function (locale, key, ...args) {
  const [feature] = key.split('.')
  const featureKey = `${feature}-${locale}`

  if (!i18n.featureLoadStates.has(featureKey)) {
    // Add to pending batch instead of immediate loading
    pendingAutoloads.add({ feature, locale })

    // Process batch after short delay
    if (!autoloadTimer) {
      autoloadTimer = setTimeout(() => {
        processPendingAutoloads()
        autoloadTimer = null
      }, 50) // 50ms batch window
    }
  }

  // Call original handler to show warnings
  if (originalMissingHandler) {
    originalMissingHandler.call(this, locale, key, ...args)
  }
}

export default i18n
