<template>
  <div class="relative h-screen overflow-hidden bg-slate-100 dark:bg-gray-900 transition-colors duration-700">
    <StarryBackground class="absolute inset-0" />

    <!-- Main scroll container -->
    <div ref="scrollContainer" @scroll="throttledUpdateSection"
      class="relative z-10 h-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <section v-for="section in sections" :key="section.path"
        class="h-screen flex items-center justify-center snap-start">
        <component :is="sectionComponents[section.component]" class="w-full max-w-7xl px-4 sm:px-6 lg:px-8" />
      </section>
    </div>

    <!-- Navigation -->
    <NavigationDots :sections="sections" :currentSection="currentSection" @navigate="navigateToSection"
      class="fixed right-4 top-1/2 -translate-y-1/2 z-20" />

    <SettingsButton class="z-20" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, provide } from 'vue'
import { useRouter } from 'vue-router'
import throttle from 'lodash/throttle'

// Components
import NavigationDots from '@/components/NavigationDots.vue'
import SettingsButton from '@/components/SettingsButton.vue'
import StarryBackground from '@/components/StarryBackground.vue'

// Data
import portfolioData from '@/portfolio-data.json'
const sections = portfolioData.sections
provide('sections', sections)

// Dynamic imports for section components
const sectionComponents = Object.fromEntries(
  sections.map(section => [
    section.component,
    defineAsyncComponent(() =>
      import(`@/components/sections/${section.component}.vue`)
    )
  ])
)

// Refs and state
const router = useRouter()
const scrollContainer = ref(null)
const currentSection = ref(sections[0].path)
const isScrolling = ref(false)

// Utilities
const updatePageTitle = (path) => {
  const section = sections.find(s => s.path === path)
  if (section) {
    document.title = section.pageTitle
  }
}

const scrollToSection = (path) => {
  const index = sections.findIndex(section => section.path === path)
  if (index === -1 || !scrollContainer.value) return

  isScrolling.value = true
  scrollContainer.value.scrollTo({
    top: index * window.innerHeight,
    behavior: 'smooth'
  })

  setTimeout(() => {
    isScrolling.value = false
  }, 700)
}

const updateCurrentSection = () => {
  if (isScrolling.value || !scrollContainer.value) return

  const { scrollTop } = scrollContainer.value
  const index = Math.round(scrollTop / window.innerHeight)
  const newPath = sections[index]?.path

  if (newPath && currentSection.value !== newPath) {
    currentSection.value = newPath
    router.push({ path: `/${newPath}` })
    updatePageTitle(newPath)
  }
}

// Throttle scroll handler for better performance
const throttledUpdateSection = throttle(updateCurrentSection, 150)

const navigateToSection = (path) => {
  router.push({ path: `/${path}` })
}

const handleRouteChange = (to) => {
  const path = to.path.slice(1)
  if (!path || !sections.some(section => section.path === path)) return

  currentSection.value = path
  scrollToSection(path)
  updatePageTitle(path)
}

// Lifecycle
onMounted(() => {
  // Handle redirect from 404
  const redirectFrom = sessionStorage.getItem('redirectFrom')
  if (redirectFrom) {
    sessionStorage.removeItem('redirectFrom')
    router.push({
      path: sections.some(s => s.path === redirectFrom)
        ? `/${redirectFrom}`
        : '/'
    })
  } else {
    // Handle initial route
    const initialPath = router.currentRoute.value.path
    if (initialPath === '/') {
      updatePageTitle(sections[0].path)
    } else {
      handleRouteChange(router.currentRoute.value)
    }
  }

  // Setup route handling
  router.afterEach(handleRouteChange)
})
</script>