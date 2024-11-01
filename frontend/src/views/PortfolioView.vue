<script setup>
import { ref, onMounted, defineAsyncComponent, provide } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

// Components
import NavigationDots from '@/components/NavigationDots.vue'
import SettingsButton from '@/components/SettingsButton.vue'
import StarryBackground from '@/components/StarryBackground.vue'

// Add scrollbar visibility state
const showScrollbar = ref(false)
provide('showScrollbar', showScrollbar) // Provide to child components

// Configuration constants
const CONFIG = {
  SCROLL: {
    COOLDOWN: 500, // ms between scroll actions
    THRESHOLD: 50, // minimum pixels for swipe detection
    DEBOUNCE: 50, // ms for debounce delay
    ANIMATION_DURATION: 100, // ms for smooth scroll
  },
  LAYOUT: {
    Z_INDICES: {
      BACKGROUND: 0,
      CONTENT: 10,
      NAVIGATION: 20,
    },
    MAX_WIDTH: '7xl', // Tailwind max-width class
  },
  NAVIGATION: {
    POSITION: {
      RIGHT: 4, // Tailwind spacing units
    },
  },
}

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

// Refs and state management
const router = useRouter()
const scrollContainer = ref(null)
const currentSection = ref(sections[0].path)
const isNavigating = ref(false)
const touchStartY = ref(0)
const lastScrollTime = ref(Date.now())

// Navigation handlers
const navigateToSection = (targetPath, smooth = true) => {
  if (isNavigating.value) return

  const targetIndex = sections.findIndex(section => section.path === targetPath)
  if (targetIndex === -1) return

  isNavigating.value = true
  const scrollOptions = {
    top: targetIndex * window.innerHeight,
    behavior: smooth ? 'smooth' : 'auto'
  }

  scrollContainer.value?.scrollTo(scrollOptions)
  currentSection.value = targetPath
  router.push({ path: `/${targetPath}` })
  updatePageTitle(targetPath)

  setTimeout(() => {
    isNavigating.value = false
  }, CONFIG.SCROLL.ANIMATION_DURATION)
}

// Scroll handlers
const handleScroll = debounce(() => {
  if (isNavigating.value) return

  const { scrollTop } = scrollContainer.value
  const index = Math.round(scrollTop / window.innerHeight)
  const newPath = sections[index]?.path

  if (newPath && currentSection.value !== newPath) {
    currentSection.value = newPath
    router.push({ path: `/${newPath}` })
    updatePageTitle(newPath)
  }
}, CONFIG.SCROLL.DEBOUNCE)

// Touch handlers
const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  e.preventDefault()
}

const handleTouchEnd = (e) => {
  const touchEndY = e.changedTouches[0].clientY
  const deltaY = touchStartY.value - touchEndY

  if (Math.abs(deltaY) < CONFIG.SCROLL.THRESHOLD) return

  const currentIndex = sections.findIndex(section => section.path === currentSection.value)
  const newIndex = deltaY > 0
    ? Math.min(currentIndex + 1, sections.length - 1)
    : Math.max(currentIndex - 1, 0)

  navigateToSection(sections[newIndex].path)
}

// Wheel handler with improved throttling
const handleWheel = debounce((e) => {
  const now = Date.now()
  if (now - lastScrollTime.value < CONFIG.SCROLL.COOLDOWN) return

  const currentIndex = sections.findIndex(section => section.path === currentSection.value)
  const newIndex = e.deltaY > 0
    ? Math.min(currentIndex + 1, sections.length - 1)
    : Math.max(currentIndex - 1, 0)

  navigateToSection(sections[newIndex].path)
  lastScrollTime.value = now
}, CONFIG.SCROLL.DEBOUNCE, { leading: true })

// Utility functions
const updatePageTitle = (path) => {
  const section = sections.find(s => s.path === path)
  if (section) {
    document.title = `${section.pageTitle}`
  }
}

const handleRouteChange = (to) => {
  const path = to.path.slice(1)
  if (!path || !sections.some(section => section.path === path)) return
  navigateToSection(path, true)
}

// Lifecycle hooks
onMounted(() => {
  const handleInitialNavigation = () => {
    const redirectFrom = sessionStorage.getItem('redirectFrom')
    if (redirectFrom) {
      sessionStorage.removeItem('redirectFrom')
      router.push({
        path: sections.some(s => s.path === redirectFrom)
          ? `/${redirectFrom}`
          : '/'
      })
    } else {
      const initialPath = router.currentRoute.value.path
      if (initialPath === '/') {
        updatePageTitle(sections[0].path)
      } else {
        handleRouteChange(router.currentRoute.value)
      }
    }
  }

  handleInitialNavigation()
  router.afterEach(handleRouteChange)
})
</script>

<template>
  <div class="relative h-screen overflow-hidden bg-slate-100 dark:bg-gray-900 transition-colors duration-700">
    <StarryBackground class="absolute inset-0" />
    <!-- Main scroll container with dynamic scrollbar classes -->
    <div ref="scrollContainer" @scroll="handleScroll" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
      @touchend="handleTouchEnd" @wheel="handleWheel" :class="[
        'relative z-10 h-full overflow-y-auto snap-y snap-mandatory scroll-smooth',
        showScrollbar ? 'scrollbar-visible' : 'scrollbar-hidden'
      ]">
      <section v-for="section in sections" :key="section.path"
        class="h-screen flex items-center justify-center snap-start">
        <component :is="sectionComponents[section.component]" class="w-full max-w-7xl px-4 sm:px-6 lg:px-8" />
      </section>
    </div>
    <NavigationDots :sections="sections" :currentSection="currentSection" @navigate="navigateToSection"
      class="fixed right-4 top-1/2 -translate-y-1/2 z-20" />
    <SettingsButton class="z-20" />
  </div>
</template>