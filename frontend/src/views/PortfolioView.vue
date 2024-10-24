<script setup>
import { ref, watch, onMounted, computed, defineAsyncComponent, provide } from 'vue'
import { useRouter } from 'vue-router'
import SettingsButton from '@/components/SettingsButton.vue'
import portfolioData from '@/portfolio-data.json'

const router = useRouter()
const currentSection = ref(0)
const hoveredSection = ref(null)
const isScrolling = ref(false)
const showNewPageLabel = ref(false)
const portfolioContainer = ref(null)
const touchStartY = ref(0)

// Provide the sections data to child components
provide('sections', portfolioData.sections)

// Preload all section components
const sectionComponents = Object.fromEntries(
    portfolioData.sections.map(section => [
        section.component,
        defineAsyncComponent(() => import(`@/components/sections/${section.component}.vue`))
    ])
)

const goToSection = (index) => {
    currentSection.value = index
    updateURL(portfolioData.sections[index].path)
    showNewPageLabel.value = true
    setTimeout(() => {
        showNewPageLabel.value = false
    }, 1500)
}

const updateURL = (section) => {
    router.push({ path: `/${section}` })
}

const getSectionNameClass = (index) => {
    if (showNewPageLabel.value && currentSection.value === index) {
        return 'opacity-100 text-sm font-bold'
    } else if (hoveredSection.value === index) {
        return 'opacity-100 text-xs'
    } else {
        return 'opacity-0 text-[0px]'
    }
}

const handleScroll = (event) => {
    if (isScrolling.value) return
    isScrolling.value = true
    setTimeout(() => {
        if (event.deltaY > 0 && currentSection.value < portfolioData.sections.length - 1) {
            goToSection(currentSection.value + 1)
        } else if (event.deltaY < 0 && currentSection.value > 0) {
            goToSection(currentSection.value - 1)
        }
        isScrolling.value = false
    }, 500)
}

const handleTouchStart = (event) => {
    touchStartY.value = event.touches[0].clientY
}

const handleTouchMove = (event) => {
    if (isScrolling.value) return
    const touchEndY = event.touches[0].clientY
    const deltaY = touchStartY.value - touchEndY
    if (Math.abs(deltaY) > 50) {
        isScrolling.value = true
        setTimeout(() => {
            if (deltaY > 0 && currentSection.value < portfolioData.sections.length - 1) {
                goToSection(currentSection.value + 1)
            } else if (deltaY < 0 && currentSection.value > 0) {
                goToSection(currentSection.value - 1)
            }
            isScrolling.value = false
        }, 500)
    }
}

const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        if (currentSection.value < portfolioData.sections.length - 1) {
            goToSection(currentSection.value + 1)
        }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        if (currentSection.value > 0) {
            goToSection(currentSection.value - 1)
        }
    }
}

const sectionClass = () => `
  h-screen flex items-center justify-center p-4 md:p-8
  transition-all duration-700 ease-in-out
`

const starColors = ['text-yellow-300', 'text-orange-300', 'text-pink-300', 'text-purple-300']
const starShapes = ['•', '✦', '✧', '+', '×', '★', '✸']

const stars = computed(() =>
    Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        shape: starShapes[Math.floor(Math.random() * starShapes.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 4 + 2
    }))
)

const updateTitle = (index) => {
    const section = portfolioData.sections[index]
    document.title = section.pageTitle || section.name
}

watch(
    () => router.currentRoute.value.path,
    (newPath) => {
        const sectionIndex = portfolioData.sections.findIndex(section => newPath === `/${section.path}`)
        if (sectionIndex !== -1) {
            currentSection.value = sectionIndex
            updateTitle(sectionIndex)
        }
    },
    { immediate: true }
)

onMounted(() => {
    // Handle redirect from 404
    const redirectFrom = sessionStorage.getItem('redirectFrom')
    if (redirectFrom) {
        sessionStorage.removeItem('redirectFrom')
        const sectionIndex = portfolioData.sections.findIndex(
            section => redirectFrom === section.path
        )
        if (sectionIndex !== -1) {
            goToSection(sectionIndex)
        } else {
            // If section doesn't exist, stay at home
            goToSection(0)
        }
    }
})
</script>
<template>
    <div class="bg-slate-100 dark:bg-[#24292e] relative h-screen overflow-hidden transition-colors duration-300 focus:outline-none"
        @wheel="handleScroll" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @keydown="handleKeyDown"
        tabindex="0" ref="portfolioContainer">
        <!-- Starry background -->
        <div class="absolute inset-0 overflow-hidden opacity-55">
            <div v-for="star in stars" :key="star.id" class="absolute text-xs md:text-sm" :class="star.color"
                :style="{ left: star.left, top: star.top, animation: `twinkle ${star.duration}s infinite` }">
                {{ star.shape }}
            </div>
        </div>

        <SettingsButton />

        <!-- Navigation dots -->
        <nav class="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-50">
            <ul class="space-y-2 md:space-y-4">
                <li v-for="(section, index) in portfolioData.sections" :key="section.name"
                    @mouseenter="hoveredSection = index" @mouseleave="hoveredSection = null">
                    <div class="relative group backdrop-filter backdrop-blur-lg">
                        <button @click="goToSection(index)"
                            class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ease-in-out focus:outline-none"
                            :class="[
                                currentSection === index
                                    ? 'bg-primary-600 scale-150'
                                    : 'bg-primary-300 hover:bg-primary-700 dark:hover:bg-white hover:opacity-100 opacity-60'
                            ]" :aria-label="`Go to ${section.name} section`"></button>
                        <span
                            class="absolute right-6 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-md transition-all duration-300 whitespace-nowrap backdrop-filter backdrop-blur-lg bg-opacity-70 bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                            :class="getSectionNameClass(index)">
                            {{ section.name }}
                        </span>
                    </div>
                </li>
            </ul>
        </nav>

        <!-- Sections -->
        <div class="h-screen transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateY(-${currentSection * 100}%)` }">
            <section v-for="(section, index) in portfolioData.sections" :key="section.name" :class="sectionClass()">
                <component :is="sectionComponents[section.component]" :data="section.content" />
            </section>
        </div>
    </div>
</template>

<style>
@keyframes twinkle {

    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }
}
</style>