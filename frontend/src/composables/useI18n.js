/**
 * Composable for loading and using feature-specific translations.
 *
 * @param {string} feature - The path to the feature's translation directory (e.g., 'example' or 'example/another').
 * @returns {Object} - Returns translation utilities:
 *   - `t(key, options)`: Translation function for the feature's keys.
 *   - `isLoading`: Ref indicating if translations are being loaded.
 *   - `reload()`: Function to reload translations for the current locale.
 *
 * @example
 * // For translations in `features/example/locale`:
 * const { t } = useFeatureTranslations('example')
 * t('greeting') // Translates 'greeting' key
 *
 * @example
 * // For translations in `features/example/another/locale`:
 * const { t } = useFeatureTranslations('example/another')
 * t('greeting') // Translates 'greeting' key
 */

import { watch, ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import i18n from '@/i18n'

// Global loading tracker
const pendingLoads = new Map()

export function useFeatureTranslations(feature) {
  const { locale, t } = useI18n()
  const isLoading = ref(false)
  let abortController = null

  const loadTranslations = async (targetLocale = locale.value) => {
    const featureKey = `${feature}-${targetLocale}`

    // Skip if already loaded or loading
    const status = i18n.featureLoadStates.get(featureKey)
    if (status === 'loaded' || pendingLoads.has(featureKey)) return

    // Cleanup previous load attempts
    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()

    isLoading.value = true
    pendingLoads.set(featureKey, abortController)

    try {
      await i18n.loadFeatureMessages(feature, targetLocale)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Translation load failed for ${featureKey}:`, error)
      }
    } finally {
      pendingLoads.delete(featureKey)
      isLoading.value = false
      abortController = null
    }
  }

  // Efficient locale watcher
  const stopWatcher = watch(locale, newVal => {
    loadTranslations(newVal)
  })

  // Initial load
  loadTranslations()

  // Cleanup on unmount
  onUnmounted(() => {
    stopWatcher()
    if (abortController) {
      abortController.abort()
    }
  })

  return {
    t: (key, options) => t(`${feature}.${key}`, options),
    isLoading,
    reload: () => {
      i18n.featureLoadStates.delete(`${feature}-${locale.value}`)
      return loadTranslations()
    },
  }
}
