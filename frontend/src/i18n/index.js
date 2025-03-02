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

// Attach load states to i18n instance
i18n.featureLoadStates = new Map()

i18n.loadFeatureMessages = async function (
  feature,
  locale = this.global.locale.value,
) {
  const featureKey = `${feature}-${locale}`

  if (this.featureLoadStates.has(featureKey)) {
    return this.featureLoadStates.get(featureKey)
  }

  const loadPromise = (async () => {
    try {
      const messages = await import(
        /* webpackChunkName: "locale-[request]" */
        `../features/${feature}/locales/${locale}.json`
      )

      this.global.mergeLocaleMessage(locale, {
        [feature]: messages.default,
      })

      this.featureLoadStates.set(featureKey, 'loaded')
      return true
    } catch (error) {
      console.error(`Failed loading ${feature}/${locale}:`, error)
      this.featureLoadStates.delete(featureKey)
      throw error
    }
  })()

  this.featureLoadStates.set(featureKey, loadPromise)
  return loadPromise
}

const originalMissingHandler = i18n.global.missing

i18n.global.missing = function (locale, key, ...args) {
  const [feature] = key.split('.')
  const featureKey = `${feature}-${locale}`

  if (!i18n.featureLoadStates.has(featureKey)) {
    console.warn(`Attempting auto-load for ${featureKey}`)
    i18n.loadFeatureMessages(feature, locale)
  }

  // Call original handler to show warnings
  if (originalMissingHandler) {
    originalMissingHandler.call(this, locale, key, ...args)
  }
}

export default i18n
