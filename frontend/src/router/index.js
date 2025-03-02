import { createRouter, createWebHistory } from 'vue-router'
import i18n, { SUPPORTED_LOCALES } from '@/i18n'

// Helper function for language validation
const isValidLocale = lang => SUPPORTED_LOCALES.includes(lang)

const routes = [
  {
    path: '/:lang([a-z]{2})?', // Only match 2-letter language codes
    children: [
      {
        path: ':section?',
        name: 'portfolio-section',
        component: () => import('@/views/PortfolioView.vue'),
      },
      {
        path: 'i18nexample',
        name: 'i18n-example',
        component: () =>
          import('@/features/example/views/ExampleComponent.vue'),
      },
    ],
  },

  // Fallback route for invalid paths
  {
    path: '/:pathMatch(.*)*',
    redirect: to => {
      // Handle pathMatch as either string or array
      const pathSegment = Array.isArray(to.params.pathMatch)
        ? to.params.pathMatch[0]
        : to.params.pathMatch?.split('/')[0]

      const lang = isValidLocale(pathSegment) ? pathSegment : 'en'
      return `/${lang}`
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const urlLang = to.params.lang
  const storedLang = localStorage.getItem('preferredLocale')
  const browserLang = navigator.language.split('-')[0]

  // 1. Determine target language with fallback
  let targetLang = 'en'
  const detectedLangs = [urlLang, storedLang, browserLang]
  for (const lang of detectedLangs) {
    if (isValidLocale(lang)) {
      targetLang = lang
      break
    }
  }

  // Check if redirect is needed
  const needsRedirect =
    // Case 1: Invalid language in URL
    (urlLang && !isValidLocale(urlLang)) ||
    // Case 2: Language mismatch (non-default language should be in URL)
    (targetLang !== 'en' && urlLang !== targetLang) ||
    // Case 3: English with lang prefix (if you want to keep English URLs clean)
    (targetLang === 'en' && urlLang !== undefined)

  if (needsRedirect) {
    // Clean path from any language prefix
    const basePath = to.fullPath
      .replace(/^\/[a-z]{2}(\/|$)/, '/') // Remove valid lang prefix (only 2 letters)
      .replace(/^\/\//, '/') // Fix double slashes

    // Preserve query and hash parts
    const query = to.query
    const hash = to.hash

    // Build new path based on target language
    let newPath = targetLang === 'en' ? basePath : `/${targetLang}${basePath}`

    // Normalize paths for comparison to prevent redirect loops
    const currentPath = to.path.replace(/\/$/, '')
    const cleanNewPath = newPath.replace(/\/$/, '')

    if (cleanNewPath !== currentPath) {
      return next({
        path: newPath,
        query,
        hash,
        replace: true, // Replace instead of push to avoid browser history clutter
      })
    }
  }

  // Update application state
  if (i18n.global.locale.value !== targetLang) {
    i18n.global.locale.value = targetLang
  }

  if (localStorage.getItem('preferredLocale') !== targetLang) {
    localStorage.setItem('preferredLocale', targetLang)
  }

  // Load dynamic components
  try {
    await Promise.all(
      to.matched.map(record => {
        const component = record.components?.default
        if (typeof component === 'function') {
          return component().catch(error => {
            console.error('Component load failed:', error)
            throw error
          })
        }
        return Promise.resolve()
      }),
    )
  } catch (error) {
    console.error('Route component failed to load:', error)
    return next(false)
  }

  next()
})

export default router
