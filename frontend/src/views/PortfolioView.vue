<template>
  <div class="relative h-screen overflow-hidden bg-slate-100 dark:bg-[#24292e] transition-colors duration-700">
    <StarryBackground class="absolute inset-0 z-0" />
    <div class="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory bg-transparent" ref="scrollContainer">
      <div v-for="section in portfolioData.sections" :key="section.path"
        class="h-screen snap-start flex items-center justify-center" style="scroll-snap-align: start;">
        <component :is="sectionComponents[section.component]" :data="section.content"
          class="w-full max-w-7xl px-4 sm:px-6 lg:px-8" />
      </div>
    </div>
    <NavigationDots :sections="portfolioData.sections" :currentSection="currentSection" @navigate="navigateToSection"
      class="fixed right-4 top-1/2 transform -translate-y-1/2 z-20" />
    <SettingsButton class="z-20" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
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
    }
  }
}

const handleRouteChange = (to) => {
  const path = to.path.slice(1)
  if (path && portfolioData.sections.some(section => section.path === path)) {
    currentSection.value = path
    scrollToSection(path)
  }
}

onMounted(() => {
  scrollContainer.value.addEventListener('scroll', updateCurrentSection)
  handleRouteChange(router.currentRoute.value)

  // Use afterEach navigation guard to handle route changes
  router.afterEach((to) => {
    handleRouteChange(to)
  })
})

watch(currentSection, (newPath) => {
  const section = portfolioData.sections.find(section => section.path === newPath)
  if (section) {
    document.title = section.pageTitle
  }
})
</script>