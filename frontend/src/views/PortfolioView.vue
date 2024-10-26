<template>
  <div class="relative h-screen overflow-hidden bg-slate-100 dark:bg-[#24292e] transition-colors duration-700">
    <StarryBackground class="absolute inset-0 z-0" />
    <div class="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory bg-transparent" ref="scrollContainer">
      <div v-for="section in portfolioData.sections" :key="section.path"
        class="h-screen snap-start flex items-center justify-center" style="scroll-snap-align: start;">
        <component :is="sectionComponents[section.component]" class="w-full max-w-7xl px-4 sm:px-6 lg:px-8" />
      </div>
    </div>
    <NavigationDots :sections="portfolioData.sections" :currentSection="currentSection" @navigate="navigateToSection"
      class="fixed right-4 top-1/2 transform -translate-y-1/2 z-20" />
    <SettingsButton class="z-20" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import portfolioData from '@/portfolio-data.json'
import NavigationDots from '@/components/NavigationDots.vue'
import SettingsButton from '@/components/SettingsButton.vue'
import { provide } from 'vue'
import StarryBackground from '@/components/StarryBackground.vue'

// Dynamically import section components
const sectionComponents = {}
portfolioData.sections.forEach(section => {
  sectionComponents[section.component] = defineAsyncComponent(() =>
    import(`@/components/sections/${section.component}.vue`)
  )
})

// Provide the sections data to child components
provide('sections', portfolioData.sections)

const router = useRouter()
const scrollContainer = ref(null)
const currentSection = ref(portfolioData.sections[0].path)
const isScrolling = ref(false)

// Set initial page title
document.title = portfolioData.sections[0].pageTitle

const scrollToSection = (path) => {
  const index = portfolioData.sections.findIndex(section => section.path === path)
  if (index !== -1) {
    isScrolling.value = true
    scrollContainer.value.children[index].scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      isScrolling.value = false
    }, 500)
  }
}

const navigateToSection = (path) => {
  router.push({ path: `/${path}` })
}

const updateCurrentSection = () => {
  if (!isScrolling.value) {
    const scrollPosition = scrollContainer.value.scrollTop
    const windowHeight = window.innerHeight
    const index = Math.round(scrollPosition / windowHeight)
    const newPath = portfolioData.sections[index].path

    if (currentSection.value !== newPath) {
      currentSection.value = newPath
      router.push({ path: `/${newPath}` })

      // Update page title when section changes
      const section = portfolioData.sections[index]
      if (section) {
        document.title = section.pageTitle
      }
    }
  }
}

const handleRouteChange = (to) => {
  const path = to.path.slice(1)
  if (path && portfolioData.sections.some(section => section.path === path)) {
    currentSection.value = path
    scrollToSection(path)

    // Update page title on route change
    const section = portfolioData.sections.find(section => section.path === path)
    if (section) {
      document.title = section.pageTitle
    }
  }
}

onMounted(() => {
  scrollContainer.value.addEventListener('scroll', updateCurrentSection)

  // Handle redirection from 404 page
  const redirectFrom = sessionStorage.getItem('redirectFrom')
  if (redirectFrom) {
    sessionStorage.removeItem('redirectFrom')
    if (portfolioData.sections.some(section => section.path === redirectFrom)) {
      router.push({ path: `/${redirectFrom}` })
    } else {
      router.push({ path: '/' })
    }
  } else {
    // Handle initial route
    const initialPath = router.currentRoute.value.path
    if (initialPath === '/') {
      // If we're at the root path, set title to first section
      document.title = portfolioData.sections[0].pageTitle
    } else {
      // Otherwise handle the current route
      handleRouteChange(router.currentRoute.value)
    }
  }

  // Use afterEach navigation guard to handle route changes
  router.afterEach((to) => {
    handleRouteChange(to)
  })
})
</script>