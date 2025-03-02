<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Use translations instead of hardcoded values
const data = computed(() => ({
  greeting: t('sections.home.greeting'),
  name: t('sections.home.personName'),
  secondaryName: t('sections.home.secondaryName'),
  title: t('sections.home.title'),
  subtitle: t('sections.home.subtitle')
}))

const sections = inject('sections')
const contactSection = computed(() => sections.find(section => section.key === 'contact'))

const greetingRef = ref(null)
const alternatingTextRef = ref(null)
const showCursor = ref(true)
const showContent = ref(false)
let cursorInterval = null
let animationController = null

// Animation speed constants
const TYPE_SPEED = 100
const ERASE_SPEED = 50
const NAME_DISPLAY_TIME = 5000
const SECONDARY_NAME_DISPLAY_TIME = 3000

// Use AbortController for cleaner animation cancellation
const createAnimationController = () => {
  if (animationController) {
    animationController.abort()
  }
  return new AbortController()
}

const typeWriter = async (element, text, speed = TYPE_SPEED, signal) => {
  if (!element) return

  element.textContent = ''

  for (let i = 0; i < text.length; i++) {
    if (signal?.aborted) return

    element.textContent += text.charAt(i)
    await new Promise(resolve => setTimeout(resolve, speed))
  }
}

const eraseText = async (element, speed = ERASE_SPEED, signal) => {
  if (!element) return

  while (element.textContent.length > 0) {
    if (signal?.aborted) return

    element.textContent = element.textContent.slice(0, -1)
    await new Promise(resolve => setTimeout(resolve, speed))
  }
}

const blinkCursor = () => {
  if (cursorInterval) clearInterval(cursorInterval)

  cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
}

const alternateText = async (signal) => {
  if (!alternatingTextRef.value) return

  if (!data.value.secondaryName) {
    await typeWriter(alternatingTextRef.value, data.value.name, TYPE_SPEED, signal)
    return
  }

  while (!signal?.aborted) {
    await typeWriter(alternatingTextRef.value, data.value.name, TYPE_SPEED, signal)
    if (signal?.aborted) break

    await new Promise(resolve => {
      const timeout = setTimeout(resolve, NAME_DISPLAY_TIME)
      signal?.addEventListener('abort', () => clearTimeout(timeout))
    })
    if (signal?.aborted) break

    await eraseText(alternatingTextRef.value, ERASE_SPEED, signal)
    if (signal?.aborted) break

    await typeWriter(alternatingTextRef.value, data.value.secondaryName, TYPE_SPEED, signal)
    if (signal?.aborted) break

    await new Promise(resolve => {
      const timeout = setTimeout(resolve, SECONDARY_NAME_DISPLAY_TIME)
      signal?.addEventListener('abort', () => clearTimeout(timeout))
    })
    if (signal?.aborted) break

    await eraseText(alternatingTextRef.value, ERASE_SPEED, signal)
  }
}

const startAnimations = async () => {
  animationController = createAnimationController()
  const signal = animationController.signal

  blinkCursor()
  await typeWriter(greetingRef.value, data.value.greeting, TYPE_SPEED, signal)
  if (signal.aborted) return

  showContent.value = true

  await new Promise(resolve => {
    const timeout = setTimeout(resolve, 1000)
    signal?.addEventListener('abort', () => clearTimeout(timeout))
  })
  if (signal.aborted) return

  alternateText(signal)
}

// When language changes, restart animations
watch(locale, () => {
  startAnimations()
})

onMounted(() => {
  startAnimations()
})

onUnmounted(() => {
  if (cursorInterval) clearInterval(cursorInterval)
  if (animationController) animationController.abort()
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen text-gray-800 dark:text-white p-4 relative overflow-hidden">
    <div class="text-center z-10 space-y-6">
      <h1 class="text-4xl md:text-5xl font-bold relative">
        <span ref="greetingRef" class="inline-block"></span>
        <span class="inline-block w-0.5 h-8 bg-gray-800 dark:bg-white ml-1"
          :class="{ 'opacity-0': !showCursor }"></span>
      </h1>
      <div class="space-y-6 transition-opacity duration-1000"
        :class="{ 'opacity-0': !showContent, 'opacity-100': showContent }">
        <h2 class="text-3xl md:text-4xl font-bold">
          <span class="text-teal-500 dark:text-teal-400">{{ t('sections.home.itsMe') }}</span>&nbsp;
          <span ref="alternatingTextRef" class="text-yellow-500 dark:text-yellow-400"></span>
        </h2>
        <p class="text-xl md:text-2xl">{{ data.title }}</p>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ data.subtitle }}</p>
        <router-link v-if="contactSection" :to="'/' + contactSection.path"
          class="inline-block px-8 py-3 font-bold text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-gradient-to-bl from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 dark:from-primary-500 dark:to-primary-700 dark:hover:from-primary-600 dark:hover:to-primary-800">
          {{ t('sections.home.getInTouch') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
